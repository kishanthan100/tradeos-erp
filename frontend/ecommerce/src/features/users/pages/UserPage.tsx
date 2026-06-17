import { useState } from "react";

import { UseUser, useCreateUser } from "../hooks/useUsers";
import type { CreateUserPayload } from "../services/user.api";


const empty: CreateUserPayload = {
  name: "",
  email: "",
  role: "",
  is_active: true,
  password: ""
}


function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}


export default function UserPage() {
  const { data, isLoading, error } = UseUser();
  const { mutate: createUser, isPending } = useCreateUser();
  
  
  const [showForm, setShowForm]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm]               = useState<CreateUserPayload>(empty);
  const [showPassword, setShowPassword] = useState(false);
    
  
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

  function handleCreate() {
      // move to confirm stage — no API call yet
      setShowConfirm(true);
    }

    function handleSubmit() {
      createUser(form, {
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
            Users
            <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full">
              {data?.length ?? 0}
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your saved useUsers</p>
        </div>
          {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 text-sm font-medium bg-gray-900 text-white px-3.5 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            + Add User
          </button>
        )}
      </div>
         
       {/* Form card */}
      {showForm && !showConfirm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h2 className="text-sm font-medium text-gray-900 mb-4">New User</h2>

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
              <label className="block text-xs text-gray-500 mb-1">Role</label>
              <select
                name="role" 
                value={form.role} 
                onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
              >
                <option value="" disabled>Select a role</option>
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
                <option value="storekeeper">StoreKeeper</option>
              </select>
            </div>
            
            
            <div>
              <label className="block text-xs text-gray-500 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} // Dynamically changes type
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="*********"
                  className="w-full border border-gray-200 rounded-lg pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
                <button
                  type="button" // Prevents the button from accidentally submitting a form
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-500 hover:text-gray-800 focus:outline-none"
                >
                  {showPassword ? (
                    // "Hide" text or an Eye-Off icon
                    <span>Hide</span>
                  ) : (
                    // "Show" text or an Eye icon
                    <span>Show</span>
                  )}
                </button>
              </div>
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
              { label: "Role", value: form.role },
              { label: "Is Active", value: form.is_active },
              { label: "Password", value: form.password },
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
                <td className="px-4 py-3 text-gray-400 text-xs">{customer.role}</td>
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