import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Separator } from "./separator";

type ModalProps = {
  visible: boolean;
  title: React.ReactNode;
  description?: React.ReactNode;
  onClose?: () => void;
  className?: string;
};

function Modal({
  visible,
  title,
  description,
  onClose,
  className,
}: ModalProps) {
  return (
    <Dialog
      open={visible}
      onOpenChange={(open) => {
        if (!open) {
          onClose?.();
        }
      }}
    >
      <DialogContent className={cn(className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <>
              <Separator className="my-2" />
              <DialogDescription>{description}</DialogDescription>
            </>
          ) : null}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export { Modal };
export type { ModalProps };
