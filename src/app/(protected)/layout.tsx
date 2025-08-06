import RedirectButton from "@/components/RedirectButton";
import ThemeSwitcher from "@/components/shared/ThemeSwitcher";
import React from "react";

async function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3 flex-wrap gap-2">
          <div className="flex-1">
            <RedirectButton />
          </div>

          <div className="flex items-center gap-3">
            <ThemeSwitcher />
          </div>
        </div>
      </header>
      {children}
    </>
  );
}

export default layout;
