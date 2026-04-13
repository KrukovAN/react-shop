import * as React from "react";
import { Card } from "@/components/ui/card";
import { ProfileForm } from "@/components/ui/profile-form";
import type { ProfileFormValues } from "@/types/profile";

const initialProfileValues: ProfileFormValues = {
  firstName: "Иван",
  lastName: "Иванов",
  displayName: "Иван И.",
  email: "ivan@example.com",
  emailVerified: false,
};

function ProfilePage() {
  const [profileValues, setProfileValues] = React.useState<ProfileFormValues>(
    initialProfileValues,
  );

  return (
    <section className="mx-auto w-full max-w-2xl space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Профиль</h1>
        <p className="text-sm text-muted-foreground">
          Форма профиля теперь доступна на отдельном маршруте.
        </p>
      </header>

      <Card className="rounded-2xl p-6 shadow-sm">
        <ProfileForm
          initialValues={profileValues}
          onSubmit={(values) => {
            setProfileValues(values);
            console.log("[ProfilePage] profile submit", values);
          }}
          onValidation={(result) => {
            console.log("[ProfilePage] profile validation", result);
          }}
        />
      </Card>
    </section>
  );
}

export { ProfilePage };
