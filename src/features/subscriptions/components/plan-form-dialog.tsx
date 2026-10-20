import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { useSubscriptionActions } from "../hooks/use-subscription-actions";
import {
  Dialog,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppTranslate } from "@/hooks";
import type { PlansRowItem } from "../hooks/use-plans-list";

interface PlanFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPlan?: PlansRowItem | null;
  onSuccess?: () => void;
}

function PlanFormContent({
  initialPlan,
  onClose,
  onSuccess,
}: {
  initialPlan?: PlansRowItem | null;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const { t } = useAppTranslate();
  const isEdit = Boolean(initialPlan);

  const [name, setName] = useState(initialPlan?.name ?? "");
  const [displayName, setDisplayName] = useState(
    initialPlan?.display_name ?? "",
  );
  const [description, setDescription] = useState(
    initialPlan?.description ?? "",
  );
  const [durationDays, setDurationDays] = useState(
    String(initialPlan?.duration_days ?? 30),
  );

  const baseMicro =
    (initialPlan as unknown as { base_price_usdmicro?: number })
      ?.base_price_usdmicro ?? 0;
  const discMicro =
    (initialPlan as unknown as { discounted_price_usdmicro?: number })
      ?.discounted_price_usdmicro ?? 0;

  const [basePriceUsd, setBasePriceUsd] = useState(
    String(baseMicro / 1_000_000),
  );
  const [discountedPriceUsd, setDiscountedPriceUsd] = useState(
    String(discMicro / 1_000_000),
  );
  const [giftAmountUsd, setGiftAmountUsd] = useState(
    String((initialPlan?.balance_gift_amount_usdmicro ?? 0) / 1_000_000),
  );
  const [scopesStr, setScopesStr] = useState(
    initialPlan?.scopes ? Array.from(initialPlan.scopes).join(", ") : "",
  );
  const [allowedModelsStr, setAllowedModelsStr] = useState(
    initialPlan?.allowed_models
      ? Array.from(initialPlan.allowed_models).join(", ")
      : "",
  );
  const [isActive, setIsActive] = useState(initialPlan?.is_active ?? true);
  const [isRecommended, setIsRecommended] = useState(
    initialPlan?.is_recommended ?? false,
  );
  const [isDefault, setIsDefault] = useState(initialPlan?.is_default ?? false);

  const { createPlan, updatePlan, isCreatingPlan, isUpdatingPlan } =
    useSubscriptionActions();
  const isSubmitting = isCreatingPlan || isUpdatingPlan;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedBaseMicro = Math.round(
      (parseFloat(basePriceUsd) || 0) * 1_000_000,
    );
    const parsedDiscMicro = Math.round(
      (parseFloat(discountedPriceUsd) || 0) * 1_000_000,
    );
    const parsedGiftMicro = Math.round(
      (parseFloat(giftAmountUsd) || 0) * 1_000_000,
    );

    const scopes = scopesStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const allowedModels = allowedModelsStr
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);

    try {
      if (isEdit && initialPlan) {
        await updatePlan({
          planUuid: initialPlan.uuid,
          body: {
            display_name: displayName.trim() || undefined,
            description: description.trim() || undefined,
            is_active: isActive,
            is_recommended: isRecommended,
            is_default: isDefault,
            base_price_usdmicro: parsedBaseMicro,
            discounted_price_usdmicro: parsedDiscMicro,
            balance_gift_amount_usdmicro: parsedGiftMicro,
            scopes,
            allowed_models: allowedModels,
          },
        });
      } else {
        await createPlan({
          name: name.trim(),
          display_name: displayName.trim() || undefined,
          description: description.trim() || undefined,
          duration_days: parseInt(durationDays, 10) || 30,
          base_price_usdmicro: parsedBaseMicro,
          discounted_price_usdmicro: parsedDiscMicro,
          balance_gift_amount_usdmicro: parsedGiftMicro,
          scopes,
          allowed_models: allowedModels,
          is_active: isActive,
          is_recommended: isRecommended,
          is_default: isDefault,
        });
      }
      onClose();
      onSuccess?.();
    } catch {
      // toast is handled in hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-foreground text-xs font-semibold">
            {t("features.subscriptions.plans.fields.name", {
              defaultValue: "نام سیستمی پلن",
            })}{" "}
            <span className="text-destructive">*</span>
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isEdit}
            placeholder="pro-monthly"
            dir="ltr"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-foreground text-xs font-semibold">
            {t("features.subscriptions.plans.fields.displayName", {
              defaultValue: "نام نمایشی پلن",
            })}
          </label>
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="پلن حرفه‌ای ماهانه"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-foreground text-xs font-semibold">
          {t("features.subscriptions.plans.fields.description", {
            defaultValue: "توضیحات پلن",
          })}
        </label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="دسترسی نامحدود به مدل‌های پیشرفته..."
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-foreground text-xs font-semibold">
            {t("features.subscriptions.plans.fields.durationDays", {
              defaultValue: "مدت اعتبار (روز)",
            })}{" "}
            <span className="text-destructive">*</span>
          </label>
          <Input
            type="number"
            min={1}
            value={durationDays}
            onChange={(e) => setDurationDays(e.target.value)}
            disabled={isEdit}
            dir="ltr"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-foreground text-xs font-semibold">
            {t("features.subscriptions.plans.fields.giftAmountUsd", {
              defaultValue: "مبلغ هدیه کیف پول (دلار)",
            })}
          </label>
          <Input
            type="number"
            step="0.01"
            min={0}
            value={giftAmountUsd}
            onChange={(e) => setGiftAmountUsd(e.target.value)}
            dir="ltr"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-foreground text-xs font-semibold">
            {t("features.subscriptions.plans.fields.basePriceUsd", {
              defaultValue: "قیمت پایه (دلار)",
            })}
          </label>
          <Input
            type="number"
            step="0.01"
            min={0}
            value={basePriceUsd}
            onChange={(e) => setBasePriceUsd(e.target.value)}
            dir="ltr"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-foreground text-xs font-semibold">
            {t("features.subscriptions.plans.fields.discountedPriceUsd", {
              defaultValue: "قیمت با تخفیف (دلار)",
            })}
          </label>
          <Input
            type="number"
            step="0.01"
            min={0}
            value={discountedPriceUsd}
            onChange={(e) => setDiscountedPriceUsd(e.target.value)}
            dir="ltr"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-foreground text-xs font-semibold">
          {t("features.subscriptions.plans.fields.scopes", {
            defaultValue: "دسترسی‌ها (با کاما جدا کنید)",
          })}
        </label>
        <Input
          value={scopesStr}
          onChange={(e) => setScopesStr(e.target.value)}
          placeholder="ai:chat, ai:image"
          dir="ltr"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-foreground text-xs font-semibold">
          {t("features.subscriptions.plans.fields.allowedModels", {
            defaultValue: "مدل‌های مجاز (با کاما جدا کنید)",
          })}
        </label>
        <Input
          value={allowedModelsStr}
          onChange={(e) => setAllowedModelsStr(e.target.value)}
          placeholder="gpt-4o, claude-3-5-sonnet"
          dir="ltr"
        />
      </div>

      <div className="space-y-2 pt-2">
        <div className="flex flex-wrap gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="text-primary focus:ring-primary size-4 rounded"
            />
            <span>
              {t("features.subscriptions.plans.fields.isActive", {
                defaultValue: "پلن فعال و قابل خرید باشد",
              })}
            </span>
          </label>

          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium">
            <input
              type="checkbox"
              checked={isRecommended}
              onChange={(e) => setIsRecommended(e.target.checked)}
              className="text-primary focus:ring-primary size-4 rounded"
            />
            <span>
              {t("features.subscriptions.plans.fields.isRecommended", {
                defaultValue: "پیشنهاد ویژه (Recommended)",
              })}
            </span>
          </label>

          {isEdit && (
            <label className="flex cursor-pointer items-center gap-2 text-xs font-medium">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="text-primary focus:ring-primary size-4 rounded"
              />
              <span>
                {t("features.subscriptions.plans.fields.isDefault", {
                  defaultValue: "پلن پیش‌فرض",
                })}
              </span>
            </label>
          )}
        </div>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
          className="cursor-pointer"
        >
          {t("common.cancel", { defaultValue: "انصراف" })}
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !name.trim()}
          className="cursor-pointer gap-2"
        >
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {isEdit
            ? t("common.save", { defaultValue: "ذخیره تغییرات" })
            : t("features.subscriptions.plans.createSubmit", {
                defaultValue: "ایجاد پلن",
              })}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function PlanFormDialog({
  open,
  onOpenChange,
  initialPlan,
  onSuccess,
}: PlanFormDialogProps) {
  const { t } = useAppTranslate();
  const isEdit = Boolean(initialPlan);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup className="max-h-[90vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary size-5" />
            <DialogTitle>
              {isEdit
                ? t("features.subscriptions.plans.editTitle", {
                    defaultValue: "ویرایش پلن اشتراک",
                  })
                : t("features.subscriptions.plans.createTitle", {
                    defaultValue: "ایجاد پلن اشتراک جدید",
                  })}
            </DialogTitle>
          </div>
          <DialogDescription>
            {isEdit
              ? t("features.subscriptions.plans.editDesc", {
                  defaultValue: "مشخصات و قیمت پلن اشتراک را به‌روزرسانی کنید.",
                })
              : t("features.subscriptions.plans.createDesc", {
                  defaultValue:
                    "پلن اشتراک جدید برای دسترسی کاربران به خدمات تعریف کنید.",
                })}
          </DialogDescription>
        </DialogHeader>

        {open && (
          <PlanFormContent
            key={initialPlan ? initialPlan.uuid : "create"}
            initialPlan={initialPlan}
            onClose={() => onOpenChange(false)}
            onSuccess={onSuccess}
          />
        )}
      </DialogPopup>
    </Dialog>
  );
}
