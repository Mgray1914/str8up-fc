// Promo configuration. One promo is active per deployment: NEXT_PUBLIC_ACTIVE_PROMO
// (default EPL on the epl-promo-frontend branch). Copy marked [PLACEHOLDER] is
// pending final text from counsel / the business - do not ship it as final.
export const ACTIVE_PROMO = process.env.NEXT_PUBLIC_ACTIVE_PROMO || 'EPL';

// Stock-reward numbers shown to users. The backend doesn't expose its reward config, so
// these are copied from its defaults (Str8Upfe-be utils/rewardConfig.js:
// REWARD_PURSE_USD, REWARD_WINNER_SHARE, REWARD_DAILY_CAP_USD) - keep them in sync if
// those env vars are changed on the server.
const EPL_REWARDS = { purseUsd: 1.0, winnerShare: 0.6, dailyCapUsd: 3.0 };
const usd = (n) => `$${n.toFixed(2)}`;
const rewardsCopy = ({ purseUsd, winnerShare, dailyCapUsd }) =>
  `Every matched pick that settles with a winner earns a stock reward in the company you choose in The Vault. ` +
  `The winning pick receives ${usd(purseUsd * winnerShare)} of that stock and the other pick receives ${usd(purseUsd * (1 - winnerShare))} ` +
  `(${usd(purseUsd)} per matched pick). One rewarded pick per match, up to ${usd(dailyCapUsd)} in rewards per day. ` +
  `Rewards are held by Str8Up on your behalf.`;

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://str8upgaming.com').replace(/\/$/, '');

const PROMO_META = {
  PRESEASON: {
    name: 'NFL Preseason Challenge',
    title: 'NFL Preseason Challenge — Str8Up Gaming',
    seasonLabel: 'NFL Preseason 2026',
    ogDescription: 'Free-to-play peer-to-peer prediction contest. NFL Preseason 2026.',
    ogImage: 'https://str8upgaming.com/og-nfl-promo.png',
    apiPromoParam: 'NFL_2026',
    allowDraw: false,
    roundStyle: 'NFL_WEEK',
  },
  REGULAR_SEASON: {
    name: 'NFL Regular Season Challenge',
    title: 'NFL Regular Season Challenge — Str8Up Gaming',
    seasonLabel: 'NFL Regular Season 2026',
    ogDescription: 'Free-to-play peer-to-peer prediction contest. NFL Regular Season 2026.',
    ogImage: 'https://str8upgaming.com/og-nfl-regular.png',
    apiPromoParam: 'NFL_REG_2026',
    allowDraw: false,
    roundStyle: 'NFL_WEEK',
  },
  EPL: {
    name: 'English Premier League Challenge',
    shortName: 'EPL Challenge',
    title: 'English Premier League Challenge — Str8Up Gaming',
    seasonLabel: '2026/27 Season',
    ogDescription: 'Free-to-play prediction challenge for the 2026/27 English Premier League season. Pick home, draw or away and earn stock rewards.',
    // [PLACEHOLDER] OG image asset still to be supplied (public/og-epl-promo.png).
    ogImage: `${SITE_URL}/og-epl-promo.png`,
    apiPromoParam: 'EPL_2026',
    allowDraw: true,           // three-way market: home / draw / away
    roundStyle: 'MATCHWEEK',   // rounds are MW1..MW38
    disclaimer: 'Not affiliated with, sponsored by, or endorsed by the Premier League or any club.',
    // Informational only: nothing here blocks anyone; any geoblocking has to be added
    // separately (it is not implemented yet).
    eligibilityNotice: 'The EPL Challenge is not available to residents of the United States. Eligibility requirements are set out in the Official Rules.',
    rewards: EPL_REWARDS,
    prizesNote: rewardsCopy(EPL_REWARDS),
    // [PLACEHOLDER] credit terms pending the Official Rules.
    creditsNote: '[PLACEHOLDER] Promo Credits have no monetary value and are non-transferable. Expiry and other terms will be set out in the Official Rules.',
  },
};

export const siteUrl = SITE_URL;
export const activePromo = PROMO_META[ACTIVE_PROMO] || PROMO_META.EPL;
