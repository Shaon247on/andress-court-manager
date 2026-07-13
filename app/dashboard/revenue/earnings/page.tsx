import EarningsList from "./EarningsList";
import { getEarningsAction } from "@/actions/revenue.action";

export default async function EarningsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | undefined>>;
}) {
  const params = (await searchParams) || {};
  const page = params?.page ? parseInt(params.page) : 1;

  const res = await getEarningsAction(page);
  const data = res.success ? res.data : null;
  const errorMessage = !res.success ? res.message : undefined;

  return <EarningsList data={data} errorMessage={errorMessage} />;
}
