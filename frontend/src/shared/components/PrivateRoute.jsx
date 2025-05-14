import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export function PrivateRoute({ children }) {
  const { isAuthenticated } = useSelector(state => state.auth);
  
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export function AdminRoute({ children }) {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  

  const isAdmin = user && user.isAdmin;
  
  return isAdmin ? children : <Navigate to="/user" />;
}
