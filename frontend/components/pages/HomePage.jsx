'use client'
// Client implementation of the home page. Rendered by the server wrapper at app/page.js.

import Hero from '@/components/Landing/Hero'
import SocialProofBar from '@/components/Landing/SocialProofBar'
import HowItWorks from '@/components/Landing/HowItWorks'
import FeaturesBento from '@/components/Landing/FeaturesBento'
import AssessmentPreview from '@/components/Landing/AssessmentPreview'
import TherapistsSection from '@/components/Landing/TherapistsSection'
import TestimonialsCarousel from '@/components/Landing/TestimonialsCarousel'
import WhyCPH from '@/components/Landing/WhyCPH'
import PricingPlans from '@/components/Landing/PricingPlans'
import Faq from '@/components/Landing/Faq'
import FinalCTA from '@/components/Landing/FinalCTA'
import React, { Suspense, useEffect } from 'react'
import { toast } from "sonner"
import { useSearchParams, useRouter } from 'next/navigation'

function ToastHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const messageCode = searchParams.get('message')

    if (messageCode) {
      if (messageCode === 'login_required') {
        toast.error('Please login first to access the dashboard!', {
          id: 'auth-toast',
        })
      } else if (messageCode === 'session_expired') {
        toast.error('Your session has expired. Please login again.', {
          id: 'auth-toast',
        })
      } else if (messageCode === 'unauthorized') {
        toast.error("You don't have permission to view this page!", {
          id: 'auth-toast',
        })
      }

      // Clear the URL after the toast is shown so the page state remains consistent.
      const timer = setTimeout(() => {
        router.replace('/')
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [searchParams, router])

  return null
}

const HomePage = () => {
  return (
    <>
      <Suspense fallback={null}>
        <ToastHandler />
      </Suspense>
      <main>
        <Hero />
        <SocialProofBar />
        <HowItWorks />
        <FeaturesBento />
        <AssessmentPreview />
        <TherapistsSection />
        <TestimonialsCarousel />
        {/* <WhyCPH /> */}
        {/* <PricingPlans /> */}
        <Faq />
        <FinalCTA />
      </main>
    </>
  )
}

export default HomePage