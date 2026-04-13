import { Link } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";

type AppHeaderActionsProps = {
  authLabel: string;
  isAuthenticated: boolean;
  totalItems: number;
  authRoute: string;
  cartRoute: string;
  onLogout: () => void;
};

function AppHeaderActions({
  authLabel,
  isAuthenticated,
  totalItems,
  authRoute,
  cartRoute,
  onLogout,
}: AppHeaderActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="rounded-full border border-border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {authLabel}
      </span>

      {isAuthenticated ? (
        <Button type="button" size="sm" onClick={onLogout}>
          <User className="size-4" />
          <span>Выйти</span>
        </Button>
      ) : (
        <Button type="button" size="sm" asChild>
          <Link to={authRoute}>
            <User className="size-4" />
            <span>Войти</span>
          </Link>
        </Button>
      )}

      <Button
        type="button"
        size="icon"
        variant="outline"
        className="relative"
        aria-label="Корзина"
        asChild
      >
        <Link to={cartRoute}>
          <ShoppingCart className="size-4" />
          <span className="absolute -top-1 -right-1 inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
            {totalItems}
          </span>
        </Link>
      </Button>
    </div>
  );
}

export { AppHeaderActions };
export type { AppHeaderActionsProps };
