import Layout from '../components/layout/Layout';

const Wallet = () => {
  return (
    <Layout title="Wallet">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Wallet Overview</h2>
        <p className="text-sm sm:text-base text-gray-600">
          Wallet management features will be available here.
        </p>
      </div>
    </Layout>
  );
};

export default Wallet;

