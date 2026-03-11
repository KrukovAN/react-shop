type ProfileFormValues = {
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  emailVerified: boolean;
};

type ProfileSaveResult = {
  success: boolean;
  message: string;
};

export type { ProfileFormValues, ProfileSaveResult };
