import { Outlet, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { logout } from '../../features/auth/authSlice';
import { logout as logoutService } from '../../../services/auth';

function UserLayout() {
  const dispatch = useDispatch();
  const { permissions, user } = useSelector(state => state.auth);
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
        className={`fixed z-30 h-full w-64 transform overflow-y-auto bg-gray-800 text-white transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4">
          <h2 className="text-2xl font-semibold">User Dashboard</h2>
          <p className="mt-2 text-sm text-gray-400">Welcome, {user?.username}</p>
          
          {/* Permissions Summary */}
          <div className="mt-4 border-t border-gray-700 pt-4">
            <h3 className="text-sm font-medium text-gray-300">Your Permissions:</h3>
            <div className="mt-2">
              {permissions && permissions.length > 0 ? (
                <ul className="space-y-1 text-xs text-gray-400">
                  {permissions.map(permission => (
                    permission && permission.name ? (
                      <li key={permission._id || permission.id} className="flex items-center">
                        <span className="mr-2 inline-block h-2 w-2 rounded-full bg-green-400"></span>
                        {permission.name}
                      </li>
                    ) : null
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-500">No permissions assigned</p>
              )}
            </div>
          </div>
        </div>
        <nav className="mt-6">
          {permissions && permissions.length > 0 ? permissions.map((permission) => {
            // Skip rendering if permission or permission.name is undefined
            if (!permission || !permission.name) return null;
            
            return (
              <NavLink
                key={permission._id || permission.id}
                to={`/user/feature/${permission.name.toLowerCase().replace(/\s+/g, '-')}`}
                className={({ isActive }) =>
                  `flex items-center px-6 py-3 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
                }
                onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
              >
                <span className="mx-3">{permission.name}</span>
              </NavLink>
            );
          }) : (
            <div className="px-6 py-3 text-gray-400">No permissions available</div>
          )}
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
              <h1 className="text-xl font-semibold text-gray-800">User Dashboard</h1>
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

export default UserLayout;
