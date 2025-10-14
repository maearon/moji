"use client";

import type React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { slugify } from "@/utils/slugify";
import type { Product } from "@/types/product";
import { Badge } from "@/components/ui/badge";
// import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
// import { Edit, Eye } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { Mode } from "@/components/ui/mode-switcher";

interface ProductCardProps {
  product: Product;
  viewMode: "grid" | "list";
}

export default function ProductCard({
  product,
  viewMode,
}: ProductCardProps) {
  // const router = useRouter();

  const defaultVariant = product.variants?.[0] ?? null;
  const fallbackUrl = `/products/edit/${slugify(
    product.name || "product"
  )}/${defaultVariant?.variant_code}.html?mode=view`;

  const mainImage = product.main_image_url || defaultVariant?.avatar_url || "";
  const hoverImage =
    product.hover_image_url || defaultVariant?.hover_url || "";

  return (
    <Link href={fallbackUrl}>
      <Card
        key={product.id}
        className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] hover:shadow-lg transition-shadow"
      >
        <CardContent
          className={`p-4 ${viewMode === "list" ? "flex gap-4" : ""}`}
        >
          {/* Image */}
          <div
            className={`${
              viewMode === "list"
                ? "w-32 h-32 flex-shrink-0"
                : "aspect-square"
            } mb-4 relative overflow-hidden`}
          >
            {mainImage && (
              <>
                <Image
                  src={mainImage}
                  alt={product.name || product.title || ""}
                  fill
                  className="object-cover transition-opacity duration-300 group-hover:opacity-0"
                />
                {hoverImage && (
                  <Image
                    src={hoverImage}
                    alt={`${product.name} hover`}
                    fill
                    className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                )}
              </>
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-sm line-clamp-2 text-gray-700 dark:text-gray-400">
                  {product.name || product.title}
                </h3>
                {product.sport && (
                  <Badge
                    variant="secondary"
                    className="text-xs mt-1 text-gray-700 dark:text-gray-400"
                  >
                    {product.sport} ▪ {product?.variants?.length || 0} variants
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-700 dark:text-gray-400">
                  ${product.price}
                </span>
                {product.compare_at_price &&
                  product.compare_at_price > product.price && (
                    <span className="text-sm text-gray-700 dark:text-gray-400 line-through">
                      ${product.compare_at_price}
                    </span>
                  )}
              </div>

              {/* <div className="flex gap-1">
                <ToggleGroup
                  type="single"
                  onValueChange={(value) => {
                    if (value) {
                      router.push(
                        `/products/edit/${slugify(
                          product.name
                        )}/${defaultVariant?.variant_code}.html?mode=${
                          value as Mode
                        }`
                      );
                    }
                  }}
                >
                  <ToggleGroupItem value="view" aria-label="View mode">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </ToggleGroupItem>
                  <ToggleGroupItem value="edit" aria-label="Edit mode">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </ToggleGroupItem>
                </ToggleGroup>
              </div> */}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
