import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components/ui/button";
import { Input } from "@/layuots/input";
import { Modal } from "@/components/ui/modal";

function ModalInputDemoStory() {
  const [message, setMessage] = React.useState("");
  const [visible, setVisible] = React.useState(false);

  return (
    <div className="w-[380px] rounded-3xl border bg-card p-6 shadow-sm">
      <div className="space-y-2">
        <label
          htmlFor="modal-message-input"
          className="block text-sm font-medium text-card-foreground"
        >
          Текст для модального окна
        </label>
        <Input
          id="modal-message-input"
          value={message}
          placeholder="Введите текст для модального окна"
          onChange={(event) => setMessage(event.target.value)}
        />
      </div>

      <Button type="button" className="mt-4" onClick={() => setVisible(true)}>
        Открыть модальное окно
      </Button>

      <Modal
        visible={visible}
        title="Значение из поля ввода"
        description={message.trim() || "Поле ввода пока пустое."}
        onClose={() => setVisible(false)}
      />
    </div>
  );
}

const meta: Meta<typeof ModalInputDemoStory> = {
  title: "Компоненты/Демо модального окна",
  component: ModalInputDemoStory,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ModalInputDemoStory>;

export const Default: Story = {
  name: "Демо",
  render: () => <ModalInputDemoStory />,
};




