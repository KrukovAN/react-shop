type ApiCartItem = {
  productId: string;
  quantity: number;
};

type CartItemView = {
  id: string;
  title: string;
  quantity: number;
  price: number;
  imageSrc: string;
  imageAlt: string;
};

export type { ApiCartItem, CartItemView };
