import { useState } from "react";
import {
  createAiProvider,
  updateAiProvider,
  AiActionError,
} from "../services/ai-service";
import type {
  AiRegistryProviderCreateRequest,
  AiRegistryProviderUpdateRequest,
} from "../model/types";
import { toast } from "sonner";
import { useAppTranslate } from "@/hooks";

export function useAiProviderActions() {
  const { t } = useAppTranslate();
  const [isCreatingProvider, setIsCreatingProvider] = useState(false);
  const [isUpdatingProvider, setIsUpdatingProvider] = useState(false);

  const handleCreateProvider = async (
    body: AiRegistryProviderCreateRequest,
  ) => {
    setIsCreatingProvider(true);
    try {
      const res = await createAiProvider(body);
      toast.success(
        t("features.ai.providers.createSuccess", {
          defaultValue: "ارائه‌دهنده با موفقیت ایجاد شد.",
        }),
      );
      return res;
    } catch (err) {
      const msg =
        err instanceof AiActionError
          ? err.message
          : t("features.ai.providers.createError", {
              defaultValue: "ایجاد ارائه‌دهنده ناموفق بود.",
            });
      toast.error(msg);
      throw err;
    } finally {
      setIsCreatingProvider(false);
    }
  };

  const handleUpdateProvider = async (
    providerUuid: string,
    body: AiRegistryProviderUpdateRequest,
  ) => {
    setIsUpdatingProvider(true);
    try {
      const res = await updateAiProvider(providerUuid, body);
      toast.success(
        t("features.ai.providers.updateSuccess", {
          defaultValue: "ارائه‌دهنده با موفقیت بروزرسانی شد.",
        }),
      );
      return res;
    } catch (err) {
      const msg =
        err instanceof AiActionError
          ? err.message
          : t("features.ai.providers.updateError", {
              defaultValue: "بروزرسانی ارائه‌دهنده ناموفق بود.",
            });
      toast.error(msg);
      throw err;
    } finally {
      setIsUpdatingProvider(false);
    }
  };

  return {
    createProvider: handleCreateProvider,
    updateProvider: handleUpdateProvider,
    isCreatingProvider,
    isUpdatingProvider,
  };
}
