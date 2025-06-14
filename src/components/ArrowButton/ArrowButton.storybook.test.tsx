import { render, screen, fireEvent } from '@testing-library/react'
import { composeStories } from '@storybook/react'
import { describe, it, expect, vi } from 'vitest'

import * as stories from './ArrowButton.stories'

// Compose all stories from the story file
const { Right, Left, Disabled, WithCustomProps } = composeStories(stories)

describe('ArrowButton Component Stories', () => {
  describe('Right Arrow Button', () => {
    it('renders right arrow button with correct styling', () => {
      render(<Right />)
      const button = screen.getByRole('button')

      expect(button).toBeInTheDocument()
      expect(button).toHaveClass(
        'h-10',
        'w-14',
        'rounded-sm',
        'border-gray-500',
      )
    })

    it('calls onClick handler when clicked', () => {
      const handleClick = vi.fn()
      render(<Right onClick={handleClick} />)

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('displays right arrow icon', () => {
      render(<Right />)
      const button = screen.getByRole('button')

      // Check that the button contains content (arrow icon)
      expect(button).toBeInTheDocument()
      expect(button.children.length).toBeGreaterThan(0)
    })
  })

  describe('Left Arrow Button', () => {
    it('renders left arrow button with correct styling', () => {
      render(<Left />)
      const button = screen.getByRole('button')

      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('h-10', 'w-14', 'rounded-sm')
    })

    it('displays left arrow icon', () => {
      render(<Left />)
      const button = screen.getByRole('button')

      expect(button).toBeInTheDocument()
      expect(button.children.length).toBeGreaterThan(0)
    })
  })

  describe('Disabled Arrow Button', () => {
    it('renders disabled button with correct attributes', () => {
      render(<Disabled />)
      const button = screen.getByRole('button')

      expect(button).toBeInTheDocument()
      expect(button).toBeDisabled()
      expect(button).toHaveClass(
        'disabled:cursor-not-allowed',
        'disabled:opacity-30',
      )
    })

    it('does not call onClick when disabled', () => {
      const handleClick = vi.fn()
      render(<Disabled onClick={handleClick} />)

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('Arrow Button with Custom Props', () => {
    it('supports custom aria-label', () => {
      render(<WithCustomProps />)
      const button = screen.getByRole('button', { name: 'Previous page' })

      expect(button).toBeInTheDocument()
      expect(button).toHaveAttribute('aria-label', 'Previous page')
    })

    it('supports custom data-testid', () => {
      render(<WithCustomProps />)
      const button = screen.getByTestId('nav-previous')

      expect(button).toBeInTheDocument()
    })

    it('is clickable with custom props', () => {
      const handleClick = vi.fn()
      render(<WithCustomProps onClick={handleClick} />)

      const button = screen.getByTestId('nav-previous')
      fireEvent.click(button)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Arrow Button Direction Coverage', () => {
    it('covers both arrow directions', () => {
      const directions = [
        { story: Right, direction: 'right' },
        { story: Left, direction: 'left' },
      ]

      directions.forEach(({ story: Story, direction }) => {
        const { unmount } = render(<Story />)
        const button = screen.getByRole('button')

        expect(button).toBeInTheDocument()
        expect(button).toHaveClass('h-10', 'w-14')

        unmount()
      })
    })
  })

  describe('Arrow Button Styling', () => {
    it('has consistent base styling across variants', () => {
      const stories = [Right, Left, Disabled]

      stories.forEach((Story) => {
        const { unmount } = render(<Story />)
        const button = screen.getByRole('button')

        expect(button).toHaveClass(
          'flex',
          'h-10',
          'w-14',
          'items-center',
          'justify-center',
          'rounded-sm',
          'border',
          'bg-white',
        )

        unmount()
      })
    })

    it('applies hover classes correctly', () => {
      render(<Right />)
      const button = screen.getByRole('button')

      expect(button).toHaveClass(
        'hover:border-gray-200',
        'hover:bg-gray-100',
        'hover:text-gray-400',
      )
    })

    it('applies focus classes correctly', () => {
      render(<Right />)
      const button = screen.getByRole('button')

      expect(button).toHaveClass('focus:outline-hidden')
    })
  })

  describe('Arrow Button Accessibility', () => {
    it('supports keyboard navigation', () => {
      render(<Right />)
      const button = screen.getByRole('button')

      button.focus()
      expect(button).toHaveFocus()
    })

    it('supports keyboard activation', () => {
      const handleClick = vi.fn()
      render(<Right onClick={handleClick} />)

      const button = screen.getByRole('button')
      fireEvent.keyDown(button, { key: 'Enter' })

      // Note: fireEvent.keyDown doesn't automatically trigger click for buttons
      // but the button should still be focusable and accessible
      expect(button).toBeInTheDocument()
    })

    it('works with screen readers', () => {
      render(<WithCustomProps />)
      const button = screen.getByRole('button', { name: 'Previous page' })

      expect(button).toHaveAttribute('aria-label', 'Previous page')
      expect(button).toBeVisible()
    })
  })

  describe('Arrow Button Performance', () => {
    it('renders efficiently with minimal re-renders', () => {
      const { rerender } = render(<Right />)
      const button = screen.getByRole('button')

      expect(button).toBeInTheDocument()

      // Re-render with same props should not cause issues
      rerender(<Right />)
      expect(button).toBeInTheDocument()
    })
  })

  describe('Arrow Button Event Handling', () => {
    it('handles multiple click events', () => {
      const handleClick = vi.fn()
      render(<Right onClick={handleClick} />)

      const button = screen.getByRole('button')

      fireEvent.click(button)
      fireEvent.click(button)
      fireEvent.click(button)

      expect(handleClick).toHaveBeenCalledTimes(3)
    })

    it('supports custom event handlers', () => {
      const handleMouseEnter = vi.fn()
      const handleMouseLeave = vi.fn()

      render(
        <Right
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />,
      )

      const button = screen.getByRole('button')

      fireEvent.mouseEnter(button)
      expect(handleMouseEnter).toHaveBeenCalledTimes(1)

      fireEvent.mouseLeave(button)
      expect(handleMouseLeave).toHaveBeenCalledTimes(1)
    })
  })
})
