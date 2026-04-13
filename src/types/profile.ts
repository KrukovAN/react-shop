import type { AuthRole } from "@/app/routes";

export type ProfileFormValues = {
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  emailVerified: boolean;
};

export type AppProfile = ProfileFormValues & {
  id: string;
  role: AuthRole;
};

export type ProfileFormErrors = Partial<
  Record<"firstName" | "lastName" | "displayName" | "email", string>
>;

export type ProfileFormValidationResult = {
  values: ProfileFormValues;
  errors: ProfileFormErrors;
  isValid: boolean;
};
