import React from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ 
  searchTerm, 
  onSearchChange, 
  onSubmit 
}) => {
  return (
    <div className="bg-white shadow rounded-lg mb-6">
      <div className="p-6">
        <form onSubmit={onSubmit} className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md p-4"
                placeholder="Search users by name, email, or role..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
