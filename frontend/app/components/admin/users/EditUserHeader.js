import Link from 'next/link';
import { FaArrowLeft, FaUserEdit } from 'react-icons/fa';

export const EditUserHeader = () => (
  <header className="bg-white shadow">
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <div className="flex items-center">
        <Link href="/admin/users" className="mr-4">
          <FaArrowLeft className="h-5 w-5 text-gray-600 hover:text-gray-900" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <FaUserEdit className="mr-2 h-6 w-6 text-blue-600" />
          Edit User
        </h1>
      </div>
    </div>
  </header>
);
