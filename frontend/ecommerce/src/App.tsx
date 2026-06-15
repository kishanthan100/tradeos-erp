
import { Routes, Route } from "react-router-dom";
import AddressPage from "./features/address/pages/AddressPage";
import ProductPage from "./features/stock/pages/ProductPage";
import CustomerPage from "./features/customers/pages/CustomerPage";
import UserPage from "./features/users/pages/UserPage";
export default function App() {
  return (
    <Routes>
      <Route path="/address" element={<AddressPage />} />
      <Route path="/product" element={<ProductPage />} />
      <Route path="/customer" element={<CustomerPage />} />
      <Route path="/user" element={<UserPage />} />
      
    </Routes>
  );
}