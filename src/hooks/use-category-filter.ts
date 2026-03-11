import * as React from "react";
import type { ApiProduct } from "@/pages/products-page";

type CategoryFilterOption = {
  id: string;
  name: string;
};

function useCategoryFilter(productsFromApi: ApiProduct[]) {
  const [isCategoryFilterEnabled, setIsCategoryFilterEnabled] =
    React.useState(false);
  const [isCategoryMultiSelect, setIsCategoryMultiSelect] =
    React.useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = React.useState<
    string[]
  >([]);

  const categoryFilterOptions = React.useMemo<CategoryFilterOption[]>(() => {
    const seen = new Set<string>();
    const options: CategoryFilterOption[] = [];

    for (const product of productsFromApi) {
      if (!product.categoryId || !product.categoryName) {
        continue;
      }

      if (seen.has(product.categoryId)) {
        continue;
      }

      seen.add(product.categoryId);
      options.push({ id: product.categoryId, name: product.categoryName });
    }

    return options.sort((left, right) =>
      left.name.localeCompare(right.name, "ru"),
    );
  }, [productsFromApi]);

  React.useEffect(() => {
    if (selectedCategoryIds.length === 0) {
      return;
    }

    const validIds = new Set(categoryFilterOptions.map((x) => x.id));
    const nextSelected = selectedCategoryIds.filter((id) => validIds.has(id));

    if (nextSelected.length !== selectedCategoryIds.length) {
      setSelectedCategoryIds(nextSelected);
    }
  }, [categoryFilterOptions, selectedCategoryIds]);

  React.useEffect(() => {
    if (isCategoryMultiSelect || selectedCategoryIds.length <= 1) {
      return;
    }

    setSelectedCategoryIds((current) => current.slice(0, 1));
  }, [isCategoryMultiSelect, selectedCategoryIds.length]);

  const selectedCategoryLabel = React.useMemo(() => {
    if (selectedCategoryIds.length === 0) {
      return "Категории";
    }

    if (selectedCategoryIds.length > 1) {
      return "Фильтр";
    }

    const selectedId = selectedCategoryIds[0];
    return (
      categoryFilterOptions.find((option) => option.id === selectedId)?.name ??
      "Категории"
    );
  }, [categoryFilterOptions, selectedCategoryIds]);

  const handleCategoryToggle = React.useCallback(
    (categoryId: string, checked: boolean) => {
      if (checked && !isCategoryFilterEnabled && !isCategoryMultiSelect) {
        setIsCategoryFilterEnabled(true);
      }

      setSelectedCategoryIds((current) => {
        if (checked) {
          if (isCategoryMultiSelect) {
            if (current.includes(categoryId)) {
              return current;
            }

            return [...current, categoryId];
          }

          return [categoryId];
        }

        return current.filter((id) => id !== categoryId);
      });
    },
    [isCategoryFilterEnabled, isCategoryMultiSelect],
  );

  return {
    isCategoryFilterEnabled,
    setIsCategoryFilterEnabled,
    isCategoryMultiSelect,
    setIsCategoryMultiSelect,
    selectedCategoryIds,
    categoryFilterOptions,
    selectedCategoryLabel,
    handleCategoryToggle,
  };
}

export { useCategoryFilter };
export type { CategoryFilterOption };
