import type { AccountDiscountRepository } from "./account-discount-repository";
import type { ProductType, UserType } from "./account-types";

export class InMemoryAccountDiscountRepository
  implements AccountDiscountRepository
{
  private readonly userDiscounts = new Map<UserType, number>();
  private readonly productDiscounts = new Map<UserType, Map<ProductType, number>>();

  getUserDiscount(userType: UserType): number | undefined {
    return this.userDiscounts.get(userType);
  }

  setUserDiscount(userType: UserType, discount: number): void {
    this.userDiscounts.set(userType, discount);
  }

  getProductDiscount(
    userType: UserType,
    productType: ProductType,
  ): number | undefined {
    return this.productDiscounts.get(userType)?.get(productType);
  }

  setProductDiscount(
    userType: UserType,
    productType: ProductType,
    discount: number,
  ): void {
    const userProductDiscounts = this.productDiscounts.get(userType) ?? new Map();
    userProductDiscounts.set(productType, discount);
    this.productDiscounts.set(userType, userProductDiscounts);
  }
}
