import { Navigate, useLocation } from 'react-router-dom';
import { isLoggedIn } from '../services/authService';
import type { ReactElement } from 'react';

export default function ProtectedRoute({ children }: { children: ReactElement }) {
  const location = useLocation();
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace state={{ from: location.pathname, message: 'Please log in to view the catalogue.' }} />;
  }
  return children;
}
