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
  
  // This is a simplified check - you may need to enhance this
  // based on your actual data structure for admin determination
  const isAdmin = user && user.isAdmin;
  
  return isAdmin ? children : <Navigate to="/user" />;
}
