import type { Meta, StoryObj } from "@storybook/react-vite";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";

import { Card } from "@/components/ui/card";
import { CartProductItem } from "@/components/ui/cart-product-item";
import { ModalAlert } from "@/components/ui/modal-alert";

type CartStoryItem = {
  id: string;
  title: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
  quantity: number;
};

const meta: Meta<typeof CartProductItem> = {
  title: "Товары/Товар в корзине",
  component: CartProductItem,
  parameters: {
    layout: "padded",
  },
  // tags: ["autodocs"],
  argTypes: {
    onIncrement: {
      action: "increment",
    },
    onDecrement: {
      action: "decrement",
    },
    onRemove: {
      action: "remove",
    },
  },
};

export default meta;
type Story = StoryObj<typeof CartProductItem>;

const initialItems: CartStoryItem[] = [
  {
    id: "headphones",
    title: "Беспроводные наушники",
    price: "12 990 ₽",
    imageSrc:
      "https://cloud.krukoff.pro/public.php/dav/files/3b2HSHk8H8JiSmP/headphones.avif",
    imageAlt: "Беспроводные наушники",
    quantity: 2,
  },
  {
    id: "lamp",
    title: "Дизайнерская настольная лампа",
    price: "5 990 ₽",
    imageSrc:
      "https://cloud.krukoff.pro/public.php/dav/files/3b2HSHk8H8JiSmP/lamp.avif",
    imageAlt: "Дизайнерская настольная лампа",
    quantity: 1,
  },
];

export const TwoProductsInteractive: Story = {
  name: "Интерактивно",
  render: () => {
    const [items, setItems] = useState(initialItems);
    const [pendingRemovalId, setPendingRemovalId] = useState<string | null>(
      null,
    );

    const updateQuantity = (
      id: string,
      updater: (current: number) => number,
    ) => {
      setItems((current) =>
        current.map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, updater(item.quantity)) }
            : item,
        ),
      );
    };

    const requestRemoval = (id: string) => {
      setPendingRemovalId(id);
    };

    const closeRemovalModal = () => {
      setPendingRemovalId(null);
    };

    const confirmRemoval = () => {
      if (!pendingRemovalId) {
        return;
      }

      setItems((current) =>
        current.filter((item) => item.id !== pendingRemovalId),
      );
    };

    return (
      <>
        {items.length === 0 ? (
          <Card className="mx-auto w-full max-w-[1400px] px-6 py-10 text-center text-sm text-muted-foreground">
            Корзина пуста
          </Card>
        ) : (
          <Card className="mx-auto w-full max-w-[1400px] px-4">
            <div className="divide-y divide-border">
              {items.map((item) => (
                <CartProductItem
                  key={item.id}
                  title={item.title}
                  price={item.price}
                  imageSrc={item.imageSrc}
                  imageAlt={item.imageAlt}
                  quantity={item.quantity}
                  onIncrement={() =>
                    updateQuantity(item.id, (current) => current + 1)
                  }
                  onDecrement={() =>
                    item.quantity === 1
                      ? requestRemoval(item.id)
                      : updateQuantity(item.id, (current) => current - 1)
                  }
                  onRemove={() => requestRemoval(item.id)}
                />
              ))}
            </div>
          </Card>
        )}

        <ModalAlert
          visible={pendingRemovalId !== null}
          title="Удалить товар"
          description="Вы точно хотите удалить выбранный товар? Отменить данное действие будет невозможно."
          actionLabel="Удалить"
          actionIcon={<Trash2Icon />}
          onAction={confirmRemoval}
          onClose={closeRemovalModal}
        />
      </>
    );
  },
};

export const Default: Story = {
  name: "Товар",
  render: (args) => (
    <Card className="mx-auto w-full max-w-[1400px] px-4">
      <CartProductItem {...args} />
    </Card>
  ),
  args: {
    title: "Беспроводные наушники",
    price: "12 990 ₽",
    imageSrc:
      "https://cloud.krukoff.pro/public.php/dav/files/3b2HSHk8H8JiSmP/headphones.avif",
    imageAlt: "Беспроводные наушники",
    quantity: 2,
  },
};
