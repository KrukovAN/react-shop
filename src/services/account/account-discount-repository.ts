import type { ProductType, UserType } from "./account-types";

export interface AccountDiscountRepository {
  getUserDiscount(userType: UserType): number | undefined;
  setUserDiscount(userType: UserType, discount: number): void;
  getProductDiscount(
    userType: UserType,
    productType: ProductType,
  ): number | undefined;
  setProductDiscount(
    userType: UserType,
    productType: ProductType,
    discount: number,
  ): void;
}
