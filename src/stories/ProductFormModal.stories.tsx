import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components/ui/button";
import {
  ProductFormModal,
  type ProductFormInitialValue,
  type ProductFormMode,
  type ProductFormSubmitPayload,
  type ProductFormValidationResult,
} from "@/components/ui/product-form-modal";

type ProductFormStoryArgs = {
  mode: ProductFormMode;
  initialValue: ProductFormInitialValue;
};

function ProductFormModalDemo({ mode, initialValue }: ProductFormStoryArgs) {
  const [visible, setVisible] = React.useState(false);
  const [activeMode, setActiveMode] = React.useState<ProductFormMode>(mode);
  const [submittedPayload, setSubmittedPayload] =
    React.useState<ProductFormSubmitPayload | null>(null);

  React.useEffect(() => {
    setActiveMode(mode);
  }, [mode]);

  const openAdd = () => {
    setActiveMode("add");
    setVisible(true);
  };

  const openEdit = () => {
    setActiveMode("edit");
    setVisible(true);
  };

  const handleSubmit = (payload: ProductFormSubmitPayload) => {
    setSubmittedPayload(payload);
    console.log("[ProductFormModal story] submit", payload);
  };

  const handleValidation = (result: ProductFormValidationResult) => {
    console.log("[ProductFormModal story] validation", result);
  };

  return (
    <div className="w-[min(100%,920px)] space-y-4 rounded-3xl border bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" onClick={openAdd}>
          Открыть добавление
        </Button>
        <Button type="button" variant="secondary" onClick={openEdit}>
          Открыть редактирование
        </Button>
      </div>

      {submittedPayload ? (
        <pre className="overflow-x-auto rounded-2xl border bg-muted/30 p-4 text-xs">
          {JSON.stringify(submittedPayload, null, 2)}
        </pre>
      ) : (
        <p className="text-sm text-muted-foreground">
          После отправки формы данные появятся здесь и в консоли Storybook.
        </p>
      )}

      <ProductFormModal
        visible={visible}
        mode={activeMode}
        initialValue={activeMode === "edit" ? initialValue : undefined}
        onClose={() => setVisible(false)}
        onSubmit={handleSubmit}
        onValidation={handleValidation}
      />
    </div>
  );
}

const meta: Meta<ProductFormStoryArgs> = {
  title: "Формы/Форма товара",
  parameters: {
    layout: "centered",
  },
  args: {
    mode: "edit",
    initialValue: {
      id: "prd_demo_001",
      name: "Кофемашина",
      description: "Автоматическая кофемашина с ручным капучинатором.",
      categoryName: "Техника",
      price: 24999.9,
      oldPrice: 31999.9,
      createdAt: "2026-03-05T10:00:00.000Z",
    },
  },
  argTypes: {
    mode: {
      control: "inline-radio",
      options: ["add", "edit"],
    },
    initialValue: {
      control: "object",
    },
  },
};

export default meta;

type Story = StoryObj<ProductFormStoryArgs>;

export const Interactive: Story = {
  name: "Интерактивная форма",
  render: (args) => <ProductFormModalDemo {...args} />,
};
