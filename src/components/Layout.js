import Footer from '../components/Footer';
import Header from '../components/Header';
import PromoHeader from './promo/PromoHeader';
import PromoFooter from './promo/PromoFooter';
import { PROMO_ONLY } from '../config/promoOnly';

export default function Layout({ children }) {
  // Promo-only build: promo header/footer, never the main app's (wallet connect, STR8 links).
  if (PROMO_ONLY) {
    return (
      <>
        <PromoHeader />
        <main className="min-h-screen">{children}</main>
        <PromoFooter />
      </>
    );
  }
  return (
    <>
    <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
