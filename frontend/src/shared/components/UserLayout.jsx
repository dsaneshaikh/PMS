import { Outlet, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { logout as logoutService } from '../../../services/auth';

function UserLayout() {
  const dispatch = useDispatch();
  const { permissions, user } = useSelector(state => state.auth);

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
          <h2 className="text-2xl font-semibold">User Dashboard</h2>
          <p className="mt-2 text-sm text-gray-400">Welcome, {user?.username}</p>
          
          {/* Permissions Summary */}
          <div className="mt-4 pt-4 border-t border-gray-700">
            <h3 className="text-sm font-medium text-gray-300">Your Permissions:</h3>
            <div className="mt-2">
              {permissions && permissions.length > 0 ? (
                <ul className="text-xs text-gray-400 space-y-1">
                  {permissions.map(permission => (
                    permission && permission.name ? (
                      <li key={permission._id || permission.id} className="flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2"></span>
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
              >
                <span className="mx-3">{permission.name}</span>
              </NavLink>
            );
          }) : (
            <div className="px-6 py-3 text-gray-400">No permissions available</div>
          )}
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
            <h1 className="text-xl font-semibold text-gray-800">User Dashboard</h1>
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

export default UserLayout;
