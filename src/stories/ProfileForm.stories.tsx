import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProfileForm } from "@/components/ui/profile-form";
import type {
  ProfileFormValidationResult,
  ProfileFormValues,
} from "@/types/profile";

type ProfileFormStoryArgs = {
  initialValues: ProfileFormValues;
};

function ProfileFormDemo({ initialValues }: ProfileFormStoryArgs) {
  const [submittedValues, setSubmittedValues] =
    React.useState<ProfileFormValues | null>(null);

  React.useEffect(() => {
    setSubmittedValues(null);
  }, [initialValues]);

  const handleSubmit = (values: ProfileFormValues) => {
    setSubmittedValues(values);
    console.log("[ProfileForm story] submit", values);
  };

  const handleValidation = (result: ProfileFormValidationResult) => {
    console.log("[ProfileForm story] validation", result);
  };

  return (
    <div className="w-[min(100%,920px)] space-y-4 rounded-3xl border bg-card p-6 shadow-sm">
      {submittedValues ? (
        <pre className="overflow-x-auto rounded-2xl border bg-muted/30 p-4 text-xs">
          {JSON.stringify(submittedValues, null, 2)}
        </pre>
      ) : (
        <p className="text-sm text-muted-foreground">
          После отправки формы данные появятся здесь и в консоли Storybook.
        </p>
      )}

      <ProfileForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onValidation={handleValidation}
      />
    </div>
  );
}

const meta: Meta<ProfileFormStoryArgs> = {
  title: "Формы/Форма профиля",
  parameters: {
    layout: "centered",
  },
  args: {
    initialValues: {
      firstName: "Иван",
      lastName: "Иванов",
      displayName: "Иван И.",
      email: "ivan@example.com",
      emailVerified: false,
    },
  },
  argTypes: {
    initialValues: {
      control: "object",
    },
  },
};

export default meta;

type Story = StoryObj<ProfileFormStoryArgs>;

export const Interactive: Story = {
  name: "Интерактивная форма",
  render: (args) => <ProfileFormDemo {...args} />,
};
