import { useState } from "react";
import { useCategories, useCreateCategory } from "../hooks/useCategory";
import type { CreateCategory } from "../services/stock.api";

const empty: CreateCategory = {
  name: "",
  country: "",
  description: "",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function AddressPage() {
  const { data, isLoading, error } = useCategories();
  const { mutate: createCategory, isPending } = useCreateCategory();

  const [showForm, setShowForm]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm]               = useState<CreateCategory>(empty);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleCreate() {
    // move to confirm stage — no API call yet
    setShowConfirm(true);
  }

  function handleSubmit() {
    createCategory(form, {
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
            Addresses
            <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full">
              {data?.length ?? 0}
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your saved categories</p>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 text-sm font-medium bg-gray-900 text-white px-3.5 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            + Add Category
          </button>
        )}
      </div>

      {/* Form card */}
      {showForm && !showConfirm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h2 className="text-sm font-medium text-gray-900 mb-4">New Category</h2>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. fruits"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Country</label>
              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                placeholder="e.g. Market Road"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
           
            <div>
              <label className="block text-xs text-gray-500 mb-1">Description</label>
              <input
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="e.g. COMMENT"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
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
          <h2 className="text-sm font-medium text-gray-900 mb-1">Submit this address?</h2>
          <p className="text-xs text-gray-400 mb-4">Please review before confirming.</p>

          <div className="border border-gray-100 rounded-lg divide-y divide-gray-100 mb-4">
            {[
              { label: "Name",     value: form.name },
              { label: "Country",  value: form.country },
              { label: "Description",    value: form.description },
            
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

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Name", "Country", "Description","Created At"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-400">Loading...</td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan={5} className="text-center py-12 text-red-400">Failed to load addresses.</td>
              </tr>
            )}
            {data?.map((category) => (
              <tr key={category.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{category.name}</p>
                </td>
                <td className="px-4 py-3 text-gray-700">{category.country}</td>
                <td className="px-4 py-3 text-gray-400">{category.description}</td>
                <td className="px-4 py-3 text-gray-700">{formatDate(category.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}