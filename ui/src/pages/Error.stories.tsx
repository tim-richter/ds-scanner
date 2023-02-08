import { StoryObj } from '@storybook/react';
import { Error } from './Error.js';

export default { component: Error, parameters: { layout: 'fullscreen' } };

type Story = StoryObj<typeof Error>;

export const Default: Story = {
  parameters: {
    initialEntries: ['/no-route'],
  },
};
