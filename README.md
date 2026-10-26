# Str8Up — Web App

The Next.js frontend and promo contracts for **Str8Up**, a peer-to-peer sports prediction platform on **Base**. Users connect a wallet, browse matches, make picks against other fans, and track results, the leaderboard and their stock rewards.

**Live:** https://str8upfc.com

## Features
- Wallet connect and silent wallet sign-in for promo actions
- Match boards with three-way picks (win/draw/loss), local kickoff times, matchweek tabs and club badges
- Take an open pick at its exact stake (equal-stake peer-to-peer matching)
- My Picks and Profile with Won/Lost/Matched/Returned badges, plus a leaderboard
- **The Vault:** tokenized-stock reward holdings, current value and reward history
- Promo-only build mode (`NEXT_PUBLIC_PROMO_ONLY=true`) for campaign sites, with OG/social metadata
- `PromoCredit` smart contract (Solidity + Hardhat, with tests): non-transferable promo credits, escrowed picks and on-chain settlement

## Stack
Next.js 15 · React 19 · Tailwind CSS · ethers v6 / web3.js · Solidity 0.8.20 · Hardhat · Base

## Contracts (Base mainnet, chain ID 8453)
| Contract | Address |
|---|---|
| EPL PromoCredit | [`0x36D63FECc32b66d635d66DC1372959d476494E1F`](https://basescan.org/address/0x36D63FECc32b66d635d66DC1372959d476494E1F) |
| NFL Regular Season PromoCredit | [`0xBDA63488acBb14846056C71b20A8ed40747e47b7`](https://basescan.org/address/0xBDA63488acBb14846056C71b20A8ed40747e47b7) |

## Running locally
```bash
cp .env.epl.example .env.local   # fill in values; .env* files are gitignored
npm install
npm run dev
```

Contracts:
```bash
cd wc-credits
npm install
npx hardhat test
```

The API lives in the Str8Up backend repository.

## Built with
I developed Str8Up using AI-assisted development (Claude Code).

## History
Netset Software built the original v1 web app in 2025. Their commits are kept in this repository's history. From mid-2026 I took over development and built the NFL, World Cup and EPL promo flows, wallet sign-in sessions, The Vault, the leaderboard and the `PromoCredit` contract.

— Milton Gray Jr., founder
