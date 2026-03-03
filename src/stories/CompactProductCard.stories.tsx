import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { CompactProductCard } from "@/components/ui/compact-product-card";

const meta: Meta<typeof CompactProductCard> = {
  title: "Товары/Компактная карточка товара",
  component: CompactProductCard,
  parameters: {
    layout: "centered",
  },
  // tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CompactProductCard>;

export const TwoProductsInteractive: Story = {
  name: "Интерактивно",
  render: () => {
    const [headphonesCount, setHeadphonesCount] = useState(1);
    const [lampCount, setLampCount] = useState(0);

    return (
      <div className="grid gap-6 md:grid-cols-2">
        <CompactProductCard
          title="Беспроводные наушники"
          description="Компактные полноразмерные наушники с активным шумоподавлением, мягкими амбушюрами и автономностью до 30 часов."
          price="12 990 ₽"
          imageSrc="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
          imageAlt="Беспроводные наушники"
          cartCount={headphonesCount}
          onCartIncrement={() => setHeadphonesCount((current) => current + 1)}
          onCartDecrement={() =>
            setHeadphonesCount((current) => Math.max(0, current - 1))
          }
        />
        <CompactProductCard
          title="Минималистичная настольная лампа"
          description="Тонкая алюминиевая настольная лампа с регулировкой яркости, теплыми и холодными режимами света, сенсорным управлением и устойчивым основанием для компактного рабочего места."
          price="5 990 ₽"
          imageSrc="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80"
          imageAlt="Минималистичная настольная лампа"
          cartCount={lampCount}
          onCartIncrement={() => setLampCount((current) => current + 1)}
          onCartDecrement={() =>
            setLampCount((current) => Math.max(0, current - 1))
          }
        />
      </div>
    );
  },
};

export const Default: Story = {
  name: "Кнопка",
  args: {
    title: "Беспроводные наушники",
    description:
      "Компактные полноразмерные наушники с активным шумоподавлением, мягкими амбушюрами и автономностью до 30 часов.",
    price: "12 990 ₽",
    imageSrc:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Беспроводные наушники",
    cartCount: 0,
  },
};

export const LongDescription: Story = {
  name: "Количество",
  args: {
    title: "Минималистичная настольная лампа",
    description:
      "Тонкая алюминиевая настольная лампа с регулировкой яркости, теплыми и холодными режимами света, сенсорным управлением и устойчивым основанием для компактного рабочего места.",
    price: "5 990 ₽",
    imageSrc:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Минималистичная настольная лампа",
    cartCount: 2,
  },
};
