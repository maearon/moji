import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Metadata } from "next";
import ProductDetailPageClient from "./ProductDetailPageClient";
import { formatSlugTitle } from "@/utils/category-config.auto";
import Loading from "@/components/loading";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";

interface ProductDetailPageProps {
  params: { slug?: string; variant_code?: string };
}

// ✅ generateMetadata must be async with awaited `params`
export async function generateMetadata(
  props: { params: { slug?: string } }
): Promise<Metadata> {
  const { slug } = await Promise.resolve(props.params || {});
  const pageTitle = formatSlugTitle(slug || "Product Detail");
  return {
    title: pageTitle,
  };
}

// ✅ Main page function must await `params`
const ProductDetailPage = async (props: ProductDetailPageProps) => {
  const { slug, variant_code } = await Promise.resolve(props.params || {});

  if (!slug || !variant_code) notFound();

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<Loading />}>
        <PageBreadcrumb pageTitle="Product Detail" />
        <ComponentCard title="All Products">
        <ProductDetailPageClient
          params={{
            slug,
            variant_code,
          }}
        />
        </ComponentCard>
      </Suspense>
    </div>
  );
};

export default ProductDetailPage;
