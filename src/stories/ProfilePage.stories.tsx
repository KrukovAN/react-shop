import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toaster } from "@/components/ui/sonner";
import {
  ProfilePage,
  type ProfileFormValidationResult,
  type ProfileFormValues,
  type ProfileSaveResult,
} from "@/pages/profile-page";

type ProfilePageStoryArgs = {
  authenticated: boolean | null;
  isManager: boolean;
  shouldFail: boolean;
  initialValues: ProfileFormValues;
};

function ProfilePageDemo({
  authenticated,
  isManager,
  shouldFail,
  initialValues,
}: ProfilePageStoryArgs) {
  const [currentInitialValues, setCurrentInitialValues] =
    React.useState<ProfileFormValues>(initialValues);
  const [submittedValues, setSubmittedValues] =
    React.useState<ProfileFormValues | null>(null);

  React.useEffect(() => {
    setCurrentInitialValues(initialValues);
    setSubmittedValues(null);
  }, [initialValues]);

  const handleLogin = () => {
    console.log("[ProfilePage] login click");
  };

  const handleSubmitProfile = async (
    values: ProfileFormValues,
  ): Promise<ProfileSaveResult> => {
    console.log("[ProfilePage] submit", values);
    setSubmittedValues(values);
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (shouldFail) {
      return {
        success: false,
        message: "РќРµ СѓРґР°Р»РѕСЃСЊ СЃРѕС…СЂР°РЅРёС‚СЊ РїСЂРѕС„РёР»СЊ (РґРµРјРѕ-РѕС€РёР±РєР° Storybook).",
      };
    }

    setCurrentInitialValues(values);
    return {
      success: true,
      message: "РџСЂРѕС„РёР»СЊ СЃРѕС…СЂР°РЅРµРЅ.",
    };
  };

  const handleValidation = (result: ProfileFormValidationResult) => {
    console.log("[ProfilePage] validation", result);
  };

  const handleSubmitEmail = async (email: string): Promise<ProfileSaveResult> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setCurrentInitialValues((current) => ({
      ...current,
      email,
      emailVerified: false,
    }));
    return {
      success: true,
      message: "Email изменен.",
    };
  };

  const handleSendEmailVerification = async (): Promise<ProfileSaveResult> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      message: "Письмо подтверждения отправлено.",
    };
  };

  return (
    <div className="w-[min(100%,920px)] space-y-4">
      {submittedValues ? (
        <pre className="overflow-x-auto rounded-2xl border bg-muted/30 p-4 text-xs">
          {JSON.stringify(submittedValues, null, 2)}
        </pre>
      ) : (
        <p className="text-sm text-muted-foreground">
          РџРѕСЃР»Рµ РѕС‚РїСЂР°РІРєРё С„РѕСЂРјС‹ РґР°РЅРЅС‹Рµ РїРѕСЏРІСЏС‚СЃСЏ Р·РґРµСЃСЊ Рё РІ РєРѕРЅСЃРѕР»Рё Storybook.
        </p>
      )}

      <ProfilePage
        authenticated={authenticated}
        isManager={isManager}
        initialValues={currentInitialValues}
        onLogin={handleLogin}
        onSubmitProfile={handleSubmitProfile}
        onSubmitEmail={handleSubmitEmail}
        onSendEmailVerification={handleSendEmailVerification}
        onValidation={handleValidation}
      />
      <Toaster />
    </div>
  );
}

const meta: Meta<ProfilePageStoryArgs> = {
  title: "Р¤РѕСЂРјС‹/Р¤РѕСЂРјР° РїСЂРѕС„РёР»СЏ",
  parameters: {
    layout: "centered",
  },
  args: {
    authenticated: true,
    isManager: true,
    shouldFail: false,
    initialValues: {
      firstName: "РРІР°РЅ",
      lastName: "РРІР°РЅРѕРІ",
      displayName: "РРІР°РЅ Р.",
      email: "ivan@example.com",
      emailVerified: false,
    },
  },
  argTypes: {
    authenticated: {
      control: "inline-radio",
      options: [true, false, null],
    },
    isManager: {
      control: "boolean",
    },
    shouldFail: {
      control: "boolean",
    },
    initialValues: {
      control: "object",
    },
  },
};

export default meta;

type Story = StoryObj<ProfilePageStoryArgs>;

export const Interactive: Story = {
  name: "РРЅС‚РµСЂР°РєС‚РёРІРЅР°СЏ С„РѕСЂРјР°",
  render: (args) => <ProfilePageDemo {...args} />,
};




