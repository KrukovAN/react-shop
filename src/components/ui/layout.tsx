import * as React from "react";
import { cn } from "@/lib/utils";
import { Header } from "./header";

type LayoutProps = React.ComponentProps<"div"> & {
  children: React.ReactNode;
  headerContent?: React.ReactNode;
  contentClassName?: string;
  headerClassName?: string;
  onProfileClick?: () => void;
  onLoginClick?: () => void;
};

function Layout({
  children,
  className,
  headerContent,
  contentClassName,
  headerClassName,
  onProfileClick,
  onLoginClick,
  ...props
}: LayoutProps) {
  return (
    <div
      data-slot="layout"
      className={cn(
        "min-h-screen bg-linear-to-b from-background via-background to-muted/30 text-foreground",
        className,
      )}
      {...props}
    >
      <Header
        className={headerClassName}
        onProfileClick={onProfileClick}
        onLoginClick={onLoginClick}
      >
        {headerContent}
      </Header>

      <main
        data-slot="layout-content"
        className={cn(
          "mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8",
          contentClassName,
        )}
      >
        {children}
      </main>
    </div>
  );
}

export { Layout };
export type { LayoutProps };
