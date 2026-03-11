import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { CartButton } from "@/widgets/cart-button";

const meta: Meta<typeof CartButton> = {
  title: "РљРѕРјРїРѕРЅРµРЅС‚С‹/РљРЅРѕРїРєР° РєРѕСЂР·РёРЅС‹",
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
  name: "РРЅС‚РµСЂР°РєС‚РёРІРЅРѕ",
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
  name: "РљРЅРѕРїРєР°",
  args: {
    count: 0,
  },
};

export const SingleItem: Story = {
  name: "РљРѕР»РёС‡РµСЃС‚РІРѕ",
  args: {
    count: 2,
  },
};




