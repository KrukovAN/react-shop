import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AccountDiscountRepository } from "./account-discount-repository";
import type { UserType } from "./account-types";
import { AccountService } from "./account-service";
import { InMemoryAccountDiscountRepository } from "./in-memory-account-discount-repository";

describe("AccountService", () => {
  let repository: AccountDiscountRepository;
  let service: AccountService;

  beforeEach(() => {
    repository = {
      getUserDiscount: vi.fn(),
      setUserDiscount: vi.fn(),
      getProductDiscount: vi.fn(),
      setProductDiscount: vi.fn(),
    };

    service = new AccountService(repository);
  });

  it("sets global discount for every supported user type", () => {
    const discountsByUserType: Record<UserType, number> = {
      Standard: 5,
      Premium: 10,
      Gold: 15,
      Free: 0,
    };

    (Object.keys(discountsByUserType) as UserType[]).forEach((userType) => {
      service.setUserDiscount(userType, discountsByUserType[userType]);
    });

    expect(repository.setUserDiscount).toHaveBeenCalledTimes(4);
    expect(repository.setUserDiscount).toHaveBeenNthCalledWith(1, "Standard", 5);
    expect(repository.setUserDiscount).toHaveBeenNthCalledWith(2, "Premium", 10);
    expect(repository.setUserDiscount).toHaveBeenNthCalledWith(3, "Gold", 15);
    expect(repository.setUserDiscount).toHaveBeenNthCalledWith(4, "Free", 0);
  });

  it("sets product discount for concrete user and product type", () => {
    service.setProductDiscount("Premium", "Car", 3);
    service.setProductDiscount("Premium", "Toy", 2);
    service.setProductDiscount("Gold", "Food", 7);

    expect(repository.setProductDiscount).toHaveBeenCalledTimes(3);
    expect(repository.setProductDiscount).toHaveBeenNthCalledWith(
      1,
      "Premium",
      "Car",
      3,
    );
    expect(repository.setProductDiscount).toHaveBeenNthCalledWith(
      2,
      "Premium",
      "Toy",
      2,
    );
    expect(repository.setProductDiscount).toHaveBeenNthCalledWith(
      3,
      "Gold",
      "Food",
      7,
    );
  });

  it("returns zero total discount when no discounts are configured", () => {
    vi.mocked(repository.getUserDiscount).mockReturnValue(undefined);
    vi.mocked(repository.getProductDiscount).mockReturnValue(undefined);

    expect(service.calculateTotalDiscount("Free", "Toy")).toBe(0);
  });

  it("reads configured user and product discounts from repository", () => {
    vi.mocked(repository.getUserDiscount).mockReturnValue(12);
    vi.mocked(repository.getProductDiscount).mockReturnValue(4);

    expect(service.getUserDiscount("Gold")).toBe(12);
    expect(service.getProductDiscount("Gold", "Food")).toBe(4);
    expect(repository.getUserDiscount).toHaveBeenCalledWith("Gold");
    expect(repository.getProductDiscount).toHaveBeenCalledWith("Gold", "Food");
  });

  it("sums global and product discounts for a user", () => {
    vi.mocked(repository.getUserDiscount).mockReturnValue(10);
    vi.mocked(repository.getProductDiscount).mockReturnValue(5);

    expect(service.calculateTotalDiscount("Premium", "Car")).toBe(15);
    expect(repository.getUserDiscount).toHaveBeenCalledWith("Premium");
    expect(repository.getProductDiscount).toHaveBeenCalledWith("Premium", "Car");
  });

  it("validates discount values for global and product discounts", () => {
    expect(() => service.setUserDiscount("Standard", -1)).toThrow(RangeError);
    expect(() => service.setUserDiscount("Standard", 101)).toThrow(RangeError);
    expect(() => service.setUserDiscount("Standard", Number.NaN)).toThrow(
      RangeError,
    );
    expect(() => service.setProductDiscount("Gold", "Food", -0.5)).toThrow(
      RangeError,
    );
    expect(() => service.setProductDiscount("Gold", "Food", 250)).toThrow(
      RangeError,
    );
  });

  it("works end-to-end with an in-memory repository fake", () => {
    const fakeRepository = new InMemoryAccountDiscountRepository();
    const accountService = new AccountService(fakeRepository);

    accountService.setUserDiscount("Premium", 10);
    accountService.setProductDiscount("Premium", "Car", 3);
    accountService.setProductDiscount("Premium", "Toy", 1);
    accountService.setProductDiscount("Gold", "Car", 20);

    expect(accountService.calculateTotalDiscount("Premium", "Car")).toBe(13);
    expect(accountService.calculateTotalDiscount("Premium", "Toy")).toBe(11);
    expect(accountService.calculateTotalDiscount("Premium", "Food")).toBe(10);
    expect(accountService.calculateTotalDiscount("Gold", "Car")).toBe(20);
  });
});
