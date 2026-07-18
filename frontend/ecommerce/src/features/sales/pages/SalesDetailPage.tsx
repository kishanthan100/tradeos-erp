import { useParams, useNavigate } from "react-router-dom";
import { useSalesDetails } from "../hooks/useSalesDetails";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function SalesDetailPage() {
  usePageTitle("Sales Detail");
  
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useSalesDetails(id!);

  if (isLoading) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <p className="text-sm text-red-500">Failed to load sales order.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-medium text-gray-900">Sales Order Detail</h1>
          <p className="text-sm text-gray-500 mt-0.5">{new Date(data.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          ← Back
        </button>
      </div>

      {/* Summary */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Customer Name</span>
          <span className="font-medium text-gray-900">{data.name}</span>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Total Amount</span>
          <span className="font-medium text-gray-900">${data.amount.toFixed(2)}</span>
        </div> 
      </div>

      {/* Items */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide">
              <th className="px-4 py-3 text-left">SKU</th>
              <th className="px-4 py-3 text-right">Qty</th>
              <th className="px-4 py-3 text-right">Unit Price</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-50 last:border-0">
                <td className="px-4 py-3 font-medium text-gray-900">{item.sku}</td>
                <td className="px-4 py-3 text-right text-gray-600">{item.quantity}</td>
                <td className="px-4 py-3 text-right text-gray-600">${item.unit_price.toFixed(2)}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">${item.total_price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}