import * as React from "react";
import { useCartOptional } from "@/components/providers/cart-provider";
import { useProductImage } from "@/hooks/use-product-image";
import { cn } from "@/lib/utils";
import { Card, CardDescription, CardTitle } from "./card";
import { CartButton } from "./cart-button";

type ProductDetailsCardProps = {
  productId?: string;
  category: string;
  title: string;
  description: string;
  price: React.ReactNode;
  imageSrc: string;
  imageAlt?: string;
  cartCount?: number;
  onCartIncrement?: () => void;
  onCartDecrement?: () => void;
  className?: string;
};

function ProductDetailsCard({
  productId,
  category,
  title,
  description,
  price,
  imageSrc,
  imageAlt,
  cartCount = 0,
  onCartIncrement,
  onCartDecrement,
  className,
}: ProductDetailsCardProps) {
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
    <Card className={cn("w-full max-w-none overflow-hidden p-0", className)}>
      <div className="grid h-full grid-cols-1 lg:grid-cols-[minmax(22rem,52rem)_minmax(24rem,1fr)]">
        <div className="relative aspect-[4/3] overflow-hidden border-b bg-muted sm:aspect-[2/1] lg:aspect-[4/3] lg:border-r lg:border-b-0">
          {isLoading ? (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-background/70">
              <div
                className="h-10 w-10 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary"
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
        </div>
        <div className="flex min-w-0 flex-1 flex-col p-6 md:p-8">
          <div className="space-y-4">
            <div className="text-2xl font-semibold md:text-3xl">{price}</div>
            <div className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              {category}
            </div>
            <div className="space-y-3">
              <CardTitle className="text-2xl leading-tight md:text-3xl">
                {title}
              </CardTitle>
              <CardDescription className="whitespace-pre-line text-sm leading-6 md:text-base">
                {description}
              </CardDescription>
            </div>
          </div>
          <div className="mt-auto pt-6">
            <CartButton
              count={resolvedCartCount}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              className="w-full min-w-0"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

export { ProductDetailsCard };
export type { ProductDetailsCardProps };
