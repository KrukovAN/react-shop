import * as React from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ProductFormModal } from "@/components/ui/product-form-modal";
import { ProductDetailsCard } from "@/components/ui/product-details-card";
import { ProductList } from "@/components/ui/product-list";
import { formatPrice } from "@/app/formatters";
import type { Product } from "@/types/shop";

type ProductsPageProps = {
  products: Product[];
  isLoadingMore: boolean;
  loadError: string | null;
  onLoadMore: () => Promise<void>;
  isAdmin: boolean;
};

function ProductsPage({
  products,
  isLoadingMore,
  loadError,
  onLoadMore,
  isAdmin,
}: ProductsPageProps) {
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(
    null,
  );
  const [isProductFormOpen, setIsProductFormOpen] = React.useState(false);
  const [productFormMode, setProductFormMode] = React.useState<"add" | "edit">(
    "add",
  );
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(
    null,
  );

  const handleRetry = React.useCallback(() => {
    void onLoadMore();
  }, [onLoadMore]);

  const openAddProductForm = React.useCallback(() => {
    if (!isAdmin) {
      return;
    }

    setProductFormMode("add");
    setEditingProduct(null);
    setIsProductFormOpen(true);
  }, [isAdmin]);

  const openEditProductForm = React.useCallback(
    (product: Product) => {
      if (!isAdmin) {
        return;
      }

      setProductFormMode("edit");
      setEditingProduct(product);
      setIsProductFormOpen(true);
    },
    [isAdmin],
  );

  const closeProductForm = React.useCallback(() => {
    setIsProductFormOpen(false);
    setEditingProduct(null);
  }, []);

  return (
    <>
      <section className="space-y-8">
        {isAdmin ? (
          <Button type="button" onClick={openAddProductForm} className="w-fit">
            Добавить товар
          </Button>
        ) : null}

        {loadError ? (
          <section className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
            <p className="text-sm text-destructive">{loadError}</p>
            <Button
              type="button"
              variant="outline"
              className="mt-3"
              onClick={handleRetry}
            >
              Повторить
            </Button>
          </section>
        ) : null}

        <ProductList
          products={products}
          onProductSelect={setSelectedProduct}
          onProductEdit={isAdmin ? openEditProductForm : undefined}
          onLoadMore={onLoadMore}
          hasMore
          isLoadingMore={isLoadingMore}
          canEdit={isAdmin}
          formatPrice={formatPrice}
        />
      </section>

      <Modal
        visible={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        className="max-h-[calc(100vh-2rem)] w-[min(96vw,72rem)] max-w-none gap-0 overflow-y-auto border-0 bg-transparent p-0 shadow-none sm:max-w-none data-[state=open]:slide-in-from-bottom-6 data-[state=open]:duration-300"
        hideHeader
      >
        {selectedProduct ? (
          <ProductDetailsCard
            productId={selectedProduct.id}
            category={selectedProduct.category.name}
            title={selectedProduct.name}
            description={
              selectedProduct.desc ??
              "Карточка загружена из бесконечной ленты каталога."
            }
            price={
              <div className="flex flex-wrap items-center gap-3">
                <span>{formatPrice(selectedProduct.price)}</span>
                {selectedProduct.oldPrice ? (
                  <span className="text-base font-medium text-muted-foreground line-through">
                    {formatPrice(selectedProduct.oldPrice)}
                  </span>
                ) : null}
              </div>
            }
            imageSrc={selectedProduct.photo}
            imageAlt={selectedProduct.name}
            showEditButton={isAdmin}
            onEdit={
              isAdmin
                ? () => {
                    setSelectedProduct(null);
                    openEditProductForm(selectedProduct);
                  }
                : undefined
            }
            className="max-w-none animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300"
          />
        ) : null}
      </Modal>

      {isAdmin ? (
        <ProductFormModal
          visible={isProductFormOpen}
          mode={productFormMode}
          initialValue={
            editingProduct
              ? {
                  id: editingProduct.id,
                  name: editingProduct.name,
                  description: editingProduct.desc,
                  categoryName: editingProduct.category.name,
                  price: editingProduct.price,
                  oldPrice: editingProduct.oldPrice,
                  createdAt: editingProduct.createdAt,
                }
              : undefined
          }
          onClose={closeProductForm}
          onSubmit={(payload) => {
            console.log("[ProductsPage] product submit", payload);
          }}
          onValidation={(result) => {
            console.log("[ProductsPage] product validation", result);
          }}
        />
      ) : null}
    </>
  );
}

export { ProductsPage };
export type { ProductsPageProps };
