'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import type { Product } from '@/lib/types';
import { ProductDetail } from '@/components/product-detail';
import { Button } from '@/components/ui/button';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const productId = typeof params.id === 'string' ? params.id : undefined;

  useEffect(() => {
    if (!productId) {
      return;
    }

    let active = true;
    const loadProduct = async () => {
      try {
        const response = await api.getProduct(productId);
        if (active) {
          setProduct(response);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
        if (active) {
          router.push('/');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadProduct();
    return () => {
      active = false;
    };
  }, [productId, router]);

  if (productId && (loading || product?.id !== productId)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center" role="status">
        <p className="text-muted-foreground">Loading cake details...</p>
      </div>
    );
  }

  if (!productId || !product) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-muted-foreground">This cake could not be found.</p>
        <Button variant="outline" onClick={() => router.push('/')}>
          Back to cakes
        </Button>
      </div>
    );
  }

  return <ProductDetail key={product.id} product={product} />;
}
