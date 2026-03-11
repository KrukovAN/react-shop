import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getBeautifulNumber = (
  value: string,
  separator: string = " ",
): string => value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);




