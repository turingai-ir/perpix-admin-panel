import { useEffect, useState } from "react";
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

export function AiProviderFormDialog({
  open,
  onOpenChange,
  initialProvider,
  onSuccess,
}: AiProviderFormDialogProps) {
  const { t } = useAppTranslate();
  const {
    createProvider,
    updateProvider,
    isCreatingProvider,
    isUpdatingProvider,
  } = useAiProviderActions();

  const isEditing = Boolean(initialProvider);
  const isSubmitting = isCreatingProvider || isUpdatingProvider;

  const [name, setName] = useState<AiRegistryProviderNameEnum>("OPENAI");
  const [displayName, setDisplayName] = useState("");
  const [baseApiUrl, setBaseApiUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [rateLimitPerMin, setRateLimitPerMin] = useState("60");
  const [costToUsdmicro, setCostToUsdmicro] = useState("0");

  useEffect(() => {
    if (initialProvider) {
      const pName = initialProvider.name as AiRegistryProviderNameEnum;
      if (PROVIDER_NAMES.includes(pName)) {
        setName(pName);
      }
      setDisplayName(initialProvider.display_name || "");
      setApiKey(""); // Don't expose existing API key
      setBaseApiUrl(
        (initialProvider as unknown as { base_api_url?: string })
          .base_api_url || "",
      );
      setRateLimitPerMin(
        String(
          (initialProvider as unknown as { rate_limit_per_min?: number })
            .rate_limit_per_min ?? 60,
        ),
      );
      setCostToUsdmicro(
        String(
          (initialProvider as unknown as { cost_to_usdmicro?: number })
            .cost_to_usdmicro ?? 0,
        ),
      );
    } else {
      setName("OPENAI");
      setDisplayName("");
      setBaseApiUrl("");
      setApiKey("");
      setRateLimitPerMin("60");
      setCostToUsdmicro("0");
    }
  }, [initialProvider, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing && initialProvider) {
        await updateProvider(initialProvider.uuid, {
          display_name: displayName || undefined,
          base_api_url: baseApiUrl || undefined,
          api_key: apiKey ? apiKey : undefined,
          rate_limit_per_min: Number(rateLimitPerMin) || undefined,
          cost_to_usdmicro: Number(costToUsdmicro) || undefined,
        });
      } else {
        await createProvider({
          name,
          display_name: displayName || undefined,
          base_api_url: baseApiUrl || undefined,
          api_key: apiKey || undefined,
          rate_limit_per_min: Number(rateLimitPerMin) || undefined,
          cost_to_usdmicro: Number(costToUsdmicro) || undefined,
        });
      }
      onOpenChange(false);
      onSuccess?.();
    } catch {
      // toast handled in hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
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
                "تنظیمات اتصال، کلید API و محدودیت نرخ درخواست ارائه‌دهنده را وارد کنید.",
            })}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-sm">
          <div>
            <label className="text-foreground mb-1 block text-xs font-semibold">
              {t("features.ai.providers.name", {
                defaultValue: "نوع سرویس ارائه‌دهنده",
              })}{" "}
              *
            </label>
            <Select
              value={name}
              disabled={isEditing}
              onChange={(e) =>
                setName(e.target.value as AiRegistryProviderNameEnum)
              }
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
                defaultValue: "عنوان نمایشی",
              })}
            </label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="OpenAI Production"
            />
          </div>

          <div>
            <label className="text-foreground mb-1 block text-xs font-semibold">
              {t("features.ai.providers.baseApiUrl", {
                defaultValue: "آدرس Base API",
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
                defaultValue: "کلید API (API Key)",
              })}
              {isEditing && " (در صورت عدم تغییر خالی بگذارید)"}
            </label>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              dir="ltr"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-foreground mb-1 block text-xs font-semibold">
                {t("features.ai.providers.rateLimit", {
                  defaultValue: "محدودیت نرخ (بر دقیقه)",
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
                  defaultValue: "هزینه (usdmicro)",
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
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
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
      </DialogContent>
    </Dialog>
  );
}
