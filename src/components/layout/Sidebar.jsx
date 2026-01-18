import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HiOutlineViewGrid,
  HiOutlineCash,
  HiOutlineCreditCard,
  HiOutlineCog,
  HiOutlineUserGroup,
  HiOutlineLogout,
  HiOutlineX,
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { path: '/dashboard', icon: HiOutlineViewGrid, label: 'Dashboard' },
    { path: '/wallet', icon: HiOutlineCash, label: 'Wallet' },
    { path: '/transactions', icon: HiOutlineCreditCard, label: 'Transactions' },
  ];

  const toolItems = [
    { path: '/settings', icon: HiOutlineCog, label: 'Settings' },
    { path: '/help', icon: HiOutlineUserGroup, label: 'Help&Support' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Logo with close button for mobile */}
      <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Finmag</h1>
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Close menu"
        >
          <HiOutlineX className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* General Section */}
      <div className="flex-1 py-4 overflow-y-auto">
        <div className="px-4 mb-2">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            General
          </h2>
        </div>
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  active
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="my-4 mx-4 border-t border-gray-200"></div>

        {/* Tools Section */}
        <div className="px-4 mb-2">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Tools
          </h2>
        </div>
        <nav className="space-y-1 px-2">
          {toolItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  active
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <HiOutlineLogout className="w-5 h-5 mr-3" />
            Logout
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;

