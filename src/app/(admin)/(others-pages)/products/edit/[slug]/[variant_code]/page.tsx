import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Metadata } from "next";
import EditProductPageClient from "./EditProductPageClient";
import { formatSlugTitle } from "@/utils/category-config.auto";
import { Loading } from "@/components/loading";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { getBreadcrumbTrail } from "@/utils/breadcrumb";

interface ProductDetailPageProps {
  params: { slug?: string; variant_code?: string };
  searchParams: { mode?: string };
}

// ✅ generateMetadata must be async with awaited `params`
export async function generateMetadata(
  props: { params: { slug?: string } }
): Promise<Metadata> {
  const { slug } = await Promise.resolve(props.params || {});
  const pageTitle = formatSlugTitle(slug || "Edit Product");
  return {
    title: pageTitle,
  };
}

// ✅ Main page function must await `params`
const ProductDetailPage = async (props: ProductDetailPageProps) => {
  const { slug, variant_code } = await Promise.resolve(props.params || {});
  const { mode } = await Promise.resolve(props.searchParams || {});

  if (!slug || !variant_code) notFound();

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<Loading />}>
        <PageBreadcrumb
          pageTitle={formatSlugTitle(slug)}
          items={getBreadcrumbTrail(`products-${mode || "view"}`)}
        />
        {/* <ComponentCard title="Edit, View, Create Product"> */}
        <EditProductPageClient
          params={{
            slug,
            variant_code,
            mode: mode || "view",
          }}
        />
        {/* </ComponentCard> */}
      </Suspense>
    </div>
  );
};

export default ProductDetailPage;
