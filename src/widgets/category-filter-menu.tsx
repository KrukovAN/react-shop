import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CategoryFilterOption } from "@/hooks/use-category-filter";

type CategoryFilterMenuProps = {
  selectedCategoryLabel: string;
  isCategoryFilterEnabled: boolean;
  isCategoryMultiSelect: boolean;
  categoryFilterOptions: CategoryFilterOption[];
  selectedCategoryIds: string[];
  onCategoryFilterEnabledChange: (enabled: boolean) => void;
  onCategoryMultiSelectChange: (enabled: boolean) => void;
  onCategoryToggle: (categoryId: string, checked: boolean) => void;
};

function CategoryFilterMenu({
  selectedCategoryLabel,
  isCategoryFilterEnabled,
  isCategoryMultiSelect,
  categoryFilterOptions,
  selectedCategoryIds,
  onCategoryFilterEnabledChange,
  onCategoryMultiSelectChange,
  onCategoryToggle,
}: CategoryFilterMenuProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" className="gap-2">
          <span className="max-w-36 truncate">{selectedCategoryLabel}</span>
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuCheckboxItem
          checked={isCategoryFilterEnabled}
          onCheckedChange={(checked) =>
            onCategoryFilterEnabledChange(checked === true)
          }
        >
          Включить фильтр
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={isCategoryMultiSelect}
          onCheckedChange={(checked) =>
            onCategoryMultiSelectChange(checked === true)
          }
        >
          Множественный выбор
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Категории</DropdownMenuLabel>
        {categoryFilterOptions.length > 0 ? (
          categoryFilterOptions.map((category) => (
            <DropdownMenuCheckboxItem
              key={category.id}
              checked={selectedCategoryIds.includes(category.id)}
              onCheckedChange={(checked) =>
                onCategoryToggle(category.id, checked === true)
              }
            >
              {category.name}
            </DropdownMenuCheckboxItem>
          ))
        ) : (
          <div className="px-2 py-1.5 text-sm text-muted-foreground">
            Категории недоступны
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { CategoryFilterMenu };
export type { CategoryFilterMenuProps };
