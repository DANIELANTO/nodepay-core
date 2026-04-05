// frontend/src/App.tsx
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

import { ProtectedRoute } from './router/ProtectedRoute';
import { Login } from './pages/Login';
import { DashboardLayout } from './layouts/DashboardLayout';
import { UsersTable } from './components/users/UsersTable';
import { TermsPage } from './pages/TermsPage';
import { UserDetails } from './pages/UserDetails';
import { CreateUser } from './pages/CreateUser';

function App() {
  const { isInitialized, initKeycloak } = useAuthStore();

  // Inicializar Auth Global
  useEffect(() => {
    initKeycloak();
  }, [initKeycloak]);

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  // Enrutamiento
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta Pública */}
        <Route path="/" element={<Login />} />

        {/* Rutas Protegidas bajo el Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard/users" element={<UsersTable />} />
            <Route path="/dashboard/terms" element={<TermsPage />} />
            <Route path="/dashboard/users/new" element={<CreateUser />} />
            <Route path="/dashboard/users/:id" element={<UserDetails />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;