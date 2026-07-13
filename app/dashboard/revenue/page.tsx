import RevenueOverview from "./RevenueOverview";
import { getRevenueAction } from "@/actions/revenue.action";

export default async function RevenuePage() {
  const res = await getRevenueAction();
  const data = res.success ? res.data : null;
  const errorMessage = !res.success ? res.message : undefined;

  return <RevenueOverview data={data} errorMessage={errorMessage} />;
}