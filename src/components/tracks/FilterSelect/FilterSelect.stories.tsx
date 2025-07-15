import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { FilterSelect } from './FilterSelect';

const genres = ['Rock', 'Pop', 'Jazz', 'Classical', 'Electronic'];

const meta: Meta<typeof FilterSelect> = {
  title: 'Example/FilterSelect',
  component: FilterSelect,
  argTypes: {
    value: { control: 'text' },
    disabled: { control: 'boolean' },
    'data-testid': { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof FilterSelect>;

export const Default: Story = {
  args: {
    value: '',
    options: genres,
    disabled: false,
  },
  render: (args) => {
    const [value, setValue] = React.useState(args.value);
    return (
      <FilterSelect
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
};