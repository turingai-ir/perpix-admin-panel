import { useState } from "react";
import { NavLink, Outlet } from "react-router";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  ShieldCheck,
  X,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { signOut } from "@/features/auth/session";
import { Button } from "@/components/ui/button";
import { useAppTranslate } from "@/hooks";
import { APP_ROUTES_KEY } from "@/router/routes";

const items = [
  {
    path: APP_ROUTES_KEY.overview.path,
    label: "overview.title",
    icon: LayoutDashboard,
  },
  {
    path: APP_ROUTES_KEY.smsTest.path,
    label: "smsTest.title",
    icon: MessageSquareText,
  },
] as const;

export function AdminLayout() {
  const { t } = useAppTranslate();
  const [open, setOpen] = useState(false);
  const logout = useMutation({ mutationFn: signOut, networkMode: "always" });
  return (
    <div dir="rtl" className="bg-muted/30 text-foreground min-h-svh lg:flex">
      <header className="border-border bg-card flex items-center justify-between border-b p-4 lg:hidden">
        <span className="font-bold">{t("overview.brand")}</span>
        <Button
          variant="outline"
          size="icon"
          aria-label={t("navigation.toggle")}
          aria-expanded={open}
          aria-controls="admin-sidebar"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </header>
      <aside
        id="admin-sidebar"
        className={`border-border bg-card top-0 flex-col border-b p-5 lg:sticky lg:flex lg:h-svh lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-l ${open ? "flex" : "hidden"}`}
      >
        <div className="mb-9 flex items-center gap-3">
          <span className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-xl">
            <ShieldCheck aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="font-bold">{t("overview.brand")}</p>
            <p className="text-muted-foreground mt-1 text-xs">
              {t("overview.admin")}
            </p>
          </div>
        </div>
        <p className="text-muted-foreground mb-3 px-3 text-xs">
          {t("navigation.menu")}
        </p>
        <nav aria-label={t("navigation.main")} className="space-y-2">
          {items.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${isActive ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`
              }
            >
              <Icon aria-hidden="true" className="size-5" />
              {t(label)}
            </NavLink>
          ))}
        </nav>
        <div className="border-border mt-6 border-t pt-4 lg:mt-auto">
          <Button
            variant="ghost"
            className="w-full justify-start"
            disabled={logout.isPending}
            onClick={() => logout.mutate()}
          >
            <LogOut aria-hidden="true" />
            {t("overview.logout")}
          </Button>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
