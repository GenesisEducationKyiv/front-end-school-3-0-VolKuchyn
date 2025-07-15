import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { ButtonAddTrack, ButtonAddTrackProps } from './ButtonAddTrack';

const meta: Meta<ButtonAddTrackProps> = {
  title: 'Example/ButtonAddTrack',
  component: ButtonAddTrack,
  argTypes: {
    onClick: { action: 'clicked' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    label: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<ButtonAddTrackProps>;

export const Default: Story = {
  args: {
    label: '+ Add Track',
    disabled: false,
    loading: false,
  },
};
