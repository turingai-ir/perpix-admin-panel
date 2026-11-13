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
import { useAiProviderDetail } from "../../hooks/use-ai-provider-detail";
import { parseJsonObject, stringifyJsonObject } from "../../model/json-object";
import { JsonObjectField } from "../json-object-field";
import { useAppTranslate } from "@/hooks";
import type {
  AiRegistryProviderDetail,
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
  initialProvider?: AiRegistryProviderDetail | null;
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
    initialProvider?.base_api_url ?? "",
  );
  const [apiKey, setApiKey] = useState("");
  const [metaText, setMetaText] = useState(
    stringifyJsonObject(initialProvider?.meta),
  );
  const [rateLimitPerMin, setRateLimitPerMin] = useState(
    String(initialProvider?.rate_limit_per_min ?? 60),
  );
  const [costToUsdmicro, setCostToUsdmicro] = useState(
    String(initialProvider?.cost_to_usdmicro ?? 0),
  );

  const meta = parseJsonObject(metaText);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meta.ok) return;

    const displayNameValue = displayName.trim();
    const baseApiUrlValue = baseApiUrl.trim();
    const rateLimitValue = rateLimitPerMin.trim();
    const costValue = costToUsdmicro.trim();

    try {
      if (isEditing && initialProvider) {
        // Edit sends every field, so a cleared one is cleared (null), not left as it was.
        // The key is the exception: blank keeps the stored one.
        await updateProvider(initialProvider.uuid, {
          display_name: displayNameValue || null,
          base_api_url: baseApiUrlValue || null,
          ...(apiKey ? { api_key: apiKey } : {}),
          rate_limit_per_min: rateLimitValue ? Number(rateLimitValue) : null,
          cost_to_usdmicro: costValue ? Number(costValue) : null,
          meta: meta.value,
        });
      } else {
        await createProvider({
          name,
          display_name: displayNameValue || undefined,
          base_api_url: baseApiUrlValue || undefined,
          api_key: apiKey || undefined,
          rate_limit_per_min: rateLimitValue
            ? Number(rateLimitValue)
            : undefined,
          cost_to_usdmicro: costValue ? Number(costValue) : undefined,
          meta: meta.value,
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
        {isEditing && (
          <span
            className={
              initialProvider?.has_api_key
                ? "mb-1 block text-[11px] text-emerald-600"
                : "text-destructive mb-1 block text-[11px]"
            }
          >
            {initialProvider?.has_api_key
              ? "یک کلید ثبت شده است (مقدارش نمایش داده نمی‌شود)."
              : "هیچ کلیدی ثبت نشده است؛ درخواست به این ارائه‌دهنده کار نمی‌کند."}
          </span>
        )}
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

      <details className="rounded-lg border p-3">
        <summary className="cursor-pointer text-xs font-semibold">
          تنظیمات پیشرفته (meta)
        </summary>
        <div className="pt-3">
          <JsonObjectField
            id="provider-meta"
            label="meta (JSON)"
            hint="داده‌های اضافی ارائه‌دهنده؛ خالی یعنی {}."
            value={metaText}
            onChange={setMetaText}
            rows={6}
          />
        </div>
      </details>

      <DialogFooter className="gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          {t("common.cancel", { defaultValue: "انصراف" })}
        </Button>
        <Button type="submit" disabled={isSubmitting || !meta.ok}>
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
  // Edit from the full record, never from the list's summary row.
  const { provider, error } = useAiProviderDetail(
    open && initialProvider ? initialProvider.uuid : "",
  );

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

        {open && !isEditing && (
          <AiProviderFormContent
            key="create"
            onClose={() => onOpenChange(false)}
            onSuccess={onSuccess}
          />
        )}
        {open && isEditing && provider && (
          <AiProviderFormContent
            key={`${provider.uuid}:${provider.updated_at}`}
            initialProvider={provider}
            onClose={() => onOpenChange(false)}
            onSuccess={onSuccess}
          />
        )}
        {open && isEditing && !provider && (
          <p className="text-muted-foreground py-6 text-center text-sm">
            {error
              ? t("features.ai.providers.loadError", {
                  defaultValue:
                    "بارگذاری اطلاعات ارائه‌دهنده ناموفق بود. پنجره را ببندید و دوباره باز کنید.",
                })
              : t("common.loading", { defaultValue: "در حال بارگذاری..." })}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
