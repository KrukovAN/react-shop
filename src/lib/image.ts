const PRODUCT_IMAGE_REMOTE_BASE_URL =
  "https://cloud.krukoff.pro/public.php/dav/files/3b2HSHk8H8JiSmP";
const PRODUCT_IMAGE_FILE_PATTERN = /product-\d{3}\.jpg/i;
const LOCAL_PRODUCT_IMAGE_FALLBACK_SRC = `${PRODUCT_IMAGE_REMOTE_BASE_URL}/product-001.jpg`;

const extractProductImageFileName = (src: string): string | null => {
  const match = src.match(PRODUCT_IMAGE_FILE_PATTERN);
  return match ? match[0].toLowerCase() : null;
};

const resolveProductImageSrc = (src: string): string => {
  const fileName = extractProductImageFileName(src);

  if (!fileName) {
    return src;
  }

  return `${PRODUCT_IMAGE_REMOTE_BASE_URL}/${fileName}`;
};

const applyLocalImageFallback = (image: HTMLImageElement): void => {
  if (image.dataset.fallbackApplied === "true") {
    return;
  }

  image.dataset.fallbackApplied = "true";
  image.src = LOCAL_PRODUCT_IMAGE_FALLBACK_SRC;
};

export {
  LOCAL_PRODUCT_IMAGE_FALLBACK_SRC,
  PRODUCT_IMAGE_REMOTE_BASE_URL,
  applyLocalImageFallback,
  resolveProductImageSrc,
};
