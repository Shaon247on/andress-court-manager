import CustomerDetails from "./CustomerDetails";
import { getCustomersAction, getCustomerBenefitsAction } from "@/actions/customer.action";

export default async function CustomerDetailsPage({
  params,
}: {
  params?: Promise<{ id: string }>;
}) {
  const { id } = await params || { id: '' };
  
  console.log("receiving ID:",id)
  
  if (!id) {
    return (
      <div className="h-full flex flex-col p-8 bg-white overflow-y-auto">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Customer ID is required
        </div>
      </div>
    );
  }

  // Get all customers to find the specific one (since we don't have a details API)
  const customersRes = await getCustomersAction({ search: '', filter: 'all', page: 1 });
  console.log("ID:",customersRes)
  const customer = customersRes.success 
    ? customersRes.data.customers.find(c => c.user_id  === id) 
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

  // Get customer benefits
  const benefitsRes = await getCustomerBenefitsAction(id);
  const benefits = benefitsRes.success ? benefitsRes.data.benefits : [];

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 bg-white overflow-y-auto">
      <CustomerDetails 
        customer={customer} 
        benefits={benefits}
        errorMessage={!benefitsRes.success ? benefitsRes.message : undefined}
      />
    </div>
  );
}