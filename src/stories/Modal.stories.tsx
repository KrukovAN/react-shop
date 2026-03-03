import type { Meta, StoryObj } from "@storybook/react-vite";
import { Modal } from "@/components/ui/modal";

const meta: Meta<typeof Modal> = {
  title: "Компоненты/Модальное окно",
  component: Modal,
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
    onClose: {
      action: "close",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  name: "Демо",
  args: {
    visible: true,
    title: "Заголовок модального окна",
    description: "Описание модального окна, которое передается через пропсы.",
  },
  render: (args) => (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-100 via-slate-200 to-slate-300 p-8 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
      <div className="text-sm text-slate-600 dark:text-slate-300">
        Подложка страницы
      </div>
      <Modal {...args} />
    </div>
  ),
};
