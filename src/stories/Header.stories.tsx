import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Header } from "@/components/ui/header";

const meta: Meta<typeof Header> = {
  title: "Навигация/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  // tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  name: "Демо",
  render: (args) => (
    <ThemeProvider storageKey="react-shop-header-story-theme">
      <div className="min-h-[160vh] bg-linear-to-b from-muted/40 via-background to-background">
        <Header {...args} />

        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
          <section className="rounded-3xl border bg-card p-8 shadow-sm">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Демонстрация прилипшего хедера
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Прокрутите холст, чтобы проверить, что хедер остается закрепленным.
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">
              Хедер это презентационный компонент со встроенным логотипом слева и
              кнопками навигации справа. Здесь добавлена достаточная высота
              страницы, чтобы полоса прокрутки была видна.
            </p>
          </section>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border bg-card p-6 shadow-sm" />
            <div className="rounded-3xl border bg-card p-6 shadow-sm" />
            <div className="rounded-3xl border bg-card p-6 shadow-sm" />
            <div className="rounded-3xl border bg-card p-6 shadow-sm" />
          </div>
        </div>
      </div>
    </ThemeProvider>
  ),
};
