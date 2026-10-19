import { useState } from "react";
import { useParams, Link } from "react-router";
import {
  Wallet,
  User,
  Calendar,
  Lock,
  Unlock,
  Check,
  Copy,
  PlusCircle,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Loader2,
  DollarSign,
  Receipt,
} from "lucide-react";
import { useWalletDetail } from "../hooks/use-wallet-detail";
import {
  useWalletTransactions,
  type WalletTransactionRowItem,
} from "../hooks/use-wallet-transactions";
import { useFinanceActions } from "../hooks/use-finance-actions";
import { DetailPageLayout } from "@/components/custom/detail-page-layout";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/custom/data-table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAppTranslate } from "@/hooks";

const faNumber = (val: number) => new Intl.NumberFormat("fa-IR").format(val);

const formatDate = (isoString?: string | null) => {
  if (!isoString) return "—";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString;
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
};

export function WalletDetailPage() {
  const { t } = useAppTranslate();
  const { walletUuid = "" } = useParams<{ walletUuid: string }>();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Charge Modal state
  const [isChargeOpen, setIsChargeOpen] = useState(false);
  const [chargeAmountUsd, setChargeAmountUsd] = useState("1.00");
  const [chargeReason, setChargeReason] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  const {
    data: wallet,
    isPending,
    isError,
    error,
    refetch,
  } = useWalletDetail(walletUuid);
  const {
    data: transactionsData,
    isPending: isTxPending,
    isError: isTxError,
    refetch: refetchTx,
  } = useWalletTransactions(walletUuid, wallet?.user_uuid);

  const { chargeWallet, isCharging } = useFinanceActions();

  const handleCopy = (field: string, text: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleChargeSubmit = async () => {
    if (!wallet) return;
    const usd = Number.parseFloat(chargeAmountUsd);
    if (!Number.isFinite(usd) || usd <= 0) return;

    const amountUsdmicro = Math.round(usd * 1_000_000);
    try {
      await chargeWallet({
        walletUuid: wallet.uuid,
        userUuid: wallet.user_uuid,
        amountUsdmicro,
        reason: chargeReason.trim() || undefined,
      });
      setIsChargeOpen(false);
      void refetch();
      void refetchTx();
    } catch {
      // error handled in hook
    }
  };

  const txColumns: DataTableColumn<WalletTransactionRowItem>[] = [
    {
      id: "uuid",
      header: t("features.finance.transactions.columns.id", {
        defaultValue: "شناسه تراکنش",
      }),
      cell: (tx) => {
        const isCopied = copiedField === tx.transaction_uuid;
        return (
          <div className="text-muted-foreground flex items-center gap-1.5 font-mono text-xs">
            <span title={tx.transaction_uuid}>
              {tx.transaction_uuid.slice(0, 8)}…{tx.transaction_uuid.slice(-4)}
            </span>
            <button
              type="button"
              onClick={() =>
                handleCopy(tx.transaction_uuid, tx.transaction_uuid)
              }
              aria-label="کپی شناسه"
              className="text-muted-foreground hover:text-foreground hover:bg-muted rounded p-1 transition-colors"
            >
              {isCopied ? (
                <Check className="size-3 text-emerald-600" />
              ) : (
                <Copy className="size-3" />
              )}
            </button>
          </div>
        );
      },
    },
    {
      id: "type",
      header: t("features.finance.transactions.columns.type", {
        defaultValue: "نوع",
      }),
      cell: (tx) => {
        if (tx.type === "DEPOSIT") {
          return (
            <Badge variant="success" className="gap-1">
              <ArrowDownLeft className="size-3" />
              {t("features.finance.transactions.typeLabels.DEPOSIT", {
                defaultValue: "واریز",
              })}
            </Badge>
          );
        }
        if (tx.type === "WITHDRAW") {
          return (
            <Badge variant="destructive" className="gap-1">
              <ArrowUpRight className="size-3" />
              {t("features.finance.transactions.typeLabels.WITHDRAW", {
                defaultValue: "برداشت",
              })}
            </Badge>
          );
        }
        return (
          <Badge variant="warning" className="gap-1">
            <RefreshCw className="size-3" />
            {t("features.finance.transactions.typeLabels.REFUND", {
              defaultValue: "بازگشت",
            })}
          </Badge>
        );
      },
    },
    {
      id: "amount",
      header: t("features.finance.transactions.columns.amount", {
        defaultValue: "مبلغ",
      }),
      cell: (tx) => {
        const micro = tx.amount_usdmicro ?? 0;
        const usd = micro / 1_000_000;
        return (
          <div className="text-sm font-semibold tabular-nums">
            {faNumber(usd)} $
          </div>
        );
      },
    },
    {
      id: "balance_change",
      header: t("features.finance.transactions.columns.balanceChange", {
        defaultValue: "تغییر موجودی",
      }),
      cell: (tx) => (
        <div className="text-muted-foreground font-mono text-xs tabular-nums">
          {faNumber((tx.balance_before ?? 0) / 1_000_000)}$ →{" "}
          <span className="text-foreground font-semibold">
            {faNumber((tx.balance_after ?? 0) / 1_000_000)}$
          </span>
        </div>
      ),
    },
    {
      id: "created_at",
      header: t("features.finance.transactions.columns.date", {
        defaultValue: "تاریخ",
      }),
      cell: (tx) => (
        <span className="text-muted-foreground text-xs whitespace-nowrap">
          {formatDate(tx.created_at)}
        </span>
      ),
    },
  ];

  return (
    <DetailPageLayout
      breadcrumbs={[
        {
          label: t("features.finance.menuTitle", { defaultValue: "مالی" }),
        },
        {
          label: t("features.finance.wallets.title", {
            defaultValue: "کیف پول‌ها",
          }),
          href: "/finance/wallets",
        },
        {
          label: wallet?.name || walletUuid.slice(0, 8),
        },
      ]}
      backHref="/finance/wallets"
      backLabel={t("features.finance.wallets.backToList", {
        defaultValue: "بازگشت به لیست کیف پول‌ها",
      })}
      title={
        <div className="flex items-center gap-2">
          <Wallet className="text-primary size-6" />
          <span>
            {wallet?.name || t("common.wallet", { defaultValue: "کیف پول" })}
          </span>
        </div>
      }
      subtitle={wallet?.uuid}
      isLoading={isPending}
      isError={isError}
      errorMessage={error instanceof Error ? error.message : undefined}
      onRetry={() => {
        void refetch();
      }}
      badges={
        wallet && (
          <div className="flex flex-wrap items-center gap-2">
            {wallet.is_active ? (
              <Badge variant="success">فعال</Badge>
            ) : (
              <Badge variant="destructive">غیرفعال</Badge>
            )}
            {wallet.is_locked ? (
              <Badge variant="warning" className="gap-1">
                <Lock className="size-3" />
                قفل شده
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1">
                <Unlock className="size-3" />
                آزاد
              </Badge>
            )}
          </div>
        )
      }
      actions={
        wallet && (
          <Button
            size="sm"
            className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
            onClick={() => {
              setChargeAmountUsd("1.00");
              setChargeReason("");
              setIsConfirmed(false);
              setIsChargeOpen(true);
            }}
          >
            <PlusCircle className="size-4" />
            {t("features.finance.wallets.chargeBtn", {
              defaultValue: "افزایش اعتبار کیف پول",
            })}
          </Button>
        )
      }
    >
      {wallet && (
        <div className="space-y-6">
          {/* Wallet Overview Card */}
          <Card>
            <CardHeader className="border-border/60 border-b pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <DollarSign className="text-primary size-4" />
                {t("features.finance.wallets.overviewTitle", {
                  defaultValue: "اطلاعات موجودی و حساب",
                })}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* Balance USD */}
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs">
                    {t("features.finance.wallets.balanceUsd", {
                      defaultValue: "موجودی قابل استفاده (دلار)",
                    })}
                  </span>
                  <p className="text-foreground text-2xl font-bold tabular-nums">
                    {faNumber(wallet.balance_usdmicro / 1_000_000)} $
                  </p>
                </div>

                {/* Balance USDmicro */}
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs">
                    {t("features.finance.wallets.balanceMicro", {
                      defaultValue: "موجودی دقیق (USDMicro)",
                    })}
                  </span>
                  <p className="text-foreground font-mono text-base font-semibold tabular-nums">
                    {faNumber(wallet.balance_usdmicro)}
                  </p>
                </div>

                {/* User Link */}
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    <User className="size-3" />
                    {t("features.finance.wallets.owner", {
                      defaultValue: "صاحب کیف پول",
                    })}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/users/${wallet.user_uuid}`}
                      className="text-primary font-mono text-sm hover:underline"
                    >
                      {wallet.user_uuid.slice(0, 8)}…
                      {wallet.user_uuid.slice(-4)}
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleCopy("user_uuid", wallet.user_uuid)}
                      aria-label="کپی شناسه کاربر"
                      className="text-muted-foreground hover:text-foreground hover:bg-muted rounded p-1 transition-colors"
                    >
                      {copiedField === "user_uuid" ? (
                        <Check className="size-3 text-emerald-600" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Created At */}
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    <Calendar className="size-3" />
                    {t("features.finance.wallets.createdAt", {
                      defaultValue: "تاریخ افتتاح",
                    })}
                  </span>
                  <p className="text-foreground text-sm">
                    {formatDate(wallet.created_at)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions for this wallet */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Receipt className="text-primary size-4" />
                {t("features.finance.wallets.txHistory", {
                  defaultValue: "سوابق تراکنش‌های این کیف پول",
                })}
              </h2>
            </div>

            <DataTable
              columns={txColumns}
              data={
                transactionsData?.transactions
                  ? Array.from(transactionsData.transactions)
                  : undefined
              }
              isLoading={isTxPending}
              isError={isTxError}
              emptyMessage={t("features.finance.wallets.noTransactions", {
                defaultValue: "تراکنشی برای این کیف پول ثبت نشده است.",
              })}
              onRetry={() => {
                void refetchTx();
              }}
              keyExtractor={(tx) => tx.transaction_uuid}
            />
          </div>
        </div>
      )}

      {/* Charge Dialog */}
      {wallet && (
        <Dialog open={isChargeOpen} onOpenChange={setIsChargeOpen}>
          <DialogPopup>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600">
                  <PlusCircle className="size-5" />
                </span>
                <DialogTitle>
                  {t("features.finance.wallets.chargeModalTitle", {
                    defaultValue: "افزایش موجودی کیف پول",
                  })}
                </DialogTitle>
              </div>
              <DialogDescription className="mt-1.5">
                {t("features.finance.wallets.chargeModalDesc", {
                  defaultValue:
                    "شارژ مستقیم حساب کاربر با ارز دلاری (USDMicro). این عملیات بلافاصله اعمال می‌شود.",
                })}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="border-border bg-muted/40 space-y-2 rounded-xl border p-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">شناسه کاربر:</span>
                  <span dir="ltr" className="font-mono font-medium">
                    {wallet.user_uuid}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">موجودی فعلی:</span>
                  <span className="text-foreground font-semibold">
                    {faNumber(wallet.balance_usdmicro / 1_000_000)} $
                  </span>
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="charge-amount-detail"
                  className="text-foreground text-xs font-medium"
                >
                  {t("features.finance.wallets.amountLabel", {
                    defaultValue: "مبلغ شارژ (دلار):",
                  })}
                </label>
                <div className="relative">
                  <Input
                    id="charge-amount-detail"
                    dir="ltr"
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={chargeAmountUsd}
                    onChange={(e) => setChargeAmountUsd(e.target.value)}
                    className="pl-8 text-left font-mono"
                    disabled={isCharging}
                  />
                  <span className="text-muted-foreground absolute top-2.5 left-3 text-xs">
                    $
                  </span>
                </div>
                <p className="text-muted-foreground text-[11px]">
                  معادل{" "}
                  {faNumber(
                    Math.round(Number(chargeAmountUsd || 0) * 1_000_000),
                  )}{" "}
                  usdmicro
                </p>
              </div>

              {/* Reason Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="charge-reason-detail"
                  className="text-foreground text-xs font-medium"
                >
                  {t("features.finance.wallets.reasonLabel", {
                    defaultValue: "علت یا شماره پیگیری (اختیاری):",
                  })}
                </label>
                <Input
                  id="charge-reason-detail"
                  value={chargeReason}
                  onChange={(e) => setChargeReason(e.target.value)}
                  placeholder="مثال: شارژ دستی توسط ادمین..."
                  disabled={isCharging}
                />
              </div>

              {/* Explicit Confirmation Checkbox */}
              <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
                <input
                  id="confirm-charge-detail"
                  type="checkbox"
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                  className="border-border mt-0.5 rounded"
                  disabled={isCharging}
                />
                <label
                  htmlFor="confirm-charge-detail"
                  className="cursor-pointer text-xs leading-relaxed text-amber-900 select-none dark:text-amber-300"
                >
                  {t("features.finance.wallets.confirmCheckbox", {
                    defaultValue:
                      "صحت مبلغ و واریز به این کاربر را بررسی کرده‌ام و آن را تأیید می‌کنم.",
                  })}
                </label>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                disabled={
                  !isConfirmed || isCharging || !Number(chargeAmountUsd)
                }
                onClick={handleChargeSubmit}
                className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
              >
                {isCharging && <Loader2 className="size-4 animate-spin" />}
                {t("features.finance.wallets.confirmChargeBtn", {
                  defaultValue: "تأیید و افزایش اعتبار",
                })}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isCharging}
                onClick={() => setIsChargeOpen(false)}
              >
                {t("common.cancel", { defaultValue: "انصراف" })}
              </Button>
            </DialogFooter>
          </DialogPopup>
        </Dialog>
      )}
    </DetailPageLayout>
  );
}
