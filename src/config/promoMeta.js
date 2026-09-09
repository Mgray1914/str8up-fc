export const ACTIVE_PROMO = 'REGULAR_SEASON'; // flip to 'REGULAR_SEASON' to switch

const PROMO_META = {
  PRESEASON: {
    name: 'NFL Preseason Challenge',
    title: 'NFL Preseason Challenge — Str8Up Gaming',
    seasonLabel: 'NFL Preseason 2026',
    ogDescription: 'Free-to-play peer-to-peer prediction contest. NFL Preseason 2026.',
    ogImage: 'https://str8upgaming.com/og-nfl-promo.png',
    apiPromoParam: 'NFL_2026',
  },
  REGULAR_SEASON: {
    name: 'NFL Regular Season Challenge',
    title: 'NFL Regular Season Challenge — Str8Up Gaming',
    seasonLabel: 'NFL Regular Season 2026',
    ogDescription: 'Free-to-play peer-to-peer prediction contest. NFL Regular Season 2026.',
    ogImage: 'https://str8upgaming.com/og-nfl-promo.png',
    apiPromoParam: 'NFL_REG_2026',
  },
};

export const activePromo = PROMO_META[ACTIVE_PROMO];
