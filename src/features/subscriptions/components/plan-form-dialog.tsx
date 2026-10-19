import { useEffect, useState } from "react";
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

export function PlanFormDialog({
  open,
  onOpenChange,
  initialPlan,
  onSuccess,
}: PlanFormDialogProps) {
  const { t } = useAppTranslate();
  const isEdit = Boolean(initialPlan);

  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [durationDays, setDurationDays] = useState("30");
  const [basePriceUsd, setBasePriceUsd] = useState("0");
  const [discountedPriceUsd, setDiscountedPriceUsd] = useState("0");
  const [giftAmountUsd, setGiftAmountUsd] = useState("0");
  const [scopesStr, setScopesStr] = useState("");
  const [allowedModelsStr, setAllowedModelsStr] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isRecommended, setIsRecommended] = useState(false);
  const [isDefault, setIsDefault] = useState(false);

  const { createPlan, updatePlan, isCreatingPlan, isUpdatingPlan } =
    useSubscriptionActions();
  const isSubmitting = isCreatingPlan || isUpdatingPlan;

  useEffect(() => {
    if (initialPlan) {
      setName(initialPlan.name);
      setDisplayName(initialPlan.display_name || "");
      setDescription(initialPlan.description || "");
      setDurationDays(String(initialPlan.duration_days ?? 30));
      // Prices in PlansRow are base_price_irr or in usdmicro
      const baseMicro =
        (initialPlan as unknown as { base_price_usdmicro?: number })
          .base_price_usdmicro ?? 0;
      const discMicro =
        (initialPlan as unknown as { discounted_price_usdmicro?: number })
          .discounted_price_usdmicro ?? 0;
      setBasePriceUsd(String(baseMicro / 1_000_000));
      setDiscountedPriceUsd(String(discMicro / 1_000_000));
      setGiftAmountUsd(
        String((initialPlan.balance_gift_amount_usdmicro ?? 0) / 1_000_000),
      );
      setScopesStr(
        initialPlan.scopes ? Array.from(initialPlan.scopes).join(", ") : "",
      );
      setAllowedModelsStr(
        initialPlan.allowed_models
          ? Array.from(initialPlan.allowed_models).join(", ")
          : "",
      );
      setIsActive(initialPlan.is_active);
      setIsRecommended(initialPlan.is_recommended);
      setIsDefault(initialPlan.is_default);
    } else {
      setName("");
      setDisplayName("");
      setDescription("");
      setDurationDays("30");
      setBasePriceUsd("0");
      setDiscountedPriceUsd("0");
      setGiftAmountUsd("0");
      setScopesStr("");
      setAllowedModelsStr("");
      setIsActive(true);
      setIsRecommended(false);
      setIsDefault(false);
    }
  }, [initialPlan, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const baseMicro = Math.round((parseFloat(basePriceUsd) || 0) * 1_000_000);
    const discMicro = Math.round(
      (parseFloat(discountedPriceUsd) || 0) * 1_000_000,
    );
    const giftMicro = Math.round((parseFloat(giftAmountUsd) || 0) * 1_000_000);
    const duration = parseInt(durationDays, 10) || 30;

    const scopes = scopesStr
      .split(/[,،\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const allowedModels = allowedModelsStr
      .split(/[,،\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      if (isEdit && initialPlan) {
        await updatePlan({
          planUuid: initialPlan.uuid,
          body: {
            name: name.trim(),
            display_name: displayName.trim() || null,
            description: description.trim() || null,
            duration_days: duration,
            base_price_usdmicro: baseMicro,
            discounted_price_usdmicro: discMicro,
            balance_gift_amount_usdmicro: giftMicro,
            scopes,
            allowed_models: allowedModels,
            is_active: isActive,
            is_recommended: isRecommended,
            is_default: isDefault,
          },
        });
      } else {
        await createPlan({
          name: name.trim(),
          display_name: displayName.trim() || null,
          description: description.trim() || null,
          duration_days: duration,
          base_price_usdmicro: baseMicro,
          discounted_price_usdmicro: discMicro,
          balance_gift_amount_usdmicro: giftMicro,
          scopes,
          allowed_models: allowedModels,
          is_active: isActive,
          is_recommended: isRecommended,
          is_default: isDefault,
        });
      }
      onOpenChange(false);
      onSuccess?.();
    } catch {
      // toast is handled in hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup className="max-h-[90vh] max-w-xl overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="text-primary size-5" />
              <DialogTitle>
                {isEdit
                  ? t("features.subscriptions.plans.editTitle", {
                      defaultValue: "ویرایش پلن اشتراکی",
                    })
                  : t("features.subscriptions.plans.createTitle", {
                      defaultValue: "ایجاد پلن اشتراکی جدید",
                    })}
              </DialogTitle>
            </div>
            <DialogDescription>
              {t("features.subscriptions.plans.formDescription", {
                defaultValue:
                  "مشخصات، قیمت‌ها، مدت زمان اعتبار و دسترسی‌های این پلن را تعیین کنید.",
              })}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 text-sm">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label
                  htmlFor="plan-name"
                  className="text-foreground text-xs font-medium"
                >
                  {t("features.subscriptions.plans.fields.name", {
                    defaultValue: "شناسه انگلیسی (slug):",
                  })}
                </label>
                <Input
                  id="plan-name"
                  placeholder="مثال: pro-monthly"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  dir="ltr"
                  className="font-mono text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="plan-display-name"
                  className="text-foreground text-xs font-medium"
                >
                  {t("features.subscriptions.plans.fields.displayName", {
                    defaultValue: "عنوان نمایشی فارسی:",
                  })}
                </label>
                <Input
                  id="plan-display-name"
                  placeholder="مثال: پلن حرفه‌ای ماهانه"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="plan-description"
                className="text-foreground text-xs font-medium"
              >
                {t("features.subscriptions.plans.fields.description", {
                  defaultValue: "توضیحات پلن:",
                })}
              </label>
              <Input
                id="plan-description"
                placeholder="توضیح کوتاه درباره ویژگی‌ها..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="plan-duration"
                  className="text-foreground text-xs font-medium"
                >
                  {t("features.subscriptions.plans.fields.duration", {
                    defaultValue: "مدت اعتبار (روز):",
                  })}
                </label>
                <Input
                  id="plan-duration"
                  type="number"
                  min="1"
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  className="font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="plan-base-price"
                  className="text-foreground text-xs font-medium"
                >
                  {t("features.subscriptions.plans.fields.basePrice", {
                    defaultValue: "قیمت پایه ($):",
                  })}
                </label>
                <Input
                  id="plan-base-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={basePriceUsd}
                  onChange={(e) => setBasePriceUsd(e.target.value)}
                  dir="ltr"
                  className="font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="plan-disc-price"
                  className="text-foreground text-xs font-medium"
                >
                  {t("features.subscriptions.plans.fields.discountedPrice", {
                    defaultValue: "قیمت تخفیف‌خورده ($):",
                  })}
                </label>
                <Input
                  id="plan-disc-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={discountedPriceUsd}
                  onChange={(e) => setDiscountedPriceUsd(e.target.value)}
                  dir="ltr"
                  className="font-mono"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="plan-gift"
                className="text-foreground text-xs font-medium"
              >
                {t("features.subscriptions.plans.fields.giftAmount", {
                  defaultValue: "اعتبار هدیه کیف پول دلاری ($):",
                })}
              </label>
              <Input
                id="plan-gift"
                type="number"
                min="0"
                step="0.01"
                value={giftAmountUsd}
                onChange={(e) => setGiftAmountUsd(e.target.value)}
                dir="ltr"
                className="font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="plan-scopes"
                className="text-foreground text-xs font-medium"
              >
                {t("features.subscriptions.plans.fields.scopes", {
                  defaultValue: "دسترسی‌ها و مجوزها (با کاما جدا کنید):",
                })}
              </label>
              <Input
                id="plan-scopes"
                placeholder="text_to_image, text_to_video, chat"
                value={scopesStr}
                onChange={(e) => setScopesStr(e.target.value)}
                dir="ltr"
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="plan-models"
                className="text-foreground text-xs font-medium"
              >
                {t("features.subscriptions.plans.fields.models", {
                  defaultValue: "مدل‌های مجاز (با کاما جدا کنید):",
                })}
              </label>
              <Input
                id="plan-models"
                placeholder="gemini-1.5-pro, dall-e-3, flux-schnell"
                value={allowedModelsStr}
                onChange={(e) => setAllowedModelsStr(e.target.value)}
                dir="ltr"
                className="font-mono text-xs"
              />
            </div>

            <div className="border-border flex flex-wrap gap-6 border-t pt-2">
              <label className="flex cursor-pointer items-center gap-2 text-xs font-medium">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="text-primary focus:ring-primary size-4 rounded"
                />
                <span>
                  {t("features.subscriptions.plans.fields.isActive", {
                    defaultValue: "پلن فعال است",
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
              onClick={() => onOpenChange(false)}
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
      </DialogPopup>
    </Dialog>
  );
}
