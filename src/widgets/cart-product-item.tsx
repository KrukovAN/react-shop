import * as React from "react";
import { Trash2 } from "lucide-react";
import { applyLocalImageFallback } from "@/lib/image";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { CartButton } from "@/widgets/cart-button";

type CartProductItemProps = {
  title: string;
  price: React.ReactNode;
  imageSrc: string;
  imageAlt?: string;
  quantity: number;
  onIncrement?: () => void;
  onDecrement?: () => void;
  onRemove?: () => void;
  className?: string;
};

function CartProductItem({
  title,
  price,
  imageSrc,
  imageAlt,
  quantity,
  onIncrement,
  onDecrement,
  onRemove,
  className,
}: CartProductItemProps) {
  const safeQuantity = Math.max(1, quantity);
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

  return (
    <div
      className={cn(
        "grid w-full gap-4 py-4 sm:grid-cols-[5rem_1fr] md:grid-cols-[5rem_1fr_auto] md:items-center",
        className,
      )}
    >
      <AspectRatio ratio={1} className="overflow-hidden rounded-lg bg-muted">
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
            "h-full w-full object-cover",
            isImageLoading ? "opacity-0" : "opacity-100",
          )}
          />
          {isImageLoading ? (
            <div className="absolute inset-0 grid place-items-center bg-muted/80">
              <span className="size-6 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary" />
            </div>
          ) : null}
        </div>
      </AspectRatio>
      <div className="min-w-0 space-y-2">
        <div className="line-clamp-2 text-sm font-semibold sm:text-base">
          {title}
        </div>
        <div className="text-sm font-semibold sm:text-base">{price}</div>
      </div>
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row md:col-span-1 md:justify-self-end">
        <CartButton
          count={safeQuantity}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          className="w-full min-w-0 sm:w-auto"
        />
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={onRemove}
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
}

export { CartProductItem };
export type { CartProductItemProps };






