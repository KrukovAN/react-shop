export type Category = {
  id: string;
  name: string;
  photo?: string;
};

export type Product = {
  id: string;
  name: string;
  photo: string;
  desc?: string;
  createdAt: string;
  oldPrice?: number;
  price: number;
  category: Category;
};

export type OperationBase = {
  id: string;
  name: string;
  desc?: string;
  createdAt: string;
  amount: number;
  category: Category;
};

export type Cost = OperationBase & { type: "Cost" };
export type Profit = OperationBase & { type: "Profit" };

export type Operation = Cost | Profit;

/* ---------------- helpers ---------------- */

const pick = <T>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];
const chance = (p: number): boolean => Math.random() < p;

const randomMoney = (min: number, max: number): number =>
  Math.round((Math.random() * (max - min) + min) * 100) / 100;

const randomId = (prefix = ""): string => {
  const s1 = Math.random().toString(36).slice(2, 10);
  const s2 = Date.now().toString(36);
  return `${prefix}${s2}_${s1}`;
};

const PRODUCT_IMAGE_COUNT = 300;

const getImageIndex = (seed: string, total: number): number => {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return (hash % total) + 1;
};

const photoUrl = (seed: string, _w = 640, _h = 480): string => {
  const imageIndex = getImageIndex(seed, PRODUCT_IMAGE_COUNT);

  return `/product-images/product-${imageIndex.toString().padStart(3, "0")}.jpg`;
};

const maybeDesc = (): string | undefined => {
  if (!chance(0.5)) return undefined;
  return pick([
    "Р‘РµР· Р»РёС€РЅРёС… РґРµС‚Р°Р»РµР№.",
    "РЎСЂРѕС‡РЅРѕ/РїРѕ РїСѓС‚Рё РґРѕРјРѕР№.",
    "РђРєС†РёСЏ/СЃРєРёРґРєР° РїСЂРёРјРµРЅРµРЅР°.",
    "РџР»Р°РЅРѕРІР°СЏ РїРѕРєСѓРїРєР°.",
    "Р РµРєРѕРјРµРЅРґРѕРІР°РЅРѕ РґСЂСѓР·СЊСЏРјРё.",
  ] as const);
};

/* ---------------- categories ---------------- */

export const CATEGORIES = [
  { id: "cat_food", name: "Р•РґР°", photo: photoUrl("cat_food", 200, 200) },
  { id: "cat_tech", name: "РўРµС…РЅРёРєР°", photo: photoUrl("cat_tech", 200, 200) },
  { id: "cat_clothes", name: "РћРґРµР¶РґР°" },
  { id: "cat_home", name: "Р”РѕРј", photo: photoUrl("cat_home", 200, 200) },
  { id: "cat_transport", name: "РўСЂР°РЅСЃРїРѕСЂС‚" },
  { id: "cat_fun", name: "Р Р°Р·РІР»РµС‡РµРЅРёСЏ" },
  { id: "cat_health", name: "Р—РґРѕСЂРѕРІСЊРµ" },
  { id: "cat_gifts", name: "РџРѕРґР°СЂРєРё" },
  { id: "cat_edu", name: "РћР±СЂР°Р·РѕРІР°РЅРёРµ" },
  { id: "cat_subs", name: "РџРѕРґРїРёСЃРєРё" },
] as const satisfies readonly Category[];

const createRandomCategory = (): Category => {
  const cat = pick(CATEGORIES);
  return { ...cat };
};

/* ---------------- data generators ---------------- */

const PRODUCT_NAMES = [
  "РљРѕС„Рµ",
  "РќР°СѓС€РЅРёРєРё",
  "Р¤СѓС‚Р±РѕР»РєР°",
  "Р›Р°РјРїР°",
  "РўР°РєСЃРё",
  "РљРЅРёРіР°",
  "РџС‹Р»РµСЃРѕСЃ",
  "РњС‹С€СЊ",
  "РЁР°РјРїСѓРЅСЊ",
  "Р СЋРєР·Р°Рє",
] as const;

const OP_COST_NAMES = [
  "РџРѕРєСѓРїРєР° РїСЂРѕРґСѓРєС‚РѕРІ",
  "РџСЂРѕРµР·Рґ",
  "РџРѕРґРїРёСЃРєР°",
  "РљР°С„Рµ",
  "РђРїС‚РµРєР°",
  "РћРґРµР¶РґР°",
  "Р”РѕРјР°С€РЅРёРµ С‚РѕРІР°СЂС‹",
  "РџРѕРґР°СЂРѕРє",
] as const;

const OP_PROFIT_NAMES = [
  "Р—Р°СЂРїР»Р°С‚Р°",
  "Р’РѕР·РІСЂР°С‚",
  "Р¤СЂРёР»Р°РЅСЃ",
  "РљСЌС€Р±РµРє",
  "РџСЂРѕРґР°Р¶Р° РІРµС‰Рё",
  "РџРѕРґР°СЂРёР»Рё РґРµРЅСЊРіРё",
] as const;

export const createRandomProduct = (createdAt: string): Product => {
  const id = randomId("prd_");
  const category = createRandomCategory();

  const price = randomMoney(100, 10000);
  const oldPrice = chance(0.35)
    ? Math.max(price + randomMoney(30, 1200), price)
    : undefined;

  return {
    id,
    name: pick(PRODUCT_NAMES),
    photo: photoUrl(id, 640, 480),
    desc: maybeDesc(),
    createdAt,
    oldPrice,
    price,
    category,
  };
};

export const createRandomOperation = (createdAt: string): Operation => {
  const isProfit = chance(0.5);
  const id = randomId(isProfit ? "prf_" : "cst_");
  const category = createRandomCategory();

  const amount = isProfit ? randomMoney(10, 6000) : randomMoney(1, 1200);

  return isProfit
    ? {
        id,
        name: pick(OP_PROFIT_NAMES),
        desc: maybeDesc(),
        createdAt,
        amount,
        category,
        type: "Profit",
      }
    : {
        id,
        name: pick(OP_COST_NAMES),
        desc: maybeDesc(),
        createdAt,
        amount,
        category,
        type: "Cost",
      };
};




