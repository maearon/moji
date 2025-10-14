import { z } from "zod"

const variantSchema = z.object({
  id: z.string().optional(),
  variant_code: z.string().min(1, "Variant code is required"),
  // size: z.string().min(1, "Size is required"),
  color: z.string().min(1, "Color is required"),
  price: z.number().min(0, "Price must be positive"),
  compare_at_price: z.number().min(0).optional(),
  stock: z.number().int().min(0, "Stock must be non-negative"),
  // sku: z.string().min(1, "SKU is required"),
  main_image: z.any().optional(),
  hover_image: z.any().optional(),
  additional_images: z.array(z.any()).optional(),
  existing_main_image: z.string().optional(),
  existing_hover_image: z.string().optional(),
  // existing_additional_images: z.array(z.string()).optional(),
  remove_images: z.array(z.string()).optional(),
})

export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Product name is required"),
  model_number: z.string().min(1, "Model number is required"),
  // slug: z.string().min(1, "Slug is required"),
  main_image: z.any().optional(),
  hover_image: z.any().optional(),
  description: z.string().optional(),
  description_h5: z.string().optional(),
  description_p: z.string().optional(),
  brand: z.string().min(1, "Brand is required"),
  category: z.string().min(1, "Category is required"),
  sport: z.string().min(1, "Sport is required"),
  gender: z.string().optional(),
  product_type: z.string().optional(),
  activity: z.string().optional(),
  // material: z.string().optional(),
  // collection: z.string().optional(),
  franchise: z.string().optional(),
  // status: z.enum(["active", "inactive"]),
  care: z.string().optional(),
  specifications: z.string().optional(),
  // is_featured: z.boolean().default(false),
  badge: z.string().optional(),
  variants: z.array(variantSchema).min(1, "At least one variant is required"),
})

export type ProductFormData = z.infer<typeof productSchema>
export type VariantFormData = z.infer<typeof variantSchema>
