import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ProductDetailsCard } from "@/widgets/product-details-card";

const meta: Meta<typeof ProductDetailsCard> = {
  title: "РўРѕРІР°СЂС‹/РљР°СЂС‚РѕС‡РєР° РїРѕР»РЅРѕРіРѕ РѕРїРёСЃР°РЅРёСЏ С‚РѕРІР°СЂР°",
  component: ProductDetailsCard,
  parameters: {
    layout: "padded",
  },
  // tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ProductDetailsCard>;

export const Interactive: Story = {
  name: "РРЅС‚РµСЂР°РєС‚РёРІРЅРѕ",
  render: () => {
    const [count, setCount] = useState(0);

    return (
      <ProductDetailsCard
        category="РћСЃРІРµС‰РµРЅРёРµ"
        title="Р”РёР·Р°Р№РЅРµСЂСЃРєР°СЏ РЅР°СЃС‚РѕР»СЊРЅР°СЏ Р»Р°РјРїР°"
        description={
          "РљРѕРјРїР°РєС‚РЅР°СЏ Р»Р°РјРїР° РґР»СЏ СЂР°Р±РѕС‡РµРіРѕ СЃС‚РѕР»Р° СЃ СЂРµРіСѓР»РёСЂРѕРІРєРѕР№ СЏСЂРєРѕСЃС‚Рё, С‚РµРїР»С‹Рј Рё С…РѕР»РѕРґРЅС‹Рј СЃРІРµС‚РѕРј Рё СѓСЃС‚РѕР№С‡РёРІС‹Рј РјРµС‚Р°Р»Р»РёС‡РµСЃРєРёРј РѕСЃРЅРѕРІР°РЅРёРµРј.\n\nРџРѕРґС…РѕРґРёС‚ РґР»СЏ РґРѕРјР°С€РЅРµРіРѕ РѕС„РёСЃР°, С‡С‚РµРЅРёСЏ Рё РІРµС‡РµСЂРЅРµР№ РїРѕРґСЃРІРµС‚РєРё."
        }
        price="5 990 в‚Ѕ"
        imageSrc="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80"
        imageAlt="Р”РёР·Р°Р№РЅРµСЂСЃРєР°СЏ РЅР°СЃС‚РѕР»СЊРЅР°СЏ Р»Р°РјРїР°"
        cartCount={count}
        onCartIncrement={() => setCount((current) => current + 1)}
        onCartDecrement={() => setCount((current) => Math.max(0, current - 1))}
      />
    );
  },
};

export const Default: Story = {
  name: "РљР°СЂС‚РѕС‡РєР°",
  args: {
    category: "РђСѓРґРёРѕС‚РµС…РЅРёРєР°",
    title: "Р‘РµСЃРїСЂРѕРІРѕРґРЅС‹Рµ РЅР°СѓС€РЅРёРєРё СЃ Р°РєС‚РёРІРЅС‹Рј С€СѓРјРѕРїРѕРґР°РІР»РµРЅРёРµРј",
    description:
      "РњРѕРґРµР»СЊ РґР»СЏ РµР¶РµРґРЅРµРІРЅРѕРіРѕ РёСЃРїРѕР»СЊР·РѕРІР°РЅРёСЏ РґРѕРјР°, РІ РґРѕСЂРѕРіРµ Рё РІ РѕС„РёСЃРµ.\n\nРњСЏРіРєРёРµ Р°РјР±СѓС€СЋСЂС‹, СЃС‚Р°Р±РёР»СЊРЅРѕРµ Bluetooth-СЃРѕРµРґРёРЅРµРЅРёРµ, Р°РІС‚РѕРЅРѕРјРЅРѕСЃС‚СЊ РґРѕ 30 С‡Р°СЃРѕРІ Рё С‡РёСЃС‚С‹Р№ СЃР±Р°Р»Р°РЅСЃРёСЂРѕРІР°РЅРЅС‹Р№ Р·РІСѓРє РґРµР»Р°СЋС‚ СЌС‚Сѓ РјРѕРґРµР»СЊ СѓРґРѕР±РЅРѕР№ РґР»СЏ РґР»РёС‚РµР»СЊРЅРѕРіРѕ РїСЂРѕСЃР»СѓС€РёРІР°РЅРёСЏ РјСѓР·С‹РєРё Рё Р·РІРѕРЅРєРѕРІ.",
    price: "12 990 в‚Ѕ",
    imageSrc:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Р‘РµСЃРїСЂРѕРІРѕРґРЅС‹Рµ РЅР°СѓС€РЅРёРєРё",
    cartCount: 0,
  },
};




