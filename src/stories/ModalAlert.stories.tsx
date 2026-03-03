import type { Meta, StoryObj } from "@storybook/react-vite";
import { Trash2Icon } from "lucide-react";
import { ModalAlert } from "@/components/ui/modal-alert";

const meta: Meta<typeof ModalAlert> = {
  title: "Компоненты/Модальное окно Alert",
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
  name: "Демо",
  args: {
    visible: true,
    title: "Удалить товар",
    description:
      "Вы точно хотите удалить выбранный товар? Отменить данное действие будет невозможно.",
    actionLabel: "Удалить",
    actionIcon: <Trash2Icon />,
  },
  render: (args) => (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-100 via-slate-200 to-slate-300 p-8 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
      <div className="text-sm text-slate-600 dark:text-slate-300">
        Подложка страницы
      </div>
      <ModalAlert {...args} />
    </div>
  ),
};
