import * as React from "react";
import { CartProvider } from "@/components/providers/cart-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/ui/layout";
import { Modal } from "@/components/ui/modal";
import { ProductFormModal } from "@/components/ui/product-form-modal";
import { ProductDetailsCard } from "@/components/ui/product-details-card";
import { ProductList } from "@/components/ui/product-list";
import { ProfileForm } from "@/components/ui/profile-form";
import { useProductsFeed } from "@/hooks/use-products-feed";
import { getBeautifulNumber } from "@/lib/number-format";
import type { Product } from "@/types/shop";
import type { ProfileFormValues } from "@/types/profile";

const formatPrice = (price: number): string =>
  `${getBeautifulNumber(price.toFixed(2))} ₽`;
const ZITADEL_AUTH_URL = "https://auth.uonn.ru";

const initialProfileValues: ProfileFormValues = {
  firstName: "Иван",
  lastName: "Иванов",
  displayName: "Иван И.",
  email: "ivan@example.com",
  emailVerified: false,
};

function CatalogPage() {
  const { products, isLoadingMore, loadError, loadMore } = useProductsFeed();
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);
  const [isProductFormOpen, setIsProductFormOpen] = React.useState(false);
  const [productFormMode, setProductFormMode] = React.useState<"add" | "edit">(
    "add",
  );
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);

  const handleRetry = React.useCallback(() => {
    void loadMore();
  }, [loadMore]);

  const openAddProductForm = React.useCallback(() => {
    setProductFormMode("add");
    setEditingProduct(null);
    setIsProductFormOpen(true);
  }, []);

  const openEditProductForm = React.useCallback((product: Product) => {
    setProductFormMode("edit");
    setEditingProduct(product);
    setIsProductFormOpen(true);
  }, []);

  const closeProductForm = React.useCallback(() => {
    setIsProductFormOpen(false);
    setEditingProduct(null);
  }, []);
  const handleLoginRedirect = React.useCallback(() => {
    if (typeof window !== "undefined") {
      window.location.assign(ZITADEL_AUTH_URL);
    }
  }, []);

  return (
    <Layout
      onProfileClick={() => setIsProfileModalOpen(true)}
      onLoginClick={handleLoginRedirect}
    >
      <div className="space-y-8">
        <Button type="button" onClick={openAddProductForm} className="w-fit">
          Добавить товар
        </Button>

        {loadError ? (
          <section className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
            <p className="text-sm text-destructive">{loadError}</p>
            <button
              type="button"
              onClick={handleRetry}
              className="mt-3 inline-flex h-9 items-center rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Повторить загрузку
            </button>
          </section>
        ) : null}

        <ProductList
          products={products}
          onProductSelect={setSelectedProduct}
          onProductEdit={openEditProductForm}
          onLoadMore={loadMore}
          hasMore
          isLoadingMore={isLoadingMore}
          formatPrice={formatPrice}
        />
      </div>

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
              selectedProduct.desc ?? "Карточка подгружена из бесконечной ленты."
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
            onEdit={() => {
              setSelectedProduct(null);
              openEditProductForm(selectedProduct);
            }}
            className="max-w-none animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300"
          />
        ) : null}
      </Modal>

      <Modal
        visible={isProfileModalOpen}
        title="Профиль"
        description="Редактирование профиля пользователя"
        onClose={() => setIsProfileModalOpen(false)}
        className="sm:max-w-xl"
      >
        <ProfileForm
          initialValues={initialProfileValues}
          onSubmit={(values) => {
            console.log("[App] profile submit", values);
          }}
          onValidation={(result) => {
            console.log("[App] profile validation", result);
          }}
        />
      </Modal>

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
          console.log("[App] product submit", payload);
        }}
        onValidation={(result) => {
          console.log("[App] product validation", result);
        }}
      />
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <CatalogPage />
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;

