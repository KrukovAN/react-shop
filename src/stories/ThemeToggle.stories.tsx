import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ThemeProvider,
  type Theme,
  useTheme,
} from "@/components/providers/theme-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const themeLabels: Record<Theme, string> = {
  system: "Система",
  light: "Светлая",
  dark: "Темная",
};

function ThemeTogglePreview() {
  const { theme, resolvedTheme } = useTheme();

  return (
    <div className="flex w-full max-w-sm flex-col gap-4 rounded-3xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-card-foreground">
            Цветовая схема
          </p>
          <p className="text-sm text-muted-foreground">
            Тема: {themeLabels[theme]} / Активна: {themeLabels[resolvedTheme]}
          </p>
        </div>
        <ThemeToggle />
      </div>

      <div className="rounded-2xl border bg-background p-4 text-sm text-muted-foreground">
        Откройте меню и переключайтесь между системной, светлой и темной темами.
      </div>
    </div>
  );
}

const meta: Meta<typeof ThemeToggle> = {
  title: "Настройки/Переключатель темы",
  component: ThemeToggle,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const Default: Story = {
  name: "Демо",
  render: () => (
    <ThemeProvider storageKey="react-shop-theme-toggle-story-theme">
      <ThemeTogglePreview />
    </ThemeProvider>
  ),
};
