import PaymentMethodsList from "./PaymentMethodsList";
import { getPayoutMethodsAction } from "@/actions/payout-method.action";

export default async function PaymentMethodsPage() {
  const res = await getPayoutMethodsAction();
  const methods = res.success ? res.data.payout_methods : [];
  const errorMessage = !res.success ? res.message : undefined;

  return <PaymentMethodsList methods={methods} errorMessage={errorMessage} />;
}