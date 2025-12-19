import { HiOutlineUser } from 'react-icons/hi';

const Header = ({ title }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          <HiOutlineUser className="w-6 h-6 text-gray-600" />
        </div>
      </div>
    </div>
  );
};

export default Header;

