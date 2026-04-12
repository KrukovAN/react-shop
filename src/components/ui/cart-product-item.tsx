import * as React from "react";
import { Trash2 } from "lucide-react";
import { useProductImage } from "@/hooks/use-product-image";
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
  const imageRef = React.useRef<HTMLImageElement | null>(null);
  const { resolvedSrc, isLoading, handleImageLoad, handleImageError } =
    useProductImage({ src: imageSrc, imageRef });

  return (
    <div
      className={cn(
        "grid w-full gap-4 py-4 sm:grid-cols-[5rem_1fr] md:grid-cols-[5rem_1fr_auto] md:items-center",
        className,
      )}
    >
      <AspectRatio ratio={1} className="relative overflow-hidden rounded-lg bg-muted">
        {isLoading ? (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-background/70">
            <div
              className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary"
              aria-hidden="true"
            />
            <span className="sr-only">Загрузка изображения</span>
          </div>
        ) : null}
        <img
          ref={imageRef}
          src={resolvedSrc}
          alt={imageAlt ?? title}
          onLoad={handleImageLoad}
          onError={handleImageError}
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
