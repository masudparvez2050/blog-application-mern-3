import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaUserShield,
  FaUser,
  FaEdit,
  FaTrash,
  FaLock,
  FaUnlock,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";

const UserTable = ({
  users,
  sortField,
  sortDirection,
  handleSort,
  onEdit,
  onDelete,
  onActivate,
  onDeactivate,
  onMakeAdmin,
  onRemoveAdmin,
}) => {
  // Animation variants
  const tableRowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <FaSortAmountUp className="ml-1 h-4 w-4" />
    ) : (
      <FaSortAmountDown className="ml-1 h-4 w-4" />
    );
  };

  const renderSortableHeader = (field, label) => (
    <th
      className="px-4 py-3 cursor-pointer hover:bg-gray-50"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center">
        {label}
        <span className="ml-1">{getSortIcon(field)}</span>
      </div>
    </th>
  );

  return (
    <div className="overflow-x-auto mt-4 bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {renderSortableHeader("name", "User")}
            {renderSortableHeader("email", "Email")}
            {renderSortableHeader("role", "Role")}
            {renderSortableHeader("isActive", "Status")}
            {renderSortableHeader("createdAt", "Joined")}
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <motion.tr
              key={user._id}
              variants={tableRowVariants}
              initial="hidden"
              animate="visible"
              className="hover:bg-gray-50"
            >
              <td className="px-4 py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 relative">
                    <Image
                      src={user.avatar || "/images/default-avatar.png"}
                      alt={user.name}
                      className="rounded-full object-cover"
                      fill
                      sizes="40px"
                    />
                  </div>
                  <div className="ml-4">
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-gray-500 text-sm">ID: {user._id}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="text-gray-900">{user.email}</div>
                <div className="text-gray-500 text-sm">
                  {user.isEmailVerified ? "Verified" : "Not verified"}
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center">
                  {user.role === "admin" ? (
                    <FaUserShield className="text-blue-600 mr-2" />
                  ) : (
                    <FaUser className="text-gray-400 mr-2" />
                  )}
                  <span className="capitalize">{user.role}</span>
                </div>
              </td>
              <td className="px-4 py-4">
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${
                    user.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-4 py-4 text-sm text-gray-500">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="px-4 py-4 text-right space-x-2">
                <div className="flex justify-end space-x-2">
                  <Link
                    href={`/admin/users/edit/${user._id}`}
                    className="text-indigo-600 hover:text-indigo-900 p-1"
                  >
                    <FaEdit />
                  </Link>
                  <button
                    className="text-red-600 hover:text-red-900 p-1"
                    onClick={() => onDelete(user)}
                    aria-label="Delete user"
                  >
                    <FaTrash />
                  </button>
                  {user.isActive ? (
                    <button
                      className="text-orange-600 hover:text-orange-900 p-1"
                      onClick={() => onDeactivate(user)}
                      aria-label="Deactivate user"
                    >
                      <FaLock />
                    </button>
                  ) : (
                    <button
                      className="text-green-600 hover:text-green-900 p-1"
                      onClick={() => onActivate(user)}
                      aria-label="Activate user"
                    >
                      <FaUnlock />
                    </button>
                  )}
                  {user.role === "admin" ? (
                    <button
                      className="text-blue-600 hover:text-blue-900 p-1"
                      onClick={() => onRemoveAdmin(user)}
                      aria-label="Remove admin privileges"
                    >
                      <FaUser />
                    </button>
                  ) : (
                    <button
                      className="text-blue-600 hover:text-blue-900 p-1"
                      onClick={() => onMakeAdmin(user)}
                      aria-label="Make admin"
                    >
                      <FaUserShield />
                    </button>
                  )}
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
