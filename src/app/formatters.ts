import { getBeautifulNumber } from "@/lib/number-format";

export const formatPrice = (price: number): string =>
  `${getBeautifulNumber(price.toFixed(2))} ₽`;
