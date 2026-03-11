import { Trash2Icon } from "lucide-react";
import { ModalAlert } from "@/modals/modal-alert";

type CartRemovalModalProps = {
  visible: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

function CartRemovalModal({
  visible,
  onConfirm,
  onClose,
}: CartRemovalModalProps) {
  return (
    <ModalAlert
      visible={visible}
      title="Удалить товар"
      description="Вы точно хотите удалить выбранный товар? Отменить данное действие будет невозможно."
      actionLabel="Удалить"
      actionIcon={<Trash2Icon />}
      onAction={onConfirm}
      onClose={onClose}
    />
  );
}

export { CartRemovalModal };
export type { CartRemovalModalProps };
