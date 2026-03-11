import type { ProfileFormValues } from "@/entities/profile";

type AuthUser = {
  profile?: Record<string, unknown> | null;
  access_token?: string | null;
} | null;

const EMPTY_PROFILE_VALUES: ProfileFormValues = {
  firstName: "",
  lastName: "",
  displayName: "",
  email: "",
  emailVerified: false,
};

const readProfileString = (
  profile: Record<string, unknown>,
  key: string,
): string | null => {
  const value = profile[key];

  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();
  return normalizedValue ? normalizedValue : null;
};

const readProfileBoolean = (
  profile: Record<string, unknown>,
  key: string,
): boolean => {
  const value = profile[key];
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") {
      return true;
    }
    if (normalized === "false") {
      return false;
    }
  }

  return false;
};

const getProfileValues = (user: AuthUser): ProfileFormValues => {
  const profile = user?.profile ?? {};

  return {
    firstName:
      readProfileString(profile, "given_name") ??
      readProfileString(profile, "firstName") ??
      "",
    lastName:
      readProfileString(profile, "family_name") ??
      readProfileString(profile, "lastName") ??
      "",
    displayName:
      readProfileString(profile, "name") ??
      readProfileString(profile, "preferred_username") ??
      "",
    email: readProfileString(profile, "email") ?? "",
    emailVerified: readProfileBoolean(profile, "email_verified"),
  };
};

const getHeaderUserName = (values: ProfileFormValues): string =>
  values.displayName || values.firstName || values.email || "Пользователь";

const getIsManager = (user: AuthUser, currentProjectId: string): boolean => {
  const roles =
    user?.profile?.[`urn:zitadel:iam:org:project:${currentProjectId}:roles`];

  if (!roles || typeof roles !== "object" || Array.isArray(roles)) {
    return false;
  }

  return Boolean((roles as Record<string, unknown>).manager);
};

const parseZitadelError = async (response: Response): Promise<string> => {
  try {
    const payload = (await response.json()) as {
      message?: string;
      details?: Array<{ id?: string; message?: string }>;
      error?: { message?: string };
    };

    const authTokenInvalid = Array.isArray(payload.details)
      ? payload.details.some(
          (detail) =>
            typeof detail === "object" &&
            detail !== null &&
            "id" in detail &&
            (detail as { id?: string }).id === "AUTH-7fs1e",
        )
      : false;

    if (authTokenInvalid) {
      return "Недействительный токен для API ZITADEL. Выйдите и войдите снова, чтобы получить новый access token.";
    }

    if (typeof payload.message === "string" && payload.message.trim()) {
      return payload.message;
    }

    if (Array.isArray(payload.details)) {
      const detailMessage = payload.details
        .map((detail) => detail.message)
        .find((message): message is string => Boolean(message));

      if (detailMessage) {
        return detailMessage;
      }
    }

    if (
      payload.error &&
      typeof payload.error.message === "string" &&
      payload.error.message.trim()
    ) {
      return payload.error.message;
    }
  } catch {
    // Ignore parse errors and fallback to status text.
  }

  return `Ошибка ${response.status}: ${response.statusText || "не удалось выполнить запрос"}`;
};

const isJwtAccessToken = (token: string): boolean =>
  /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token);

export {
  EMPTY_PROFILE_VALUES,
  getProfileValues,
  getHeaderUserName,
  getIsManager,
  parseZitadelError,
  isJwtAccessToken,
};
export type { AuthUser };
