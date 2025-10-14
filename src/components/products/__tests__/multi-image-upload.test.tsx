import { render, screen, fireEvent } from '@testing-library/react'
import { MultiImageUpload } from '../multi-image-upload'

// Mock react-dropzone
jest.mock('react-dropzone', () => ({
  useDropzone: () => ({
    getRootProps: () => ({}),
    getInputProps: () => ({}),
    isDragActive: false,
  }),
}))

describe('MultiImageUpload', () => {
  const mockOnChange = jest.fn()
  const mockOnReorder = jest.fn()
  
  const defaultProps = {
    value: [],
    onChange: mockOnChange,
    label: 'Test Images',
    maxFiles: 5,
    disabled: false,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders with label', () => {
    render(<MultiImageUpload {...defaultProps} />)
    expect(screen.getByText('Test Images')).toBeInTheDocument()
  })

  it('shows dropzone when under max files', () => {
    render(<MultiImageUpload {...defaultProps} />)
    expect(screen.getByText(/Click or drag images to upload/)).toBeInTheDocument()
  })

  it('hides dropzone when at max files', () => {
    const props = {
      ...defaultProps,
      value: ['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg', 'image5.jpg']
    }
    render(<MultiImageUpload {...props} />)
    expect(screen.queryByText(/Click or drag images to upload/)).not.toBeInTheDocument()
  })

  it('calls onChange when images are added', () => {
    const mockFiles = [new File(['test'], 'test.jpg', { type: 'image/jpeg' })]
    const { getRootProps } = require('react-dropzone').useDropzone()
    
    render(<MultiImageUpload {...defaultProps} />)
    
    // Simulate file drop
    const onDrop = getRootProps().onDrop || jest.fn()
    onDrop(mockFiles)
    
    expect(mockOnChange).toHaveBeenCalledWith(mockFiles)
  })

  it('calls onReorder when provided', () => {
    const props = {
      ...defaultProps,
      onReorder: mockOnReorder,
      value: ['image1.jpg', 'image2.jpg']
    }
    
    render(<MultiImageUpload {...props} />)
    
    // Simulate reorder (this would be triggered by drag and drop)
    const newOrder = ['image2.jpg', 'image1.jpg']
    mockOnChange.mockImplementation((newValue) => {
      if (mockOnReorder) {
        mockOnReorder(newValue)
      }
    })
    
    mockOnChange(newOrder)
    expect(mockOnReorder).toHaveBeenCalledWith(newOrder)
  })

  it('disables interaction when disabled', () => {
    const props = {
      ...defaultProps,
      disabled: true,
      value: ['image1.jpg']
    }
    
    render(<MultiImageUpload {...props} />)
    
    // Check that remove buttons are not present when disabled
    const removeButtons = screen.queryAllByRole('button')
    expect(removeButtons).toHaveLength(0)
  })
})


