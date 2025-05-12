import Link from 'next/link';
import { FaArrowLeft, FaNewspaper, FaPlus } from 'react-icons/fa';

export const PostsHeader = () => (
  <header className="bg-white shadow-sm border-b border-gray-200">
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <div className="flex items-center">
        <Link href="/admin" className="mr-4">
          <div className="h-8 w-8 rounded-md flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
            <FaArrowLeft className="h-4 w-4" />
          </div>
        </Link>
        <h1 className="text-xl font-bold text-gray-900 flex items-center">
          <FaNewspaper className="mr-2 h-5 w-5 text-blue-600" />
          Post Management
        </h1>
      </div>
      <Link
        href="/admin/posts/create"
        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-all duration-200 hover:shadow"
      >
        <FaPlus className="mr-2 h-4 w-4" />
        Create New Post
      </Link>
    </div>
  </header>
);
