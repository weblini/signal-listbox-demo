import type {Meta, StoryObj} from '@storybook/angular';
import {within} from '@storybook/testing-library';
import {expect} from '@storybook/jest';
import {VegetableFormComponent} from './vegetable-form.component';
import {Status} from '@shared/models';
import {toArgs} from '@storybook-host';

const meta: Meta<VegetableFormComponent> = {
  component: VegetableFormComponent,
  title: 'VegetableFormComponent',
  args: toArgs<VegetableFormComponent>({
    status: Status.Idle,
  }),
  argTypes: {
    status: {
      options: Status,
      control: {
        type: 'select',
      },
    },
  },
};

export default meta;
type Story = StoryObj<VegetableFormComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/save/gi)).toBeTruthy();
  },
};
