import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { CartButton } from "@/components/ui/cart-button";

const meta: Meta<typeof CartButton> = {
  title: "Компоненты/Кнопка корзины",
  component: CartButton,
  parameters: {
    layout: "centered",
  },
  // tags: ["autodocs"],
  argTypes: {
    onIncrement: {
      action: "increment",
    },
    onDecrement: {
      action: "decrement",
    },
  },
};

export default meta;
type Story = StoryObj<typeof CartButton>;

export const Demo: Story = {
  name: "Интерактивно",
  render: () => {
    const [count, setCount] = useState(0);

    return (
      <CartButton
        count={count}
        onIncrement={() => setCount((current) => current + 1)}
        onDecrement={() => setCount((current) => Math.max(0, current - 1))}
      />
    );
  },
};

export const Empty: Story = {
  name: "Кнопка",
  args: {
    count: 0,
  },
};

export const SingleItem: Story = {
  name: "Количество",
  args: {
    count: 2,
  },
};
