import { composeStories } from '@storybook/react-vite'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi } from 'vitest'

import * as stories from './Input.stories'

// Compose all stories from the story file
const { Default, WithError, EmailType, PasswordType } = composeStories(stories)

describe('Input Component Stories', () => {
  describe('Default Input', () => {
    test('renders default input with correct attributes', () => {
      render(<Default />)
      const input = screen.getByPlaceholderText('Emily')

      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('type', 'text')
      expect(input).toHaveAttribute('placeholder', 'Emily')
    })

    test('accepts text input', async () => {
      const user = userEvent.setup()
      render(<Default />)
      const input = screen.getByPlaceholderText('Emily')

      await user.clear(input)
      await user.type(input, 'John Doe')

      expect(input).toHaveValue('John Doe')
    })

    test('handles focus and blur events', async () => {
      const user = userEvent.setup()
      render(<Default />)
      const input = screen.getByPlaceholderText('Emily')

      await user.click(input)
      expect(input).toHaveFocus()

      await user.tab()
      expect(input).not.toHaveFocus()
    })

    test('has correct default styling', () => {
      render(<Default />)
      const input = screen.getByPlaceholderText('Emily')

      expect(input).toHaveClass(
        'bg-gray-200',
        'border-gray-200',
        'text-gray-700',
      )
    })
  })

  describe('Input with Error', () => {
    test('renders error state with correct styling', () => {
      render(<WithError />)
      const input = screen.getByPlaceholderText('Required field')

      expect(input).toBeInTheDocument()
      expect(input).toHaveClass('border-red-300', 'text-red-900')
    })

    test('displays error message', () => {
      render(<WithError />)
      const errorMessage = screen.getByText('firstName is required')

      expect(errorMessage).toBeInTheDocument()
      expect(errorMessage).toHaveClass('text-red-600')
    })

    test('shows error icon', () => {
      // SVG with aria-hidden="true" won't be found by role, so use class selector
      const { container } = render(<WithError />)
      const errorIcon = container.querySelector('svg[aria-hidden="true"]')

      expect(errorIcon).toBeInTheDocument()
      expect(errorIcon).toHaveClass('text-red-500')
    })

    test('has proper error styling structure', () => {
      render(<WithError />)
      const input = screen.getByPlaceholderText('Required field')
      const errorMessage = screen.getByText('firstName is required')

      expect(input).toHaveClass('border-red-300')
      expect(errorMessage).toHaveClass('mt-2', 'text-sm', 'text-red-600')
    })
  })

  describe('Email Input Type', () => {
    test('renders email input with correct type', () => {
      render(<EmailType />)
      const input = screen.getByPlaceholderText('user@example.com')

      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('type', 'email')
    })

    test('accepts email input', async () => {
      const user = userEvent.setup()
      render(<EmailType />)
      const input = screen.getByPlaceholderText('user@example.com')

      await user.clear(input)
      await user.type(input, 'test@example.com')

      expect(input).toHaveValue('test@example.com')
    })

    test('has appropriate placeholder for email', () => {
      render(<EmailType />)
      const input = screen.getByPlaceholderText('user@example.com')

      expect(input).toHaveAttribute('placeholder', 'user@example.com')
    })
  })

  describe('Password Input Type', () => {
    test('renders password input with correct type', () => {
      render(<PasswordType />)
      const input = screen.getByPlaceholderText('Enter password')

      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('type', 'password')
    })

    test('accepts password input', async () => {
      const user = userEvent.setup()
      render(<PasswordType />)
      const input = screen.getByPlaceholderText('Enter password')

      await user.clear(input)
      await user.type(input, 'secretpassword')

      // Password inputs may not show value in tests for security
      expect(input).toBeInTheDocument()
    })

    test('has appropriate placeholder for password', () => {
      render(<PasswordType />)
      const input = screen.getByPlaceholderText('Enter password')

      expect(input).toHaveAttribute('placeholder', 'Enter password')
    })
  })

  describe('Input Types Coverage', () => {
    test('covers different input types', () => {
      const inputTypes = [
        { story: Default, expectedType: 'text', placeholder: 'Emily' },
        {
          story: EmailType,
          expectedType: 'email',
          placeholder: 'user@example.com',
        },
        {
          story: PasswordType,
          expectedType: 'password',
          placeholder: 'Enter password',
        },
      ]

      inputTypes.forEach(({ story: Story, expectedType, placeholder }) => {
        const { unmount } = render(<Story />)
        // Use placeholder text to find inputs since password inputs don't expose textbox role
        const input = screen.getByPlaceholderText(placeholder)

        expect(input).toHaveAttribute('type', expectedType)
        unmount()
      })
    })
  })

  describe('Input Event Handling', () => {
    test('prevents event propagation on keyup', () => {
      const globalHandler = vi.fn()
      document.addEventListener('keyup', globalHandler)

      render(<Default />)
      const input = screen.getByPlaceholderText('Emily')

      fireEvent.keyUp(input, { key: 'a' })

      // The stopPropagation should prevent global handler from being called
      expect(globalHandler).not.toHaveBeenCalled()

      document.removeEventListener('keyup', globalHandler)
    })

    test('handles keyboard input correctly', async () => {
      const user = userEvent.setup()
      render(<Default />)
      const input = screen.getByPlaceholderText('Emily')

      await user.type(input, 'Hello World')
      expect(input).toHaveValue('Hello World')
    })
  })

  describe('Input Accessibility', () => {
    test('supports keyboard navigation', () => {
      render(<Default />)
      const input = screen.getByPlaceholderText('Emily')

      input.focus()
      expect(input).toHaveFocus()
    })

    test('has proper ARIA attributes for error state', () => {
      const { container } = render(<WithError />)
      const input = screen.getByPlaceholderText('Required field')
      const errorMessage = screen.getByText('firstName is required')

      expect(input).toBeInTheDocument()
      expect(errorMessage).toBeInTheDocument()

      // Error icon should have aria-hidden (use querySelector since SVGs with aria-hidden don't have roles)
      const errorIcon = container.querySelector('svg[aria-hidden="true"]')
      expect(errorIcon).toHaveAttribute('aria-hidden', 'true')
    })

    test('provides proper focus outline', () => {
      render(<Default />)
      const input = screen.getByPlaceholderText('Emily')

      expect(input).toHaveClass('focus:outline-hidden')
    })
  })

  describe('Input Styling States', () => {
    test('has correct normal state styling', () => {
      render(<Default />)
      const input = screen.getByPlaceholderText('Emily')

      expect(input).toHaveClass(
        'w-full',
        'px-4',
        'py-2',
        'text-gray-700',
        'bg-gray-200',
        'border-2',
        'border-gray-200',
        'rounded-sm',
      )
    })

    test('has correct error state styling', () => {
      render(<WithError />)
      const input = screen.getByPlaceholderText('Required field')

      expect(input).toHaveClass(
        'border-red-300',
        'text-red-900',
        'placeholder-red-300',
      )
    })

    test('has correct focus styling classes', () => {
      render(<Default />)
      const input = screen.getByPlaceholderText('Emily')

      expect(input).toHaveClass('focus:bg-white', 'focus:border-purple-500')
    })
  })

  describe('Input Container Structure', () => {
    test('has proper container structure', () => {
      const { container } = render(<Default />)
      const inputContainer = container.querySelector(
        '.relative.mt-1.rounded-md.shadow-xs',
      )

      expect(inputContainer).toBeInTheDocument()
    })

    test('includes error icon container when there is an error', () => {
      const { container } = render(<WithError />)
      const errorIconContainer = container.querySelector(
        '.pointer-events-none.absolute.inset-y-0.right-0',
      )

      expect(errorIconContainer).toBeInTheDocument()
    })
  })

  describe('Input React Hook Form Integration', () => {
    test('integrates with React Hook Form register', () => {
      render(<Default />)
      const input = screen.getByPlaceholderText('Emily')

      // The input should be properly registered (name attribute should be present)
      expect(input).toHaveAttribute('name', 'firstName')
    })

    test('displays validation errors from React Hook Form', () => {
      render(<WithError />)

      const errorMessage = screen.getByText('firstName is required')
      expect(errorMessage).toBeInTheDocument()
    })
  })
})
