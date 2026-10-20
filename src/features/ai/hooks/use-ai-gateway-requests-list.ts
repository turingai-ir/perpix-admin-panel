import { useReactQueryApi } from "@/hooks";
import type {
  AdminSort,
  AiGatewayStatusEnum,
  RequestsRow,
} from "../model/types";

export interface UseAiGatewayRequestsListParams {
  page?: number;
  limit?: number;
  sort?: AdminSort;
  createdFrom?: string;
  createdTo?: string;
  resourceUuid?: string;
  userUuid?: string;
  search?: string;
  taskStatus?: AiGatewayStatusEnum | "ALL";
  modelUuid?: string;
  providerUuid?: string;
}

export type AiGatewayRequestsRowItem = RequestsRow;

export function useAiGatewayRequestsList({
  page = 1,
  limit = 10,
  sort = "-created_at",
  createdFrom,
  createdTo,
  resourceUuid,
  userUuid,
  search,
  taskStatus,
  modelUuid,
  providerUuid,
}: UseAiGatewayRequestsListParams = {}) {
  const api = useReactQueryApi();
  const offset = (page - 1) * limit;

  const queryParams = {
    offset,
    limit,
    sort,
    created_from: createdFrom || undefined,
    created_to: createdTo || undefined,
    resource_uuid: resourceUuid || undefined,
    user_uuid: userUuid || undefined,
    search: search || undefined,
    task_status:
      taskStatus && taskStatus !== "ALL"
        ? (taskStatus as AiGatewayStatusEnum)
        : undefined,
    model_uuid: modelUuid || undefined,
    provider_uuid: providerUuid || undefined,
  };

  const { data, isLoading, error, refetch } = api.useQuery(
    "get",
    "/api/admin/v1/ai-gateway/requests",
    {
      params: {
        query: queryParams,
      },
    },
  );

  return {
    requests: (data?.items ?? []) as unknown as AiGatewayRequestsRowItem[],
    totalCount: data?.total_count ?? 0,
    hasMore: data?.has_next ?? false,
    isLoading,
    error,
    refetch,
  };
}
