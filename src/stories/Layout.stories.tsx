import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Layout } from "@/components/ui/layout";

const meta: Meta<typeof Layout> = {
  title: "Навигация/Layout",
  component: Layout,
  parameters: {
    layout: "fullscreen",
  },
  // tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Layout>;

export const Default: Story = {
  name: "Демо",
  render: () => (
    <Layout
      headerContent={
        <div className="rounded-full border border-dashed border-border px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Header
        </div>
      }
    >
      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardDescription>Layout</CardDescription>
            <CardTitle className="text-3xl tracking-tight">
              Каркас страницы с липким хедером и центрированным контентом.
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-6 text-muted-foreground">
            Используйте эту презентационную обертку для страниц с активной
            навигацией. Она фиксирует хедер и ограничивает ширину контента на
            больших экранах.
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardHeader>
            <CardDescription>Logo</CardDescription>
            <CardTitle>Зарезервированное место внутри хедера</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-6 text-muted-foreground">
            Логотип встроен в хедер слева, а правая часть остается доступной для
            навигации, действий или элементов профиля.
          </CardContent>
        </Card>
      </section>

      <section className="mt-4 grid gap-4 md:grid-cols-3">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Витрина</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Здесь можно размещать крупный главный контент.
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Подборки</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Добавляйте вспомогательные блоки, фильтры или сводки по категориям.
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Готово</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Лейаут аккуратно масштабируется от мобильных экранов до широких
            десктопов.
          </CardContent>
        </Card>
      </section>
    </Layout>
  ),
};
