import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ProductDetailsCard } from "@/components/ui/product-details-card";

const meta: Meta<typeof ProductDetailsCard> = {
  title: "Товары/Карточка полного описания товара",
  component: ProductDetailsCard,
  parameters: {
    layout: "padded",
  },
  // tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ProductDetailsCard>;

export const Interactive: Story = {
  name: "Интерактивно",
  render: () => {
    const [count, setCount] = useState(0);

    return (
      <ProductDetailsCard
        category="Освещение"
        title="Дизайнерская настольная лампа"
        description={
          "Компактная лампа для рабочего стола с регулировкой яркости, теплым и холодным светом и устойчивым металлическим основанием.\n\nПодходит для домашнего офиса, чтения и вечерней подсветки."
        }
        price="5 990 ₽"
        imageSrc="https://cloud.krukoff.pro/public.php/dav/files/3b2HSHk8H8JiSmP/lamp.avif"
        imageAlt="Дизайнерская настольная лампа"
        cartCount={count}
        onCartIncrement={() => setCount((current) => current + 1)}
        onCartDecrement={() => setCount((current) => Math.max(0, current - 1))}
      />
    );
  },
};

export const Default: Story = {
  name: "Карточка",
  args: {
    category: "Аудиотехника",
    title: "Беспроводные наушники с активным шумоподавлением",
    description:
      "Модель для ежедневного использования дома, в дороге и в офисе.\n\nМягкие амбушюры, стабильное Bluetooth-соединение, автономность до 30 часов и чистый сбалансированный звук делают эту модель удобной для длительного прослушивания музыки и звонков.",
    price: "12 990 ₽",
    imageSrc:
      "https://cloud.krukoff.pro/public.php/dav/files/3b2HSHk8H8JiSmP/headphones.avif",
    imageAlt: "Беспроводные наушники",
    cartCount: 0,
  },
};
