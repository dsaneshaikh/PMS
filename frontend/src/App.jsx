import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import "./App.css";

// Auth Components
import LoginForm from "./features/auth/components/LoginForm";

// Admin Components
import AdminLayout from "./shared/components/AdminLayout";
import PermissionManagement from "./features/admin/components/PermissionManagement";
import RoleManagement from "./features/admin/components/RoleManagement";
import UserManagement from "./features/admin/components/UserManagement";

// User Components
import UserLayout from "./shared/components/UserLayout";
import PlaceholderPage from "./shared/components/PlaceholderPage";
import FeaturePlaceholder from "./features/user/components/FeaturePlaceholder";

// Route Protection
import { PrivateRoute, AdminRoute } from "./shared/components/PrivateRoute";

// App Routes Component

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<LoginForm />} />
        
        {/* Admin routes */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Navigate to="/admin/permissions" replace />} />
          <Route path="permissions" element={<PermissionManagement />} />
          <Route path="roles" element={<RoleManagement />} />
          <Route path="users" element={<UserManagement />} />
        </Route>
        
        {/* User routes */}
        <Route 
          path="/user" 
          element={
            <PrivateRoute>
              <UserLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<PlaceholderPage title="User Dashboard" message="Select a permission from the sidebar to access a feature" />} />
          <Route path="feature/:featureId" element={<FeaturePlaceholder />} />
        </Route>
        
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
}

export default App;
