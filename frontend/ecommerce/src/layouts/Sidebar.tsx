import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useLogout, useCurrentUser } from "@/features/auth/hooks/useAuth";

interface NavItem {
  label: string;
  path: string;
  children?: { label: string; path: string }[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Sales", path: "/sales" },
  { label: "Users", path: "/user" },
  {
    label: "Stock",
    path: "/stock/product",
    children: [
      { label: "Products", path: "/stock/product" },
      { label: "Categories", path: "/stock/category" },
    ],
  },
  {
    label: "Customers",
    path: "/customer",
    children: [
      { label: "All Customers", path: "/customer" },
      { label: "Addresses", path: "/customer/address" },
    ],
  },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: logoutUser } = useLogout();
  const { data: currentUser, error } = useCurrentUser();

  // redirect to login if token expired or invalid
  useEffect(() => {
    if (error) navigate("/");
  }, [error]);

  // auto-expand whichever section matches the current route
  useEffect(() => {
    const match = navItems.find(
      (item) =>
        item.children &&
        item.children.some((child) => location.pathname.startsWith(child.path))
    );
    if (match && !expanded.includes(match.path)) {
      setExpanded((prev) => [...prev, match.path]);
    }
  }, [location.pathname]);

  function toggleExpanded(path: string) {
    setExpanded((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  }

  function handleLogout() {
    logoutUser(undefined, {
      onSuccess: () => navigate("/"),
    });
  }

  return (
    <>
      {/* Hamburger — always visible */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <div className="space-y-1">
          <span className="block w-5 h-0.5 bg-gray-600" />
          <span className="block w-5 h-0.5 bg-gray-600" />
          <span className="block w-5 h-0.5 bg-gray-600" />
        </div>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/20"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <div
        className={`fixed top-0 left-0 z-40 h-full w-56 bg-white border-r border-gray-200 flex flex-col transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="px-5 pt-16 pb-5 border-b border-gray-100">
          <h1 className="text-sm font-semibold text-gray-900">Trados ERP</h1>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            if (!item.children) {
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-gray-900 text-white font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              );
            }

            const isExpanded = expanded.includes(item.path);
            const isParentActive = item.children.some((child) =>
              location.pathname.startsWith(child.path)
            );

            return (
              <div key={item.path}>
                <button
                  onClick={() => toggleExpanded(item.path)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    isParentActive
                      ? "text-gray-900 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div className="mt-1 ml-3 pl-3 border-l border-gray-200 space-y-1">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        onClick={() => setOpen(false)}
                        end
                        className={({ isActive }) =>
                          `block px-3 py-1.5 rounded-lg text-sm transition-colors ${
                            isActive
                              ? "bg-gray-900 text-white font-medium"
                              : "text-gray-500 hover:bg-gray-100"
                          }`
                        }
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="px-3 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-medium">
              {currentUser?.user_name?.charAt(0).toUpperCase() ?? "U"}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-gray-900 truncate">{currentUser?.user_name}</span>
              <span className="text-xs text-gray-500 truncate">{currentUser?.user_email}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors text-left"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}