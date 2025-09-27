import Header from '../components/Header';
import Hero from '../components/Hero';
import Services from '../components/Services';
import PricingCalculator from '../components/PricingCalculator';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import PWAInstallPopup from '../components/PWAInstallPopup';

export default function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <Services />
      <PricingCalculator />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
      <BottomNav />
      <FloatingWhatsApp />
      <PWAInstallPopup />
    </div>
  );
}
