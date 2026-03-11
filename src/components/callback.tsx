import * as React from "react";

const REDIRECT_KEY = "post-login-redirect";

type CallbackProps = {
  setAuth: (authenticated: boolean | null) => void;
  userManager: {
    signinRedirectCallback: () => Promise<unknown>;
  };
};

function Callback({ setAuth, userManager }: CallbackProps) {
  React.useEffect(() => {
    let active = true;

    async function handleCallback() {
      try {
        const user = await userManager.signinRedirectCallback();

        if (!active) {
          return;
        }

        setAuth(Boolean(user));

        const target = sessionStorage.getItem(REDIRECT_KEY) || "/";
        sessionStorage.removeItem(REDIRECT_KEY);
        window.location.replace(target);
      } catch (error) {
        console.error("Callback error", error);

        if (!active) {
          return;
        }

        setAuth(false);
        window.location.replace("/");
      }
    }

    void handleCallback();

    return () => {
      active = false;
    };
  }, [setAuth, userManager]);

  return null;
}

export { Callback };




