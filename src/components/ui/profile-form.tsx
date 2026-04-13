import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  ProfileFormErrors,
  ProfileFormValidationResult,
  ProfileFormValues,
} from "@/types/profile";

type ProfileFormProps = {
  initialValues?: Partial<ProfileFormValues>;
  onSubmit?: (values: ProfileFormValues) => void;
  onValidation?: (result: ProfileFormValidationResult) => void;
  submitLabel?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const buildInitialValues = (
  initialValues?: Partial<ProfileFormValues>,
): ProfileFormValues => ({
  firstName: initialValues?.firstName ?? "",
  lastName: initialValues?.lastName ?? "",
  displayName: initialValues?.displayName ?? "",
  email: initialValues?.email ?? "",
  emailVerified: initialValues?.emailVerified ?? false,
});

const normalizeValues = (values: ProfileFormValues): ProfileFormValues => ({
  firstName: values.firstName.trim(),
  lastName: values.lastName.trim(),
  displayName: values.displayName.trim(),
  email: values.email.trim(),
  emailVerified: values.emailVerified,
});

const validateProfileForm = (values: ProfileFormValues): ProfileFormErrors => {
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

  if (!normalized.email) {
    errors.email = "Введите email.";
  } else if (!EMAIL_PATTERN.test(normalized.email)) {
    errors.email = "Введите корректный email.";
  }

  return errors;
};

function ProfileForm({
  initialValues,
  onSubmit,
  onValidation,
  submitLabel = "Сохранить",
}: ProfileFormProps) {
  const [values, setValues] = React.useState<ProfileFormValues>(() =>
    buildInitialValues(initialValues),
  );
  const [errors, setErrors] = React.useState<ProfileFormErrors>({});

  React.useEffect(() => {
    setValues(buildInitialValues(initialValues));
    setErrors({});
  }, [initialValues]);

  const updateField = <TKey extends keyof ProfileFormValues>(
    field: TKey,
    value: ProfileFormValues[TKey],
  ) => {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));

    if (errors[field as keyof ProfileFormErrors]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [field]: undefined,
      }));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedValues = normalizeValues(values);
    const nextErrors = validateProfileForm(normalizedValues);
    const isValid = Object.keys(nextErrors).length === 0;
    setErrors(nextErrors);

    onValidation?.({
      values: normalizedValues,
      errors: nextErrors,
      isValid,
    });

    if (!isValid) {
      return;
    }

    console.log("[ProfileForm] submit", normalizedValues);
    onSubmit?.(normalizedValues);

    setValues(buildInitialValues());
    setErrors({});
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
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

      <div className="space-y-2">
        <label htmlFor="profile-email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="profile-email"
          type="email"
          value={values.email}
          onChange={(event) => updateField("email", event.target.value)}
          aria-invalid={Boolean(errors.email)}
          placeholder="Введите email"
        />
        {errors.email ? (
          <p className="text-xs text-destructive">{errors.email}</p>
        ) : null}
      </div>

      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          checked={values.emailVerified}
          onChange={(event) => updateField("emailVerified", event.target.checked)}
        />
        Email подтвержден
      </label>

      <div className="flex justify-end">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}

export { ProfileForm };
export type { ProfileFormProps };
