import { Card } from "@/components/ui/card";
import { ProfileForm } from "@/components/ui/profile-form";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateProfile } from "@/store/slices/profile-slice";

function ProfilePage() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile.value);

  if (!profile) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-2xl space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Профиль</h1>
        <p className="text-sm text-muted-foreground">
          Форма профиля доступна только авторизованным пользователям.
        </p>
      </header>

      <Card className="rounded-2xl p-6 shadow-sm">
        <ProfileForm
          initialValues={{
            firstName: profile.firstName,
            lastName: profile.lastName,
            displayName: profile.displayName,
            email: profile.email,
            emailVerified: profile.emailVerified,
          }}
          onSubmit={(values) => {
            dispatch(updateProfile(values));
          }}
        />
      </Card>
    </section>
  );
}

export { ProfilePage };
