import type { components } from "@/services/api/api";

export type TopupPolicy = components["schemas"]["AdminTopupPolicyResponse"];
type PolicyBody = components["schemas"]["UpdateTopupPolicyRequest"];

/** One token is 1,000 micro-USD. */
const TOKEN_USDMICRO = 1000;
export const MAX_TIERS = 20;
export const MAX_PROFIT_PERCENT = 1000;

export type TierForm = { fromTokens: string; discountPercent: string };

export type TopupPolicyForm = {
  profitPercent: string;
  minTokens: string;
  maxTokens: string;
  tiers: TierForm[];
};

export type TopupPolicyError =
  | "profit"
  | "limits"
  | "firstTier"
  | "tierOrder"
  | "tierDiscount"
  | "tierCount";

const whole = (value: string): number | null =>
  /^\d+$/.test(value.trim()) ? Number(value) : null;

export const policyToForm = (policy: TopupPolicy): TopupPolicyForm => ({
  profitPercent: String(policy.profit_percent),
  minTokens: String(policy.min_amount_usdmicro / TOKEN_USDMICRO),
  maxTokens: String(policy.max_amount_usdmicro / TOKEN_USDMICRO),
  tiers: policy.tiers.map((tier) => ({
    fromTokens: String(tier.from_amount_usdmicro / TOKEN_USDMICRO),
    discountPercent: String(tier.discount_percent),
  })),
});

/** The same rules the server enforces, so mistakes show up before saving. */
export const validateTopupPolicyForm = (
  form: TopupPolicyForm,
): TopupPolicyError[] => {
  const errors: TopupPolicyError[] = [];
  const profit = whole(form.profitPercent);
  const min = whole(form.minTokens);
  const max = whole(form.maxTokens);
  if (profit === null || profit > MAX_PROFIT_PERCENT) errors.push("profit");
  if (min === null || max === null || min < 1 || min > max) {
    errors.push("limits");
  }
  const froms = form.tiers.map((tier) => whole(tier.fromTokens));
  const discounts = form.tiers.map((tier) => whole(tier.discountPercent));
  if (form.tiers.length === 0 || form.tiers.length > MAX_TIERS) {
    errors.push("tierCount");
  }
  if (froms[0] !== 0) errors.push("firstTier");
  const ascending = froms.every(
    (from, index) =>
      from !== null && (index === 0 || from > (froms[index - 1] ?? 0)),
  );
  if (!ascending) errors.push("tierOrder");
  const valid = discounts.every(
    (discount, index) =>
      discount !== null &&
      discount <= 100 &&
      (index === 0 || discount >= (discounts[index - 1] ?? 0)),
  );
  if (!valid) errors.push("tierDiscount");
  return errors;
};

export const formToBody = (form: TopupPolicyForm): PolicyBody => ({
  profit_percent: Number(form.profitPercent),
  min_amount_usdmicro: Number(form.minTokens) * TOKEN_USDMICRO,
  max_amount_usdmicro: Number(form.maxTokens) * TOKEN_USDMICRO,
  tiers: form.tiers.map((tier) => ({
    from_amount_usdmicro: Number(tier.fromTokens) * TOKEN_USDMICRO,
    discount_percent: Number(tier.discountPercent),
  })),
});

/** Our profit after a tier gives back a share of it, e.g. 20% with a 25% tier is 15%. */
export const effectiveProfit = (profit: string, discount: string): string => {
  const p = whole(profit);
  const d = whole(discount);
  if (p === null || d === null || d > 100) return "—";
  return String(Math.round(p * (100 - d)) / 100);
};
