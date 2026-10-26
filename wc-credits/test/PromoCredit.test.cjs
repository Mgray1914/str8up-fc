const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PromoCredit", function () {
  const GRANT = 50000n;
  const MATCH = ethers.encodeBytes32String("EPL_TEST_MATCH");

  async function deploy() {
    const [owner, a, b, house, stranger] = await ethers.getSigners();
    const now = (await ethers.provider.getBlock("latest")).timestamp;
    const F = await ethers.getContractFactory("PromoCredit");
    const pc = await F.deploy(now + 365 * 24 * 3600);
    await pc.issueSignupGrant(a.address);
    await pc.issueSignupGrant(b.address);
    return { pc, owner, a, b, house, stranger };
  }

  async function placeBet(pc, a, b, amount) {
    const receipt = await (await pc.placeBet(a.address, b.address, amount, MATCH)).wait();
    const ev = receipt.logs
      .map((l) => { try { return pc.interface.parseLog(l); } catch { return null; } })
      .find((e) => e && e.name === "BetPlaced");
    return ev.args.betId;
  }

  async function sumOf(pc, addrs) {
    let s = 0n;
    for (const x of addrs) s += await pc.totalBalanceOf(x);
    return s;
  }

  it("settleBet pays the winner both stakes and does NOT change totalSupply", async () => {
    const { pc, a, b } = await deploy();
    const betId = await placeBet(pc, a, b, 1000n);
    const supplyBefore = await pc.totalSupply();

    await pc.settleBet(betId, a.address);

    expect(await pc.totalSupply()).to.equal(supplyBefore);
    expect(await pc.balanceOf(a.address)).to.equal(GRANT + 1000n);
    expect(await pc.balanceOf(b.address)).to.equal(GRANT - 1000n);
    expect(await pc.lockedBalance(a.address)).to.equal(0n);
    expect(await pc.lockedBalance(b.address)).to.equal(0n);
    // Conservation: every credit is accounted for.
    expect(await sumOf(pc, [a.address, b.address])).to.equal(await pc.totalSupply());
  });

  it("cancelBet refunds BOTH players in full", async () => {
    const { pc, a, b } = await deploy();
    const betId = await placeBet(pc, a, b, 2500n);
    expect(await pc.balanceOf(a.address)).to.equal(GRANT - 2500n);

    await pc.cancelBet(betId, "no_winner");

    expect(await pc.balanceOf(a.address)).to.equal(GRANT);
    expect(await pc.balanceOf(b.address)).to.equal(GRANT);
    expect(await pc.lockedBalance(a.address)).to.equal(0n);
    expect(await pc.lockedBalance(b.address)).to.equal(0n);
    expect(await sumOf(pc, [a.address, b.address])).to.equal(await pc.totalSupply());
  });

  it("a bet cannot be settled or cancelled twice", async () => {
    const { pc, a, b } = await deploy();
    const betId = await placeBet(pc, a, b, 100n);
    await pc.settleBet(betId, b.address);
    await expect(pc.settleBet(betId, a.address)).to.be.revertedWith("WCCredit: bet already settled");
    await expect(pc.cancelBet(betId, "late")).to.be.revertedWith("WCCredit: bet not active");
  });

  it("issueCredits can fund the house/liquidity-bot wallet, owner only", async () => {
    const { pc, house, stranger } = await deploy();
    await pc.issueCredits(house.address, 1_000_000n, "house_liquidity");
    expect(await pc.balanceOf(house.address)).to.equal(1_000_000n);
    await expect(
      pc.connect(stranger).issueCredits(stranger.address, 1n, "steal")
    ).to.be.revertedWithCustomError(pc, "OwnableUnauthorizedAccount");
  });

  it("signup grant is one per wallet and keeps the exact revert text the backend matches on", async () => {
    const { pc, a } = await deploy();
    await expect(pc.issueSignupGrant(a.address)).to.be.revertedWith("WCCredit: grant already issued");
  });

  it("only the owner can place or settle bets", async () => {
    const { pc, a, b, stranger } = await deploy();
    await expect(
      pc.connect(stranger).placeBet(a.address, b.address, 1n, MATCH)
    ).to.be.revertedWithCustomError(pc, "OwnableUnauthorizedAccount");
  });

  it("credits are soulbound", async () => {
    const { pc, a, b } = await deploy();
    await expect(pc.connect(a).transfer(b.address, 1n)).to.be.revertedWith(
      "WCCredit: soulbound - credits are non-transferable"
    );
  });
});
