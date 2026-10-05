import RevenueOverview from "./RevenueOverview";
import { getRevenueAction } from "@/actions/revenue.action";
import { getPayoutMethodsAction } from "@/actions/payout-method.action";

export default async function RevenuePage() {
  const [revenueRes, payoutMethodsRes] = await Promise.all([
    getRevenueAction(),
    getPayoutMethodsAction(),
  ]);
  const data = revenueRes.success ? revenueRes.data : null;
  const errorMessage = !revenueRes.success ? revenueRes.message : undefined;
  const defaultPayoutMethod = payoutMethodsRes.success
    ? payoutMethodsRes.data.payout_methods.find((method) => method.is_default) ?? null
    : null;

  return (
    <RevenueOverview
      data={data}
      defaultPayoutMethod={defaultPayoutMethod}
      errorMessage={errorMessage}
    />
  );
}