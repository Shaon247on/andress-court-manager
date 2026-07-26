import { getSession } from "@/lib/cookies";
import PaymentMethodsList from "./PaymentMethodsList";
import { getPayoutMethodsAction } from "@/actions/payout-method.action";
import { getFirstAvailableRoute } from "@/lib/navigation";
import { redirect } from "next/navigation";

export default async function PaymentMethodsPage() {
  const res = await getPayoutMethodsAction();
  const methods = res.success ? res.data.payout_methods : [];
  const errorMessage = !res.success ? res.message : undefined;
  const session = await getSession();
  if (session?.role_label !== "Owner") {
    const redirectTo = getFirstAvailableRoute(session?.permissions || {});
    redirect(redirectTo);
  }

  return <PaymentMethodsList methods={methods} errorMessage={errorMessage} />;
}
