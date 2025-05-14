import { Outlet, NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { logout } from '../../features/auth/authSlice';
import { logout as logoutService } from '../../../services/auth';

function AdminLayout() {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutService();
      dispatch(logout());
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="relative flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden" 
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div 
        className={`fixed z-30 h-full w-64 transform bg-gray-800 text-white transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4">
          <h2 className="text-2xl font-semibold">Admin Panel</h2>
        </div>
        <nav className="mt-6">
          <NavLink 
            to="/admin/permissions" 
            className={({ isActive }) => 
              `flex items-center px-6 py-3 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
            }
            onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
          >
            <span className="mx-3">Permissions</span>
          </NavLink>
          <NavLink 
            to="/admin/roles" 
            className={({ isActive }) => 
              `flex items-center px-6 py-3 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
            }
            onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
          >
            <span className="mx-3">Roles</span>
          </NavLink>
          <NavLink 
            to="/admin/users" 
            className={({ isActive }) => 
              `flex items-center px-6 py-3 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
            }
            onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
          >
            <span className="mx-3">Users</span>
          </NavLink>
        </nav>
        <div className="absolute bottom-0 w-full border-t border-gray-700 p-4">
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
          <div className="flex items-center justify-between px-4 py-3 lg:px-6">
            <div className="flex items-center gap-3">
              <button 
                onClick={toggleSidebar} 
                className="rounded p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-800">Administration</h1>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
