import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="pl-0">
        <Outlet />
      </main>
    </div>
  );
}