import * as React from "react";
import { useCartOptional } from "@/components/providers/cart-provider";
import { useProductImage } from "@/hooks/use-product-image";
import { cn } from "@/lib/utils";
import { AspectRatio } from "./aspect-ratio";
import { Button } from "./button";
import { CartButton } from "./cart-button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

type CompactProductCardProps = {
  productId?: string;
  title: string;
  description: string;
  price: React.ReactNode;
  imageSrc: string;
  imageAlt?: string;
  onImageClick?: () => void;
  imageActionLabel?: string;
  cartCount?: number;
  onCartIncrement?: () => void;
  onCartDecrement?: () => void;
  showEditButton?: boolean;
  onEdit?: () => void;
  editLabel?: string;
  className?: string;
};

function CompactProductCard({
  productId,
  title,
  description,
  price,
  imageSrc,
  imageAlt,
  onImageClick,
  imageActionLabel,
  cartCount = 0,
  onCartIncrement,
  onCartDecrement,
  showEditButton = true,
  onEdit,
  editLabel = "Изменить",
  className,
}: CompactProductCardProps) {
  const cart = useCartOptional();
  const imageRef = React.useRef<HTMLImageElement | null>(null);
  const { resolvedSrc, isLoading, handleImageLoad, handleImageError } =
    useProductImage({ src: imageSrc, imageRef });

  const resolvedCartCount =
    productId && cart ? cart.getCount(productId) : Math.max(0, cartCount);

  const handleIncrement = React.useCallback(() => {
    if (productId && cart) {
      cart.increment(productId);
      return;
    }

    onCartIncrement?.();
  }, [cart, onCartIncrement, productId]);

  const handleDecrement = React.useCallback(() => {
    if (productId && cart) {
      cart.decrement(productId);
      return;
    }

    onCartDecrement?.();
  }, [cart, onCartDecrement, productId]);

  return (
    <Card
      className={cn(
        "group flex h-full w-full max-w-72 flex-col overflow-hidden pt-0 transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg",
        className,
      )}
    >
      <AspectRatio ratio={1} className="relative overflow-hidden border-b bg-muted">
        {isLoading ? (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-background/70">
            <div
              className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary"
              aria-hidden="true"
            />
            <span className="sr-only">Загрузка изображения</span>
          </div>
        ) : null}
        {onImageClick ? (
          <button
            type="button"
            onClick={onImageClick}
            aria-label={imageActionLabel ?? `Открыть детали товара ${title}`}
            className="block h-full w-full cursor-pointer border-0 bg-transparent p-0"
          >
            <img
              ref={imageRef}
              src={resolvedSrc}
              alt={imageAlt ?? title}
              onLoad={handleImageLoad}
              onError={handleImageError}
              className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            />
          </button>
        ) : (
          <img
            ref={imageRef}
            src={resolvedSrc}
            alt={imageAlt ?? title}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          />
        )}
      </AspectRatio>
      <CardHeader className="gap-2 p-4">
        <div className="text-lg font-semibold">{price}</div>
        <CardTitle className="line-clamp-2 text-base">{title}</CardTitle>
        <CardDescription className="line-clamp-2 text-sm">
          {description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto flex-col items-stretch gap-3 px-4 py-4 pt-0">
        <CartButton
          count={resolvedCartCount}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          className="w-full min-w-0"
        />
        {showEditButton ? (
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={onEdit}
            disabled={!onEdit}
          >
            {editLabel}
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
}

export { CompactProductCard };
export type { CompactProductCardProps };
