import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
      <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">Page not found</p>
      <Link to="/" className="text-blue-600 hover:underline font-medium">
        ← Back to Home
      </Link>
    </div>
  );
}