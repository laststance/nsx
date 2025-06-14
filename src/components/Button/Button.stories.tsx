import type { Meta, StoryObj } from '@storybook/react-vite'

import Button from './Button'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
}

export default meta

export const Primary: StoryObj<typeof meta> = {
  args: {
    children: 'Primary Color',
    variant: 'primary',
  },
}

export const Secondary: StoryObj<typeof meta> = {
  args: {
    children: 'Secondary Color',
    variant: 'secondary',
  },
}

export const Inverse: StoryObj<typeof meta> = {
  args: {
    children: 'Inverse Color',
    variant: 'inverse',
  },
}

export const Danger: StoryObj<typeof meta> = {
  args: {
    children: 'Danger Color',
    variant: 'danger',
  },
}

export const Loading: StoryObj<typeof meta> = {
  args: {
    children: 'Loading Button',
    isLoading: true,
    variant: 'primary',
  },
}

export const Disabled: StoryObj<typeof meta> = {
  args: {
    children: 'Disabled Button',
    disabled: true,
    variant: 'primary',
  },
}

export const Sizes: StoryObj<typeof meta> = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm" variant="primary">
        Small
      </Button>
      <Button size="md" variant="primary">
        Medium
      </Button>
      <Button size="lg" variant="primary">
        Large
      </Button>
    </div>
  ),
}

export const WithCustomProps: StoryObj<typeof meta> = {
  args: {
    children: 'Custom Button',
    variant: 'primary',
    className: 'custom-class',
    'data-testid': 'custom-button',
    type: 'submit',
  },
}
