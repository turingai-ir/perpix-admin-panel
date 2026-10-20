import { useState } from "react";
import { useReactQueryApi, useAppTranslate } from "@/hooks";
import { refreshGatewayRequest, AiActionError } from "../services/ai-service";
import { toast } from "sonner";

export function useAiGatewayRequestDetail(requestUuid: string) {
  const { t } = useAppTranslate();
  const api = useReactQueryApi();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const query = api.useQuery(
    "get",
    "/api/admin/v1/ai-gateway/requests/{request_uuid}",
    {
      params: {
        path: {
          request_uuid: requestUuid,
        },
      },
    },
    {
      enabled: Boolean(requestUuid),
    },
  );

  const handleRefresh = async () => {
    if (!requestUuid) return;
    setIsRefreshing(true);
    try {
      const updated = await refreshGatewayRequest(requestUuid);
      toast.success(
        t("features.ai.gateway.refreshSuccess", {
          defaultValue: "وضعیت درخواست با موفقیت بروزرسانی شد.",
        }),
      );
      void query.refetch();
      return updated;
    } catch (err) {
      const msg =
        err instanceof AiActionError
          ? err.message
          : t("features.ai.gateway.refreshError", {
              defaultValue: "بروزرسانی وضعیت درخواست ناموفق بود.",
            });
      toast.error(msg);
      throw err;
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    request: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    handleRefresh,
    isRefreshing,
  };
}
