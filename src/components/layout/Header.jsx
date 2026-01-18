import { HiOutlineUser, HiOutlineMenu } from 'react-icons/hi';

const Header = ({ title, onMenuClick }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Open menu"
        >
          <HiOutlineMenu className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">{title}</h1>
      </div>
      <div className="flex items-center">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center">
          <HiOutlineUser className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
        </div>
      </div>
    </div>
  );
};

export default Header;

