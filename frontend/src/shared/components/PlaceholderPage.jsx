function PlaceholderPage({ title = 'Feature Coming Soon', message = 'This feature is under development and will be available soon.' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center p-8 max-w-md bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
        <p className="text-gray-600">{message}</p>
        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-700">You have permission to access this page.</p>
        </div>
      </div>
    </div>
  );
}

export default PlaceholderPage;
