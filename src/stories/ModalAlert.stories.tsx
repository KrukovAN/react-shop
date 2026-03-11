import type { Meta, StoryObj } from "@storybook/react-vite";
import { Trash2Icon } from "lucide-react";
import { ModalAlert } from "@/modals/modal-alert";

const meta: Meta<typeof ModalAlert> = {
  title: "РљРѕРјРїРѕРЅРµРЅС‚С‹/РњРѕРґР°Р»СЊРЅРѕРµ РѕРєРЅРѕ Alert",
  component: ModalAlert,
  parameters: {
    layout: "fullscreen",
  },
  // tags: ["autodocs"],
  argTypes: {
    visible: {
      control: "boolean",
    },
    title: {
      control: "text",
    },
    description: {
      control: "text",
    },
    actionLabel: {
      control: "text",
    },
    actionIcon: {
      control: false,
    },
    onAction: {
      action: "action",
    },
    onClose: {
      action: "close",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ModalAlert>;

export const Default: Story = {
  name: "Р”РµРјРѕ",
  args: {
    visible: true,
    title: "РЈРґР°Р»РёС‚СЊ С‚РѕРІР°СЂ",
    description:
      "Р’С‹ С‚РѕС‡РЅРѕ С…РѕС‚РёС‚Рµ СѓРґР°Р»РёС‚СЊ РІС‹Р±СЂР°РЅРЅС‹Р№ С‚РѕРІР°СЂ? РћС‚РјРµРЅРёС‚СЊ РґР°РЅРЅРѕРµ РґРµР№СЃС‚РІРёРµ Р±СѓРґРµС‚ РЅРµРІРѕР·РјРѕР¶РЅРѕ.",
    actionLabel: "РЈРґР°Р»РёС‚СЊ",
    actionIcon: <Trash2Icon />,
  },
  render: (args) => (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-100 via-slate-200 to-slate-300 p-8 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
      <div className="text-sm text-slate-600 dark:text-slate-300">
        РџРѕРґР»РѕР¶РєР° СЃС‚СЂР°РЅРёС†С‹
      </div>
      <ModalAlert {...args} />
    </div>
  ),
};




