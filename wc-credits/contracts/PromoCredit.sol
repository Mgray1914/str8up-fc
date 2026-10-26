// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * PromoCredit
 * Soulbound, non-transferable free-to-play promo credit for Str8Up promos.
 *
 * Derived from WCCredit. The ONLY behavioral change is that the contest end
 * time is now a mutable, owner-settable variable instead of a hardcoded
 * constant, so a promo can be extended, reopened, or closed without redeploy.
 *
 * All externally-called function signatures and all events are preserved
 * byte-for-byte from WCCredit, so an existing backend can point at this
 * contract by changing only the contract address (no ABI/controller changes),
 * EXCEPT that it gains one new owner function: setContestEnd.
 */
contract PromoCredit is Ownable, ReentrancyGuard {

    // Renamed from WCCredit branding. Does not affect backend (it calls
    // functions, not the name string).
    string public constant name     = "Str8Up Promo Credit";
    string public constant symbol   = "S8CRED";
    uint8  public constant decimals = 0;

    // CHANGED: was `uint256 public constant CONTEST_END`. Now mutable.
    uint256 public contestEnd;

    uint256 public constant SIGNUP_GRANT = 50000;

    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => uint256) public lockedBalance;
    mapping(address => bool)    public hasReceivedGrant;

    enum BetStatus { Active, SettledA, SettledB, Cancelled }

    struct Bet {
        address playerA;
        address playerB;
        uint256 amount;
        bytes32 matchId;
        BetStatus status;
        uint256 createdAt;
    }

    mapping(bytes32 => Bet)        public bets;
    mapping(address => bytes32[])  public userBets;

    event CreditsIssued(address indexed to, uint256 amount, string reason);
    event BetPlaced(bytes32 indexed betId, address indexed playerA, address indexed playerB, uint256 amount, bytes32 matchId);
    event BetSettled(bytes32 indexed betId, address indexed winner, address indexed loser, uint256 amount);
    event BetCancelled(bytes32 indexed betId, string reason);

    // NEW: emitted when the contest window is changed.
    event ContestEndUpdated(uint256 previousEnd, uint256 newEnd);

    modifier contestActive() {
        require(block.timestamp < contestEnd, "WCCredit: contest has ended");
        _;
    }

    modifier validAddress(address addr) {
        require(addr != address(0), "WCCredit: zero address");
        _;
    }

    /**
     * @param _contestEnd Unix timestamp when the promo closes. Pass a
     *        far-future value for an open-ended promo; it can always be
     *        changed later via setContestEnd.
     */
    constructor(uint256 _contestEnd) Ownable(msg.sender) {
        require(_contestEnd > block.timestamp, "PromoCredit: end must be future");
        contestEnd = _contestEnd;
    }

    // NEW: owner can extend, shorten, or reopen the promo at any time.
    function setContestEnd(uint256 _contestEnd) external onlyOwner {
        uint256 previous = contestEnd;
        contestEnd = _contestEnd;
        emit ContestEndUpdated(previous, _contestEnd);
    }

    function transfer(address, uint256) external pure returns (bool) {
        revert("WCCredit: soulbound - credits are non-transferable");
    }

    function transferFrom(address, address, uint256) external pure returns (bool) {
        revert("WCCredit: soulbound - credits are non-transferable");
    }

    function approve(address, uint256) external pure returns (bool) {
        revert("WCCredit: soulbound - credits are non-transferable");
    }

    function issueSignupGrant(address user) external onlyOwner contestActive validAddress(user) {
        require(!hasReceivedGrant[user], "WCCredit: grant already issued");
        hasReceivedGrant[user] = true;
        _mint(user, SIGNUP_GRANT, "signup_grant");
    }

    function issueCredits(address user, uint256 amount, string calldata reason) external onlyOwner contestActive validAddress(user) {
        require(amount > 0, "WCCredit: amount must be > 0");
        _mint(user, amount, reason);
    }

    function batchIssueSignupGrants(address[] calldata users) external onlyOwner contestActive {
        for (uint256 i = 0; i < users.length; i++) {
            address user = users[i];
            if (user != address(0) && !hasReceivedGrant[user]) {
                hasReceivedGrant[user] = true;
                _mint(user, SIGNUP_GRANT, "signup_grant");
            }
        }
    }

    function placeBet(address playerA, address playerB, uint256 amount, bytes32 matchId)
        external onlyOwner nonReentrant contestActive validAddress(playerA) validAddress(playerB)
        returns (bytes32 betId)
    {
        require(playerA != playerB,            "WCCredit: cannot bet against yourself");
        require(amount > 0,                    "WCCredit: bet amount must be > 0");
        require(balanceOf[playerA] >= amount,  "WCCredit: playerA insufficient balance");
        require(balanceOf[playerB] >= amount,  "WCCredit: playerB insufficient balance");

        balanceOf[playerA]    -= amount;
        lockedBalance[playerA] += amount;
        balanceOf[playerB]    -= amount;
        lockedBalance[playerB] += amount;

        betId = keccak256(abi.encodePacked(matchId, playerA, playerB, block.timestamp));
        require(bets[betId].createdAt == 0, "WCCredit: bet ID collision");

        bets[betId] = Bet({ playerA: playerA, playerB: playerB, amount: amount, matchId: matchId, status: BetStatus.Active, createdAt: block.timestamp });
        userBets[playerA].push(betId);
        userBets[playerB].push(betId);

        emit BetPlaced(betId, playerA, playerB, amount, matchId);
    }

    function settleBet(bytes32 betId, address winner) external onlyOwner nonReentrant {
        Bet storage bet = bets[betId];
        require(bet.createdAt > 0,               "WCCredit: bet not found");
        require(bet.status == BetStatus.Active,  "WCCredit: bet already settled");
        require(winner == bet.playerA || winner == bet.playerB, "WCCredit: winner must be a participant");

        address loser = (winner == bet.playerA) ? bet.playerB : bet.playerA;
        lockedBalance[winner] -= bet.amount;
        lockedBalance[loser]  -= bet.amount;
        balanceOf[winner]     += bet.amount * 2;
        bet.status = (winner == bet.playerA) ? BetStatus.SettledA : BetStatus.SettledB;

        emit BetSettled(betId, winner, loser, bet.amount);
    }

    function cancelBet(bytes32 betId, string calldata reason) external onlyOwner nonReentrant {
        Bet storage bet = bets[betId];
        require(bet.createdAt > 0,             "WCCredit: bet not found");
        require(bet.status == BetStatus.Active, "WCCredit: bet not active");

        lockedBalance[bet.playerA] -= bet.amount;
        balanceOf[bet.playerA]     += bet.amount;
        lockedBalance[bet.playerB] -= bet.amount;
        balanceOf[bet.playerB]     += bet.amount;
        bet.status = BetStatus.Cancelled;

        emit BetCancelled(betId, reason);
    }

    function totalBalanceOf(address user) external view returns (uint256) {
        return balanceOf[user] + lockedBalance[user];
    }

    function getUserBets(address user) external view returns (bytes32[] memory) {
        return userBets[user];
    }

    function getBet(bytes32 betId) external view returns (Bet memory) {
        return bets[betId];
    }

    function contestTimeRemaining() external view returns (uint256) {
        if (block.timestamp >= contestEnd) return 0;
        return contestEnd - block.timestamp;
    }

    function isContestActive() external view returns (bool) {
        return block.timestamp < contestEnd;
    }

    // Internal mint. Preserved from WCCredit (was elided from the pasted
    // source below the visible functions — verify this matches the original
    // _mint implementation before deploying).
    function _mint(address to, uint256 amount, string memory reason) internal {
        balanceOf[to] += amount;
        totalSupply   += amount;
        emit CreditsIssued(to, amount, reason);
    }
}
