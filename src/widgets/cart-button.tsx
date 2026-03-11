import { Minus, Plus, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CartButtonProps = {
  count: number;
  onIncrement?: () => void;
  onDecrement?: () => void;
  disabled?: boolean;
  className?: string;
};

function CartButton({
  count,
  onIncrement,
  onDecrement,
  disabled = false,
  className,
}: CartButtonProps) {
  const safeCount = Math.max(0, count);
  const showCounter = safeCount > 0;

  return (
    <div
      className={cn(
        "inline-grid min-w-44 grid-cols-[2.5rem_minmax(3.5rem,1fr)_2.5rem]",
        className,
      )}
    >
      {showCounter ? (
        <div
          key="counter"
          className="col-span-3 inline-grid h-10 grid-cols-[2.5rem_minmax(3.5rem,1fr)_2.5rem] overflow-hidden rounded-md border border-input bg-background shadow-xs dark:border-input dark:bg-input/30"
        >
          <Button
            type="button"
            variant="ghost"
            className="h-full rounded-none border-0 bg-transparent px-0 shadow-none dark:hover:bg-input/50"
            onClick={onDecrement}
            disabled={disabled}
            aria-label="Уменьшить количество"
          >
            <Minus />
          </Button>
          <div
            className="flex h-full min-w-14 items-center justify-center border-x border-input px-3 text-sm font-medium tabular-nums"
            aria-live="polite"
          >
            {safeCount}
          </div>
          <Button
            type="button"
            variant="ghost"
            className="h-full rounded-none border-0 bg-transparent px-0 shadow-none dark:hover:bg-input/50"
            onClick={onIncrement}
            disabled={disabled}
            aria-label="Увеличить количество"
          >
            <Plus />
          </Button>
        </div>
      ) : (
        <Button
          key="empty"
          type="button"
          size="lg"
          variant="outline"
          className="col-span-3 h-10 w-full justify-center"
          onClick={onIncrement}
          disabled={disabled}
        >
          <ShoppingCart />В корзину
        </Button>
      )}
    </div>
  );
}

export { CartButton };
export type { CartButtonProps };
