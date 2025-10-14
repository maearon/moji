import { render, screen } from '@testing-library/react'
import { EnhancedProductForm } from '../enhanced-product-form'

// Mock the API service
jest.mock('@/api/services/rubyService', () => ({
  reorderVariantImages: jest.fn().mockResolvedValue({ success: true })
}))

describe('EnhancedProductForm', () => {
  const mockOnSubmit = jest.fn()
  
  const defaultProps = {
    onSubmit: mockOnSubmit,
    mode: 'create' as const,
    loading: false
  }

  it('renders form with basic fields', () => {
    render(<EnhancedProductForm {...defaultProps} />)
    
    expect(screen.getByText('Create Product')).toBeInTheDocument()
    expect(screen.getByLabelText('Product Name *')).toBeInTheDocument()
    expect(screen.getByLabelText('Model Number *')).toBeInTheDocument()
  })

  it('shows edit mode when mode is edit', () => {
    render(<EnhancedProductForm {...defaultProps} mode="edit" />)
    
    expect(screen.getByText('Edit Product')).toBeInTheDocument()
  })

  it('shows view mode when mode is view', () => {
    render(<EnhancedProductForm {...defaultProps} mode="view" />)
    
    expect(screen.getByText('Product Details')).toBeInTheDocument()
  })

  it('disables form fields in view mode', () => {
    render(<EnhancedProductForm {...defaultProps} mode="view" />)
    
    const nameInput = screen.getByLabelText('Product Name *')
    expect(nameInput).toBeDisabled()
  })
})



