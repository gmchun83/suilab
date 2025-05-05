import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import Card from '../../components/common/Card'

describe('Card Component', () => {
  test('renders card with children', () => {
    render(<Card>Card Content</Card>)
    expect(screen.getByText('Card Content')).toBeInTheDocument()
  })

  test('applies default styles', () => {
    render(<Card>Card Content</Card>)
    const card = screen.getByText('Card Content')
    
    expect(card).toHaveClass('bg-white')
    expect(card).toHaveClass('p-6') // default padding is 'md'
    expect(card).toHaveClass('shadow') // default shadow is 'md'
    expect(card).toHaveClass('rounded-md') // default rounded is 'md'
  })

  test('applies custom padding', () => {
    render(<Card padding="lg">Card Content</Card>)
    const card = screen.getByText('Card Content')
    
    expect(card).toHaveClass('p-8')
  })

  test('applies custom shadow', () => {
    render(<Card shadow="lg">Card Content</Card>)
    const card = screen.getByText('Card Content')
    
    expect(card).toHaveClass('shadow-lg')
  })

  test('applies custom rounded corners', () => {
    render(<Card rounded="lg">Card Content</Card>)
    const card = screen.getByText('Card Content')
    
    expect(card).toHaveClass('rounded-lg')
  })

  test('applies custom className', () => {
    render(<Card className="custom-class">Card Content</Card>)
    const card = screen.getByText('Card Content')
    
    expect(card).toHaveClass('custom-class')
  })

  test('applies no padding when specified', () => {
    render(<Card padding="none">Card Content</Card>)
    const card = screen.getByText('Card Content')
    
    expect(card).toHaveClass('p-0')
  })

  test('applies no shadow when specified', () => {
    render(<Card shadow="none">Card Content</Card>)
    const card = screen.getByText('Card Content')
    
    expect(card).toHaveClass('shadow-none')
  })

  test('applies no rounded corners when specified', () => {
    render(<Card rounded="none">Card Content</Card>)
    const card = screen.getByText('Card Content')
    
    expect(card).toHaveClass('rounded-none')
  })
})
