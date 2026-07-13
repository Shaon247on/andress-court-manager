import CustomersList from "./CustomersList";
import { getCustomersAction } from "@/actions/customer.action";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams || {};
  
  const queryParams = {
    search: params?.search,
    filter: params?.filter as 'all' | 'benefits' | undefined,
    page: params?.page ? parseInt(params.page) : undefined,
  };

  const res = await getCustomersAction(queryParams);
  const customers = res.success ? res.data.customers : [];
  const pagination = res.success ? res.data.pagination : null;
  const errorMessage = !res.success ? res.message : undefined;

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 bg-white overflow-y-auto">
      <div className="mb-6 flex flex-col space-y-1 shrink-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Customers</h1>
      </div>

      <CustomersList
        customers={customers}
        pagination={pagination}
        errorMessage={errorMessage}
      />
    </div>
  );
}