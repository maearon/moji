# Form Fixes Summary

## Vấn đề đã sửa

### 1. Form tự động save khi kéo thả/xóa ảnh
**Nguyên nhân**: `onChange` callback gọi API ngay lập tức
**Giải pháp**:
- Thêm `isImageChanging` state để ngăn submit
- Chỉ cập nhật local state, không gọi API ngay
- API chỉ được gọi khi submit form thực sự

### 2. Thứ tự ảnh không được cập nhật chính xác
**Nguyên nhân**: 
- Logic extract image ID không chính xác
- Backend reorder logic có vấn đề
**Giải pháp**:
- Cải thiện regex patterns để extract image ID
- Sửa backend reorder logic với better error handling
- Thêm debug logging để track

### 3. Xóa ảnh không cập nhật form state
**Nguyên nhân**: `handleRemove` không gọi `onReorder` callback
**Giải pháp**: Thêm `onReorder` callback trong `handleRemove`

## Code Changes

### Frontend (enhanced-product-form.tsx)
```typescript
// Thêm state để ngăn auto-submit
const [isImageChanging, setIsImageChanging] = useState(false)

// Cải thiện handleImageReorder
const handleImageReorder = useCallback((variantIndex: number, newOrder: (File | string)[]) => {
  setIsImageChanging(true)
  setValue(`variants.${variantIndex}.additional_images`, newOrder, {
    shouldDirty: true,
    shouldTouch: true,
    shouldValidate: false,
  })
  setTimeout(() => setIsImageChanging(false), 2000)
}, [setValue])

// Ngăn submit khi đang thay đổi ảnh
if (isImageChanging) return

// Cải thiện image ID extraction
const patterns = [
  /\/(\d+)\//,  // /123/
  /\/\d+\/(\d+)\//,  // /123/456/
  /images\/(\d+)\//,  // images/123/
  /variants\/(\d+)\/images\/(\d+)\//,  // variants/123/images/456/
]
```

### Frontend (multi-image-upload.tsx)
```typescript
// Thêm onReorder callback trong handleRemove
const handleRemove = (index: number) => {
  const newValue = value.filter((_, i) => i !== index)
  onChange(newValue)
  if (onReorder) {
    onReorder(newValue)
  }
}

// Thêm onReorder callback trong onDrop
const onDrop = useCallback((acceptedFiles: File[]) => {
  // ... existing logic
  if (onReorder) {
    onReorder(newValue)
  }
}, [value, onChange, maxFiles, onReorder])
```

### Backend (products_controller.rb)
```ruby
# Cải thiện reorder_variant_images method
def reorder_variant_images(variant, image_order)
  return unless image_order.is_a?(Array) && image_order.any?
  
  current_images = variant.images.attached? ? variant.images.to_a : []
  return if current_images.empty?
  
  reordered_images = []
  image_order.each do |image_id|
    image = current_images.find { |img| img.id.to_s == image_id.to_s }
    if image
      reordered_images << image
    else
      index = image_id.to_i
      reordered_images << current_images[index] if current_images[index]
    end
  end
  
  if reordered_images.any? && reordered_images.length == current_images.length
    image_blobs = reordered_images.map(&:blob)
    variant.images.purge
    image_blobs.each { |blob| variant.images.attach(blob) }
  end
end
```

## Testing Steps

1. **Test Drag & Drop**:
   - Kéo thả ảnh trong Additional Images
   - Kiểm tra console logs: "Image reorder triggered"
   - Kiểm tra button hiển thị "Updating Images..."
   - Kiểm tra form không tự submit

2. **Test Remove Images**:
   - Xóa ảnh bằng nút X
   - Kiểm tra ảnh có bị xóa không
   - Kiểm tra form state có cập nhật không

3. **Test Form Submit**:
   - Thay đổi thứ tự ảnh
   - Click Save
   - Kiểm tra console logs: "Reordering images for variant"
   - Kiểm tra API có được gọi với đúng thứ tự không

## Expected Behavior

1. **Drag & Drop**: 
   - Kéo thả ảnh → UI cập nhật ngay
   - Button hiển thị "Updating Images..."
   - Form không tự submit
   - Sau 2 giây button trở lại bình thường

2. **Remove Images**:
   - Click X → ảnh bị xóa
   - Form state cập nhật
   - Form không tự submit

3. **Form Submit**:
   - Click Save → API reorder được gọi
   - Thứ tự ảnh được lưu chính xác
   - Form submit thành công

## Debug Information

- Console logs sẽ hiển thị khi reorder được trigger
- Button state sẽ thay đổi khi đang update images
- Network tab sẽ hiển thị API calls khi submit
- Backend logs sẽ hiển thị reorder success/failure


