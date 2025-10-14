import { Suspense } from "react";
import { Metadata } from "next";
import NewProductPageClient from "./NewProductPageClient";
import { formatSlugTitle } from "@/utils/category-config.auto";
import { Loading } from "@/components/loading";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { getBreadcrumbTrail } from "@/utils/breadcrumb";

// ✅ generateMetadata must be async with awaited `params`
export async function generateMetadata(
  props: { params: { slug?: string } }
): Promise<Metadata> {
  const { slug } = await Promise.resolve(props.params || {});
  const pageTitle = formatSlugTitle(slug || "New Product");
  return {
    title: pageTitle,
  };
}

// ✅ Main page function must await `params`
const NewProductPage = async () => {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<Loading />}>
      <PageBreadcrumb items={getBreadcrumbTrail("products-new")} />
      {/* <ComponentCard title="Create New Product"> */}
        <NewProductPageClient />
      {/* </ComponentCard> */}
      </Suspense>
    </div>
  );
};

export default NewProductPage;
