import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { SearchInput, SearchInputProps } from './SearchInput';

const meta: Meta<SearchInputProps> = {
  title: 'Example/SearchInput',
  component: SearchInput,
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    'data-testid': { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<SearchInputProps>;

export const Default: Story = {
  args: {
    value: '',
    placeholder: 'Search...',
    disabled: false,
  },
  render: (args) => {
    const [value, setValue] = React.useState(args.value);
    return <SearchInput {...args} value={value} onChange={e => setValue(e.target.value)} />;
  },
};