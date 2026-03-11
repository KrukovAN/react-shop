import { LogIn } from "lucide-react";
import { ModalConfirm } from "@/modals/modal-confirm";

type AuthRequiredModalProps = {
  visible: boolean;
  onClose: () => void;
  onRegister: () => void;
};

function AuthRequiredModal({
  visible,
  onClose,
  onRegister,
}: AuthRequiredModalProps) {
  return (
    <ModalConfirm
      visible={visible}
      onClose={onClose}
      title="Вход в аккаунт"
      description="Для добавления товаров в корзину необходимо войти или зарегистрироваться"
      actionLabel="Войти"
      actionIcon={<LogIn />}
      onAction={onRegister}
      className="sm:max-w-md"
    />
  );
}

export { AuthRequiredModal };
export type { AuthRequiredModalProps };
