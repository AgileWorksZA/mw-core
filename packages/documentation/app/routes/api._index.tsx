export default function ApiIndex() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            API Reference
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Complete API documentation for all MoneyWorks Core packages.
          </p>
          <div className="mt-8 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-6">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              API documentation is automatically generated from source code. 
              Use the search function (Cmd+K) to find specific methods and types.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}