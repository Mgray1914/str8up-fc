// Promo-only build (NEXT_PUBLIC_PROMO_ONLY=true): the international EPL deployment
// serves only /promo. middleware.js redirects every other page to /promo and 404s
// the main app's API routes, so the real-money app is never exposed.
export const PROMO_ONLY = process.env.NEXT_PUBLIC_PROMO_ONLY === 'true';
