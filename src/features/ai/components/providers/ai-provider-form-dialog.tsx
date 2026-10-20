import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useAiProviderActions } from "../../hooks/use-ai-provider-actions";
import { useAppTranslate } from "@/hooks";
import type {
  AiRegistryProviderNameEnum,
  ProvidersRow,
} from "../../model/types";

interface AiProviderFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialProvider?: ProvidersRow | null;
  onSuccess?: () => void;
}

const PROVIDER_NAMES: AiRegistryProviderNameEnum[] = [
  "OPENAI",
  "GOOGLE",
  "OPENROUTER",
  "RUNWARE",
  "AIMLAPI",
  "KIE",
];

function AiProviderFormContent({
  initialProvider,
  onClose,
  onSuccess,
}: {
  initialProvider?: ProvidersRow | null;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const { t } = useAppTranslate();
  const {
    createProvider,
    updateProvider,
    isCreatingProvider,
    isUpdatingProvider,
  } = useAiProviderActions();

  const isEditing = Boolean(initialProvider);
  const isSubmitting = isCreatingProvider || isUpdatingProvider;

  const [name, setName] = useState<AiRegistryProviderNameEnum>(() => {
    const pName = initialProvider?.name as AiRegistryProviderNameEnum;
    return PROVIDER_NAMES.includes(pName) ? pName : "OPENAI";
  });
  const [displayName, setDisplayName] = useState(
    initialProvider?.display_name || "",
  );
  const [baseApiUrl, setBaseApiUrl] = useState(
    (initialProvider as unknown as { base_api_url?: string })?.base_api_url ||
      "",
  );
  const [apiKey, setApiKey] = useState("");
  const [rateLimitPerMin, setRateLimitPerMin] = useState(
    String(
      (initialProvider as unknown as { rate_limit_per_min?: number })
        ?.rate_limit_per_min ?? 60,
    ),
  );
  const [costToUsdmicro, setCostToUsdmicro] = useState(
    String(
      (initialProvider as unknown as { cost_to_usdmicro?: number })
        ?.cost_to_usdmicro ?? 0,
    ),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing && initialProvider) {
        await updateProvider(initialProvider.uuid, {
          display_name: displayName || undefined,
          base_api_url: baseApiUrl || undefined,
          api_key: apiKey || undefined,
          rate_limit_per_min: rateLimitPerMin
            ? Number(rateLimitPerMin)
            : undefined,
          cost_to_usdmicro: costToUsdmicro ? Number(costToUsdmicro) : undefined,
        });
      } else {
        await createProvider({
          name,
          display_name: displayName || undefined,
          base_api_url: baseApiUrl || undefined,
          api_key: apiKey || undefined,
          rate_limit_per_min: rateLimitPerMin
            ? Number(rateLimitPerMin)
            : undefined,
          cost_to_usdmicro: costToUsdmicro ? Number(costToUsdmicro) : undefined,
        });
      }
      onClose();
      onSuccess?.();
    } catch {
      // toast handled in hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2 text-sm">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-foreground mb-1 block text-xs font-semibold">
            {t("features.ai.providers.name", {
              defaultValue: "نوع سرویس‌دهنده",
            })}
          </label>
          <Select
            value={name}
            onChange={(e) =>
              setName(e.target.value as AiRegistryProviderNameEnum)
            }
            disabled={isEditing}
          >
            {PROVIDER_NAMES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="text-foreground mb-1 block text-xs font-semibold">
            {t("features.ai.providers.displayName", {
              defaultValue: "نام نمایشی",
            })}
          </label>
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="OpenAI Main Gateway"
          />
        </div>
      </div>

      <div>
        <label className="text-foreground mb-1 block text-xs font-semibold">
          {t("features.ai.providers.baseApiUrl", {
            defaultValue: "آدرس Base API URL (اختیاری)",
          })}
        </label>
        <Input
          value={baseApiUrl}
          onChange={(e) => setBaseApiUrl(e.target.value)}
          placeholder="https://api.openai.com/v1"
          dir="ltr"
        />
      </div>

      <div>
        <label className="text-foreground mb-1 block text-xs font-semibold">
          {t("features.ai.providers.apiKey", {
            defaultValue: isEditing
              ? "کلید دسترسی (API Key) جدید (برای حفظ قبلی خالی بگذارید)"
              : "کلید دسترسی (API Key)",
          })}
        </label>
        <Input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-..."
          dir="ltr"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-foreground mb-1 block text-xs font-semibold">
            {t("features.ai.providers.rateLimit", {
              defaultValue: "سقف درخواست در دقیقه (Rate Limit)",
            })}
          </label>
          <Input
            type="number"
            value={rateLimitPerMin}
            onChange={(e) => setRateLimitPerMin(e.target.value)}
            placeholder="60"
            min={1}
          />
        </div>

        <div>
          <label className="text-foreground mb-1 block text-xs font-semibold">
            {t("features.ai.providers.costMicro", {
              defaultValue: "هزینه به میکرو دلار (USD Micro)",
            })}
          </label>
          <Input
            type="number"
            value={costToUsdmicro}
            onChange={(e) => setCostToUsdmicro(e.target.value)}
            placeholder="0"
            min={0}
          />
        </div>
      </div>

      <DialogFooter className="gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          {t("common.cancel", { defaultValue: "انصراف" })}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? t("common.submitting", { defaultValue: "در حال ثبت..." })
            : isEditing
              ? t("common.update", { defaultValue: "بروزرسانی" })
              : t("common.create", { defaultValue: "افزودن" })}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function AiProviderFormDialog({
  open,
  onOpenChange,
  initialProvider,
  onSuccess,
}: AiProviderFormDialogProps) {
  const { t } = useAppTranslate();
  const isEditing = Boolean(initialProvider);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? t("features.ai.providers.editTitle", {
                  defaultValue: "ویرایش ارائه‌دهنده هوش مصنوعی",
                })
              : t("features.ai.providers.createTitle", {
                  defaultValue: "افزودن ارائه‌دهنده جدید",
                })}
          </DialogTitle>
          <DialogDescription>
            {t("features.ai.providers.formDesc", {
              defaultValue:
                "تنظیمات اتصال به ارائه‌دهنده، کلید API و سقف درخواست‌ها را مشخص کنید.",
            })}
          </DialogDescription>
        </DialogHeader>

        {open && (
          <AiProviderFormContent
            key={initialProvider ? initialProvider.uuid : "create"}
            initialProvider={initialProvider}
            onClose={() => onOpenChange(false)}
            onSuccess={onSuccess}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
