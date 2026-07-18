import { useEffect, useState } from "react";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import { useSalesDetails } from "../hooks/useSalesDetails";
import { useProducts } from "../hooks/useProduct";
import { useUpdateSaleItems } from "../hooks/useUpdateSaleItems";
import type { SalesItem } from "../services/sales.api";

interface EditSaleModalProps {
  saleId: string;
  onClose: () => void;
}

interface EditableItem extends SalesItem {
  additional_quantity: number;
}

export function EditSaleModal({ saleId, onClose }: EditSaleModalProps) {
  const { data, isLoading, isError } = useSalesDetails(saleId);
  const { data: products } = useProducts();
  const {
    mutate: submitUpdate,
    isPending,
    error: submitError,
  } = useUpdateSaleItems(saleId);

  const [items, setItems] = useState<EditableItem[]>([]);
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (data?.items) {
      setItems(data.items.map((item) => ({ ...item, additional_quantity: 0 })));
    }
  }, [data]);

  const getAvailableStock = (sku: string): number | null => {
    const product = products?.find((p) => p.sku === sku);
    return product ? product.quantity_in_stock : null;
  };

  const handleAdditionalChange = (index: number, value: number) => {
    const item = items[index];
    const available = getAvailableStock(item.sku);

    setItems((prev) =>
      prev.map((it, i) =>
        i === index
          ? {
              ...it,
              additional_quantity: value,
              total_price: (it.quantity + value) * it.unit_price,
            }
          : it
      )
    );

    setErrors((prev) => {
      const next = { ...prev };
      if (value < 0) {
        next[index] = "Cannot be negative";
      } else if (available === null) {
        next[index] = "Stock info unavailable";
      } else if (value > available) {
        next[index] = `Only ${available} in stock`;
      } else {
        delete next[index];
      }
      return next;
    });
  };

  const totalAmount = items.reduce((sum, item) => sum + item.total_price, 0);

  const hasChanges = items.some((item) => item.additional_quantity > 0);
  const hasErrors = Object.keys(errors).length > 0;
  const canSave = hasChanges && !hasErrors && !isPending;

  const handleSaveClick = () => setShowConfirm(true);

  const handleConfirmSave = () => {
  const payload = {
    items: items
      .filter((item) => item.additional_quantity > 0)
      .map((item) => ({
        product_id: item.product_id,
        sku: item.sku,
        additional_quantity: item.additional_quantity,
      })),
  };
  console.log("submitting payload:", payload,saleId);

  submitUpdate(payload, {
    onSuccess: () => {
      console.log("update success, server response:", data,saleId);
      setShowConfirm(false);
      onClose();
    },
  });
};

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Edit Sale</h2>
            {data?.sales_name && (
              <p className="text-sm text-gray-500 mt-0.5">{data.sales_name}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {isLoading && (
            <div className="flex items-center justify-center py-10">
              <p className="text-sm text-gray-400">Loading sale details…</p>
            </div>
          )}

          {isError && (
            <div className="flex items-center justify-center py-10">
              <p className="text-sm text-red-500">Couldn't load this sale. Try again.</p>
            </div>
          )}

          {!isLoading && !isError && (
            <>
              {submitError && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-lg">
                  <p className="text-sm text-red-600 font-medium">
                    Couldn't save changes
                  </p>
                  <p className="text-sm text-red-500 mt-0.5">
                    {(submitError as any)?.response?.data?.detail?.message ||
                      "Please check the quantities and try again."}
                  </p>
                </div>
              )}

              <div className="border border-gray-100 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      <th className="px-4 py-2.5">SKU</th>
                      <th className="px-4 py-2.5 w-16 text-right">Qty</th>
                      <th className="px-4 py-2.5 w-32">Additional</th>
                      <th className="px-4 py-2.5 w-24 text-right">Unit Price</th>
                      <th className="px-4 py-2.5 w-24 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {items.map((item, index) => (
                      <tr key={item.id} className="align-top">
                        <td className="px-4 py-3 text-gray-700 font-medium">{item.sku}</td>
                        <td className="px-4 py-3 text-gray-500 text-right tabular-nums">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min={0}
                            value={item.additional_quantity}
                            disabled={isPending}
                            onChange={(e) =>
                              handleAdditionalChange(index, Number(e.target.value))
                            }
                            className={`w-20 border rounded-md px-2 py-1.5 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors disabled:bg-gray-50 disabled:text-gray-400 ${
                              errors[index]
                                ? "border-red-300 focus:ring-red-100"
                                : "border-gray-200 focus:ring-blue-100 focus:border-blue-300"
                            }`}
                          />
                          {errors[index] && (
                            <p className="text-xs text-red-500 mt-1">{errors[index]}</p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-right tabular-nums">
                          {item.unit_price.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-gray-900 font-medium text-right tabular-nums">
                          {item.total_price.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between mt-4 px-1">
                <span className="text-sm text-gray-500">Total Amount</span>
                <span className="text-lg font-semibold text-gray-900 tabular-nums">
                  {totalAmount.toLocaleString()}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={isPending}
            className="text-sm font-medium text-gray-600 border border-gray-200 rounded-lg px-4 py-2 hover:bg-white transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveClick}
            disabled={!canSave}
            className={`text-sm font-medium rounded-lg px-4 py-2 transition-colors ${
              canSave
                ? "text-white bg-blue-600 hover:bg-blue-700"
                : "text-gray-400 bg-gray-200 cursor-not-allowed"
            }`}
          >
            Save changes
          </button>
        </div>
      </div>

      {/* Confirm dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-amber-50">
                  <AlertTriangle size={18} className="text-amber-500" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">Confirm changes</h3>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                This adds the additional quantities to this sale and deducts them from
                stock. New total amount:{" "}
                <span className="font-semibold text-gray-900">
                  {totalAmount.toLocaleString()}
                </span>
                .
              </p>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 bg-gray-50 border-t border-gray-100">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
                className="text-sm font-medium text-gray-600 border border-gray-200 rounded-lg px-4 py-2 hover:bg-white transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSave}
                disabled={isPending}
                className="text-sm font-medium text-white bg-blue-600 rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center gap-2"
              >
                {isPending && <Loader2 size={14} className="animate-spin" />}
                {isPending ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}