import * as React from "react";
import { createZitadelAuth } from "@zitadel/react";
import { ShoppingCart } from "lucide-react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { toast } from "sonner";
import { Callback } from "@/components/callback";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import {
  CART_API_PATH,
  CART_ROUTE,
  PRODUCTS_API_BASE,
  PRODUCTS_ROUTE,
  PROFILE_ROUTE,
} from "@/app/config";
import {
  authConfig,
  authorityBase,
  projectId,
  redirectUri,
} from "@/auth/config";
import {
  EMPTY_PROFILE_VALUES,
  getHeaderUserName,
  getIsManager,
  getProfileValues,
  isJwtAccessToken,
  parseZitadelError,
  type AuthUser,
} from "@/auth/auth-utils";
import { useCategoryFilter } from "@/hooks/use-category-filter";
import type { ApiCartItem, CartItemView } from "@/entities/cart";
import type { ProfileFormValues, ProfileSaveResult } from "@/entities/profile";
import { Layout } from "@/layuots/layout";
import { AuthRequiredModal } from "@/modals/auth-required-modal";
import { CartRemovalModal } from "@/modals/cart-removal-modal";
import { CartSummaryModal } from "@/modals/cart-summary-modal";
import { CartPage } from "@/pages/cart-page";
import { ProfilePage } from "@/pages/profile-page";
import { ProductsPage, type ApiProduct } from "@/pages/products-page";
import { CategoryFilterMenu } from "@/widgets/category-filter-menu";
import { UserAuthControl } from "@/widgets/user-auth-control";
import { getBeautifulNumber } from "@/lib/utils";

const formatPrice = (price: number): string =>
  `${getBeautifulNumber(
    price.toLocaleString("ru-RU", { maximumFractionDigits: 2 }),
  )} ₽`;

