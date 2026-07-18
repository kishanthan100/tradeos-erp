import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, ShoppingCart, Users } from "lucide-react";
import { useDashboard } from "../hooks/useDashboard";
import { usePageTitle } from "@/hooks/usePageTitle";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "LKR",
  maximumFractionDigits: 0,
});

const number = new Intl.NumberFormat("en-US");

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  return (

      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50">
          <Icon className="h-5 w-5 text-blue-600" strokeWidth={2} />
        </div>
      </div>
    );
  }

  function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-md">
        <p className="text-xs font-medium text-slate-500">Day {label}</p>
        <p className="text-sm font-semibold text-slate-900">
          {currency.format(payload[0].value)}
        </p>
      </div>
    );
  }

  function DashboardSkeleton() {
    return (
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-[84px] animate-pulse rounded-xl bg-slate-100"
            />
          ))}
        </div>
        <div className="h-[340px] animate-pulse rounded-xl bg-slate-100" />
      </div>
    );
  }

  export default function DashboardPage() {
    usePageTitle("Dashboard");
    const { data, isLoading, isError, error } = useDashboard();

    if (isLoading) return <DashboardSkeleton />;

    if (isError) {
      return (
        <div className="m-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Couldn't load the dashboard. {(error as Error).message}
        </div>
      );
    }

    if (!data) return null;

    return (
      <div className="p-6 max-w-5xl mx-auto">
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">
            Overview of sales performance
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Total Sales"
            value={currency.format(data.total_sales_amount)}
            icon={DollarSign}
          />
          <StatCard
            label="Sales Count"
            value={number.format(data.sales_count)}
            icon={ShoppingCart}
          />
          <StatCard
            label="Customers"
            value={number.format(data.customers_count)}
            icon={Users}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Sales By Year</h2>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-700">Sales trend</p>
            <span className="text-xs text-slate-400">By day</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={data.sales_by_year}
              margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                tickFormatter={(v) => `$${v}`}
                width={48}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="total_amount"
                stroke="#2563eb"
                strokeWidth={2}
                fill="url(#salesFill)"
                dot={{ r: 3, fill: "#2563eb", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Sales By Customer</h2>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-700">Sales trend</p>
            <span className="text-xs text-slate-400">By Customer</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={data.top_customers_by_sales}
              margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                tickFormatter={(v) => `$${v}`}
                width={48}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="total_amount"
                stroke="#2563eb"
                strokeWidth={2}
                fill="url(#salesFill)"
                dot={{ r: 3, fill: "#2563eb", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      </div>
  );
}