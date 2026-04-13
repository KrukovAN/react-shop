import { NavLink } from "react-router-dom";
import { ROUTES } from "@/app/routes";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

type AppHeaderNavProps = {
  isAdmin: boolean;
};

function AppHeaderNav({ isAdmin }: AppHeaderNavProps) {
  const navItemClassName =
    "cursor-pointer transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

  return (
    <nav
      aria-label="Основная навигация"
      className="hidden items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground md:flex"
    >
      <NavLink
        to={ROUTES.products}
        end
        className={({ isActive }) =>
          cn(navItemClassName, isActive ? "text-foreground" : undefined)
        }
      >
        Каталог
      </NavLink>
      <Separator orientation="vertical" className="h-4" />
      <NavLink
        to={ROUTES.profile}
        className={({ isActive }) =>
          cn(navItemClassName, isActive ? "text-foreground" : undefined)
        }
      >
        Профиль
      </NavLink>
      <Separator orientation="vertical" className="h-4" />
      <NavLink
        to={ROUTES.cart}
        className={({ isActive }) =>
          cn(navItemClassName, isActive ? "text-foreground" : undefined)
        }
      >
        Корзина
      </NavLink>
      {isAdmin ? (
        <>
          <Separator orientation="vertical" className="h-4" />
          <NavLink
            to={ROUTES.admin}
            className={({ isActive }) =>
              cn(navItemClassName, isActive ? "text-foreground" : undefined)
            }
          >
            Админ
          </NavLink>
        </>
      ) : null}
      <Separator orientation="vertical" className="h-4" />
      <NavLink
        to={ROUTES.auth}
        className={({ isActive }) =>
          cn(navItemClassName, isActive ? "text-foreground" : undefined)
        }
      >
        Авторизация
      </NavLink>
    </nav>
  );
}

export { AppHeaderNav };
export type { AppHeaderNavProps };
