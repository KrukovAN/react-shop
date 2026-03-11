import * as React from "react";
import { Card } from "@/components/ui/card";
import type { CartItemView } from "@/entities/cart";
import { CartProductItem } from "@/widgets/cart-product-item";

type CartPageProps = {
  cartItems: CartItemView[];
  totalItemsInCart: number;
  formatPrice: (price: number) => string;
  onIncrement: (productId: string) => void;
  onDecrement: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
};

function CartPage({
  cartItems,
  totalItemsInCart,
  formatPrice,
  onIncrement,
  onDecrement,
  onRemove,
}: CartPageProps) {
  const totalCost = React.useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems],
  );

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Корзина</h1>
        <p className="text-sm text-muted-foreground">
          Товаров в корзине: {totalItemsInCart}
        </p>
        <p className="text-sm font-medium">
          Итоговая стоимость: <span className="font-semibold">{formatPrice(totalCost)}</span>
        </p>
      </header>

      {cartItems.length === 0 ? (
        <Card className="mx-auto w-full max-w-[1400px] px-6 py-10 text-center text-sm text-muted-foreground">
          Корзина пуста
        </Card>
      ) : (
        <Card className="mx-auto w-full max-w-[1400px] px-4">
          <div className="divide-y divide-border">
            {cartItems.map((item) => (
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
      )}
    </section>
  );
}

export { CartPage };
export type { CartPageProps };
