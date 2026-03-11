import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

type ModalProps = {
  visible: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  onClose?: () => void;
  className?: string;
  children?: React.ReactNode;
  hideHeader?: boolean;
};

function Modal({
  visible,
  title,
  description,
  onClose,
  className,
  children,
  hideHeader = false,
}: ModalProps) {
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(
    null,
  );

  React.useEffect(() => {
    if (!visible || typeof document === "undefined") {
      setPortalContainer(null);
      return undefined;
    }

    const element = document.createElement("div");
    element.dataset.slot = "modal-container";
    document.body.appendChild(element);
    setPortalContainer(element);

    return () => {
      element.remove();
    };
  }, [visible]);

  if (!visible || !portalContainer) {
    return null;
  }

  const showHeader = !hideHeader && (title || description);
  const accessibleTitle =
    typeof title === "string" || typeof title === "number"
      ? String(title).trim() || "Диалоговое окно"
      : "Диалоговое окно";

  return (
    <Dialog
      open={visible}
      onOpenChange={(open) => {
        if (!open) {
          onClose?.();
        }
      }}
    >
      <DialogContent
        className={cn(className)}
        portalContainer={portalContainer}
      >
        {hideHeader || !title ? (
          <DialogTitle className="sr-only">{accessibleTitle}</DialogTitle>
        ) : null}
        {showHeader ? (
          <DialogHeader>
            {title ? <DialogTitle>{title}</DialogTitle> : null}
            {description ? (
              <>
                <Separator className="my-2" />
                <DialogDescription>{description}</DialogDescription>
              </>
            ) : null}
          </DialogHeader>
        ) : null}
        {children}
      </DialogContent>
    </Dialog>
  );
}

export { Modal };
export type { ModalProps };




