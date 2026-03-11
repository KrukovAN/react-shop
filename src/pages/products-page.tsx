import * as React from "react";
import { Check, ChevronDown, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/layuots/input";
import { Modal } from "@/components/ui/modal";
import { ModalAlert } from "@/modals/modal-alert";
import { ProductDetailsCard } from "@/widgets/product-details-card";
import { ProductList } from "@/widgets/product-list";
import type { Product } from "@/entities/product";
import {
  applyLocalImageFallback,
  LOCAL_PRODUCT_IMAGE_FALLBACK_SRC,
} from "@/lib/image";

const PRODUCTS_API_BASE = "https://api.uonn.ru";
const PRODUCTS_API_PATH = "/products";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const INITIAL_VISIBLE_PRODUCTS = 12;
const PRODUCTS_STEP = 12;

type ApiProduct = {
  id: string;
  name: string;
  description: string | null;
  price: number | string;
  stock: number | string;
  isActive: boolean;
  imageUrl: string | null;
  categoryId: string;
  categoryName: string;
};

type ApiCategory = {
  id: string;
  name: string;
};

type ProductsPageProps = {
  isManager: boolean;
  getAccessToken: () => Promise<string | null>;
  cartCounts: Record<string, number>;
  onCartIncrement: (productId: string) => void;
  onCartDecrement: (productId: string) => void;
  onProductsSync?: (products: ApiProduct[]) => void;
  categoryFilterEnabled?: boolean;
  selectedCategoryIds?: string[];
};

type ProductFormState = {
  name: string;
  description: string;
  price: string;
  stock: string;
  isActive: boolean;
  categoryId: string;
  newCategoryName: string;
  useNewCategory: boolean;
};

type ProductFormErrors = Partial<Record<keyof ProductFormState, string>>;

const EMPTY_FORM: ProductFormState = {
  name: "",
  description: "",
  price: "",
  stock: "",
  isActive: true,
  categoryId: "",
  newCategoryName: "",
  useNewCategory: false,
};

const toNumber = (value: number | string): number => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatPrice = (value: number | string): string =>
  `${toNumber(value).toLocaleString("ru-RU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} ₽`;

const resolveProductImageSrc = (imageUrl: string | null): string => {
  if (!imageUrl) {
    return LOCAL_PRODUCT_IMAGE_FALLBACK_SRC;
  }

  if (imageUrl.startsWith("/")) {
    return `${PRODUCTS_API_BASE}${imageUrl}`;
  }

  try {
    const parsed = new URL(imageUrl);
    if (parsed.pathname.startsWith("/products/")) {
      return `${PRODUCTS_API_BASE}${parsed.pathname}`;
    }

    if (window.location.protocol === "https:" && parsed.protocol === "http:") {
      parsed.protocol = "https:";
      return parsed.toString();
    }
  } catch {
    return LOCAL_PRODUCT_IMAGE_FALLBACK_SRC;
  }

  return imageUrl;
};

const mapApiProductToCardProduct = (apiProduct: ApiProduct): Product => ({
  id: apiProduct.id,
  name: apiProduct.name,
  desc: apiProduct.description ?? undefined,
  createdAt: new Date().toISOString(),
  price: toNumber(apiProduct.price),
  oldPrice: undefined,
  photo: resolveProductImageSrc(apiProduct.imageUrl),
  category: {
    id: apiProduct.categoryId,
    name: apiProduct.categoryName,
  },
});

const validateForm = (state: ProductFormState): ProductFormErrors => {
  const errors: ProductFormErrors = {};
  const normalizedName = state.name.trim();
  const normalizedDescription = state.description.trim();
  const price = Number(state.price);
  const stock = Number(state.stock);

  if (normalizedName.length < 2 || normalizedName.length > 120) {
    errors.name = "Название должно быть от 2 до 120 символов.";
  }

  if (normalizedDescription.length > 1000) {
    errors.description = "Описание должно быть не длиннее 1000 символов.";
  }

  if (!Number.isFinite(price) || price < 0 || price > 1_000_000) {
    errors.price = "Цена должна быть числом от 0 до 1 000 000.";
  }

  if (!Number.isInteger(stock) || stock < 0 || stock > 1_000_000) {
    errors.stock = "Остаток должен быть целым числом от 0 до 1 000 000.";
  }

  if (state.useNewCategory) {
    const newCategory = state.newCategoryName.trim();
    if (newCategory.length < 2 || newCategory.length > 120) {
      errors.newCategoryName = "Новая категория должна быть от 2 до 120 символов.";
    }
  } else if (!state.categoryId) {
    errors.categoryId = "Выберите категорию.";
  }

  return errors;
};

const getProblemMessage = async (response: Response): Promise<string> => {
  try {
    const payload = (await response.json()) as {
      title?: string;
      detail?: string;
      status?: number | string | null;
    };

    if (payload.detail && payload.detail.trim()) {
      return payload.detail;
    }

    if (payload.title && payload.title.trim()) {
      return payload.title;
    }
  } catch {
    // Ignore parse errors.
  }

  return `Ошибка ${response.status}: ${response.statusText || "неизвестная ошибка"}`;
};

function ProductsPage({
  isManager,
  getAccessToken,
  cartCounts,
  onCartIncrement,
  onCartDecrement,
  onProductsSync,
  categoryFilterEnabled = false,
  selectedCategoryIds = [],
}: ProductsPageProps) {
  const [products, setProducts] = React.useState<ApiProduct[]>([]);
  const [categories, setCategories] = React.useState<ApiCategory[]>([]);
  const [visibleCount, setVisibleCount] = React.useState(
    INITIAL_VISIBLE_PRODUCTS,
  );
  const [selectedProductId, setSelectedProductId] = React.useState<
    string | null
  >(null);

  const [isLoading, setIsLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const [editingProduct, setEditingProduct] = React.useState<ApiProduct | null>(
    null,
  );
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [pendingDeleteProduct, setPendingDeleteProduct] =
    React.useState<ApiProduct | null>(null);

  const [formState, setFormState] =
    React.useState<ProductFormState>(EMPTY_FORM);
  const [formErrors, setFormErrors] = React.useState<ProductFormErrors>({});
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const [selectedImageFile, setSelectedImageFile] = React.useState<File | null>(
    null,
  );
  const [selectedImagePreviewUrl, setSelectedImagePreviewUrl] = React.useState<
    string | null
  >(null);
  const imageInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (!selectedImageFile) {
      setSelectedImagePreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImageFile);
    setSelectedImagePreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedImageFile]);

  const cardProducts = React.useMemo(() => {
    const selectedSet = new Set(selectedCategoryIds);
    const filteredProducts =
      categoryFilterEnabled && selectedSet.size > 0
        ? products.filter((product) => selectedSet.has(product.categoryId))
        : products;

    return filteredProducts.map(mapApiProductToCardProduct);
  }, [categoryFilterEnabled, products, selectedCategoryIds]);

  const visibleProducts = React.useMemo(
    () => cardProducts.slice(0, visibleCount),
    [cardProducts, visibleCount],
  );

  const hasMoreProducts = visibleCount < cardProducts.length;

  const selectedProduct = React.useMemo(
    () =>
      cardProducts.find((product) => product.id === selectedProductId) ?? null,
    [cardProducts, selectedProductId],
  );

  const loadProducts = React.useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const response = await fetch(`${PRODUCTS_API_BASE}${PRODUCTS_API_PATH}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(await getProblemMessage(response));
      }

      const payload = (await response.json()) as ApiProduct[];
      const nextProducts = Array.isArray(payload) ? payload : [];
      setProducts(nextProducts);
      setVisibleCount(Math.min(INITIAL_VISIBLE_PRODUCTS, nextProducts.length));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Не удалось загрузить товары.";
      setLoadError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadCategories = React.useCallback(async () => {
    try {
      const response = await fetch(`${PRODUCTS_API_BASE}${PRODUCTS_API_PATH}/categories`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(await getProblemMessage(response));
      }

      const payload = (await response.json()) as ApiCategory[];
      setCategories(Array.isArray(payload) ? payload : []);
    } catch {
      setCategories([]);
    }
  }, []);

  React.useEffect(() => {
    void loadProducts();
    void loadCategories();
  }, [loadProducts, loadCategories]);

  React.useEffect(() => {
    onProductsSync?.(products);
  }, [onProductsSync, products]);

  React.useEffect(() => {
    setVisibleCount(Math.min(INITIAL_VISIBLE_PRODUCTS, cardProducts.length));
  }, [cardProducts.length]);

  React.useEffect(() => {
    if (!isCreateOpen || formState.categoryId || categories.length === 0 || formState.useNewCategory) {
      return;
    }

    setFormState((current) => ({
      ...current,
      categoryId: categories[0].id,
    }));
  }, [categories, formState.categoryId, formState.useNewCategory, isCreateOpen]);

  const handleLoadMore = () => {
    if (!hasMoreProducts || isPending) {
      return;
    }

    startTransition(() => {
      setVisibleCount((currentCount) =>
        Math.min(currentCount + PRODUCTS_STEP, cardProducts.length),
      );
    });
  };

  const openEdit = (product: ApiProduct) => {
    setIsCreateOpen(false);
    setEditingProduct(product);
    setFormErrors({});
    setSelectedImageFile(null);
    setSelectedImagePreviewUrl(null);
    setFormState({
      name: product.name,
      description: product.description ?? "",
      price: String(toNumber(product.price)),
      stock: String(Math.trunc(toNumber(product.stock))),
      isActive: product.isActive,
      categoryId: product.categoryId,
      newCategoryName: "",
      useNewCategory: false,
    });
  };

  const openCreate = () => {
    setIsCreateOpen(true);
    setEditingProduct(null);
    setFormErrors({});
    setSelectedImageFile(null);
    setSelectedImagePreviewUrl(null);
    setFormState({
      ...EMPTY_FORM,
      categoryId: categories[0]?.id ?? "",
    });
  };

  const closeForm = () => {
    setIsCreateOpen(false);
    setEditingProduct(null);
    setFormErrors({});
    setFormState(EMPTY_FORM);
    setSelectedImageFile(null);
    setSelectedImagePreviewUrl(null);
    setIsSaving(false);
  };

  const requestDelete = (product: ApiProduct) => {
    setPendingDeleteProduct(product);
  };

  const closeDeleteModal = () => {
    setPendingDeleteProduct(null);
  };

  const handleFieldChange = <T extends keyof ProductFormState>(
    field: T,
    value: ProductFormState[T],
  ) => {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));

    if (formErrors[field]) {
      setFormErrors((current) => ({
        ...current,
        [field]: undefined,
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingProduct && !isCreateOpen) {
      return;
    }

    const nextErrors = validateForm(formState);
    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error("Проверьте корректность полей формы.");
      return;
    }

    const accessToken = await getAccessToken();
    if (!accessToken) {
      toast.error("Нужна авторизация для сохранения товара.");
      return;
    }

    setIsSaving(true);
    try {
      const isEditMode = Boolean(editingProduct);
      const productUrl = isEditMode
        ? `${PRODUCTS_API_BASE}${PRODUCTS_API_PATH}/${editingProduct!.id}`
        : `${PRODUCTS_API_BASE}${PRODUCTS_API_PATH}`;
      const productMethod = isEditMode ? "PUT" : "POST";

      const response = await fetch(productUrl, {
        method: productMethod,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formState.name.trim(),
          description: formState.description.trim() || null,
          price: Number(formState.price),
          stock: Number(formState.stock),
          isActive: formState.isActive,
          categoryId: formState.useNewCategory ? null : formState.categoryId,
          categoryName: formState.useNewCategory
            ? formState.newCategoryName.trim()
            : null,
        }),
      });

      if (!response.ok) {
        throw new Error(await getProblemMessage(response));
      }

      const savedProduct = (await response.json()) as ApiProduct;
      let finalProduct = savedProduct;

      if (selectedImageFile) {
        const formData = new FormData();
        formData.append("image", selectedImageFile);

        const uploadResponse = await fetch(
          `${PRODUCTS_API_BASE}${PRODUCTS_API_PATH}/${savedProduct.id}/image`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
          },
        );

        if (!uploadResponse.ok) {
          throw new Error(await getProblemMessage(uploadResponse));
        }

        finalProduct = (await uploadResponse.json()) as ApiProduct;
      }

      if (isEditMode) {
        setProducts((current) =>
          current.map((product) =>
            product.id === finalProduct.id ? finalProduct : product,
          ),
        );
      } else {
        setProducts((current) => {
          const next = [finalProduct, ...current];
          setVisibleCount((currentVisible) =>
            Math.min(
              Math.max(currentVisible + 1, INITIAL_VISIBLE_PRODUCTS),
              next.length,
            ),
          );
          return next;
        });
      }

      toast.success(
        isEditMode
          ? selectedImageFile
            ? "Товар и изображение успешно обновлены."
            : "Товар успешно обновлен."
          : selectedImageFile
            ? "Товар и изображение успешно добавлены."
            : "Товар успешно добавлен.",
      );

      closeForm();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Не удалось сохранить товар.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDeleteProduct) {
      return;
    }

    const accessToken = await getAccessToken();
    if (!accessToken) {
      toast.error("Нужна авторизация для удаления товара.");
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(
        `${PRODUCTS_API_BASE}${PRODUCTS_API_PATH}/${pendingDeleteProduct.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(await getProblemMessage(response));
      }

      setProducts((current) =>
        current.filter((product) => product.id !== pendingDeleteProduct.id),
      );
      if (selectedProductId === pendingDeleteProduct.id) {
        setSelectedProductId(null);
      }

      toast.success("Товар успешно удален.");
      setPendingDeleteProduct(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Не удалось удалить товар.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const apiProductById = React.useMemo(() => {
    const map = new Map<string, ApiProduct>();
    for (const product of products) {
      map.set(product.id, product);
    }
    return map;
  }, [products]);

  const selectedCategoryName = React.useMemo(() => {
    if (formState.useNewCategory) {
      return "Новая категория";
    }

    return (
      categories.find((category) => category.id === formState.categoryId)
        ?.name ?? "Выберите категорию"
    );
  }, [categories, formState.categoryId, formState.useNewCategory]);

  return (
    <section className="space-y-8">
      {isManager ? (
        <div className="flex justify-start">
          <Button type="button" onClick={openCreate}>
            Добавить товар
          </Button>
        </div>
      ) : null}

      {isLoading ? (
        <Card className="p-6 text-sm text-muted-foreground">Загрузка...</Card>
      ) : null}

      {!isLoading && loadError ? (
        <Card className="space-y-4 p-6">
          <p className="text-sm text-destructive">{loadError}</p>
          <Button type="button" onClick={() => void loadProducts()}>
            Повторить
          </Button>
        </Card>
      ) : null}

      {!isLoading && !loadError && visibleProducts.length === 0 ? (
        <Card className="p-6 text-sm text-muted-foreground">Список пуст.</Card>
      ) : null}

      {!isLoading && !loadError && visibleProducts.length > 0 ? (
        <ProductList
          products={visibleProducts}
          cartCounts={cartCounts}
          onCartIncrement={onCartIncrement}
          onCartDecrement={onCartDecrement}
          onProductSelect={(product) => setSelectedProductId(product.id)}
          onLoadMore={handleLoadMore}
          hasMore={hasMoreProducts}
          isLoadingMore={isPending}
          canEdit={isManager}
          onProductEdit={(product) => {
            const apiProduct = apiProductById.get(product.id);
            if (apiProduct) {
              openEdit(apiProduct);
            }
          }}
          canDelete={isManager}
          onProductDelete={(product) => {
            const apiProduct = apiProductById.get(product.id);
            if (apiProduct) {
              requestDelete(apiProduct);
            }
          }}
          formatPrice={(price) => formatPrice(price)}
        />
      ) : null}

      <Modal
        visible={Boolean(selectedProduct)}
        onClose={() => setSelectedProductId(null)}
        className="max-h-[calc(100vh-2rem)] w-[min(96vw,72rem)] max-w-none gap-0 overflow-y-auto border-0 bg-transparent p-0 shadow-none sm:max-w-none data-[state=open]:slide-in-from-bottom-6 data-[state=open]:duration-300"
        hideHeader
      >
        {selectedProduct ? (
          <ProductDetailsCard
            category={selectedProduct.category.name}
            title={selectedProduct.name}
            description={selectedProduct.desc ?? "Описание товара отсутствует."}
            price={<span>{formatPrice(selectedProduct.price)}</span>}
            imageSrc={selectedProduct.photo}
            imageAlt={selectedProduct.name}
            cartCount={cartCounts[selectedProduct.id] ?? 0}
            onCartIncrement={() => onCartIncrement(selectedProduct.id)}
            onCartDecrement={() => onCartDecrement(selectedProduct.id)}
            showEditButton={isManager}
            onEdit={() => {
              const apiProduct = apiProductById.get(selectedProduct.id);
              if (apiProduct) {
                setSelectedProductId(null);
                openEdit(apiProduct);
              }
            }}
            className="max-w-none animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300"
          />
        ) : null}
      </Modal>

      <Modal
        visible={Boolean(editingProduct) || isCreateOpen}
        onClose={closeForm}
        title={editingProduct ? "Изменить товар" : "Добавить товар"}
        description={
          editingProduct
            ? `ID: ${editingProduct.id}`
            : "Создание нового товара в API."
        }
        className="sm:max-w-lg"
      >
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="product-name">
              Название
            </label>
            <Input
              id="product-name"
              value={formState.name}
              onChange={(event) =>
                handleFieldChange("name", event.target.value)
              }
              aria-invalid={Boolean(formErrors.name)}
            />
            {formErrors.name ? (
              <p className="text-xs text-destructive">{formErrors.name}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium"
              htmlFor="product-description"
            >
              Описание
            </label>
            <textarea
              id="product-description"
              className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              value={formState.description}
              onChange={(event) =>
                handleFieldChange("description", event.target.value)
              }
              aria-invalid={Boolean(formErrors.description)}
            />
            {formErrors.description ? (
              <p className="text-xs text-destructive">
                {formErrors.description}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="product-price">
                Цена
              </label>
              <Input
                id="product-price"
                type="number"
                step="0.01"
                min="0"
                max="1000000"
                value={formState.price}
                onChange={(event) =>
                  handleFieldChange("price", event.target.value)
                }
                aria-invalid={Boolean(formErrors.price)}
              />
              {formErrors.price ? (
                <p className="text-xs text-destructive">{formErrors.price}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="product-stock">
                Остаток
              </label>
              <Input
                id="product-stock"
                type="number"
                step="1"
                min="0"
                max="1000000"
                value={formState.stock}
                onChange={(event) =>
                  handleFieldChange("stock", event.target.value)
                }
                aria-invalid={Boolean(formErrors.stock)}
              />
              {formErrors.stock ? (
                <p className="text-xs text-destructive">{formErrors.stock}</p>
              ) : null}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={formState.isActive}
              onChange={(event) =>
                handleFieldChange("isActive", event.target.checked)
              }
            />
            Активный товар
          </label>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="product-category">
              Категория
            </label>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  id="product-category"
                  type="button"
                  variant="outline"
                  className="w-full justify-between font-normal"
                  aria-invalid={Boolean(formErrors.categoryId)}
                >
                  <span className="truncate">{selectedCategoryName}</span>
                  <ChevronDown className="size-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[var(--radix-dropdown-menu-trigger-width)]">
                <DropdownMenuItem
                  onClick={() => {
                    handleFieldChange("useNewCategory", true);
                  }}
                >
                  {formState.useNewCategory ? (
                    <Check className="size-4 text-primary" />
                  ) : (
                    <span className="size-4" />
                  )}
                  <span>+ Новая категория</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {categories.length > 0 ? (
                  categories.map((category) => {
                    const isSelected =
                      !formState.useNewCategory &&
                      formState.categoryId === category.id;
                    return (
                      <DropdownMenuItem
                        key={category.id}
                        onClick={() => {
                          handleFieldChange("useNewCategory", false);
                          handleFieldChange("categoryId", category.id);
                        }}
                      >
                        {isSelected ? (
                          <Check className="size-4 text-primary" />
                        ) : (
                          <span className="size-4" />
                        )}
                        <span className="truncate">{category.name}</span>
                      </DropdownMenuItem>
                    );
                  })
                ) : (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    Категории недоступны
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            {formErrors.categoryId ? (
              <p className="text-xs text-destructive">{formErrors.categoryId}</p>
            ) : null}
          </div>

          {formState.useNewCategory ? (
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="product-new-category">
                Новая категория
              </label>
              <Input
                id="product-new-category"
                value={formState.newCategoryName}
                onChange={(event) =>
                  handleFieldChange("newCategoryName", event.target.value)
                }
                placeholder="Введите название категории"
                aria-invalid={Boolean(formErrors.newCategoryName)}
              />
              {formErrors.newCategoryName ? (
                <p className="text-xs text-destructive">{formErrors.newCategoryName}</p>
              ) : null}
            </div>
          ) : null}

          <div className="space-y-2">
            <label className="text-sm font-medium">Изображение</label>
            <input
              ref={imageInputRef}
              id="product-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                if (!file) {
                  setSelectedImageFile(null);
                  return;
                }

                if (!file.type.startsWith("image/")) {
                  toast.error("Можно загружать только изображения.");
                  event.target.value = "";
                  return;
                }

                if (file.size > MAX_IMAGE_SIZE) {
                  toast.error("Максимальный размер файла: 5 MB.");
                  event.target.value = "";
                  return;
                }

                setSelectedImageFile(file);
              }}
            />
            <p className="text-xs text-muted-foreground">
              Нажмите на изображение, чтобы выбрать новый файл (`image/*`,
              максимум 5 MB).
            </p>
            <button
              type="button"
              className="block w-full overflow-hidden rounded-md border bg-muted text-left cursor-pointer"
              onClick={() => imageInputRef.current?.click()}
              aria-label="Выбрать изображение товара"
            >
              <img
                src={
                  selectedImagePreviewUrl ??
                  resolveProductImageSrc(editingProduct?.imageUrl ?? null)
                }
                alt={editingProduct?.name ?? "Изображение товара"}
                onError={(event) =>
                  applyLocalImageFallback(event.currentTarget)
                }
                className="aspect-square w-full object-cover cursor-pointer"
              />
            </button>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={closeForm}>
              Отмена
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving
                ? "Сохраняем..."
                : editingProduct
                  ? "Сохранить"
                  : "Добавить"}
            </Button>
          </div>
        </form>
      </Modal>

      <ModalAlert
        visible={Boolean(pendingDeleteProduct)}
        title="Удалить товар"
        description={
          pendingDeleteProduct
            ? `Вы точно хотите удалить товар «${pendingDeleteProduct.name}»?`
            : "Вы точно хотите удалить этот товар?"
        }
        actionLabel={isDeleting ? "Удаляем..." : "Удалить"}
        actionIcon={<Trash2Icon />}
        onAction={() => {
          void confirmDelete();
        }}
        onClose={closeDeleteModal}
      />
    </section>
  );
}

export { ProductsPage };
export type { ProductsPageProps, ApiProduct };





