import * as React from "react";
import { applyLocalImageFallback, resolveProductImageSrc } from "@/lib/image";

type UseProductImageParams = {
  src: string;
  imageRef: React.RefObject<HTMLImageElement | null>;
};

function useProductImage({ src, imageRef }: UseProductImageParams) {
  const resolvedSrc = React.useMemo(() => resolveProductImageSrc(src), [src]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const image = imageRef.current;

    if (!image) {
      setIsLoading(true);
      return;
    }

    setIsLoading(!(image.complete && image.naturalWidth > 0));
  }, [resolvedSrc, imageRef]);

  const handleImageLoad = React.useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleImageError = React.useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      applyLocalImageFallback(event.currentTarget);
      setIsLoading(false);
    },
    [],
  );

  return {
    resolvedSrc,
    isLoading,
    handleImageLoad,
    handleImageError,
  };
}

export { useProductImage };
