import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { ru } from "react-day-picker/locale";

const NAME_MAX_LENGTH = 80;
const CATEGORY_MAX_LENGTH = 40;
const DESCRIPTION_MAX_LENGTH = 500;
const MONEY_PATTERN = /^\d+(?:[.,]\d{1,2})?$/;
const DATE_PART_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PART_PATTERN = /^\d{2}:\d{2}$/;
const CALENDAR_START_MONTH = new Date(1990, 0);
const CALENDAR_END_MONTH = new Date(2035, 11);

type ProductFormMode = "add" | "edit";

type ProductFormInitialValue = {
  id?: string;
  name?: string;
  description?: string;
  categoryName?: string;
  price?: number;
  oldPrice?: number;
  createdAt?: string;
};

type ProductFormSubmitPayload = {
  name: string;
  description?: string;
  categoryName: string;
  price: number;
  oldPrice?: number;
  createdAt: string;
};

type ProductFormValidationErrors = Partial<
  Record<
    "name" | "description" | "categoryName" | "price" | "oldPrice" | "createdAt",
    string
  >
>;

type ProductFormValidationResult = {
  isValid: boolean;
  errors: ProductFormValidationErrors;
  values: ProductFormValues;
};

type ProductFormModalProps = {
  visible: boolean;
  mode: ProductFormMode;
  initialValue?: ProductFormInitialValue;
  onClose: () => void;
  onSubmit?: (payload: ProductFormSubmitPayload) => void;
  onValidation?: (result: ProductFormValidationResult) => void;
};

type ProductFormValues = {
  name: string;
  description: string;
  categoryName: string;
  price: string;
  oldPrice: string;
  createdAt: string;
};

const toDateTimeLocalValue = (value?: string): string => {
  if (!value) {
    return new Date().toISOString().slice(0, 16);
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString().slice(0, 16);
  }

  const pad = (part: number) => part.toString().padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
};

const padDatePart = (part: number): string => part.toString().padStart(2, "0");

const formatDatePart = (date: Date): string =>
  `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`;

const formatTimePart = (date: Date): string =>
  `${padDatePart(date.getHours())}:${padDatePart(date.getMinutes())}`;

const parseDatePartFromDateTimeLocal = (value: string): Date | undefined => {
  const [datePart] = value.split("T");

  if (!datePart || !DATE_PART_PATTERN.test(datePart)) {
    return undefined;
  }

  const [year, month, day] = datePart.split("-").map(Number);
  const parsedDate = new Date(year, month - 1, day);

  if (Number.isNaN(parsedDate.getTime())) {
    return undefined;
  }

  return parsedDate;
};

const parseTimePartFromDateTimeLocal = (value: string): string | undefined => {
  const [, timePart] = value.split("T");

  if (!timePart || !TIME_PART_PATTERN.test(timePart)) {
    return undefined;
  }

  return timePart;
};

const formatDateForLabel = (date?: Date): string =>
  date
    ? date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "Выберите дату";

const formatMonthDropdownRu = (date: Date): string =>
  date.toLocaleString("ru-RU", { month: "long" });

const buildInitialValues = (
  initialValue?: ProductFormInitialValue,
): ProductFormValues => ({
  name: initialValue?.name ?? "",
  description: initialValue?.description ?? "",
  categoryName: initialValue?.categoryName ?? "",
  price: typeof initialValue?.price === "number" ? String(initialValue.price) : "",
  oldPrice: typeof initialValue?.oldPrice === "number" ? String(initialValue.oldPrice) : "",
  createdAt: toDateTimeLocalValue(initialValue?.createdAt),
});

const buildEmptyValues = (): ProductFormValues =>
  buildInitialValues({
    name: "",
    description: "",
    categoryName: "",
    price: undefined,
    oldPrice: undefined,
    createdAt: new Date().toISOString(),
  });

const parseMoney = (value: string): number =>
  Number.parseFloat(value.replace(",", "."));

