import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { CompactProductCard } from "@/widgets/compact-product-card";

const meta: Meta<typeof CompactProductCard> = {
  title: "РўРѕРІР°СЂС‹/РљРѕРјРїР°РєС‚РЅР°СЏ РєР°СЂС‚РѕС‡РєР° С‚РѕРІР°СЂР°",
  component: CompactProductCard,
  parameters: {
    layout: "centered",
  },
  // tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CompactProductCard>;

export const TwoProductsInteractive: Story = {
  name: "РРЅС‚РµСЂР°РєС‚РёРІРЅРѕ",
  render: () => {
    const [headphonesCount, setHeadphonesCount] = useState(1);
    const [lampCount, setLampCount] = useState(0);

    return (
      <div className="grid gap-6 md:grid-cols-2">
        <CompactProductCard
          title="Р‘РµСЃРїСЂРѕРІРѕРґРЅС‹Рµ РЅР°СѓС€РЅРёРєРё"
          description="РљРѕРјРїР°РєС‚РЅС‹Рµ РїРѕР»РЅРѕСЂР°Р·РјРµСЂРЅС‹Рµ РЅР°СѓС€РЅРёРєРё СЃ Р°РєС‚РёРІРЅС‹Рј С€СѓРјРѕРїРѕРґР°РІР»РµРЅРёРµРј, РјСЏРіРєРёРјРё Р°РјР±СѓС€СЋСЂР°РјРё Рё Р°РІС‚РѕРЅРѕРјРЅРѕСЃС‚СЊСЋ РґРѕ 30 С‡Р°СЃРѕРІ."
          price="12 990 в‚Ѕ"
          imageSrc="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
          imageAlt="Р‘РµСЃРїСЂРѕРІРѕРґРЅС‹Рµ РЅР°СѓС€РЅРёРєРё"
          cartCount={headphonesCount}
          onCartIncrement={() => setHeadphonesCount((current) => current + 1)}
          onCartDecrement={() =>
            setHeadphonesCount((current) => Math.max(0, current - 1))
          }
        />
        <CompactProductCard
          title="РњРёРЅРёРјР°Р»РёСЃС‚РёС‡РЅР°СЏ РЅР°СЃС‚РѕР»СЊРЅР°СЏ Р»Р°РјРїР°"
          description="РўРѕРЅРєР°СЏ Р°Р»СЋРјРёРЅРёРµРІР°СЏ РЅР°СЃС‚РѕР»СЊРЅР°СЏ Р»Р°РјРїР° СЃ СЂРµРіСѓР»РёСЂРѕРІРєРѕР№ СЏСЂРєРѕСЃС‚Рё, С‚РµРїР»С‹РјРё Рё С…РѕР»РѕРґРЅС‹РјРё СЂРµР¶РёРјР°РјРё СЃРІРµС‚Р°, СЃРµРЅСЃРѕСЂРЅС‹Рј СѓРїСЂР°РІР»РµРЅРёРµРј Рё СѓСЃС‚РѕР№С‡РёРІС‹Рј РѕСЃРЅРѕРІР°РЅРёРµРј РґР»СЏ РєРѕРјРїР°РєС‚РЅРѕРіРѕ СЂР°Р±РѕС‡РµРіРѕ РјРµСЃС‚Р°."
          price="5 990 в‚Ѕ"
          imageSrc="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80"
          imageAlt="РњРёРЅРёРјР°Р»РёСЃС‚РёС‡РЅР°СЏ РЅР°СЃС‚РѕР»СЊРЅР°СЏ Р»Р°РјРїР°"
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
  name: "РљРЅРѕРїРєР°",
  args: {
    title: "Р‘РµСЃРїСЂРѕРІРѕРґРЅС‹Рµ РЅР°СѓС€РЅРёРєРё",
    description:
      "РљРѕРјРїР°РєС‚РЅС‹Рµ РїРѕР»РЅРѕСЂР°Р·РјРµСЂРЅС‹Рµ РЅР°СѓС€РЅРёРєРё СЃ Р°РєС‚РёРІРЅС‹Рј С€СѓРјРѕРїРѕРґР°РІР»РµРЅРёРµРј, РјСЏРіРєРёРјРё Р°РјР±СѓС€СЋСЂР°РјРё Рё Р°РІС‚РѕРЅРѕРјРЅРѕСЃС‚СЊСЋ РґРѕ 30 С‡Р°СЃРѕРІ.",
    price: "12 990 в‚Ѕ",
    imageSrc:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Р‘РµСЃРїСЂРѕРІРѕРґРЅС‹Рµ РЅР°СѓС€РЅРёРєРё",
    cartCount: 0,
  },
};

export const LongDescription: Story = {
  name: "РљРѕР»РёС‡РµСЃС‚РІРѕ",
  args: {
    title: "РњРёРЅРёРјР°Р»РёСЃС‚РёС‡РЅР°СЏ РЅР°СЃС‚РѕР»СЊРЅР°СЏ Р»Р°РјРїР°",
    description:
      "РўРѕРЅРєР°СЏ Р°Р»СЋРјРёРЅРёРµРІР°СЏ РЅР°СЃС‚РѕР»СЊРЅР°СЏ Р»Р°РјРїР° СЃ СЂРµРіСѓР»РёСЂРѕРІРєРѕР№ СЏСЂРєРѕСЃС‚Рё, С‚РµРїР»С‹РјРё Рё С…РѕР»РѕРґРЅС‹РјРё СЂРµР¶РёРјР°РјРё СЃРІРµС‚Р°, СЃРµРЅСЃРѕСЂРЅС‹Рј СѓРїСЂР°РІР»РµРЅРёРµРј Рё СѓСЃС‚РѕР№С‡РёРІС‹Рј РѕСЃРЅРѕРІР°РЅРёРµРј РґР»СЏ РєРѕРјРїР°РєС‚РЅРѕРіРѕ СЂР°Р±РѕС‡РµРіРѕ РјРµСЃС‚Р°.",
    price: "5 990 в‚Ѕ",
    imageSrc:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    imageAlt: "РњРёРЅРёРјР°Р»РёСЃС‚РёС‡РЅР°СЏ РЅР°СЃС‚РѕР»СЊРЅР°СЏ Р»Р°РјРїР°",
    cartCount: 2,
  },
};




