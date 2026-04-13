import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES, type AuthRouteState } from "@/app/routes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type AuthPageProps = {
  isAuthenticated: boolean;
  isAdmin: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onBecomeAdmin: () => void;
  onBecomeUser: () => void;
};

function AuthPage({
  isAuthenticated,
  isAdmin,
  onLogin,
  onLogout,
  onBecomeAdmin,
  onBecomeUser,
}: AuthPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as AuthRouteState | null) ?? null;

  const fromPath =
    state?.from && state.from !== ROUTES.auth ? state.from : ROUTES.products;

  const guardMessage =
    state?.reason === "admin"
      ? "Для этого раздела нужны права администратора."
      : state?.reason === "auth"
        ? "Сначала выполните вход в систему."
        : null;

  return (
    <section className="mx-auto w-full max-w-2xl space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Авторизация</h1>
        <p className="text-sm text-muted-foreground">
          Фейковая страница для переключения статуса пользователя и роли.
        </p>
      </header>

      {guardMessage ? (
        <Card className="border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {guardMessage}
        </Card>
      ) : null}

      <Card className="space-y-6 rounded-2xl p-6 shadow-sm">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Текущий статус</p>
          <p className="text-base font-medium">
            {isAuthenticated
              ? isAdmin
                ? "Выполнен вход: администратор"
                : "Выполнен вход: пользователь"
              : "Гость (не авторизован)"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant={isAuthenticated ? "outline" : "default"}
            onClick={isAuthenticated ? onLogout : onLogin}
          >
            {isAuthenticated ? "Разлогиниться" : "Залогиниться"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onBecomeUser}
            disabled={!isAuthenticated || !isAdmin}
          >
            Стать пользователем
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onBecomeAdmin}
            disabled={!isAuthenticated || isAdmin}
          >
            Стать админом
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={() => navigate(fromPath)}>
            Вернуться назад
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(ROUTES.products)}
          >
            В каталог
          </Button>
        </div>
      </Card>
    </section>
  );
}

export { AuthPage };
export type { AuthPageProps };
