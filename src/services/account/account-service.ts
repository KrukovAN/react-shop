import type { AccountDiscountRepository } from "./account-discount-repository";
import type { ProductType, UserType } from "./account-types";

const validateDiscount = (discount: number): void => {
  if (!Number.isFinite(discount) || discount < 0 || discount > 100) {
    throw new RangeError("Discount must be a finite number between 0 and 100.");
  }
};

export class AccountService {
  constructor(private readonly repository: AccountDiscountRepository) {}

  setUserDiscount(userType: UserType, discount: number): void {
    validateDiscount(discount);
    this.repository.setUserDiscount(userType, discount);
  }

  getUserDiscount(userType: UserType): number {
    return this.repository.getUserDiscount(userType) ?? 0;
  }

  setProductDiscount(
    userType: UserType,
    productType: ProductType,
    discount: number,
  ): void {
    validateDiscount(discount);
    this.repository.setProductDiscount(userType, productType, discount);
  }

  getProductDiscount(userType: UserType, productType: ProductType): number {
    return this.repository.getProductDiscount(userType, productType) ?? 0;
  }

  calculateTotalDiscount(userType: UserType, productType: ProductType): number {
    return this.getUserDiscount(userType) + this.getProductDiscount(userType, productType);
  }
}
