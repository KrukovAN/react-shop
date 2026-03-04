import * as React from "react";
import { applyLocalImageFallback } from "@/lib/image";
import { cn } from "@/lib/utils";
import { AspectRatio } from "./aspect-ratio";
import { CartButton } from "./cart-button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

type CompactProductCardProps = {
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
  className?: string;
};

function CompactProductCard({
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
  className,
}: CompactProductCardProps) {
  return (
    <Card
      className={cn(
        "group flex h-full w-full max-w-72 flex-col overflow-hidden pt-0 transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg",
        className,
      )}
    >
      <AspectRatio ratio={1} className="overflow-hidden border-b bg-muted">
        {onImageClick ? (
          <button
            type="button"
            onClick={onImageClick}
            aria-label={imageActionLabel ?? `Открыть детали товара ${title}`}
            className="block h-full w-full cursor-pointer border-0 bg-transparent p-0"
          >
            <img
              src={imageSrc}
              alt={imageAlt ?? title}
              onError={(event) => applyLocalImageFallback(event.currentTarget)}
              className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            />
          </button>
        ) : (
          <img
            src={imageSrc}
            alt={imageAlt ?? title}
            onError={(event) => applyLocalImageFallback(event.currentTarget)}
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
          count={cartCount}
          onIncrement={onCartIncrement}
          onDecrement={onCartDecrement}
          className="w-full min-w-0"
        />
      </CardFooter>
    </Card>
  );
}

export { CompactProductCard };
export type { CompactProductCardProps };
