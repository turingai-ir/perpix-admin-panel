import { useParams, Link } from "react-router";
import {
  Cpu,
  User,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Coins,
  FileCode,
} from "lucide-react";
import { useAiGatewayRequestDetail } from "../../hooks/use-ai-gateway-request-detail";
import { DetailPageLayout } from "@/components/custom/detail-page-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppTranslate } from "@/hooks";

export function AiGatewayRequestDetailPage() {
  const { t } = useAppTranslate();
  const { requestUuid = "" } = useParams<{ requestUuid: string }>();

  const { request, isLoading, error, refetch, handleRefresh, isRefreshing } =
    useAiGatewayRequestDetail(requestUuid);

  const renderStatusBadge = (status?: string) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return (
          <Badge variant="default" className="gap-1 bg-emerald-600 text-white">
            <CheckCircle2 className="size-3" />
            تکمیل شده
          </Badge>
        );
      case "PROCESSING":
        return (
          <Badge variant="secondary" className="gap-1 bg-blue-500 text-white">
            <RefreshCw className="size-3 animate-spin" />
            در حال پردازش
          </Badge>
        );
      case "CREATED":
        return (
          <Badge variant="secondary" className="gap-1 bg-amber-500 text-white">
            <Clock className="size-3" />
            ایجاد شده
          </Badge>
        );
      case "FAILED":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="size-3" />
            ناموفق
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground gap-1">
            <AlertTriangle className="size-3" />
            {status || "نامشخص"}
          </Badge>
        );
    }
  };

  const actualCostUsd =
    request?.actual_cost_usdmicro !== null &&
    request?.actual_cost_usdmicro !== undefined
      ? request.actual_cost_usdmicro / 1_000_000
      : null;

  const estimatedCostUsd =
    request?.estimated_cost_usdmicro !== null &&
    request?.estimated_cost_usdmicro !== undefined
      ? request.estimated_cost_usdmicro / 1_000_000
      : null;

  return (
    <DetailPageLayout
      breadcrumbs={[
        {
          label: t("features.ai.gateway.menuTitle", {
            defaultValue: "درخواست‌های Gateway",
          }),
          href: "/ai/gateway-requests",
        },
        {
          label: request?.uuid || requestUuid.slice(0, 8),
        },
      ]}
      title={t("features.ai.gateway.detailTitle", {
        defaultValue: "جزئیات درخواست AI Gateway",
      })}
      subtitle={request?.uuid}
      isLoading={isLoading}
      isError={Boolean(error)}
      errorMessage={error instanceof Error ? error.message : undefined}
      onRetry={() => void refetch()}
      actions={
        <Button
          onClick={() => void handleRefresh()}
          disabled={isRefreshing}
          className="gap-1.5"
        >
          <RefreshCw
            className={`size-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          {t("features.ai.gateway.refreshAction", {
            defaultValue: "بروزرسانی وضعیت از ارائه‌دهنده",
          })}
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Main Status & Info Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-bold">
                <Cpu className="text-primary size-4" />
                {t("features.ai.gateway.overview", {
                  defaultValue: "اطلاعات کلی درخواست",
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <User className="size-3.5" />
                    {t("features.ai.gateway.user", { defaultValue: "کاربر" })}
                  </span>
                  <div>
                    {request?.user_uuid ? (
                      <Link
                        to={`/users/${request.user_uuid}`}
                        className="text-primary font-mono text-xs font-semibold hover:underline"
                      >
                        {request.user_uuid}
                      </Link>
                    ) : (
                      "-"
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground block text-xs">
                    {t("features.ai.gateway.status", {
                      defaultValue: "وضعیت درخواست",
                    })}
                  </span>
                  <div>{renderStatusBadge(request?.task_status)}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground block text-xs">
                    {t("features.ai.gateway.externalTaskId", {
                      defaultValue: "شناسه وظیفه ارائه‌دهنده خارجی",
                    })}
                  </span>
                  <div className="font-mono text-xs">
                    {request?.ai_external_provider_task_id || "-"}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground block text-xs">
                    {t("features.ai.gateway.statusCode", {
                      defaultValue: "کد وضعیت HTTP",
                    })}
                  </span>
                  <div className="font-mono text-xs font-semibold">
                    {request?.status_code ?? "-"}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground block text-xs">
                    {t("features.ai.gateway.retries", {
                      defaultValue: "تعداد تلاش‌های مجدد",
                    })}
                  </span>
                  <div className="font-mono text-xs">
                    {request?.retry_count ?? 0}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <Calendar className="size-3.5" />
                    {t("features.ai.gateway.createdAt", {
                      defaultValue: "زمان ایجاد",
                    })}
                  </span>
                  <div className="text-xs" dir="ltr">
                    {request?.created_at
                      ? new Date(request.created_at).toLocaleString("fa-IR")
                      : "-"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cost Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-bold">
                <Coins className="size-4 text-emerald-600" />
                {t("features.ai.gateway.costs", {
                  defaultValue: "هزینه و توکن‌ها",
                })}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/30 rounded-lg border p-3">
                <span className="text-muted-foreground block text-xs">
                  هزینه واقعی (Actual Cost):
                </span>
                <span
                  className="font-mono text-lg font-bold text-emerald-600"
                  dir="ltr"
                >
                  {actualCostUsd !== null
                    ? `$${actualCostUsd.toFixed(5)}`
                    : "-"}
                </span>
              </div>

              <div className="bg-muted/30 rounded-lg border p-3">
                <span className="text-muted-foreground block text-xs">
                  هزینه تخمینی (Estimated Cost):
                </span>
                <span className="font-mono text-sm font-semibold" dir="ltr">
                  {estimatedCostUsd !== null
                    ? `$${estimatedCostUsd.toFixed(5)}`
                    : "-"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Model Config JSON */}
        {request?.ai_model_config && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-bold">
                <FileCode className="size-4" />
                {t("features.ai.gateway.modelConfig", {
                  defaultValue: "پیکربندی مدل (AI Model Config)",
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre
                className="max-h-64 overflow-auto rounded-lg bg-zinc-950 p-3 text-xs text-zinc-100 dark:bg-zinc-900"
                dir="ltr"
              >
                {JSON.stringify(request.ai_model_config, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Raw Request & Raw Response */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-bold">
                <FileCode className="size-4 text-blue-500" />
                {t("features.ai.gateway.rawRequest", {
                  defaultValue: "بدنه درخواست ارسالی (Raw Request)",
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre
                className="max-h-96 overflow-auto rounded-lg bg-zinc-950 p-3 text-xs text-zinc-100 dark:bg-zinc-900"
                dir="ltr"
              >
                {request?.raw_request
                  ? JSON.stringify(request.raw_request, null, 2)
                  : "بدون محتوا"}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-bold">
                <FileCode className="size-4 text-purple-500" />
                {t("features.ai.gateway.rawResponse", {
                  defaultValue: "پاسخ دریافتی ارائه‌دهنده (Raw Response)",
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre
                className="max-h-96 overflow-auto rounded-lg bg-zinc-950 p-3 text-xs text-zinc-100 dark:bg-zinc-900"
                dir="ltr"
              >
                {request?.raw_response
                  ? JSON.stringify(request.raw_response, null, 2)
                  : "بدون محتوا"}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </DetailPageLayout>
  );
}
