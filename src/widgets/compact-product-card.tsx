import * as React from "react";
import { applyLocalImageFallback } from "@/lib/image";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { CartButton } from "@/widgets/cart-button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CompactProductCardProps = {
  title: string;
  category?: string;
  description: string;
  price: React.ReactNode;
  imageSrc: string;
  imageAlt?: string;
  onImageClick?: () => void;
  imageActionLabel?: string;
  cartCount?: number;
  onCartIncrement?: () => void;
  onCartDecrement?: () => void;
  showEditButton?: boolean;
  onEdit?: () => void;
  editLabel?: string;
  showDeleteButton?: boolean;
  onDelete?: () => void;
  deleteLabel?: string;
  className?: string;
};

function CompactProductCard({
  title,
  category,
  description,
  price,
  imageSrc,
  imageAlt,
  onImageClick,
  imageActionLabel,
  cartCount = 0,
  onCartIncrement,
  onCartDecrement,
  showEditButton = false,
  onEdit,
  editLabel = "Изменить",
  showDeleteButton = false,
  onDelete,
  deleteLabel = "Удалить",
  className,
}: CompactProductCardProps) {
  const [isImageLoading, setIsImageLoading] = React.useState(true);
  const imageRef = React.useRef<HTMLImageElement | null>(null);

  React.useEffect(() => {
    setIsImageLoading(true);
  }, [imageSrc]);

  React.useEffect(() => {
    const img = imageRef.current;
    if (img?.complete) {
      setIsImageLoading(false);
    }
  }, [imageSrc]);

  const imageElement = (
    <div className="relative h-full w-full">
      <img
        ref={imageRef}
        src={imageSrc}
        alt={imageAlt ?? title}
        onLoad={() => setIsImageLoading(false)}
        onError={(event) => {
          setIsImageLoading(false);
          applyLocalImageFallback(event.currentTarget);
        }}
        className={cn(
          "h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105",
          isImageLoading ? "opacity-0" : "opacity-100",
        )}
      />
      {isImageLoading ? (
        <div className="absolute inset-0 grid place-items-center bg-muted/80">
          <span className="size-8 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary" />
        </div>
      ) : null}
    </div>
  );

  return (
    <Card
      className={cn(
        "group flex h-full w-full max-w-72 flex-col overflow-hidden pt-0 transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg",
        className,
      )}
    >
      <AspectRatio ratio={1} className="overflow-hidden border-b bg-muted">
        {onImageClick ? (
          <button
            type="button"
            onClick={onImageClick}
            aria-label={imageActionLabel ?? `Открыть детали товара ${title}`}
            className="block h-full w-full cursor-pointer border-0 bg-transparent p-0"
          >
            {imageElement}
          </button>
        ) : (
          imageElement
        )}
      </AspectRatio>
      <CardHeader className="gap-2 p-4">
        <div className="text-lg font-semibold">{price}</div>
        {category ? (
          <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {category}
          </div>
        ) : null}
        <CardTitle className="line-clamp-2 text-base">{title}</CardTitle>
        <CardDescription className="line-clamp-2 text-sm">
          {description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto flex-col items-stretch gap-3 px-4 py-4 pt-0">
        <CartButton
          count={cartCount}
          onIncrement={onCartIncrement}
          onDecrement={onCartDecrement}
          className="w-full min-w-0"
        />
        {showEditButton && onEdit ? (
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={onEdit}
          >
            {editLabel}
          </Button>
        ) : null}
        {showDeleteButton && onDelete ? (
          <Button
            type="button"
            variant="destructive"
            className="w-full"
            onClick={onDelete}
          >
            {deleteLabel}
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
}

export { CompactProductCard };
export type { CompactProductCardProps };






