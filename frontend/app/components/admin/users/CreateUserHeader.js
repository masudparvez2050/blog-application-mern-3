import Link from 'next/link';
import { FaArrowLeft, FaUserPlus } from 'react-icons/fa';

export const CreateUserHeader = () => (
  <header className="bg-white shadow">
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <div className="flex items-center">
        <Link href="/admin/users" className="mr-4">
          <FaArrowLeft className="h-5 w-5 text-gray-600 hover:text-gray-900" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <FaUserPlus className="mr-2 h-6 w-6 text-blue-600" />
          Create New User
        </h1>
      </div>
    </div>
  </header>
);
