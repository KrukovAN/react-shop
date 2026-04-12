import * as React from "react";

type UseInfiniteScrollTriggerParams = {
  enabled: boolean;
  isLoading: boolean;
  onLoadMore?: () => void | Promise<void>;
  rootMargin?: string;
  resetToken?: unknown;
};

function useInfiniteScrollTrigger({
  enabled,
  isLoading,
  onLoadMore,
  rootMargin = "240px 0px",
  resetToken,
}: UseInfiniteScrollTriggerParams) {
  const observerTargetRef = React.useRef<HTMLDivElement | null>(null);
  const canAutoLoadRef = React.useRef(true);

  React.useEffect(() => {
    canAutoLoadRef.current = true;
  }, [resetToken]);

  React.useEffect(() => {
    if (!enabled || !onLoadMore || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const node = observerTargetRef.current;

    if (!node) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || isLoading || !canAutoLoadRef.current) {
          return;
        }

        canAutoLoadRef.current = false;
        onLoadMore();
      },
      { rootMargin },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [enabled, isLoading, onLoadMore, rootMargin]);

  return observerTargetRef;
}

export { useInfiniteScrollTrigger };
