import * as React from "react";
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
  cartCount = 0,
  onCartIncrement,
  onCartDecrement,
  className,
}: CompactProductCardProps) {
  return (
    <Card
      className={cn(
        "flex h-full w-full max-w-72 flex-col overflow-hidden pt-0",
        className,
      )}
    >
      <AspectRatio ratio={1} className="overflow-hidden border-b bg-muted">
        <img
          src={imageSrc}
          alt={imageAlt ?? title}
          className="h-full w-full object-cover"
        />
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
