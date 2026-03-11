import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/layuots/input";
import { ModalAlert } from "@/modals/modal-alert";
import type {
  ProfileFormValues,
  ProfileSaveResult,
} from "@/entities/profile";

type ProfileFormValidationResult = {
  values: ProfileFormValues;
  errors: ProfileFormErrors;
  isValid: boolean;
};

type ProfilePageProps = {
  authenticated: boolean | null;
  isManager: boolean;
  initialValues: ProfileFormValues;
  onLogin: () => void;
  onSubmitProfile: (values: ProfileFormValues) => Promise<ProfileSaveResult>;
  onSubmitEmail: (email: string) => Promise<ProfileSaveResult>;
  onSendEmailVerification: (email: string) => Promise<ProfileSaveResult>;
  onValidation?: (result: ProfileFormValidationResult) => void;
};

type ProfileFormErrors = Partial<Record<keyof ProfileFormValues, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeValues = (values: ProfileFormValues): ProfileFormValues => ({
  firstName: values.firstName.trim(),
  lastName: values.lastName.trim(),
  displayName: values.displayName.trim(),
  email: values.email.trim(),
  emailVerified: values.emailVerified,
});

const validateProfileFields = (values: ProfileFormValues): ProfileFormErrors => {
  const normalized = normalizeValues(values);
  const errors: ProfileFormErrors = {};

  if (!normalized.firstName) {
    errors.firstName = "Введите имя.";
  }

  if (!normalized.lastName) {
    errors.lastName = "Введите фамилию.";
  }

  if (!normalized.displayName) {
    errors.displayName = "Введите отображаемое имя.";
  }

  return errors;
};

const validateEmailField = (email: string): string | null => {
  if (!email) {
    return "Введите email.";
  }

  if (!EMAIL_PATTERN.test(email)) {
    return "Введите корректный email.";
  }

  return null;
};

