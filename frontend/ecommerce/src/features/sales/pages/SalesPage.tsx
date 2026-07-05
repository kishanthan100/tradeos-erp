import { useState } from "react";
import { useCreateSales, useGetSales } from "../hooks/useSales";
import type { CreateSales, CreateSalesItem } from "../services/sales.api";
import { useCustomers } from "../hooks/useCustomer";
import { useProducts } from "../hooks/useProduct";
import { Link } from "react-router-dom";


const emptyItem: CreateSalesItem = {
  product_id: "",
  quantity: 1,
  unit_price: 0,
  total_price: 0,
};

const emptySale: CreateSales = {
  customer_id: "",
  amount: 0,
  items: [emptyItem],
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function SalesPage() {
  const { mutate: createSales, isPending } = useCreateSales();
  const {data: customers} = useCustomers();
  const {data: products} = useProducts();
  const {data, isLoading, error} = useGetSales()
  const [stockWarnings, setStockWarnings] = useState<Record<number, string>>({});

  
  

  const [showForm, setShowForm]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm]               = useState<CreateSales>(emptySale);

  // ── Header fields ────────────────────────────────────────────────────────

  function handleItemChange(index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
  const updated = form.items.map((item, i) => {
    if (i !== index) return item;

    const changed = { ...item, [e.target.name]: e.target.type === "number" ? Number(e.target.value) : e.target.value };

    // auto-fill unit_price when product is selected
    if (e.target.name === "product_id") {
      const product = products?.find((p) => p.id === e.target.value);
      changed.unit_price = product?.unit_price ?? 0;
      changed.quantity = 1;
      changed.total_price = changed.unit_price;

      // clear any existing warning for this index
      setStockWarnings((prev) => ({ ...prev, [index]: "" }));
    }

    // validate quantity against stock
    if (e.target.name === "quantity") {
      const product = products?.find((p) => p.id === item.product_id);
      if (product && Number(e.target.value) > product.quantity_in_stock) {
        setStockWarnings((prev) => ({
          ...prev,
          [index]: `Only ${product.quantity_in_stock} in stock`,
        }));
        return item; // reject the change
      } else {
        setStockWarnings((prev) => ({ ...prev, [index]: "" }));
      }
    }

    changed.total_price = changed.quantity * changed.unit_price;
    return changed;
  });

  const amount = updated.reduce((sum, item) => sum + item.total_price, 0);
  setForm((prev) => ({ ...prev, items: updated, amount }));
}

  function addItem() {
    setForm((prev) => ({ ...prev, items: [...prev.items, emptyItem] }));
  }

  function removeItem(index: number) {
    const updated = form.items.filter((_, i) => i !== index);
    const amount = updated.reduce((sum, item) => sum + item.total_price, 0);
    setForm((prev) => ({ ...prev, items: updated, amount }));
  }

  // ── Flow ─────────────────────────────────────────────────────────────────

  function handleCreate() {
    setShowConfirm(true);
  }

  function handleSubmit() {
    createSales(form, {
      onSuccess: () => {
        setForm(emptySale);
        setShowForm(false);
        setShowConfirm(false);
      },
    });
  }

  function handleCancel() {
    setForm(emptySale);
    setShowForm(false);
    setShowConfirm(false);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-medium text-gray-900">Sales Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">Create and manage sales orders</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 text-sm font-medium bg-gray-900 text-white px-3.5 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            + New Sale
          </button>
        )}
      </div>

      {/* Form card */}
      {showForm && !showConfirm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 space-y-6">
          <h2 className="text-sm font-medium text-gray-700">New Sales Order</h2>

          {/* Customer */}
          <div>
              <label className="block text-xs text-gray-500 mb-1">Customer Name</label>
              <select
                name="customer_id"
                value={form.customer_id}
                onChange={(e) => setForm((prev) => ({ ...prev, customer_id: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="">Select a customer</option>
                {customers?.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}            
                  </option>                
                ))}
              </select>
            </div>           
          

          {/* Items */}
        <div className="space-y-3">
        <div className="flex items-center justify-between">
            <label className="text-xs text-gray-500">Items</label>
            <button
            onClick={addItem}
            className="text-xs text-gray-600 hover:text-gray-900 underline"
            >
            + Add item
            </button>
        </div>

        {form.items.map((item, index) => (
            <div key={index} className="space-y-1">
            <div className="grid grid-cols-4 gap-2 items-center">

                {/* Product dropdown */}
                <select
                name="product_id"
                value={item.product_id}
                onChange={(e) => handleItemChange(index, e)}
                className="col-span-2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                >
                <option value="">Select product</option>
                {products?.map((p) => (
                    <option key={p.sku} value={p.id}>
                    {p.sku}
                    </option>
                ))}
                </select>

                {/* Quantity */}
                <input
                name="quantity"
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => handleItemChange(index, e)}
                placeholder="Qty"
                className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                    stockWarnings[index] ? "border-red-400" : "border-gray-200"
                }`}
                />

                {/* Unit price — read only */}
                <div className="flex gap-2 items-center">
                <input
                    name="unit_price"
                    type="number"
                    value={item.unit_price}
                    readOnly
                    className="w-full border border-gray-100 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                {form.items.length > 1 && (
                    <button
                    onClick={() => removeItem(index)}
                    className="text-gray-400 hover:text-red-500 text-lg leading-none"
                    >
                    ×
                    </button>
                )}
                </div>
            </div>

            {/* Stock warning */}
            {stockWarnings[index] && (
                <p className="text-xs text-red-500 pl-1">{stockWarnings[index]}</p>
            )}
            </div>
        ))}
        </div>

          {/* Total */}
          <div className="text-right text-sm text-gray-700">
            Total: <span className="font-medium">${form.amount.toFixed(2)}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleCancel}
              className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!form.customer_id || form.items.some((i) => !i.product_id)}
              className="text-sm px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-40 transition-colors"
            >
              Review Order
            </button>
          </div>
        </div>
      )}

      {/* Confirm card */}
      {showConfirm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 space-y-4">
          <h2 className="text-sm font-medium text-gray-700">Confirm Sales Order</h2>

          <div className="text-sm text-gray-600 space-y-1">
            <p>Customer: <span className="font-medium text-gray-900">{form.customer_id}</span></p>
            <p>Items: <span className="font-medium text-gray-900">{form.items.length}</span></p>
            <p>Total: <span className="font-medium text-gray-900">${form.amount.toFixed(2)}</span></p>
          </div>

          <ul className="text-xs text-gray-500 space-y-1 border-t pt-3">
            {form.items.map((item, i) => (
              <li key={i} className="flex justify-between">
                <span>{item.product_id} × {item.quantity}</span>
                <span>${item.total_price.toFixed(2)}</span>
              </li>
            ))}
          </ul>

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowConfirm(false)}
              className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="text-sm px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-40 transition-colors"
            >
              {isPending ? "Creating..." : "Confirm"}
            </button>
          </div>
        </div>
      )}

      {/* Table card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Name", "Amount", "Created At"].map((h) => (
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
                <td colSpan={6} className="text-center py-12 text-red-400">Failed to load sales.</td>
              </tr>
            )}
            {data?.map((sales) => (
              <tr key={sales.name.toString()} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  
                  <Link
                    to={`/sales/${sales.id}`}
                    className="font-medium text-gray-900 hover:underline hover:text-gray-600"
                  >
                    {sales.name}
                  </Link>
                </td>

                <td className="px-4 py-3 text-gray-700">{sales.amount}</td>
                           
                <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(sales.created_at)}</td>
                
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