import EditCustomer from "./EditCustomer";
import { getCustomersAction } from "@/actions/customer.action";

export default async function EditCustomerPage({
  params,
}: {
  params?: Promise<{ id: string }>;
}) {
  const { id } = await params || { id: '' };
  
  if (!id) {
    return (
      <div className="h-full flex flex-col p-8 bg-white overflow-y-auto">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Customer ID is required
        </div>
      </div>
    );
  }

  // Get all customers to find the specific one
  const customersRes = await getCustomersAction({ search: '', filter: 'all', page: 1 });
  const customer = customersRes.success 
    ? customersRes.data.customers.find(c => c.id === id) 
    : null;

  if (!customer) {
    return (
      <div className="h-full flex flex-col p-8 bg-white overflow-y-auto">
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
          Customer not found
        </div>
      </div>
    );
  }

  return <EditCustomer customer={customer} />;
}