import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

import UserDashboard from "./pages/dashboard/UserDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import StoreDashboard from "./pages/store/StoreDashboard";
import AddProduct from "./pages/store/AddProduct";
import StoreProducts from "./pages/store/StoreProducts";
import StoreOrders from "./pages/store/StoreOrders";
import EditProduct from "./pages/store/EditProduct";

import FormalWear from "./pages/products/FormalWear";
import Dresses from "./pages/products/Dresses";
import Shoes from "./pages/products/Shoes";
import Socks from "./pages/products/Socks";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* AUTH ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* CART & CHECKOUT */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* PRODUCT PAGES */}
        <Route path="/formal-wear" element={<FormalWear />} />
        <Route path="/dresses" element={<Dresses />} />
        <Route path="/shoes" element={<Shoes />} />
        <Route path="/socks" element={<Socks />} />

        {/* USER DASHBOARD */}
        <Route
          path="/dashboard/user"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute>
              <RoleRoute role="ADMIN">
                <AdminDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* STORE OWNER ROUTES */}
        <Route
          path="/store/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute role="STORE_OWNER">
                <StoreDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/store/add-product"
          element={
            <ProtectedRoute>
              <RoleRoute role="STORE_OWNER">
                <AddProduct />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/store/products"
          element={
            <ProtectedRoute>
              <RoleRoute role="STORE_OWNER">
                <StoreProducts />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/store/orders"
          element={
            <ProtectedRoute>
              <RoleRoute role="STORE_OWNER">
                <StoreOrders />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/store/edit-product/:id"
          element={
            <ProtectedRoute>
              <RoleRoute role="STORE_OWNER">
                <EditProduct />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}