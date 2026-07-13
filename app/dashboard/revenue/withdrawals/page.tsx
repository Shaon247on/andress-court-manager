import WithdrawalsList from "./WithdrawalsList";
import { getWithdrawalsAction } from "@/actions/revenue.action";

export default async function WithdrawalsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams || {};
  const page = params?.page ? parseInt(params.page) : 1;

  const res = await getWithdrawalsAction(page);
  const data = res.success ? res.data : null;
  const errorMessage = !res.success ? res.message : undefined;

  return <WithdrawalsList data={data} errorMessage={errorMessage} />;
}