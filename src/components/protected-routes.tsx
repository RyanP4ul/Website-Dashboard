import React from 'react';
import { useAuth } from '../context/AuthProvider';
import AccessRestricted from './access-restricted';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredAccess: number;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredAccess }) => {
  const { user } = useAuth();

  if (!user || user.access < requiredAccess) {
    return <AccessRestricted />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;