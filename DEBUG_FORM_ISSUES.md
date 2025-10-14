# Debug Form Issues

## Vấn đề đã phát hiện và sửa

### 1. Form tự động save
**Vấn đề**: Form tự động submit khi kéo thả hoặc xóa ảnh
**Nguyên nhân**: `onChange` callback gọi API ngay lập tức
**Giải pháp**: 
- Thêm `isImageChanging` state để ngăn submit khi đang thay đổi ảnh
- Chỉ cập nhật local state, không gọi API ngay
- API chỉ được gọi khi submit form

### 2. Thứ tự ảnh không được cập nhật
**Vấn đề**: Kéo thả ảnh không lưu thứ tự mới
**Nguyên nhân**: 
- Logic extract image ID không chính xác
- Backend reorder logic có vấn đề
**Giải pháp**:
- Cải thiện regex patterns để extract image ID
- Sửa backend reorder logic với better error handling
- Thêm debug logging

### 3. Xóa ảnh không chính xác
**Vấn đề**: Xóa ảnh không cập nhật form state
**Nguyên nhân**: `handleRemove` không gọi `onReorder` callback
**Giải pháp**: Thêm `onReorder` callback trong `handleRemove`

## Code Changes

### Frontend Changes
1. **enhanced-product-form.tsx**:
   - Thêm `isImageChanging` state
   - Cải thiện `handleImageReorder` để chỉ cập nhật local state
   - Thêm logic reorder trong `handleFormSubmit`
   - Cải thiện image ID extraction với multiple patterns

2. **multi-image-upload.tsx**:
   - Thêm `onReorder` callback trong `handleRemove` và `onDrop`
   - Cải thiện drag & drop logic

### Backend Changes
1. **products_controller.rb**:
   - Cải thiện `reorder_variant_images` method
   - Thêm better error handling và logging
   - Sửa logic mapping image IDs

## Testing Steps

1. **Test Drag & Drop**:
   - Kéo thả ảnh trong Additional Images
   - Kiểm tra thứ tự có thay đổi không
   - Kiểm tra form không tự submit

2. **Test Remove Images**:
   - Xóa ảnh bằng nút X
   - Kiểm tra ảnh có bị xóa không
   - Kiểm tra form state có cập nhật không

3. **Test Form Submit**:
   - Thay đổi thứ tự ảnh
   - Click Save
   - Kiểm tra API có được gọi với đúng thứ tự không

## Debug Commands

```bash
# Check browser console for debug logs
console.log('Reordering images for variant:', {...})

# Check network tab for API calls
# Should see PATCH /api/admin/products/:id/reorder_images

# Check form state
# isFormDirty should be true when changes are made
# isImageChanging should prevent auto-submit
```

## Expected Behavior

1. **Drag & Drop**: 
   - Kéo thả ảnh → UI cập nhật ngay
   - Form state cập nhật
   - Không tự submit

2. **Remove Images**:
   - Click X → ảnh bị xóa
   - Form state cập nhật
   - Không tự submit

3. **Form Submit**:
   - Click Save → API reorder được gọi
   - Thứ tự ảnh được lưu chính xác
   - Form submit thành công

## Troubleshooting

Nếu vẫn có vấn đề:

1. Kiểm tra browser console cho error logs
2. Kiểm tra network tab cho API calls
3. Kiểm tra form state với React DevTools
4. Kiểm tra backend logs cho reorder errors


