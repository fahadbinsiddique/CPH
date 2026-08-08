"use client"

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
import React, { Suspense, useEffect } from 'react'
import { toast } from "sonner"
import { useSearchParams, useRouter } from 'next/navigation';

function ToastHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const messageCode = searchParams.get('message');

    if (messageCode) {
      if (messageCode === 'login_required') {
        toast.error('Please login first to access the dashboard!', {
          id: 'auth-toast',
        });
      } else if (messageCode === 'unauthorized') {
        toast.error("You don't have permission to view this page!", {
          id: 'auth-toast',
        });
      }

      // Clear the URL after the toast is shown so the page state remains consistent.
      const timer = setTimeout(() => {
        router.replace('/');
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  return null;
}


const Page = () => {
  return (
    <>
    <Suspense fallback={null}>
        <ToastHandler />
      </Suspense>
      <main>
        <Hero />
        <TrustBenefitsSection />
        <FeaturesTrustSection />
        <FeaturesShowcase />
        <TherapistsSection />
        <ViewAllTherapistsCTA />
        <Testimonials />
        <BlogPreview />
        <Faq />
        <FinalCTA />
      </main>
    </>
  )
}

export default Page
