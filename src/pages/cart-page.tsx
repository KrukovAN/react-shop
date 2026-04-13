import * as React from "react";
import { Trash2Icon } from "lucide-react";
import { formatPrice } from "@/app/formatters";
import { Card } from "@/components/ui/card";
import { CartProductList } from "@/components/ui/cart-product-list";
import { ModalAlert } from "@/components/ui/modal-alert";
import type { CartListProduct } from "@/types/cart";

type CartPageProps = {
  items: CartListProduct[];
  totalItems: number;
  onIncrement: (productId: string) => void;
  onDecrement: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
};

function CartPage({
  items,
  totalItems,
  onIncrement,
  onDecrement,
  onRemove,
}: CartPageProps) {
  const [pendingRemovalId, setPendingRemovalId] = React.useState<string | null>(
    null,
  );

  const totalCost = React.useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  );

  const requestRemoval = React.useCallback((productId: string) => {
    setPendingRemovalId(productId);
  }, []);

  const closeRemovalModal = React.useCallback(() => {
    setPendingRemovalId(null);
  }, []);

  const confirmRemoval = React.useCallback(() => {
    if (!pendingRemovalId) {
      return;
    }

    onRemove(pendingRemovalId);
    setPendingRemovalId(null);
  }, [onRemove, pendingRemovalId]);

  React.useEffect(() => {
    if (!pendingRemovalId) {
      return;
    }

    const exists = items.some((item) => item.id === pendingRemovalId);
    if (!exists) {
      setPendingRemovalId(null);
    }
  }, [items, pendingRemovalId]);

  return (
    <>
      <section className="space-y-6">
        <header className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Корзина</h1>
          <p className="text-sm text-muted-foreground">
            Товаров в корзине: {totalItems}
          </p>
          <p className="text-sm font-medium">
            Итого: <span className="font-semibold">{formatPrice(totalCost)}</span>
          </p>
        </header>

        {items.length === 0 ? (
          <Card className="mx-auto w-full max-w-[1400px] px-6 py-10 text-center text-sm text-muted-foreground">
            Корзина пуста
          </Card>
        ) : (
          <CartProductList
            items={items}
            formatPrice={formatPrice}
            onIncrement={onIncrement}
            onDecrement={(productId, quantity) => {
              if (quantity <= 1) {
                requestRemoval(productId);
                return;
              }

              onDecrement(productId, quantity);
            }}
            onRemove={requestRemoval}
          />
        )}
      </section>

      <ModalAlert
        visible={pendingRemovalId !== null}
        title="Удалить товар"
        description="Вы точно хотите удалить выбранный товар? Отменить данное действие будет невозможно."
        actionLabel="Удалить"
        actionIcon={<Trash2Icon />}
        onAction={confirmRemoval}
        onClose={closeRemovalModal}
      />
    </>
  );
}

export { CartPage };
export type { CartPageProps };