const validateValues = (
  values: ProductFormValues,
): {
  errors: ProductFormValidationErrors;
  parsed: {
    name: string;
    description?: string;
    categoryName: string;
    price?: number;
    oldPrice?: number;
    createdAt?: string;
  };
} => {
  const errors: ProductFormValidationErrors = {};

  const name = values.name.trim();
  const description = values.description.trim();
  const categoryName = values.categoryName.trim();
  const priceText = values.price.trim();
  const oldPriceText = values.oldPrice.trim();
  const createdAtText = values.createdAt.trim();

  if (!name) {
    errors.name = "Введите название товара.";
  } else if (name.length > NAME_MAX_LENGTH) {
    errors.name = `Название не должно быть длиннее ${NAME_MAX_LENGTH} символов.`;
  }

  if (description.length > DESCRIPTION_MAX_LENGTH) {
    errors.description = `Описание не должно быть длиннее ${DESCRIPTION_MAX_LENGTH} символов.`;
  }

  if (!categoryName) {
    errors.categoryName = "Введите категорию товара.";
  } else if (categoryName.length > CATEGORY_MAX_LENGTH) {
    errors.categoryName = `Категория не должна быть длиннее ${CATEGORY_MAX_LENGTH} символов.`;
  }

  let price: number | undefined;
  if (!priceText) {
    errors.price = "Укажите цену товара.";
  } else if (!MONEY_PATTERN.test(priceText)) {
    errors.price = "Цена должна быть числом с максимум двумя знаками после запятой.";
  } else {
    price = parseMoney(priceText);
    if (!Number.isFinite(price) || price <= 0) {
      errors.price = "Цена должна быть больше нуля.";
    }
  }

  let oldPrice: number | undefined;
  if (oldPriceText) {
    if (!MONEY_PATTERN.test(oldPriceText)) {
      errors.oldPrice =
        "Старая цена должна быть числом с максимум двумя знаками после запятой.";
    } else {
      oldPrice = parseMoney(oldPriceText);
      if (!Number.isFinite(oldPrice) || oldPrice <= 0) {
        errors.oldPrice = "Старая цена должна быть больше нуля.";
      }
    }
  }

  if (price !== undefined && oldPrice !== undefined && oldPrice < price) {
    errors.oldPrice = "Старая цена должна быть больше или равна текущей.";
  }

  let createdAt: string | undefined;
  if (!createdAtText) {
    errors.createdAt = "Укажите дату и время создания.";
  } else {
    const createdAtDate = new Date(createdAtText);

    if (Number.isNaN(createdAtDate.getTime())) {
      errors.createdAt = "Некорректная дата создания товара.";
    } else {
      createdAt = createdAtDate.toISOString();
    }
  }

  return {
    errors,
    parsed: {
      name,
      description: description || undefined,
      categoryName,
      price,
      oldPrice,
      createdAt,
    },
  };
};

