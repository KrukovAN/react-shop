import * as React from "react";
import { cn } from "@/lib/utils";
import type { CartListProduct } from "@/types/cart";
import { Card } from "./card";
import { CartProductItem } from "./cart-product-item";

type CartProductListProps = {
  items: CartListProduct[];
  formatPrice: (price: number) => React.ReactNode;
  onIncrement: (productId: string) => void;
  onDecrement: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  className?: string;
};

function CartProductList({
  items,
  formatPrice,
  onIncrement,
  onDecrement,
  onRemove,
  className,
}: CartProductListProps) {
  return (
    <Card className={cn("mx-auto w-full max-w-[1400px] px-4", className)}>
      <div className="divide-y divide-border">
        {items.map((item) => (
          <CartProductItem
            key={item.id}
            title={item.title}
            price={formatPrice(item.price)}
            imageSrc={item.imageSrc}
            imageAlt={item.imageAlt}
            quantity={item.quantity}
            onIncrement={() => onIncrement(item.id)}
            onDecrement={() => onDecrement(item.id, item.quantity)}
            onRemove={() => onRemove(item.id)}
          />
        ))}
      </div>
    </Card>
  );
}

export { CartProductList };
export type { CartListProduct, CartProductListProps };
