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
import { useAiModelActions } from "../../hooks/use-ai-model-actions";
import { useAiProvidersList } from "../../hooks/use-ai-providers-list";
import { useAppTranslate } from "@/hooks";
import type { ModelsRow } from "../../model/types";
import { Link2 } from "lucide-react";

interface AiModelProviderLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  model: ModelsRow | null;
  onSuccess?: () => void;
}

export function AiModelProviderLinkDialog({
  open,
  onOpenChange,
  model,
  onSuccess,
}: AiModelProviderLinkDialogProps) {
  const { t } = useAppTranslate();
  const { addProvider, isAddingProvider } = useAiModelActions();
  const { providers, isLoading: isProvidersLoading } = useAiProvidersList({
    limit: 50,
  });

  const [selectedProviderUuid, setSelectedProviderUuid] = useState("");
  const [priority, setPriority] = useState("10");
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!model || !selectedProviderUuid) return;

    try {
      await addProvider(model.uuid, {
        ai_provider_uuid: selectedProviderUuid,
        priority: Number(priority) || 10,
        is_active: isActive,
      });
      onOpenChange(false);
      onSuccess?.();
    } catch {
      // toast handled in hook
    }
  };

  const providerOptions = (providers ? Array.from(providers) : []).map(
    (p: { uuid: string; name: string; display_name?: string | null }) => ({
      value: p.uuid,
      label: `${p.name} (${p.display_name || p.uuid.slice(0, 8)})`,
    }),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="text-primary size-5" />
            {t("features.ai.models.linkProviderTitle", {
              defaultValue: "اتصال ارائه‌دهنده به مدل",
            })}
          </DialogTitle>
          <DialogDescription>
            مدل{" "}
            <strong className="text-foreground font-mono">{model?.name}</strong>{" "}
            به کدام ارائه‌دهنده متصل شود؟
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-sm">
          <div>
            <label className="text-foreground mb-1 block text-xs font-semibold">
              {t("features.ai.models.selectProvider", {
                defaultValue: "انتخاب ارائه‌دهنده (AI Provider)",
              })}{" "}
              *
            </label>
            {isProvidersLoading ? (
              <p className="text-muted-foreground text-xs">
                در حال بارگذاری ارائه‌دهندگان...
              </p>
            ) : (
              <Select
                value={selectedProviderUuid}
                onChange={(e) => setSelectedProviderUuid(e.target.value)}
                required
              >
                <option value="">انتخاب کنید...</option>
                {providerOptions.map(
                  (opt: { value: string; label: string }) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ),
                )}
              </Select>
            )}
          </div>

          <div>
            <label className="text-foreground mb-1 block text-xs font-semibold">
              {t("features.ai.models.priority", {
                defaultValue: "اولویت فراخوانی (Priority)",
              })}
            </label>
            <Input
              type="number"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              placeholder="10"
              min={1}
              max={100}
            />
            <span className="text-muted-foreground mt-1 block text-[11px]">
              اولویت بالاتر در اولویت اول ارسال درخواست Gateway قرار می‌گیرد.
            </span>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="link-active-toggle"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="text-primary focus:ring-primary size-4 rounded border-gray-300"
            />
            <label
              htmlFor="link-active-toggle"
              className="cursor-pointer text-xs font-medium"
            >
              اتصال فعال باشد (ارسال درخواست به این ارائه‌دهنده مجاز باشد)
            </label>
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("common.cancel", { defaultValue: "انصراف" })}
            </Button>
            <Button
              type="submit"
              disabled={isAddingProvider || !selectedProviderUuid}
            >
              {isAddingProvider
                ? t("common.submitting", { defaultValue: "در حال اتصال..." })
                : t("features.ai.models.linkConfirm", {
                    defaultValue: "اتصال ارائه‌دهنده",
                  })}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
