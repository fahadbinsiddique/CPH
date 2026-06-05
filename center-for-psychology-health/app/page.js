import BlogPreview from '@/components/Landing/BlogPreview'
import Faq from '@/components/Landing/Faq'
import FeaturesShowcase from '@/components/Landing/FeaturesShowcase'
import FeaturesTrustSection from '@/components/Landing/FeaturesTrustSection'
import FinalCTA from '@/components/Landing/FinalCTA'
import Hero from '@/components/Landing/Hero'
import Testimonials from '@/components/Landing/Testimonials'
import TherapistsSection from '@/components/Landing/TherapistsSection'
import TrustBenefitsSection from '@/components/Landing/TrustBenefitsSection'
import ViewAllTherapistsCTA from '@/components/Landing/ViewAllTherapistsCTA'
import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import TopHeader from '@/components/layout/TopHeader'
import React from 'react'

const Page = () => {
  return (
    <>
      {/* <Navbar /> */}
      <main>
        <Hero />
        <FeaturesTrustSection />

        {/* <FeaturesShowcase /> */}
        {/* <TrustBenefitsSection /> */}
        <TherapistsSection />
        {/* <ViewAllTherapistsCTA /> */}
        {/* <Testimonials /> */}
        {/* <Faq /> */}
        {/* <BlogPreview /> */}
        <FinalCTA />
      </main>
      {/* <Footer /> */}
    </>
  )
}

export default Page
