import * as React from "react";
import { applyLocalImageFallback, resolveProductImageSrc } from "@/lib/image";
import { cn } from "@/lib/utils";
import { AspectRatio } from "./aspect-ratio";
import { CartButton } from "./cart-button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

type CompactProductCardProps = {
  title: string;
  description: string;
  price: React.ReactNode;
  imageSrc: string;
  imageAlt?: string;
  onImageClick?: () => void;
  imageActionLabel?: string;
  cartCount?: number;
  onCartIncrement?: () => void;
  onCartDecrement?: () => void;
  className?: string;
};

function CompactProductCard({
  title,
  description,
  price,
  imageSrc,
  imageAlt,
  onImageClick,
  imageActionLabel,
  cartCount = 0,
  onCartIncrement,
  onCartDecrement,
  className,
}: CompactProductCardProps) {
  const resolvedImageSrc = resolveProductImageSrc(imageSrc);
  const imageRef = React.useRef<HTMLImageElement | null>(null);
  const [isImageLoading, setIsImageLoading] = React.useState(true);

  React.useEffect(() => {
    const image = imageRef.current;

    if (!image) {
      setIsImageLoading(true);
      return;
    }

    if (image.complete && image.naturalWidth > 0) {
      setIsImageLoading(false);
      return;
    }

    setIsImageLoading(true);
  }, [resolvedImageSrc]);

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleImageError = (image: HTMLImageElement) => {
    applyLocalImageFallback(image);
    setIsImageLoading(false);
  };

  const loadingOverlay = isImageLoading ? (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-background/70">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary"
        aria-hidden="true"
      />
      <span className="sr-only">Загрузка изображения</span>
    </div>
  ) : null;

  return (
    <Card
      className={cn(
        "group flex h-full w-full max-w-72 flex-col overflow-hidden pt-0 transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg",
        className,
      )}
    >
      <AspectRatio ratio={1} className="relative overflow-hidden border-b bg-muted">
        {loadingOverlay}
        {onImageClick ? (
          <button
            type="button"
            onClick={onImageClick}
            aria-label={imageActionLabel ?? `Открыть детали товара ${title}`}
            className="block h-full w-full cursor-pointer border-0 bg-transparent p-0"
          >
            <img
              ref={imageRef}
              src={resolvedImageSrc}
              alt={imageAlt ?? title}
              onLoad={handleImageLoad}
              onError={(event) => handleImageError(event.currentTarget)}
              className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            />
          </button>
        ) : (
          <img
            ref={imageRef}
            src={resolvedImageSrc}
            alt={imageAlt ?? title}
            onLoad={handleImageLoad}
            onError={(event) => handleImageError(event.currentTarget)}
            className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          />
        )}
      </AspectRatio>
      <CardHeader className="gap-2 p-4">
        <div className="text-lg font-semibold">{price}</div>
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
      </CardFooter>
    </Card>
  );
}

export { CompactProductCard };
export type { CompactProductCardProps };