function ProductFormModal({
  visible,
  mode,
  initialValue,
  onClose,
  onSubmit,
  onValidation,
}: ProductFormModalProps) {
  const [values, setValues] = React.useState<ProductFormValues>(() =>
    buildInitialValues(initialValue),
  );
  const [errors, setErrors] = React.useState<ProductFormValidationErrors>({});
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  React.useEffect(() => {
    if (!visible) {
      return;
    }

    setValues(buildInitialValues(initialValue));
    setErrors({});
    setIsCalendarOpen(false);
  }, [initialValue, mode, visible]);

  const title = mode === "edit" ? "Изменить товар" : "Добавить товар";
  const submitLabel = mode === "edit" ? "Изменить" : "Добавить";

  const updateField = <TKey extends keyof ProductFormValues>(
    field: TKey,
    fieldValue: ProductFormValues[TKey],
  ) => {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: fieldValue,
    }));

    if (errors[field]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [field]: undefined,
      }));
    }
  };

  const selectedCreatedAtDate = parseDatePartFromDateTimeLocal(values.createdAt);
  const selectedCreatedAtTime =
    parseTimePartFromDateTimeLocal(values.createdAt) ?? formatTimePart(new Date());

  const handleCreatedAtDateSelect = (selectedDate?: Date) => {
    if (!selectedDate) {
      return;
    }

    const nextCreatedAtValue = `${formatDatePart(selectedDate)}T${selectedCreatedAtTime}`;
    updateField("createdAt", nextCreatedAtValue);
    setIsCalendarOpen(false);
  };

  const handleCreatedAtTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextTime = event.target.value;
    if (!nextTime || !TIME_PART_PATTERN.test(nextTime)) {
      return;
    }

    const baseDate = selectedCreatedAtDate ?? new Date();
    updateField("createdAt", `${formatDatePart(baseDate)}T${nextTime}`);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = validateValues(values);
    const nextErrors = validation.errors;
    const isValid = Object.keys(nextErrors).length === 0;
    setErrors(nextErrors);

    onValidation?.({
      isValid,
      errors: nextErrors,
      values,
    });

    if (!isValid) {
      return;
    }

    const payload: ProductFormSubmitPayload = {
      name: validation.parsed.name,
      description: validation.parsed.description,
      categoryName: validation.parsed.categoryName,
      price: validation.parsed.price ?? 0,
      oldPrice: validation.parsed.oldPrice,
      createdAt: validation.parsed.createdAt ?? new Date().toISOString(),
    };

    console.log("[ProductFormModal] submit", payload);
    onSubmit?.(payload);
    setValues(buildEmptyValues());
    setErrors({});
    onClose();
  };

  return (
    <Modal
      visible={visible}
      title={title}
      description="Заполните данные товара. Картинка назначается автоматически."
      onClose={onClose}
      className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-2xl"
    >
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium" htmlFor="product-id">
              ID товара
            </label>
            <Input
              id="product-id"
              value={initialValue?.id ?? "Создаётся автоматически"}
              disabled
              readOnly
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium" htmlFor="product-name">
              Название товара
            </label>
            <Input
              id="product-name"
              value={values.name}
              maxLength={NAME_MAX_LENGTH}
              onChange={(event) => updateField("name", event.target.value)}
              aria-invalid={Boolean(errors.name)}
              placeholder="Введите название"
            />
            <p className="text-xs text-muted-foreground">До {NAME_MAX_LENGTH} символов.</p>
            {errors.name ? (
              <p className="text-xs text-destructive">{errors.name}</p>
            ) : null}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium" htmlFor="product-description">
              Описание
            </label>
            <textarea
              id="product-description"
              value={values.description}
              maxLength={DESCRIPTION_MAX_LENGTH}
              onChange={(event) => updateField("description", event.target.value)}
              className="w-full min-h-24 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              placeholder="Введите описание"
              aria-invalid={Boolean(errors.description)}
            />
            <p className="text-xs text-muted-foreground">
              {values.description.length}/{DESCRIPTION_MAX_LENGTH}
            </p>
            {errors.description ? (
              <p className="text-xs text-destructive">{errors.description}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="product-category">
              Категория
            </label>
            <Input
              id="product-category"
              value={values.categoryName}
              maxLength={CATEGORY_MAX_LENGTH}
              onChange={(event) => updateField("categoryName", event.target.value)}
              aria-invalid={Boolean(errors.categoryName)}
              placeholder="Например, Техника"
            />
            <p className="text-xs text-muted-foreground">
              До {CATEGORY_MAX_LENGTH} символов.
            </p>
            {errors.categoryName ? (
              <p className="text-xs text-destructive">{errors.categoryName}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="product-created-at">
              Дата создания
            </label>
            <Button
              id="product-created-at"
              type="button"
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedCreatedAtDate && "text-muted-foreground",
                errors.createdAt && "border-destructive",
              )}
              onClick={() => setIsCalendarOpen((currentValue) => !currentValue)}
              aria-expanded={isCalendarOpen}
              aria-invalid={Boolean(errors.createdAt)}
            >
              {formatDateForLabel(selectedCreatedAtDate)}
            </Button>
            {isCalendarOpen ? (
              <div className="w-fit rounded-md border bg-background p-2 shadow-sm">
                <Calendar
                  mode="single"
                  selected={selectedCreatedAtDate}
                  onSelect={handleCreatedAtDateSelect}
                  locale={ru}
                  captionLayout="dropdown"
                  navLayout="after"
                  startMonth={CALENDAR_START_MONTH}
                  endMonth={CALENDAR_END_MONTH}
                  formatters={{ formatMonthDropdown: formatMonthDropdownRu }}
                />
              </div>
            ) : null}
            <Input
              type="time"
              step={60}
              value={selectedCreatedAtTime}
              onChange={handleCreatedAtTimeChange}
              aria-invalid={Boolean(errors.createdAt)}
            />
            {errors.createdAt ? (
              <p className="text-xs text-destructive">{errors.createdAt}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="product-price">
              Цена
            </label>
            <Input
              id="product-price"
              inputMode="decimal"
              value={values.price}
              onChange={(event) => updateField("price", event.target.value)}
              aria-invalid={Boolean(errors.price)}
              placeholder="1999.99"
            />
            <p className="text-xs text-muted-foreground">
              Только число с двумя знаками после запятой.
            </p>
            {errors.price ? (
              <p className="text-xs text-destructive">{errors.price}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="product-old-price">
              Старая цена (необязательно)
            </label>
            <Input
              id="product-old-price"
              inputMode="decimal"
              value={values.oldPrice}
              onChange={(event) => updateField("oldPrice", event.target.value)}
              aria-invalid={Boolean(errors.oldPrice)}
              placeholder="2499.99"
            />
            {errors.oldPrice ? (
              <p className="text-xs text-destructive">{errors.oldPrice}</p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit">{submitLabel}</Button>
        </div>
      </form>
    </Modal>
  );
}

export { ProductFormModal };
export type {
  ProductFormInitialValue,
  ProductFormModalProps,
  ProductFormMode,
  ProductFormSubmitPayload,
  ProductFormValidationResult,
};
