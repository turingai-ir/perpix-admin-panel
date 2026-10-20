import { apiClient } from "@/services/api";
import {
  FetchHttpError,
  FetchNetworkError,
  FetchTimeoutError,
} from "@/utils/custom-fetch/fetch-errors";
import type {
  AiGatewayRequestAdminResponse,
  AiRegistryModelCreateRequest,
  AiRegistryModelDetail,
  AiRegistryModelUpdateRequest,
  AiRegistryModelProviderLinkCreateRequest,
  AiRegistryModelProviderLinkUpdateRequest,
  AiRegistryProviderCreateRequest,
  AiRegistryProviderDetail,
  AiRegistryProviderUpdateRequest,
} from "../model/types";

export class AiActionError extends Error {
  constructor(
    readonly kind:
      "forbidden" | "not_found" | "validation" | "network" | "server",
    message?: string,
  ) {
    super(message || kind);
    this.name = "AiActionError";
  }
}

function handleFetchError(error: unknown): never {
  if (error instanceof FetchHttpError) {
    const status = error.response.status;
    if (status === 401 || status === 403) {
      throw new AiActionError(
        "forbidden",
        "اجازه دسترسی به این عملیات را ندارید.",
      );
    }
    if (status === 404) {
      throw new AiActionError("not_found", "منبع مورد نظر یافت نشد.");
    }
    if (status === 422) {
      throw new AiActionError("validation", "اطلاعات ارسالی معتبر نیست.");
    }
  }
  if (error instanceof AiActionError) {
    throw error;
  }
  if (
    error instanceof FetchNetworkError ||
    error instanceof FetchTimeoutError
  ) {
    throw new AiActionError(
      "network",
      "خطای شبکه در ارتباط با سرور. لطفاً مجدداً تلاش کنید.",
    );
  }
  throw new AiActionError("server", "خطای غیرمنتظره در سرور رخ داده است.");
}

// 1. AI Gateway
export async function refreshGatewayRequest(
  requestUuid: string,
): Promise<AiGatewayRequestAdminResponse> {
  try {
    const res = await apiClient.POST(
      "/api/admin/v1/ai-gateway/requests/{request_uuid}/refresh",
      {
        params: {
          path: {
            request_uuid: requestUuid,
          },
        },
      },
    );
    if (res.error) {
      throw new AiActionError("server");
    }
    return res.data as AiGatewayRequestAdminResponse;
  } catch (error) {
    return handleFetchError(error);
  }
}

// 2. AI Models
export async function createAiModel(
  body: AiRegistryModelCreateRequest,
): Promise<AiRegistryModelDetail> {
  try {
    const res = await apiClient.POST("/api/admin/v1/ai-registry/models", {
      body,
    });
    if (res.error) {
      throw new AiActionError("server");
    }
    return res.data as AiRegistryModelDetail;
  } catch (error) {
    return handleFetchError(error);
  }
}

export async function updateAiModel(
  modelUuid: string,
  body: AiRegistryModelUpdateRequest,
): Promise<AiRegistryModelDetail> {
  try {
    const res = await apiClient.PATCH(
      "/api/admin/v1/ai-registry/models/{ai_model_uuid}",
      {
        params: {
          path: {
            ai_model_uuid: modelUuid,
          },
        },
        body,
      },
    );
    if (res.error) {
      throw new AiActionError("server");
    }
    return res.data as AiRegistryModelDetail;
  } catch (error) {
    return handleFetchError(error);
  }
}

export async function addProviderToModel(
  modelUuid: string,
  body: AiRegistryModelProviderLinkCreateRequest,
): Promise<AiRegistryModelDetail> {
  try {
    const res = await apiClient.POST(
      "/api/admin/v1/ai-registry/models/{ai_model_uuid}/providers",
      {
        params: {
          path: {
            ai_model_uuid: modelUuid,
          },
        },
        body,
      },
    );
    if (res.error) {
      throw new AiActionError("server");
    }
    return res.data as AiRegistryModelDetail;
  } catch (error) {
    return handleFetchError(error);
  }
}

export async function updateModelProviderLink(
  modelUuid: string,
  providerUuid: string,
  body: AiRegistryModelProviderLinkUpdateRequest,
): Promise<AiRegistryModelDetail> {
  try {
    const res = await apiClient.PATCH(
      "/api/admin/v1/ai-registry/models/{ai_model_uuid}/providers/{ai_provider_uuid}",
      {
        params: {
          path: {
            ai_model_uuid: modelUuid,
            ai_provider_uuid: providerUuid,
          },
        },
        body,
      },
    );
    if (res.error) {
      throw new AiActionError("server");
    }
    return res.data as AiRegistryModelDetail;
  } catch (error) {
    return handleFetchError(error);
  }
}

// 3. AI Providers
export async function createAiProvider(
  body: AiRegistryProviderCreateRequest,
): Promise<AiRegistryProviderDetail> {
  try {
    const res = await apiClient.POST("/api/admin/v1/ai-registry/providers", {
      body,
    });
    if (res.error) {
      throw new AiActionError("server");
    }
    return res.data as AiRegistryProviderDetail;
  } catch (error) {
    return handleFetchError(error);
  }
}

export async function updateAiProvider(
  providerUuid: string,
  body: AiRegistryProviderUpdateRequest,
): Promise<AiRegistryProviderDetail> {
  try {
    const res = await apiClient.PATCH(
      "/api/admin/v1/ai-registry/providers/{ai_provider_uuid}",
      {
        params: {
          path: {
            ai_provider_uuid: providerUuid,
          },
        },
        body,
      },
    );
    if (res.error) {
      throw new AiActionError("server");
    }
    return res.data as AiRegistryProviderDetail;
  } catch (error) {
    return handleFetchError(error);
  }
}
