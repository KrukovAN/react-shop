import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

type ModalConfirmProps = {
  visible: boolean;
  title: React.ReactNode;
  description?: React.ReactNode;
  actionLabel: React.ReactNode;
  actionIcon?: React.ReactNode;
  onAction?: () => void;
  onClose?: () => void;
  className?: string;
};

function ModalConfirm({
  visible,
  title,
  description,
  actionLabel,
  actionIcon,
  onAction,
  onClose,
  className,
}: ModalConfirmProps) {
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
        <DialogFooter className="sm:justify-around mt-4">
          <DialogClose asChild>
            <Button onClick={onAction}>
              {actionIcon ? actionIcon : null}
              {actionLabel}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { ModalConfirm };
export type { ModalConfirmProps };
