import { Outlet, NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { logout as logoutService } from '../../../services/auth';

function AdminLayout() {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logoutService();
      dispatch(logout());
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h2 className="text-2xl font-semibold">Admin Panel</h2>
        </div>
        <nav className="mt-6">
          <NavLink 
            to="/admin/permissions" 
            className={({ isActive }) => 
              `flex items-center px-6 py-3 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
            }
          >
            <span className="mx-3">Permissions</span>
          </NavLink>
          <NavLink 
            to="/admin/roles" 
            className={({ isActive }) => 
              `flex items-center px-6 py-3 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
            }
          >
            <span className="mx-3">Roles</span>
          </NavLink>
          <NavLink 
            to="/admin/users" 
            className={({ isActive }) => 
              `flex items-center px-6 py-3 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
            }
          >
            <span className="mx-3">Users</span>
          </NavLink>
        </nav>
        <div className="absolute bottom-0 w-64 border-t border-gray-700 p-4">
          <button 
            onClick={handleLogout}
            className="w-full rounded py-2 px-4 text-center text-sm font-medium text-white hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow">
          <div className="px-6 py-4">
            <h1 className="text-xl font-semibold text-gray-800">Administration</h1>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
