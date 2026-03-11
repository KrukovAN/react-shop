const LOCAL_PRODUCT_IMAGE_FALLBACK_SRC = "/product-images/placeholder.svg";

const applyLocalImageFallback = (image: HTMLImageElement): void => {
  if (image.dataset.fallbackApplied === "true") {
    return;
  }

  image.dataset.fallbackApplied = "true";
  image.src = LOCAL_PRODUCT_IMAGE_FALLBACK_SRC;
};

export { LOCAL_PRODUCT_IMAGE_FALLBACK_SRC, applyLocalImageFallback };




