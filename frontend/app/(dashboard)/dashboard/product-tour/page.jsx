'use client';

import AuthGuard from '@/components/shared/AuthGuard';
import ProductTour from '@/components/product-tour/ProductTour';

export default function ProductTourPage() {
  return (
    <AuthGuard allowedRoles={['admin']}>
      <ProductTour />
    </AuthGuard>
  );
}