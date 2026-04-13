import { Card } from "@/components/ui/card";

function AdminPage() {
  return (
    <section className="mx-auto w-full max-w-2xl space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Админ-раздел</h1>
        <p className="text-sm text-muted-foreground">
          Этот маршрут доступен только администратору.
        </p>
      </header>

      <Card className="rounded-2xl p-6 shadow-sm">
        <p className="text-sm leading-6 text-muted-foreground">
          Здесь можно разместить инструменты администрирования. Сейчас это
          демонстрационный защищенный роут.
        </p>
      </Card>
    </section>
  );
}

export { AdminPage };
