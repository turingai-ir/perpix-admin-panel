import { useState } from "react";
import {
  ShieldCheck,
  Moon,
  Sun,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAppTranslate } from "@/hooks";

export default function DashboardPage() {
  const [count, setCount] = useState(0);
  const { t } = useAppTranslate();

  return (
    <div
      className="bg-background text-foreground flex min-h-screen flex-col justify-between"
      dir="rtl"
    >
      <header className="border-border bg-card/60 sticky top-0 z-50 border-b backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 border-primary/20 text-primary flex size-10 items-center justify-center rounded-xl border shadow-sm">
              <LayoutDashboard className="size-5" />
            </div>
            <div>
              <h1 className="text-lg leading-tight font-bold">
                پنل مدیریت پرپیکس
              </h1>
              <p className="text-muted-foreground text-xs">
                PerPix Admin Panel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const isDark =
                  document.documentElement.classList.contains("dark");
                if (isDark) {
                  document.documentElement.classList.remove("dark");
                  localStorage.setItem("theme", "light");
                } else {
                  document.documentElement.classList.add("dark");
                  localStorage.setItem("theme", "dark");
                }
              }}
              title="تغییر تم"
            >
              <Sun className="size-4 dark:hidden" />
              <Moon className="hidden size-4 dark:inline" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-4xl flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        <div className="bg-primary/10 border-primary/20 text-primary mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium">
          <ShieldCheck className="size-4" />
          <span>
            پایه‌ریزی شده با آخرین نسخه Base UI + Shadcn UI + Tailwind v4
          </span>
        </div>

        <h2 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
          خوش آمدید به پنل مدیریت پرپیکس
        </h2>
        <p className="text-muted-foreground mb-8 max-w-xl text-sm leading-relaxed sm:text-base">
          تمامی زیرساخت‌ها، پکیج‌های ترجمه (i18next)، کلاینت OpenAPI، کشینگ
          کوئری با IndexedDB، هوک‌ها و ابزارهای توسعه به طور کامل پیکربندی شدند.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            variant="default"
            size="lg"
            onClick={() => setCount((c) => c + 1)}
          >
            <Sparkles className="size-4" />
            شمارنده: {count}
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() =>
              toast.success("سیستم ترجمه و اعلان‌ها به درستی کار می‌کنند!", {
                description: `کلید تست: ${t("common.download")}`,
              })
            }
          >
            تست ترجمه و نوتیفیکیشن ({t("common.download")})
          </Button>
        </div>
      </main>

      <footer className="border-border text-muted-foreground border-t py-4 text-center text-xs">
        PerPix Admin Panel &copy; {new Date().getFullYear()} — آماده توسعه
      </footer>
    </div>
  );
}
