import type { Meta, StoryObj } from "@storybook/react-vite";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";

import { Card } from "@/components/ui/card";
import { CartProductItem } from "@/widgets/cart-product-item";
import { ModalAlert } from "@/modals/modal-alert";

type CartStoryItem = {
  id: string;
  title: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
  quantity: number;
};

const meta: Meta<typeof CartProductItem> = {
  title: "РўРѕРІР°СЂС‹/РўРѕРІР°СЂ РІ РєРѕСЂР·РёРЅРµ",
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
    title: "Р‘РµСЃРїСЂРѕРІРѕРґРЅС‹Рµ РЅР°СѓС€РЅРёРєРё",
    price: "12 990 в‚Ѕ",
    imageSrc:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Р‘РµСЃРїСЂРѕРІРѕРґРЅС‹Рµ РЅР°СѓС€РЅРёРєРё",
    quantity: 2,
  },
  {
    id: "lamp",
    title: "Р”РёР·Р°Р№РЅРµСЂСЃРєР°СЏ РЅР°СЃС‚РѕР»СЊРЅР°СЏ Р»Р°РјРїР°",
    price: "5 990 в‚Ѕ",
    imageSrc:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Р”РёР·Р°Р№РЅРµСЂСЃРєР°СЏ РЅР°СЃС‚РѕР»СЊРЅР°СЏ Р»Р°РјРїР°",
    quantity: 1,
  },
];

export const TwoProductsInteractive: Story = {
  name: "РРЅС‚РµСЂР°РєС‚РёРІРЅРѕ",
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
            РљРѕСЂР·РёРЅР° РїСѓСЃС‚Р°
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
          title="РЈРґР°Р»РёС‚СЊ С‚РѕРІР°СЂ"
          description="Р’С‹ С‚РѕС‡РЅРѕ С…РѕС‚РёС‚Рµ СѓРґР°Р»РёС‚СЊ РІС‹Р±СЂР°РЅРЅС‹Р№ С‚РѕРІР°СЂ? РћС‚РјРµРЅРёС‚СЊ РґР°РЅРЅРѕРµ РґРµР№СЃС‚РІРёРµ Р±СѓРґРµС‚ РЅРµРІРѕР·РјРѕР¶РЅРѕ."
          actionLabel="РЈРґР°Р»РёС‚СЊ"
          actionIcon={<Trash2Icon />}
          onAction={confirmRemoval}
          onClose={closeRemovalModal}
        />
      </>
    );
  },
};

export const Default: Story = {
  name: "РўРѕРІР°СЂ",
  render: (args) => (
    <Card className="mx-auto w-full max-w-[1400px] px-4">
      <CartProductItem {...args} />
    </Card>
  ),
  args: {
    title: "Р‘РµСЃРїСЂРѕРІРѕРґРЅС‹Рµ РЅР°СѓС€РЅРёРєРё",
    price: "12 990 в‚Ѕ",
    imageSrc:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Р‘РµСЃРїСЂРѕРІРѕРґРЅС‹Рµ РЅР°СѓС€РЅРёРєРё",
    quantity: 2,
  },
};




