// app/dashboard/support/page.tsx

import ManagerSupportClient from "./components/ManagerSupportClient";
import { getManagerTicketsAction, getSupportCategoriesAction, getSupportStatusesAction } from "@/actions/manager-support.action";

export default async function ManagerSupportPage() {
  const [ticketsRes, categoriesRes, statusesRes] = await Promise.all([
    getManagerTicketsAction({}),
    getSupportCategoriesAction(),
    getSupportStatusesAction(),
  ]);

  const tickets = ticketsRes.success ? ticketsRes.data.tickets : [];
  const categories = categoriesRes.success ? categoriesRes.data : [];
  const statuses = statusesRes.success ? statusesRes.data : [];
  const errorMessage = !ticketsRes.success ? ticketsRes.message : undefined;

  return (
    <ManagerSupportClient
      initialTickets={tickets}
      categories={categories}
      statuses={statuses}
      errorMessage={errorMessage}
    />
  );
}