
import { Routes, Route } from "react-router-dom";
import AddressPage from "./features/address/pages/AddressPage";
import ProductPage from "./features/stock/pages/ProductPage";
import CustomerPage from "./features/customers/pages/CustomerPage";
import UserPage from "./features/users/pages/UserPage";
import LoginPage from "./features/auth/pages/LoginPage";
import SalesPage from "./features/sales/pages/SalesPage";
import CategoryPage from "./features/stock/pages/CategoryPage";
import SalesDetailPage from "./features/sales/pages/SalesDetailPage";

export default function App() {
  return (
    <Routes>
      <Route path="/customer/address" element={<AddressPage />} />
      <Route path="/stock/product" element={<ProductPage />} />
      <Route path="/customer" element={<CustomerPage />} />
      <Route path="/user" element={<UserPage />} />
      <Route path="/sales" element={<SalesPage />} />
      <Route path="/stock/category" element={<CategoryPage />} />
      <Route path="/sales/:id" element={<SalesDetailPage />} />
      <Route path="/" element={<LoginPage />} />
      
      
    </Routes>
  );
}