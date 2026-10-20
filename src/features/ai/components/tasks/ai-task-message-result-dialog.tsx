import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAiTaskMessageResult } from "../../hooks/use-ai-task-message-result";
import { useAppTranslate } from "@/hooks";
import { Clock, AlertTriangle, Cpu } from "lucide-react";

interface AiTaskMessageResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userUuid?: string;
  taskMessageUuid?: string;
}

export function AiTaskMessageResultDialog({
  open,
  onOpenChange,
  userUuid,
  taskMessageUuid,
}: AiTaskMessageResultDialogProps) {
  const { t } = useAppTranslate();
  const { result, isLoading, error } = useAiTaskMessageResult(
    userUuid,
    taskMessageUuid,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cpu className="size-5 text-indigo-500" />
            {t("features.ai.tasks.messageResultTitle", {
              defaultValue: "نتیجه اجرای پیام وظیفه",
            })}
          </DialogTitle>
          <DialogDescription>
            {t("features.ai.tasks.messageResultDesc", {
              defaultValue:
                "مشاهده خروجی و متادیتای پردازش شده توسط هوش مصنوعی",
            })}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : error ? (
          <div className="border-destructive/20 bg-destructive/10 text-destructive rounded-lg border p-4 text-sm">
            {error instanceof Error
              ? error.message
              : "خطا در دریافت نتیجه پیام"}
          </div>
        ) : !result ? (
          <div className="text-muted-foreground py-6 text-center text-sm">
            {t("features.ai.tasks.noResult", {
              defaultValue: "نتیجه‌ای برای این پیام یافت نشد.",
            })}
          </div>
        ) : (
          <div className="space-y-4 py-2 text-sm">
            {/* Status and Model */}
            <div className="bg-muted/40 grid grid-cols-2 gap-4 rounded-lg border p-3">
              <div>
                <span className="text-muted-foreground block text-xs">
                  {t("features.ai.tasks.taskStatus", {
                    defaultValue: "وضعیت وظیفه",
                  })}
                  :
                </span>
                <div className="mt-1 flex items-center gap-1.5 font-medium">
                  {result.task_status === "IN_PROGRESS" ? (
                    <Badge
                      variant="secondary"
                      className="gap-1 bg-amber-500 text-white"
                    >
                      <Clock className="size-3" />
                      در حال پردازش
                    </Badge>
                  ) : result.task_status === "FAILED" ? (
                    <Badge variant="destructive" className="gap-1">
                      <AlertTriangle className="size-3" />
                      ناموفق
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1">
                      {result.task_status || "—"}
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <span className="text-muted-foreground block text-xs">
                  {t("features.ai.tasks.modelUuid", {
                    defaultValue: "شناسه مدل",
                  })}
                  :
                </span>
                <span className="mt-1 block font-mono text-xs font-medium">
                  {result.ai_model_uuid || "-"}
                </span>
              </div>
            </div>

            {/* Model Config */}
            {result.ai_model_config && (
              <div>
                <span className="text-muted-foreground mb-1 block text-xs font-semibold">
                  {t("features.ai.tasks.modelConfig", {
                    defaultValue: "پیکربندی مدل (AI Model Config)",
                  })}
                </span>
                <pre
                  className="max-h-48 overflow-auto rounded-lg bg-zinc-950 p-3 text-xs text-zinc-100 dark:bg-zinc-900"
                  dir="ltr"
                >
                  {JSON.stringify(result.ai_model_config, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
