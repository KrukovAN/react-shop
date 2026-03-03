import * as React from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = Exclude<Theme, "system">;

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
};

const THEME_STORAGE_KEY = "react-shop-theme";
const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined,
);

function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

function getSystemTheme(): ResolvedTheme {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
}

function readInitialTheme(defaultTheme: Theme, storageKey: string): Theme {
  if (typeof window === "undefined") {
    return defaultTheme;
  }

  const storedTheme = window.localStorage.getItem(storageKey);

  return isTheme(storedTheme) ? storedTheme : defaultTheme;
}

function applyResolvedTheme(theme: ResolvedTheme) {
  if (typeof document === "undefined") {
    return;
  }

  const isDark = theme === "dark";

  document.documentElement.classList.toggle("dark", isDark);
  document.body.classList.toggle("dark", isDark);
  document.documentElement.style.colorScheme = theme;
}

function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = THEME_STORAGE_KEY,
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(() =>
    readInitialTheme(defaultTheme, storageKey),
  );
  const [systemTheme, setSystemTheme] =
    React.useState<ResolvedTheme>(getSystemTheme);

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateSystemTheme = () => {
      setSystemTheme(mediaQuery.matches ? "dark" : "light");
    };

    updateSystemTheme();
    mediaQuery.addEventListener("change", updateSystemTheme);

    return () => {
      mediaQuery.removeEventListener("change", updateSystemTheme);
    };
  }, []);

  const resolvedTheme = theme === "system" ? systemTheme : theme;

  React.useEffect(() => {
    applyResolvedTheme(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = (nextTheme: Theme) => {
    setThemeState(nextTheme);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, nextTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context = React.useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider.");
  }

  return context;
}

export { ThemeProvider, useTheme };
export type { Theme, ResolvedTheme, ThemeContextValue, ThemeProviderProps };
