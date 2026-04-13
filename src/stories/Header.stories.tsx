import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Header } from "@/components/ui/header";
import { Modal } from "@/components/ui/modal";
import { ProfileForm } from "@/components/ui/profile-form";

const meta: Meta<typeof Header> = {
  title: "Навигация/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

function HeaderDemo(args: React.ComponentProps<typeof Header>) {
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);

  return (
    <ThemeProvider storageKey="react-shop-header-story-theme">
      <div className="min-h-[160vh] bg-linear-to-b from-muted/40 via-background to-background">
        <Header {...args} onProfileClick={() => setIsProfileModalOpen(true)} />

        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
          <section className="rounded-3xl border bg-card p-8 shadow-sm">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Демонстрация прилипающего хедера
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Нажмите «Профиль» в центре хедера, чтобы открыть форму.
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">
              В сторибуке модальное окно использует ту же форму профиля, что и в
              основном приложении.
            </p>
          </section>
        </div>

        <Modal
          visible={isProfileModalOpen}
          title="Профиль"
          description="Редактирование профиля пользователя"
          onClose={() => setIsProfileModalOpen(false)}
          className="sm:max-w-xl"
        >
          <ProfileForm
            initialValues={{
              firstName: "Иван",
              lastName: "Иванов",
              displayName: "Иван И.",
              email: "ivan@example.com",
              emailVerified: false,
            }}
            onSubmit={(values) => {
              console.log("[Header story] profile submit", values);
            }}
            onValidation={(result) => {
              console.log("[Header story] profile validation", result);
            }}
          />
        </Modal>
      </div>
    </ThemeProvider>
  );
}

export const Default: Story = {
  name: "Демо",
  render: (args) => <HeaderDemo {...args} />,
};
