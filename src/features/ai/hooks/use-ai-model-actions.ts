import { useState } from "react";
import {
  createAiModel,
  updateAiModel,
  addProviderToModel,
  updateModelProviderLink,
  AiActionError,
} from "../services/ai-service";
import type {
  AiRegistryModelCreateRequest,
  AiRegistryModelUpdateRequest,
  AiRegistryModelProviderLinkCreateRequest,
  AiRegistryModelProviderLinkUpdateRequest,
} from "../model/types";
import { toast } from "sonner";
import { useAppTranslate } from "@/hooks";

export function useAiModelActions() {
  const { t } = useAppTranslate();
  const [isCreatingModel, setIsCreatingModel] = useState(false);
  const [isUpdatingModel, setIsUpdatingModel] = useState(false);
  const [isAddingProvider, setIsAddingProvider] = useState(false);
  const [isUpdatingProviderLink, setIsUpdatingProviderLink] = useState(false);

  const handleCreateModel = async (body: AiRegistryModelCreateRequest) => {
    setIsCreatingModel(true);
    try {
      const res = await createAiModel(body);
      toast.success(
        t("features.ai.models.createSuccess", {
          defaultValue: "مدل هوش مصنوعی با موفقیت ایجاد شد.",
        }),
      );
      return res;
    } catch (err) {
      const msg =
        err instanceof AiActionError
          ? err.message
          : t("features.ai.models.createError", {
              defaultValue: "ایجاد مدل ناموفق بود.",
            });
      toast.error(msg);
      throw err;
    } finally {
      setIsCreatingModel(false);
    }
  };

  const handleUpdateModel = async (
    modelUuid: string,
    body: AiRegistryModelUpdateRequest,
  ) => {
    setIsUpdatingModel(true);
    try {
      const res = await updateAiModel(modelUuid, body);
      toast.success(
        t("features.ai.models.updateSuccess", {
          defaultValue: "اطلاعات مدل با موفقیت بروزرسانی شد.",
        }),
      );
      return res;
    } catch (err) {
      const msg =
        err instanceof AiActionError
          ? err.message
          : t("features.ai.models.updateError", {
              defaultValue: "بروزرسانی مدل ناموفق بود.",
            });
      toast.error(msg);
      throw err;
    } finally {
      setIsUpdatingModel(false);
    }
  };

  const handleAddProvider = async (
    modelUuid: string,
    body: AiRegistryModelProviderLinkCreateRequest,
  ) => {
    setIsAddingProvider(true);
    try {
      const res = await addProviderToModel(modelUuid, body);
      toast.success(
        t("features.ai.models.addProviderSuccess", {
          defaultValue: "ارائه‌دهنده با موفقیت به مدل متصل شد.",
        }),
      );
      return res;
    } catch (err) {
      const msg =
        err instanceof AiActionError
          ? err.message
          : t("features.ai.models.addProviderError", {
              defaultValue: "اتصال ارائه‌دهنده به مدل ناموفق بود.",
            });
      toast.error(msg);
      throw err;
    } finally {
      setIsAddingProvider(false);
    }
  };

  const handleUpdateProviderLink = async (
    modelUuid: string,
    providerUuid: string,
    body: AiRegistryModelProviderLinkUpdateRequest,
  ) => {
    setIsUpdatingProviderLink(true);
    try {
      const res = await updateModelProviderLink(modelUuid, providerUuid, body);
      toast.success(
        t("features.ai.models.updateProviderLinkSuccess", {
          defaultValue: "تنظیمات اتصال ارائه‌دهنده بروزرسانی شد.",
        }),
      );
      return res;
    } catch (err) {
      const msg =
        err instanceof AiActionError
          ? err.message
          : t("features.ai.models.updateProviderLinkError", {
              defaultValue: "بروزرسانی اتصال ارائه‌دهنده ناموفق بود.",
            });
      toast.error(msg);
      throw err;
    } finally {
      setIsUpdatingProviderLink(false);
    }
  };

  return {
    createModel: handleCreateModel,
    updateModel: handleUpdateModel,
    addProvider: handleAddProvider,
    updateProviderLink: handleUpdateProviderLink,
    isCreatingModel,
    isUpdatingModel,
    isAddingProvider,
    isUpdatingProviderLink,
  };
}