function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const zitadel = React.useMemo(() => createZitadelAuth(authConfig), []);

  const [authenticated, setAuthenticated] = React.useState<boolean | null>(
    null,
  );
  const [isManager, setIsManager] = React.useState(false);
  const [profileValues, setProfileValues] =
    React.useState<ProfileFormValues>(EMPTY_PROFILE_VALUES);
  const [productsFromApi, setProductsFromApi] = React.useState<ApiProduct[]>(
    [],
  );
  const [cartCounts, setCartCounts] = React.useState<Record<string, number>>(
    {},
  );
  const [cartModalVisible, setCartModalVisible] = React.useState(false);
  const [pendingCartRemovalId, setPendingCartRemovalId] = React.useState<
    string | null
  >(null);
  const [authRequiredModalVisible, setAuthRequiredModalVisible] =
    React.useState(false);
  const cartCountsRef = React.useRef<Record<string, number>>({});

  const callbackPath = React.useMemo(
    () => new URL(redirectUri, window.location.origin).pathname,
    [],
  );
  const isCallbackPath = location.pathname === callbackPath;

  const {
    isCategoryFilterEnabled,
    setIsCategoryFilterEnabled,
    isCategoryMultiSelect,
    setIsCategoryMultiSelect,
    selectedCategoryIds,
    categoryFilterOptions,
    selectedCategoryLabel,
    handleCategoryToggle,
  } = useCategoryFilter(productsFromApi);

  React.useEffect(() => {
    cartCountsRef.current = cartCounts;
  }, [cartCounts]);

  React.useEffect(() => {
    if (isCallbackPath) {
      return;
    }

    zitadel.userManager
      .getUser()
      .then((user) => {
        const typedUser = user as AuthUser;
        const nextProfileValues = getProfileValues(typedUser);

        setAuthenticated(Boolean(user));
        setProfileValues(
          Boolean(user) ? nextProfileValues : EMPTY_PROFILE_VALUES,
        );
        setIsManager(
          Boolean(user) ? getIsManager(typedUser, projectId) : false,
        );
      })
      .catch(() => {
        setAuthenticated(false);
        setProfileValues(EMPTY_PROFILE_VALUES);
        setIsManager(false);
      });
  }, [isCallbackPath, zitadel]);

  function login() {
    void zitadel.authorize();
  }

  function logout() {
    setCartModalVisible(false);
    setPendingCartRemovalId(null);
    setAuthRequiredModalVisible(false);
    setIsManager(false);
    setCartCounts({});
    void zitadel.signout();
  }

  const getAccessToken = React.useCallback(async (): Promise<string | null> => {
    let user = (await zitadel.userManager.getUser()) as AuthUser;

    if (!user?.access_token) {
      try {
        user = (await zitadel.userManager.signinSilent()) as AuthUser;
      } catch {
        return null;
      }
    }

    return user?.access_token ?? null;
  }, [zitadel]);

  const syncCartFromBackend = React.useCallback(async () => {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      setCartCounts({});
      return;
    }

    try {
      const response = await fetch(`${PRODUCTS_API_BASE}${CART_API_PATH}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`РћС€РёР±РєР° ${response.status}`);
      }

      const payload = (await response.json()) as ApiCartItem[];
      const nextCounts: Record<string, number> = {};

      if (Array.isArray(payload)) {
        for (const item of payload) {
          if (
            item &&
            typeof item.productId === "string" &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0
          ) {
            nextCounts[item.productId] = item.quantity;
          }
        }
      }

      setCartCounts(nextCounts);
    } catch {
      // Keep current state on sync failures.
    }
  }, [getAccessToken]);

  React.useEffect(() => {
    if (authenticated !== true || isCallbackPath) {
      setCartCounts({});
      return;
    }

    void syncCartFromBackend();
  }, [authenticated, isCallbackPath, syncCartFromBackend]);

  React.useEffect(() => {
    if (
      isCallbackPath ||
      authenticated !== true ||
      location.pathname !== PROFILE_ROUTE
    ) {
      return;
    }

    let isDisposed = false;

    void (async () => {
      let refreshedUser: AuthUser = null;

      try {
        refreshedUser = (await zitadel.userManager.signinSilent()) as AuthUser;
      } catch {
        refreshedUser = (await zitadel.userManager.getUser()) as AuthUser;
      }

      if (isDisposed || !refreshedUser) {
        return;
      }

      setProfileValues(getProfileValues(refreshedUser));
      setIsManager(getIsManager(refreshedUser, projectId));
    })();

    return () => {
      isDisposed = true;
    };
  }, [authenticated, isCallbackPath, location.pathname, zitadel]);

  const cartItems = React.useMemo<CartItemView[]>(
    () =>
      productsFromApi
        .filter((product) => (cartCounts[product.id] ?? 0) > 0)
        .map((product) => ({
          id: product.id,
          title: product.name,
          quantity: cartCounts[product.id] ?? 0,
          price:
            typeof product.price === "number"
              ? product.price
              : Number(product.price) || 0,
          imageSrc: product.imageUrl
            ? product.imageUrl.startsWith("/")
              ? `https://api.uonn.ru${product.imageUrl}`
              : product.imageUrl
            : "/product-images/placeholder.svg",
          imageAlt: product.name,
        })),
    [productsFromApi, cartCounts],
  );

  const totalItemsInCart = React.useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  );

    const handleProfileDataSubmit = async (
    values: ProfileFormValues,
  ): Promise<ProfileSaveResult> => {
    try {
      let user = (await zitadel.userManager.getUser()) as AuthUser;
      if (!user?.access_token) {
        try {
          user = (await zitadel.userManager.signinSilent()) as AuthUser;
        } catch {
          // Ignore silent renew failures and continue with regular validation.
        }
      }
      const accessToken = user?.access_token ?? null;

      if (!accessToken) {
        return {
          success: false,
          message: "Сессия истекла. Войдите снова и повторите попытку.",
        };
      }

      if (!isJwtAccessToken(accessToken)) {
        return {
          success: false,
          message:
            "Access token не в формате JWT. В ZITADEL откройте настройки OIDC-приложения и включите `JWT` для access token, затем выйдите и войдите снова.",
        };
      }

      const profileResponse = await fetch(
        `${authorityBase}/auth/v1/users/me/profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: values.firstName,
            lastName: values.lastName,
            displayName: values.displayName,
          }),
        },
      );

      if (!profileResponse.ok) {
        return {
          success: false,
          message: await parseZitadelError(profileResponse),
        };
      }

      setProfileValues((current) => ({
        ...current,
        firstName: values.firstName,
        lastName: values.lastName,
        displayName: values.displayName,
      }));

      return {
        success: true,
        message: "Профиль сохранён.",
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Не удалось обновить профиль.";
      return {
        success: false,
        message,
      };
    }
  };
    const handleEmailSubmit = async (
    email: string,
  ): Promise<ProfileSaveResult> => {
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        return {
          success: false,
          message: "Сессия истекла. Войдите снова и повторите попытку.",
        };
      }

      const response = await fetch(`${authorityBase}/auth/v1/users/me/email`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      if (!response.ok) {
        return {
          success: false,
          message: await parseZitadelError(response),
        };
      }

      setProfileValues((current) => ({
        ...current,
        email,
        emailVerified: false,
      }));

      return {
        success: true,
        message: "Email успешно изменён.",
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Не удалось изменить email.";
      return {
        success: false,
        message,
      };
    }
  };

  const handleSendEmailVerification = async (
    email: string,
  ): Promise<ProfileSaveResult> => {
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        return {
          success: false,
          message: "Сессия истекла. Войдите снова и повторите попытку.",
        };
      }

      const response = await fetch(
        `${authorityBase}/auth/v1/users/me/email/_resend_verification`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        },
      );

      if (!response.ok) {
        return {
          success: false,
          message: await parseZitadelError(response),
        };
      }

      return {
        success: true,
        message: "Письмо для подтверждения отправлено.",
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Не удалось отправить письмо подтверждения.";
      return {
        success: false,
        message,
      };
    }
  };
  if (isCallbackPath) {
    return (
      <Callback setAuth={setAuthenticated} userManager={zitadel.userManager} />
    );
  }

  const setCartItemQuantity = React.useCallback(
    async (productId: string, quantity: number): Promise<boolean> => {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        return false;
      }

      const url = `${PRODUCTS_API_BASE}${CART_API_PATH}/items/${productId}`;
      const response =
        quantity > 0
          ? await fetch(url, {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ quantity }),
            })
          : await fetch(url, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });

      return response.ok;
    },
    [getAccessToken],
  );

  const handleCartIncrement = (productId: string) => {
    if (authenticated !== true) {
      setAuthRequiredModalVisible(true);
      return;
    }

    void (async () => {
      const current = cartCountsRef.current[productId] ?? 0;
      const next = current + 1;
      const ok = await setCartItemQuantity(productId, next);

      if (!ok) {
        toast.error("РќРµ СѓРґР°Р»РѕСЃСЊ РѕР±РЅРѕРІРёС‚СЊ РєРѕСЂР·РёРЅСѓ.");
        return;
      }

      setCartCounts((currentCounts) => ({
        ...currentCounts,
        [productId]: next,
      }));
    })();
  };

  const handleCartDecrement = (productId: string) => {
    if (authenticated !== true) {
      setAuthRequiredModalVisible(true);
      return;
    }

    void (async () => {
      const current = cartCountsRef.current[productId] ?? 0;
      const next = Math.max(0, current - 1);

      if (current === next) {
        return;
      }

      const ok = await setCartItemQuantity(productId, next);
      if (!ok) {
        toast.error("РќРµ СѓРґР°Р»РѕСЃСЊ РѕР±РЅРѕРІРёС‚СЊ РєРѕСЂР·РёРЅСѓ.");
        return;
      }

      setCartCounts((currentCounts) => {
        if (next === 0) {
          const { [productId]: _removed, ...rest } = currentCounts;
          return rest;
        }

        return {
          ...currentCounts,
          [productId]: next,
        };
      });
    })();
  };

  const requestCartItemRemoval = (productId: string) => {
    if (authenticated !== true) {
      setAuthRequiredModalVisible(true);
      return;
    }

    setPendingCartRemovalId(productId);
  };

  const closeCartRemovalModal = () => {
    setPendingCartRemovalId(null);
  };

  const confirmCartRemoval = () => {
    if (!pendingCartRemovalId) {
      return;
    }

    void (async () => {
      const ok = await setCartItemQuantity(pendingCartRemovalId, 0);
      if (!ok) {
        toast.error("РќРµ СѓРґР°Р»РѕСЃСЊ СѓРґР°Р»РёС‚СЊ С‚РѕРІР°СЂ РёР· РєРѕСЂР·РёРЅС‹.");
        return;
      }

      setCartCounts((currentCounts) => {
        const { [pendingCartRemovalId]: _removed, ...nextCounts } =
          currentCounts;
        return nextCounts;
      });
      setPendingCartRemovalId(null);
    })();
  };

  const headerActions = (
    <div className="flex items-center gap-2">
      {location.pathname === PRODUCTS_ROUTE ? (
        <CategoryFilterMenu
          selectedCategoryLabel={selectedCategoryLabel}
          isCategoryFilterEnabled={isCategoryFilterEnabled}
          isCategoryMultiSelect={isCategoryMultiSelect}
          categoryFilterOptions={categoryFilterOptions}
          selectedCategoryIds={selectedCategoryIds}
          onCategoryFilterEnabledChange={setIsCategoryFilterEnabled}
          onCategoryMultiSelectChange={setIsCategoryMultiSelect}
          onCategoryToggle={handleCategoryToggle}
        />
      ) : null}
      {authenticated === true && isManager ? (
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
          Менеджер
        </span>
      ) : null}
      <UserAuthControl
        authenticated={authenticated === true}
        userName={getHeaderUserName(profileValues)}
        onLogin={login}
        onLogout={logout}
        onOpenProfile={() => navigate(PROFILE_ROUTE)}
      />
      <Button
        type="button"
        size="icon"
        variant="outline"
        className="relative"
        aria-label="РљРѕСЂР·РёРЅР°"
        onClick={() => navigate(CART_ROUTE)}
      >
        <ShoppingCart className="size-4" />
        <span className="absolute -top-1 -right-1 inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
          {totalItemsInCart}
        </span>
      </Button>
    </div>
  );

  return (
    <Layout headerActions={headerActions}>
      <Routes>
        <Route path="/" element={<Navigate to={PRODUCTS_ROUTE} replace />} />
        <Route
          path={PRODUCTS_ROUTE}
          element={
            <ProductsPage
              isManager={isManager}
              getAccessToken={getAccessToken}
              cartCounts={cartCounts}
              onCartIncrement={handleCartIncrement}
              onCartDecrement={handleCartDecrement}
              onProductsSync={setProductsFromApi}
              categoryFilterEnabled={isCategoryFilterEnabled}
              selectedCategoryIds={selectedCategoryIds}
            />
          }
        />
        <Route
          path={CART_ROUTE}
          element={
            <CartPage
              cartItems={cartItems}
              totalItemsInCart={totalItemsInCart}
              formatPrice={formatPrice}
              onIncrement={handleCartIncrement}
              onDecrement={(id, quantity) => {
                if (quantity === 1) {
                  requestCartItemRemoval(id);
                  return;
                }
                handleCartDecrement(id);
              }}
              onRemove={requestCartItemRemoval}
            />
          }
        />
        <Route
          path={PROFILE_ROUTE}
          element={
            <ProfilePage
              authenticated={authenticated}
              isManager={isManager}
              initialValues={profileValues}
              onLogin={login}
              onSubmitProfile={handleProfileDataSubmit}
              onSubmitEmail={handleEmailSubmit}
              onSendEmailVerification={handleSendEmailVerification}
            />
          }
        />
        <Route path="*" element={<Navigate to={PRODUCTS_ROUTE} replace />} />
      </Routes>

      <CartRemovalModal
        visible={pendingCartRemovalId !== null}
        onConfirm={confirmCartRemoval}
        onClose={closeCartRemovalModal}
      />

      <CartSummaryModal
        visible={cartModalVisible}
        totalItemsInCart={totalItemsInCart}
        cartItems={cartItems}
        formatPrice={formatPrice}
        onClose={() => setCartModalVisible(false)}
      />

      <AuthRequiredModal
        visible={authRequiredModalVisible}
        onClose={() => setAuthRequiredModalVisible(false)}
        onRegister={() => {
          setAuthRequiredModalVisible(false);
          login();
        }}
      />
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;

