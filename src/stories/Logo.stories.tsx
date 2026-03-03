import type { Meta, StoryObj } from "@storybook/react-vite";

import { Logo } from "@/components/ui/logo";

const meta: Meta<typeof Logo> = {
  title: "Навигация/Logo",
  component: Logo,
  parameters: {
    layout: "centered",
  },
  // tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Logo>;

export const Compact: Story = {
  name: "Компактный",
  args: {
    compact: true,
  },
};

export const Default: Story = {
  name: "Полный",
};
