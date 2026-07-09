import AiQuizSection from '../components/home/AiQuizSection.jsx'
import CategorySection from '../components/home/CategorySection.jsx'
import ComboSection from '../components/home/ComboSection.jsx'
import ContactSection from '../components/home/ContactSection.jsx'
import FeaturedProductsSection from '../components/home/FeaturedProductsSection.jsx'
import HeroSection from '../components/home/HeroSection.jsx'
import NewsletterSection from '../components/home/NewsletterSection.jsx'
import PoliciesSection from '../components/home/PoliciesSection.jsx'
import ReviewsSection from '../components/home/ReviewsSection.jsx'
import Workspace3DSection from '../components/home/Workspace3DSection.jsx'
import ClientLayout from '../components/layout/ClientLayout.jsx'
import SEO from '../../components/SEO.jsx'

export default function Home() {
  return (
    <ClientLayout>
      <SEO 
        title="Trang Chủ" 
        description="Smart Workspace - Giải pháp không gian làm việc thông minh, tiện lợi và đẳng cấp." 
      />
      <main>
        <HeroSection />
        <CategorySection />
        <Workspace3DSection />
        <ComboSection />
        <FeaturedProductsSection />
        <AiQuizSection />
        <PoliciesSection />
        <ReviewsSection />
        <ContactSection />
        <NewsletterSection />
      </main>
    </ClientLayout>
  )
}
