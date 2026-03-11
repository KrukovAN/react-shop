import { Modal } from "@/components/ui/modal";
import type { CartItemView } from "@/entities/cart";

type CartSummaryModalProps = {
  visible: boolean;
  totalItemsInCart: number;
  cartItems: CartItemView[];
  formatPrice: (price: number) => string;
  onClose: () => void;
};

function CartSummaryModal({
  visible,
  totalItemsInCart,
  cartItems,
  formatPrice,
  onClose,
}: CartSummaryModalProps) {
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Корзина"
      description="Сводка по товарам, добавленным в текущей сессии."
      className="sm:max-w-lg"
    >
      <div className="space-y-4">
        <div className="rounded-2xl border bg-muted/30 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Всего товаров
          </p>
          <p className="mt-2 text-base font-semibold">{totalItemsInCart}</p>
        </div>

        {cartItems.length > 0 ? (
          <div className="space-y-2">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-2xl border px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatPrice(item.price)}
                  </p>
                </div>
                <p className="text-sm font-semibold">x{item.quantity}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed p-4 text-sm text-muted-foreground">
            В корзине пока нет товаров.
          </div>
        )}
      </div>
    </Modal>
  );
}

export { CartSummaryModal };
export type { CartSummaryModalProps };
