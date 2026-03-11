import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

const variants = [
  "default",
  "destructive",
  "outline",
  "secondary",
  "ghost",
  "link",
  "success",
] as const;

const meta: Meta<typeof Button> = {
  title: "РљРѕРјРїРѕРЅРµРЅС‚С‹/РљРЅРѕРїРєР°",
  component: Button,
  parameters: {
    layout: "centered",
  },
  // tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: variants,
    },
    size: {
      control: "select",
      options: [
        "default",
        "xs",
        "sm",
        "lg",
        "icon",
        "icon-xs",
        "icon-sm",
        "icon-lg",
      ],
    },
    disabled: {
      control: "boolean",
    },
    asChild: {
      control: false,
      table: {
        disable: true,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const AllVariants: Story = {
  name: "Р’СЃРµ РІР°СЂРёР°РЅС‚С‹",
  args: {
    children: "default",
    variant: "default",
    size: "default",
    disabled: false,
  },
  render: (args) => {
    const isIconSize =
      typeof args.size === "string" && args.size.startsWith("icon");
    const controlledLabel =
      typeof args.children === "string" && args.children.length > 0
        ? args.children
        : (args.variant ?? "default");

    return (
      <div className="flex max-w-3xl flex-col gap-8 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            {...args}
            aria-label={isIconSize ? controlledLabel : args["aria-label"]}
          >
            {isIconSize ? <Plus /> : controlledLabel}
          </Button>
        </div>
        <hr />

        <div className="flex flex-wrap items-center gap-3">
          {variants.map((variant) => (
            <Button key={variant} variant={variant}>
              {variant}
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="destructive">
            <Trash2 />
            destructive + icon
          </Button>
          <Button variant="outline" size="icon" aria-label="outline icon">
            <Plus />
          </Button>
        </div>
      </div>
    );
  },
};




