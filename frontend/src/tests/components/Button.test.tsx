import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'
import Button from '../../components/common/Button'

describe('Button Component', () => {
  test('renders button with children', () => {
    render(<Button>Click Me</Button>)
    expect(screen.getByText('Click Me')).toBeInTheDocument()
  })

  test('calls onClick handler when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click Me</Button>)

    fireEvent.click(screen.getByText('Click Me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('applies primary variant styles by default', () => {
    render(<Button>Click Me</Button>)
    const button = screen.getByText('Click Me')

    expect(button).toHaveClass('bg-primary-600')
    expect(button).toHaveClass('text-white')
  })

  test('applies secondary variant styles when specified', () => {
    render(<Button variant="secondary">Click Me</Button>)
    const button = screen.getByText('Click Me')

    expect(button).toHaveClass('bg-gray-200')
    expect(button).toHaveClass('text-gray-800')
  })

  test('applies outline variant styles when specified', () => {
    render(<Button variant="outline">Click Me</Button>)
    const button = screen.getByText('Click Me')

    expect(button).toHaveClass('border')
    expect(button).toHaveClass('border-gray-300')
    expect(button).toHaveClass('bg-transparent')
  })

  test('applies size styles correctly', () => {
    render(<Button size="lg">Large Button</Button>)
    const button = screen.getByText('Large Button')

    expect(button).toHaveClass('px-6')
    expect(button).toHaveClass('py-3')
    expect(button).toHaveClass('text-lg')
  })

  test('applies fullWidth style when specified', () => {
    render(<Button fullWidth>Full Width Button</Button>)
    const button = screen.getByText('Full Width Button')

    expect(button).toHaveClass('w-full')
  })

  test('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>)
    const button = screen.getByText('Disabled Button')

    expect(button).toBeDisabled()
  })
})
