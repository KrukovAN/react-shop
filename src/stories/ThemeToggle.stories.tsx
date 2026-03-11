import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ThemeProvider,
  type Theme,
  useTheme,
} from "@/components/providers/theme-provider";
import { ThemeToggle } from "@/widgets/theme-toggle";

const themeLabels: Record<Theme, string> = {
  system: "РЎРёСЃС‚РµРјР°",
  light: "РЎРІРµС‚Р»Р°СЏ",
  dark: "РўРµРјРЅР°СЏ",
};

function ThemeTogglePreview() {
  const { theme, resolvedTheme } = useTheme();

  return (
    <div className="flex w-full max-w-sm flex-col gap-4 rounded-3xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-card-foreground">
            Р¦РІРµС‚РѕРІР°СЏ СЃС…РµРјР°
          </p>
          <p className="text-sm text-muted-foreground">
            РўРµРјР°: {themeLabels[theme]} / РђРєС‚РёРІРЅР°: {themeLabels[resolvedTheme]}
          </p>
        </div>
        <ThemeToggle />
      </div>

      <div className="rounded-2xl border bg-background p-4 text-sm text-muted-foreground">
        РћС‚РєСЂРѕР№С‚Рµ РјРµРЅСЋ Рё РїРµСЂРµРєР»СЋС‡Р°Р№С‚РµСЃСЊ РјРµР¶РґСѓ СЃРёСЃС‚РµРјРЅРѕР№, СЃРІРµС‚Р»РѕР№ Рё С‚РµРјРЅРѕР№ С‚РµРјР°РјРё.
      </div>
    </div>
  );
}

const meta: Meta<typeof ThemeToggle> = {
  title: "РќР°СЃС‚СЂРѕР№РєРё/РџРµСЂРµРєР»СЋС‡Р°С‚РµР»СЊ С‚РµРјС‹",
  component: ThemeToggle,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const Default: Story = {
  name: "Р”РµРјРѕ",
  render: () => (
    <ThemeProvider storageKey="react-shop-theme-toggle-story-theme">
      <ThemeTogglePreview />
    </ThemeProvider>
  ),
};




