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
import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import TopHeader from '@/components/layout/TopHeader'
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
      } else if (messageCode === 'login_required') {
        toast.error("You don't have permission to view this page!", {
          id: 'auth-toast',
        });
      }

      // 🚀 ফিক্স: টোস্ট ফায়ার হওয়ার পর সামান্য একটু পর ইউআরএল ক্লিন হবে
      // এতে নেক্সট-জেএস টোস্টটি ড্রপ করার আগেই ইউআরএল ডিলিট করতে পারবে না
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
