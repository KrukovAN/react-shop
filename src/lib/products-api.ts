import { PRODUCT_IMAGE_REMOTE_BASE_URL } from "@/lib/image";
import type { Category, Product } from "@/types/shop";

const PRODUCTS_BATCH_SIZE = 12;
const PRODUCT_IMAGE_MIN_INDEX = 1;
const PRODUCT_IMAGE_MAX_INDEX = 999;

const CATEGORIES: Category[] = [
  { id: "cat_food", name: "Еда" },
  { id: "cat_tech", name: "Техника" },
  { id: "cat_clothes", name: "Одежда" },
  { id: "cat_home", name: "Дом" },
  { id: "cat_transport", name: "Транспорт" },
  { id: "cat_fun", name: "Развлечения" },
];

const PRODUCT_NAMES = [
  "Умный гаджет",
  "Компактный аксессуар",
  "Портативный набор",
  "Современное устройство",
  "Полезная вещь",
  "Премиальный комплект",
] as const;

const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomMoney = (min: number, max: number): number =>
  Math.round((Math.random() * (max - min) + min) * 100) / 100;

const pick = <T>(values: readonly T[]): T =>
  values[Math.floor(Math.random() * values.length)];

const toImageFileName = (index: number): string =>
  `product-${index.toString().padStart(3, "0")}.jpg`;

const createId = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? `prd_${crypto.randomUUID()}`
    : `prd_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;

const createRandomProduct = (): Product => {
  const imageIndex = randomInt(PRODUCT_IMAGE_MIN_INDEX, PRODUCT_IMAGE_MAX_INDEX);
  const price = randomMoney(99, 15000);
  const oldPrice = Math.random() < 0.35 ? randomMoney(price, price * 1.4) : undefined;

  return {
    id: createId(),
    name: pick(PRODUCT_NAMES),
    photo: `${PRODUCT_IMAGE_REMOTE_BASE_URL}/${toImageFileName(imageIndex)}`,
    desc: `Случайная карточка с изображением ${toImageFileName(imageIndex)}.`,
    createdAt: new Date().toISOString(),
    oldPrice,
    price,
    category: { ...pick(CATEGORIES) },
  };
};

const loadRandomProductsBatch = async (
  signal?: AbortSignal,
  batchSize = PRODUCTS_BATCH_SIZE,
): Promise<Product[]> => {
  if (!Number.isInteger(batchSize) || batchSize <= 0) {
    throw new Error("Некорректный размер пачки товаров.");
  }

  if (signal?.aborted) {
    throw new DOMException("Request aborted", "AbortError");
  }

  return Array.from({ length: batchSize }, () => createRandomProduct());
};

export {
  PRODUCTS_BATCH_SIZE,
  PRODUCT_IMAGE_MAX_INDEX,
  PRODUCT_IMAGE_MIN_INDEX,
  loadRandomProductsBatch,
};
