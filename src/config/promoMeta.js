// Promo configuration. One promo is active per deployment: NEXT_PUBLIC_ACTIVE_PROMO
// (default EPL on the epl-promo-frontend branch). Copy marked [PLACEHOLDER] is
// pending final text from counsel / the business - do not ship it as final.
export const ACTIVE_PROMO = process.env.NEXT_PUBLIC_ACTIVE_PROMO || 'EPL';

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
    // [PLACEHOLDER] eligibility copy pending counsel. Informational only: nothing here blocks
    // anyone; any geoblocking has to be added separately (it is not implemented yet).
    eligibilityNotice: '[PLACEHOLDER] The EPL Challenge is not available to residents of the United States. Eligibility requirements are set out in the Official Rules.',
    // [PLACEHOLDER] prize / credit terms pending the Official Rules.
    prizesNote: '[PLACEHOLDER] Prize details will be published in the Official Rules.',
    creditsNote: '[PLACEHOLDER] Promo Credits have no monetary value and are non-transferable. Expiry and other terms will be set out in the Official Rules.',
  },
};

export const siteUrl = SITE_URL;
export const activePromo = PROMO_META[ACTIVE_PROMO] || PROMO_META.EPL;
