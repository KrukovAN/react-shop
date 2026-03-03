import * as React from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AspectRatio } from "./aspect-ratio";
import { Button } from "./button";
import { CartButton } from "./cart-button";

type CartProductItemProps = {
  title: string;
  price: React.ReactNode;
  imageSrc: string;
  imageAlt?: string;
  quantity: number;
  onIncrement?: () => void;
  onDecrement?: () => void;
  onRemove?: () => void;
  className?: string;
};

function CartProductItem({
  title,
  price,
  imageSrc,
  imageAlt,
  quantity,
  onIncrement,
  onDecrement,
  onRemove,
  className,
}: CartProductItemProps) {
  const safeQuantity = Math.max(1, quantity);

  return (
    <div
      className={cn(
        "grid w-full gap-4 py-4 sm:grid-cols-[5rem_1fr] md:grid-cols-[5rem_1fr_auto] md:items-center",
        className,
      )}
    >
      <AspectRatio ratio={1} className="overflow-hidden rounded-lg bg-muted">
        <img
          src={imageSrc}
          alt={imageAlt ?? title}
          className="h-full w-full object-cover"
        />
      </AspectRatio>
      <div className="min-w-0 space-y-2">
        <div className="line-clamp-2 text-sm font-semibold sm:text-base">
          {title}
        </div>
        <div className="text-sm font-semibold sm:text-base">{price}</div>
      </div>
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row md:col-span-1 md:justify-self-end">
        <CartButton
          count={safeQuantity}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          className="w-full min-w-0 sm:w-auto"
        />
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={onRemove}
        >
          <Trash2 />
          Удалить
        </Button>
      </div>
    </div>
  );
}

export { CartProductItem };
export type { CartProductItemProps };
