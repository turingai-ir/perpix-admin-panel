import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppTranslate } from "@/hooks";
import {
  effectiveProfit,
  MAX_TIERS,
  type TierForm,
} from "../model/topup-policy-form";

const faNumber = (value: string) =>
  value === "—" ? value : new Intl.NumberFormat("fa-IR").format(Number(value));

type Props = {
  tiers: TierForm[];
  profitPercent: string;
  onChange: (tiers: TierForm[]) => void;
};

/** The discount leagues: a charge from the given tokens up to the next league gets that discount. */
export function TopupTiersEditor({ tiers, profitPercent, onChange }: Props) {
  const { t } = useAppTranslate();
  const update = (index: number, patch: Partial<TierForm>) =>
    onChange(
      tiers.map((tier, i) => (i === index ? { ...tier, ...patch } : tier)),
    );

  return (
    <div className="space-y-3">
      <div className="text-muted-foreground grid grid-cols-[1fr_1fr_1fr_auto] gap-3 text-xs font-semibold">
        <span>
          {t("features.finance.topupPolicy.tierFrom", {
            defaultValue: "از چند توکن شارژ",
          })}
        </span>
        <span>
          {t("features.finance.topupPolicy.tierDiscount", {
            defaultValue: "تخفیف روی سود ما (٪)",
          })}
        </span>
        <span>
          {t("features.finance.topupPolicy.tierEffective", {
            defaultValue: "سود ما بعد از تخفیف (٪)",
          })}
        </span>
        <span className="w-9" />
      </div>
      {tiers.map((tier, index) => (
        <div
          key={index}
          className="grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-3"
        >
          <Input
            dir="ltr"
            inputMode="numeric"
            value={tier.fromTokens}
            disabled={index === 0}
            onChange={(e) => update(index, { fromTokens: e.target.value })}
          />
          <Input
            dir="ltr"
            inputMode="numeric"
            value={tier.discountPercent}
            onChange={(e) => update(index, { discountPercent: e.target.value })}
          />
          <span className="text-sm font-semibold tabular-nums">
            {faNumber(effectiveProfit(profitPercent, tier.discountPercent))}٪
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={index === 0}
            aria-label={t("features.finance.topupPolicy.removeTier", {
              defaultValue: "حذف لیگ",
            })}
            onClick={() => onChange(tiers.filter((_, i) => i !== index))}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={tiers.length >= MAX_TIERS}
        onClick={() =>
          onChange([...tiers, { fromTokens: "", discountPercent: "" }])
        }
      >
        <Plus className="size-4" />
        {t("features.finance.topupPolicy.addTier", {
          defaultValue: "افزودن لیگ",
        })}
      </Button>
    </div>
  );
}
