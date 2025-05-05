import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'
import Modal from '../../components/common/Modal'

describe('Modal Component', () => {
  test('renders nothing when isOpen is false', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={() => {}} title="Test Modal">
        Modal Content
      </Modal>
    )
    
    expect(container.firstChild).toBeNull()
  })

  test('renders modal when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        Modal Content
      </Modal>
    )
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Modal Content')).toBeInTheDocument()
  })

  test('calls onClose when backdrop is clicked', () => {
    const handleClose = vi.fn()
    
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        Modal Content
      </Modal>
    )
    
    // Find the backdrop (the first div with fixed positioning)
    const backdrop = document.querySelector('.fixed.inset-0.bg-black')
    expect(backdrop).not.toBeNull()
    
    // Click the backdrop
    if (backdrop) {
      fireEvent.click(backdrop)
      expect(handleClose).toHaveBeenCalledTimes(1)
    }
  })

  test('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn()
    
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        Modal Content
      </Modal>
    )
    
    // Find the close button
    const closeButton = screen.getByRole('button', { name: /close/i })
    expect(closeButton).toBeInTheDocument()
    
    // Click the close button
    fireEvent.click(closeButton)
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  test('applies correct size class based on size prop', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal" size="sm">
        Modal Content
      </Modal>
    )
    
    // Check for small size
    let modalContent = document.querySelector('.max-w-sm')
    expect(modalContent).not.toBeNull()
    
    // Rerender with medium size
    rerender(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal" size="md">
        Modal Content
      </Modal>
    )
    
    modalContent = document.querySelector('.max-w-md')
    expect(modalContent).not.toBeNull()
    
    // Rerender with large size
    rerender(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal" size="lg">
        Modal Content
      </Modal>
    )
    
    modalContent = document.querySelector('.max-w-lg')
    expect(modalContent).not.toBeNull()
    
    // Rerender with extra large size
    rerender(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal" size="xl">
        Modal Content
      </Modal>
    )
    
    modalContent = document.querySelector('.max-w-xl')
    expect(modalContent).not.toBeNull()
  })

  test('uses medium size by default', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        Modal Content
      </Modal>
    )
    
    const modalContent = document.querySelector('.max-w-md')
    expect(modalContent).not.toBeNull()
  })
})
