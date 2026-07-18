import { useState } from "react";
import { useCustomer, useCreateCustomer, useGetAddress } from "@/features/customers/hooks/useCustomer";
import type { CreateCustomerPayload } from "../services/customer.api";
import { usePageTitle } from "@/hooks/usePageTitle";


const empty: CreateCustomerPayload = {
  name: "",
  email: "",
  contact_no: "",
  is_active: true,
  address_id: ""
}


function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}


export default function CustomerPage() {
  usePageTitle("Customers");
  
  const { data, isLoading, error } = useCustomer();
  const { mutate: createCustomer, isPending } = useCreateCustomer();
  const {data: address} = useGetAddress()
  
  const [showForm, setShowForm]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm]               = useState<CreateCustomerPayload>(empty);
  
    
  
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

  function handleCreate() {
      // move to confirm stage — no API call yet
      setShowConfirm(true);
    }

    function handleSubmit() {
      createCustomer(form, {
        onSuccess: () => {
          // reset everything
          setForm(empty);
          setShowForm(false);
          setShowConfirm(false);
        },
      });
    }

    function handleCancel() {
      setForm(empty);
      setShowForm(false);
      setShowConfirm(false);     
    }
    

return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            Customers
            <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full">
              {data?.length ?? 0}
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your saved customers</p>
        </div>
          {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 text-sm font-medium bg-gray-900 text-white px-3.5 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            + Add Customer
          </button>
        )}
      </div>
         
       {/* Form card */}
      {showForm && !showConfirm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h2 className="text-sm font-medium text-gray-900 mb-4">New Customer</h2>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Sangaran"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">E-mail</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="e.g. example@gmail.com"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Contact NO</label>
              <input
                name="contact_no"
                value={form.contact_no}
                onChange={handleChange}
                placeholder="077 xxx xxx xx"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            
            
            <div>
              <label className="block text-xs text-gray-500 mb-1">Address ID</label>
              <select
                name="category_id"
                value={form.address_id}
                onChange={(e) => setForm((prev) => ({ ...prev, address_id: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="">Select a Address ID</option>
                {address?.map((addr) => (
                  <option key={addr.id} value={addr.id}>
                    {addr.id}            
                  </option>                
                ))}
              </select>
            </div>
            
            
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              className="text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Create
            </button>
            <button
              onClick={handleCancel}
              className="text-sm text-gray-500 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Confirm card */}
      {showConfirm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h2 className="text-sm font-medium text-gray-900 mb-1">Submit this customer?</h2>
          <p className="text-xs text-gray-400 mb-4">Please review before confirming.</p>

          <div className="border border-gray-100 rounded-lg divide-y divide-gray-100 mb-4">
            {[
              { label: "Name",    value: form.name },
              { label: "E-mail",     value: form.email },
              { label: "Contact NO", value: form.contact_no },
              { label: "Is Active", value: form.is_active },
              { label: "Address ID", value: form.address_id },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between px-4 py-2.5 text-sm">
                <span className="text-gray-400">{label}</span>
                <span className="font-medium text-gray-900">{value}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {isPending ? "Submitting..." : "Yes, submit"}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="text-sm text-gray-500 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Go back
            </button>
          </div>
        </div>
      )}



      {/* Table card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Name","Email","is_active","contact_no","created_at"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-400">Loading...</td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-red-400">Failed to load products.</td>
              </tr>
            )}
            {data?.map((customer) => (
              <tr key={customer.is_active.toString()} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{customer.name}</p>
                  
                </td>
                <td className="px-4 py-3 text-gray-700">{customer.email}</td>
                
                <td className="px-4 py-3">
                  <span className="text-xs font-medium bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">
                    Active
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">{customer.contact_no}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(customer.created_at)}</td>
                <td className="px-4 py-3">
                  <button className="text-xs text-gray-500 border border-gray-200 rounded-md px-2.5 py-1.5 hover:bg-gray-100 transition-colors">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}