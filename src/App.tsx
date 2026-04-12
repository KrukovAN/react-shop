import { ThemeProvider } from "@/components/providers/theme-provider";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/ui/layout";

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <section className="mx-auto w-full max-w-3xl rounded-3xl border bg-card p-8 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Провайдер темы
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Приложение теперь управляет цветовой схемой через контекст.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
            Используйте иконку в хедере, чтобы переключаться между светлой,
            темной и системной темами. Выбранный режим применяется ко всему
            приложению.
          </p>
          <Button className="mt-6">Открыть каталог</Button>
        </section>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