function ProfilePage({
  authenticated,
  isManager,
  initialValues,
  onLogin,
  onSubmitProfile,
  onSubmitEmail,
  onSendEmailVerification,
  onValidation,
}: ProfilePageProps) {
  const [values, setValues] = React.useState<ProfileFormValues>(initialValues);
  const [errors, setErrors] = React.useState<ProfileFormErrors>({});
  const [isSavingProfile, setIsSavingProfile] = React.useState(false);
  const [isSavingEmail, setIsSavingEmail] = React.useState(false);
  const [isSendingVerification, setIsSendingVerification] = React.useState(false);
  const [isEmailConfirmOpen, setIsEmailConfirmOpen] = React.useState(false);

  React.useEffect(() => {
    setValues(initialValues);
    setErrors({});
    setIsEmailConfirmOpen(false);
  }, [initialValues]);

  if (authenticated === null) {
    return (
      <section className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Проверяем сессию...</p>
      </section>
    );
  }

  if (!authenticated) {
    return (
      <section className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-base font-medium">
          Для редактирования профиля нужно войти.
        </p>
        <Button type="button" onClick={onLogin}>
          Войти
        </Button>
      </section>
    );
  }

  const normalizedValues = normalizeValues(values);
  const normalizedInitialValues = normalizeValues(initialValues);

  const isProfileDirty =
    normalizedValues.firstName !== normalizedInitialValues.firstName ||
    normalizedValues.lastName !== normalizedInitialValues.lastName ||
    normalizedValues.displayName !== normalizedInitialValues.displayName;

  const isEmailDirty = normalizedValues.email !== normalizedInitialValues.email;
  const emailValidationError = validateEmailField(normalizedValues.email);

  const updateField = <TKey extends keyof ProfileFormValues>(
    field: TKey,
    value: ProfileFormValues[TKey],
  ) => {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [field]: undefined,
      }));
    }
  };

  const handleProfileSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateProfileFields(values);
    const validationResult: ProfileFormValidationResult = {
      values: normalizedValues,
      errors: nextErrors,
      isValid: Object.keys(nextErrors).length === 0,
    };

    setErrors((currentErrors) => ({
      ...currentErrors,
      firstName: nextErrors.firstName,
      lastName: nextErrors.lastName,
      displayName: nextErrors.displayName,
    }));
    onValidation?.(validationResult);

    if (Object.keys(nextErrors).length > 0) {
      toast.error("Проверьте заполнение полей профиля.");
      return;
    }

    if (!isProfileDirty) {
      return;
    }

    setIsSavingProfile(true);
    try {
      const savePromise = onSubmitProfile(normalizedValues).then((result) => {
        if (!result.success) {
          throw new Error(result.message);
        }
        return result;
      });

      await toast.promise(savePromise, {
        loading: "Сохраняем данные профиля...",
        success: "Данные профиля сохранены.",
        error: (error) =>
          error instanceof Error
            ? error.message
            : "Не удалось сохранить данные профиля.",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const requestEmailSave = () => {
    if (!isEmailDirty || emailValidationError) {
      return;
    }

    setIsEmailConfirmOpen(true);
  };

  const confirmEmailSave = async () => {
    setIsEmailConfirmOpen(false);
    setIsSavingEmail(true);

    try {
      const savePromise = onSubmitEmail(normalizedValues.email).then((result) => {
        if (!result.success) {
          throw new Error(result.message);
        }
        return result;
      });

      await toast.promise(savePromise, {
        loading: "Изменяем email...",
        success: "Email успешно изменен.",
        error: (error) =>
          error instanceof Error
            ? error.message
            : "Не удалось изменить email.",
      });
    } finally {
      setIsSavingEmail(false);
    }
  };

  const handleSendEmailVerification = async () => {
    if (emailValidationError) {
      toast.error("Введите корректный email перед отправкой подтверждения.");
      return;
    }

    setIsSendingVerification(true);

    try {
      const sendPromise = onSendEmailVerification(normalizedValues.email).then(
        (result) => {
          if (!result.success) {
            throw new Error(result.message);
          }
          return result;
        },
      );

      await toast.promise(sendPromise, {
        loading: "Отправляем письмо подтверждения...",
        success: "Письмо для подтверждения отправлено.",
        error: (error) =>
          error instanceof Error
            ? error.message
            : "Не удалось отправить письмо подтверждения.",
      });
    } finally {
      setIsSendingVerification(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-2xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Профиль</h1>
        {isManager ? (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Менеджер
          </p>
        ) : null}
      </header>

      <div className="space-y-6 rounded-2xl border bg-card p-6 shadow-sm">
        <form className="space-y-4" onSubmit={handleProfileSubmit} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="profile-first-name" className="text-sm font-medium">
                Имя
              </label>
              <Input
                id="profile-first-name"
                value={values.firstName}
                onChange={(event) => updateField("firstName", event.target.value)}
                aria-invalid={Boolean(errors.firstName)}
                placeholder="Введите имя"
              />
              {errors.firstName ? (
                <p className="text-xs text-destructive">{errors.firstName}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="profile-last-name" className="text-sm font-medium">
                Фамилия
              </label>
              <Input
                id="profile-last-name"
                value={values.lastName}
                onChange={(event) => updateField("lastName", event.target.value)}
                aria-invalid={Boolean(errors.lastName)}
                placeholder="Введите фамилию"
              />
              {errors.lastName ? (
                <p className="text-xs text-destructive">{errors.lastName}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="profile-display-name" className="text-sm font-medium">
              Отображаемое имя
            </label>
            <Input
              id="profile-display-name"
              value={values.displayName}
              onChange={(event) => updateField("displayName", event.target.value)}
              aria-invalid={Boolean(errors.displayName)}
              placeholder="Введите отображаемое имя"
            />
            {errors.displayName ? (
              <p className="text-xs text-destructive">{errors.displayName}</p>
            ) : null}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={!isProfileDirty || isSavingProfile}>
              {isSavingProfile ? "Сохраняем..." : "Сохранить"}
            </Button>
          </div>
        </form>

        <div className="space-y-4 border-t pt-6">
          <div className="space-y-2">
            <label htmlFor="profile-email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="profile-email"
              type="email"
              value={values.email}
              onChange={(event) => updateField("email", event.target.value)}
              aria-invalid={Boolean(emailValidationError)}
              placeholder="Введите email"
            />
            {emailValidationError ? (
              <p className="text-xs text-destructive">{emailValidationError}</p>
            ) : null}
            <div className="flex items-center gap-3">
              <p
                className={`text-xs font-medium ${
                  values.emailVerified ? "text-green-600" : "text-red-600"
                }`}
              >
                {values.emailVerified ? "Подтвержден" : "Не подтвержден"}
              </p>
              {!values.emailVerified ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    void handleSendEmailVerification();
                  }}
                  disabled={isSendingVerification || Boolean(emailValidationError)}
                >
                  {isSendingVerification ? "Отправка..." : "Подтвердить"}
                </Button>
              ) : null}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              disabled={!isEmailDirty || Boolean(emailValidationError) || isSavingEmail}
              onClick={requestEmailSave}
            >
              {isSavingEmail ? "Сохраняем..." : "Сохранить"}
            </Button>
          </div>
        </div>
      </div>

      <ModalAlert
        visible={isEmailConfirmOpen}
        title="Подтвердите изменение почты"
        description={`Ваша почта будет изменена на ${normalizedValues.email}`}
        actionLabel="Изменить Email"
        onAction={() => {
          void confirmEmailSave();
        }}
        onClose={() => setIsEmailConfirmOpen(false)}
      />
    </section>
  );
}

export { ProfilePage };
export type {
  ProfileFormValidationResult,
  ProfileFormValues,
  ProfilePageProps,
  ProfileSaveResult,
};
