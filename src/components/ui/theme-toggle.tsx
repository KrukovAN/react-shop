import * as React from "react";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme, type Theme } from "@/components/providers/theme-provider";
import { Button } from "./button";

type ThemeToggleProps = Omit<React.ComponentProps<"div">, "children">;

const themeLabels: Record<Theme, string> = {
  system: "Система",
  light: "Светлая",
  dark: "Темная",
};

const themeOptions = [
  {
    label: "Система",
    value: "system" as const,
    icon: Monitor,
  },
  {
    label: "Светлая",
    value: "light" as const,
    icon: Sun,
  },
  {
    label: "Темная",
    value: "dark" as const,
    icon: Moon,
  },
];

function ThemeToggle({ className, ...props }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const CurrentIcon = resolvedTheme === "dark" ? Moon : Sun;

  React.useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleThemeChange = (nextTheme: Theme) => {
    setTheme(nextTheme);
    setOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      data-slot="theme-toggle"
      {...props}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Текущая тема: ${themeLabels[resolvedTheme]}`}
        onClick={() => setOpen((current) => !current)}
      >
        <CurrentIcon />
      </Button>

      {open ? (
        <div
          role="menu"
          aria-label="Параметры темы"
          className="absolute top-full right-0 z-50 mt-2 flex min-w-40 flex-col gap-1 rounded-xl border bg-popover p-1.5 text-popover-foreground shadow-sm"
        >
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const selected = theme === option.value;

            return (
              <button
                key={option.value}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-none"
                onClick={() => handleThemeChange(option.value)}
              >
                <Icon className="size-4" />
                <span>{option.label}</span>
                {selected ? <Check className="ml-auto size-4" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export { ThemeToggle };
export type { ThemeToggleProps };
