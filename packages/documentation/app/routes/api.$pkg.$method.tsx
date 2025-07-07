import { useParams } from "react-router";

export default function ApiMethodDetail() {
  const { pkg, method } = useParams();
  
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            {pkg}.{method}
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            API documentation for this method will be generated from source code.
          </p>
        </div>
      </div>
    </div>
  );
}