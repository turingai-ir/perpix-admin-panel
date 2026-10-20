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
import { useAppTranslate } from "@/hooks";
import type {
  AiRegistryModelOwnerEnum,
  AiRegistryModelSupportedTypesEnum,
  ModelsRow,
} from "../../model/types";

interface AiModelFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialModel?: ModelsRow | null;
  onSuccess?: () => void;
}

const MODEL_OWNERS: AiRegistryModelOwnerEnum[] = [
  "OPEN_AI",
  "GOOGLE",
  "BLACK_FOREST_LABS",
  "MID_JOURNEY",
  "RUNWAY",
  "ALIBABA",
  "BYTE_DANCE",
  "K_LING_AI",
  "BRIA",
  "IDEOGRAM",
  "MINI_MAX",
  "PIX_VERSE",
  "PRUNA_AI",
  "SOURCE_FUL",
  "VIDU",
  "X_AI",
  "IMAGINE_ART",
  "LIGHT_TICKS",
];

const SUPPORTED_TYPES: AiRegistryModelSupportedTypesEnum[] = [
  "TEXT",
  "IMAGE",
  "AUDIO",
  "VIDEO",
];

function AiModelFormContent({
  initialModel,
  onClose,
  onSuccess,
}: {
  initialModel?: ModelsRow | null;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const { t } = useAppTranslate();
  const { createModel, updateModel, isCreatingModel, isUpdatingModel } =
    useAiModelActions();

  const isEditing = Boolean(initialModel);
  const isSubmitting = isCreatingModel || isUpdatingModel;

  const [name, setName] = useState(initialModel?.name ?? "");
  const [displayName, setDisplayName] = useState(
    initialModel?.display_name ?? "",
  );
  const [description, setDescription] = useState(
    initialModel?.description ?? "",
  );
  const [modelOwner, setModelOwner] = useState<AiRegistryModelOwnerEnum>(
    (initialModel as unknown as { model_owner?: AiRegistryModelOwnerEnum })
      ?.model_owner ?? "OPEN_AI",
  );
  const [iconUrl, setIconUrl] = useState(initialModel?.icon_url ?? "");
  const [selectedInputs, setSelectedInputs] = useState<
    AiRegistryModelSupportedTypesEnum[]
  >(
    initialModel?.supported_inputs
      ? Array.from(initialModel.supported_inputs)
      : ["TEXT"],
  );
  const [selectedOutputs, setSelectedOutputs] = useState<
    AiRegistryModelSupportedTypesEnum[]
  >(
    initialModel?.supported_outputs
      ? Array.from(initialModel.supported_outputs)
      : ["TEXT"],
  );
  const [tagsStr, setTagsStr] = useState(
    initialModel?.tags ? Array.from(initialModel.tags).join(", ") : "",
  );
  const [isActive, setIsActive] = useState(
    (initialModel as unknown as { is_active?: boolean })?.is_active ?? true,
  );

  const toggleInputType = (type: AiRegistryModelSupportedTypesEnum) => {
    setSelectedInputs((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const toggleOutputType = (type: AiRegistryModelSupportedTypesEnum) => {
    setSelectedOutputs((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tags = tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      if (isEditing && initialModel) {
        await updateModel(initialModel.uuid, {
          name,
          display_name: displayName || undefined,
          description: description || undefined,
          model_owner: modelOwner,
          icon_url: iconUrl || undefined,
          supported_inputs: selectedInputs,
          supported_outputs: selectedOutputs,
          tags: tags.length ? tags : undefined,
          is_active: isActive,
        });
      } else {
        await createModel({
          name,
          display_name: displayName || undefined,
          description: description || undefined,
          model_owner: modelOwner,
          icon_url: iconUrl || undefined,
          supported_inputs: selectedInputs,
          supported_outputs: selectedOutputs,
          tags: tags.length ? tags : undefined,
          is_active: isActive,
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
            {t("features.ai.models.name", {
              defaultValue: "نام شناسه (کد مدل)",
            })}{" "}
            *
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="gpt-4o"
            required
            dir="ltr"
          />
        </div>

        <div>
          <label className="text-foreground mb-1 block text-xs font-semibold">
            {t("features.ai.models.displayName", {
              defaultValue: "نام نمایشی",
            })}
          </label>
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="GPT-4o (Omni)"
          />
        </div>
      </div>

      <div>
        <label className="text-foreground mb-1 block text-xs font-semibold">
          {t("features.ai.models.description", {
            defaultValue: "توضیحات مدل",
          })}
        </label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="مدل هوشمند چندحالته پرسرعت..."
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-foreground mb-1 block text-xs font-semibold">
            {t("features.ai.models.modelOwner", {
              defaultValue: "شرکت صاحب امتیاز",
            })}
          </label>
          <Select
            value={modelOwner}
            onChange={(e) =>
              setModelOwner(e.target.value as AiRegistryModelOwnerEnum)
            }
          >
            {MODEL_OWNERS.map((owner) => (
              <option key={owner} value={owner}>
                {owner}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="text-foreground mb-1 block text-xs font-semibold">
            {t("features.ai.models.iconUrl", {
              defaultValue: "آدرس آیکون (URL)",
            })}
          </label>
          <Input
            value={iconUrl}
            onChange={(e) => setIconUrl(e.target.value)}
            placeholder="https://..."
            dir="ltr"
          />
        </div>
      </div>

      {/* Supported Inputs */}
      <div>
        <label className="text-foreground mb-1.5 block text-xs font-semibold">
          {t("features.ai.models.supportedInputs", {
            defaultValue: "ورودی‌های پشتیبانی‌شده",
          })}
        </label>
        <div className="flex flex-wrap gap-2">
          {SUPPORTED_TYPES.map((type) => {
            const isSelected = selectedInputs.includes(type);
            return (
              <Button
                key={type}
                type="button"
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className="h-7 text-xs"
                onClick={() => toggleInputType(type)}
              >
                {type}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Supported Outputs */}
      <div>
        <label className="text-foreground mb-1.5 block text-xs font-semibold">
          {t("features.ai.models.supportedOutputs", {
            defaultValue: "خروجی‌های پشتیبانی‌شده",
          })}
        </label>
        <div className="flex flex-wrap gap-2">
          {SUPPORTED_TYPES.map((type) => {
            const isSelected = selectedOutputs.includes(type);
            return (
              <Button
                key={type}
                type="button"
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className="h-7 text-xs"
                onClick={() => toggleOutputType(type)}
              >
                {type}
              </Button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-foreground mb-1 block text-xs font-semibold">
          {t("features.ai.models.tags", {
            defaultValue: "برچسب‌ها (با کاما جدا کنید)",
          })}
        </label>
        <Input
          value={tagsStr}
          onChange={(e) => setTagsStr(e.target.value)}
          placeholder="fast, vision, reasoning"
          dir="ltr"
        />
      </div>

      <div className="flex items-center gap-2 pt-2">
        <input
          type="checkbox"
          id="model-active-toggle"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="text-primary focus:ring-primary size-4 rounded border-gray-300"
        />
        <label
          htmlFor="model-active-toggle"
          className="cursor-pointer text-xs font-medium"
        >
          {t("features.ai.models.isActive", {
            defaultValue: "مدل فعال و آماده سرویس‌دهی باشد",
          })}
        </label>
      </div>

      <DialogFooter className="gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          {t("common.cancel", { defaultValue: "انصراف" })}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? t("common.submitting", { defaultValue: "در حال ثبت..." })
            : isEditing
              ? t("common.update", { defaultValue: "بروزرسانی مدل" })
              : t("common.create", { defaultValue: "ایجاد مدل" })}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function AiModelFormDialog({
  open,
  onOpenChange,
  initialModel,
  onSuccess,
}: AiModelFormDialogProps) {
  const { t } = useAppTranslate();
  const isEditing = Boolean(initialModel);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? t("features.ai.models.editTitle", {
                  defaultValue: "ویرایش مدل هوش مصنوعی",
                })
              : t("features.ai.models.createTitle", {
                  defaultValue: "ایجاد مدل هوش مصنوعی جدید",
                })}
          </DialogTitle>
          <DialogDescription>
            {t("features.ai.models.formDesc", {
              defaultValue:
                "مشخصات مدل، ورودی/خروجی‌های پشتیبانی‌شده و مالک مدل را تعیین کنید.",
            })}
          </DialogDescription>
        </DialogHeader>

        {open && (
          <AiModelFormContent
            key={initialModel ? initialModel.uuid : "create"}
            initialModel={initialModel}
            onClose={() => onOpenChange(false)}
            onSuccess={onSuccess}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
