import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { currentUser } = useAuth();

  return (
    <Layout title="Settings">
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={currentUser?.email || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>
            <p className="text-sm text-gray-500">
              Profile settings and preferences will be available here.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;

