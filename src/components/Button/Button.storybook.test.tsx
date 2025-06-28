import { composeStories } from '@storybook/react-vite'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import * as stories from './Button.stories'

// Compose all stories from the story file
const { Primary, Secondary, Inverse, Danger, Loading, Disabled, Sizes } =
  composeStories(stories)

describe('Button Component Stories', () => {
  describe('Primary Button', () => {
    it('renders primary button with correct styling', () => {
      render(<Primary />)
      const button = screen.getByRole('button', { name: 'Primary Color' })

      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('bg-green-500', 'text-white')
    })

    it('calls onClick handler when clicked', () => {
      const handleClick = vi.fn()
      render(<Primary onClick={handleClick} />)

      const button = screen.getByRole('button', { name: 'Primary Color' })
      fireEvent.click(button)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Secondary Button', () => {
    it('renders secondary button with blue styling', () => {
      render(<Secondary />)
      const button = screen.getByRole('button', { name: 'Secondary Color' })

      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('bg-blue-500', 'text-white')
    })
  })

  describe('Inverse Button', () => {
    it('renders inverse button with border and green text', () => {
      render(<Inverse />)
      const button = screen.getByRole('button', { name: 'Inverse Color' })

      expect(button).toBeInTheDocument()
      expect(button).toHaveClass(
        'bg-white',
        'text-green-400',
        'border',
        'border-green-400',
      )
    })
  })

  describe('Danger Button', () => {
    it('renders danger button with red styling', () => {
      render(<Danger />)
      const button = screen.getByRole('button', { name: 'Danger Color' })

      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('bg-red-500', 'text-white')
    })
  })

  describe('Loading Button', () => {
    it('renders loading button with spinner', () => {
      render(<Loading />)
      const button = screen.getByRole('button', { name: /Loading.*Button/ })
      const spinner = screen.getByTestId('loading')

      expect(button).toBeInTheDocument()
      expect(spinner).toBeInTheDocument()
      expect(button).toHaveTextContent('Loading Button')
    })

    it('shows spinner and button text simultaneously', () => {
      render(<Loading />)

      // Both spinner and text should be present
      expect(screen.getByTestId('loading')).toBeInTheDocument()
      expect(screen.getByText('Loading Button')).toBeInTheDocument()
    })
  })

  describe('Disabled Button', () => {
    it('renders disabled button with correct attributes', () => {
      render(<Disabled />)
      const button = screen.getByRole('button', { name: 'Disabled Button' })

      expect(button).toBeInTheDocument()
      expect(button).toBeDisabled()
      expect(button).toHaveClass(
        'disabled:opacity-70',
        'disabled:cursor-not-allowed',
      )
    })

    it('does not call onClick when disabled', () => {
      const handleClick = vi.fn()
      render(<Disabled onClick={handleClick} />)

      const button = screen.getByRole('button', { name: 'Disabled Button' })
      fireEvent.click(button)

      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('Button Sizes', () => {
    it('renders all three button sizes', () => {
      render(<Sizes />)

      const smallButton = screen.getByRole('button', { name: 'Small' })
      const mediumButton = screen.getByRole('button', { name: 'Medium' })
      const largeButton = screen.getByRole('button', { name: 'Large' })

      expect(smallButton).toHaveClass('py-2', 'px-4', 'text-sm')
      expect(mediumButton).toHaveClass('py-2', 'px-6', 'text-md')
      expect(largeButton).toHaveClass('py-3', 'px-8', 'text-lg')
    })

    it('all buttons are clickable', () => {
      const handleClick = vi.fn()
      render(<Sizes />)

      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        button.onclick = handleClick
        fireEvent.click(button)
      })

      expect(handleClick).toHaveBeenCalledTimes(buttons.length)
    })
  })

  describe('Button Variants Coverage', () => {
    it('covers all button variants', () => {
      const variants = [
        { story: Primary, expectedClass: 'bg-green-500' },
        { story: Secondary, expectedClass: 'bg-blue-500' },
        { story: Inverse, expectedClass: 'bg-white' },
        { story: Danger, expectedClass: 'bg-red-500' },
      ]

      variants.forEach(({ story: Story, expectedClass }) => {
        const { unmount } = render(<Story />)
        const button = screen.getByRole('button')
        expect(button).toHaveClass(expectedClass)
        unmount()
      })
    })
  })

  describe('Button Accessibility', () => {
    it('supports keyboard navigation', () => {
      render(<Primary />)
      const button = screen.getByRole('button', { name: 'Primary Color' })

      button.focus()
      expect(button).toHaveFocus()
    })

    it('supports custom aria attributes', () => {
      render(<Primary aria-label="Custom label" />)
      const button = screen.getByRole('button', { name: 'Custom label' })

      expect(button).toHaveAttribute('aria-label', 'Custom label')
    })
  })

  describe('Button Types', () => {
    it('supports different button types', () => {
      render(<Primary type="submit" />)
      const button = screen.getByRole('button', { name: 'Primary Color' })

      expect(button).toHaveAttribute('type', 'submit')
    })

    it('defaults to button type', () => {
      render(<Primary />)
      const button = screen.getByRole('button', { name: 'Primary Color' })

      expect(button).toHaveAttribute('type', 'button')
    })
  })
})
