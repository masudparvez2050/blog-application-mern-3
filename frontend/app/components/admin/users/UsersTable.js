'use client";';

import React from "react";
import { FaSortAmountUp, FaSortAmountDown } from "react-icons/fa";
import { motion } from "framer-motion";
import UserRow from "./UserRow";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

const UsersTable = ({
  users,
  sortField,
  sortDirection,
  onSort,
  onUserAction,
  isLoading,
}) => {
  const sortableFields = {
    email: "Email",
    role: "Role",
    isActive: "Status",
    createdAt: "Joined",
  };

  const renderSortIcon = (field) => {
    if (sortField === field) {
      return sortDirection === "asc" ? (
        <FaSortAmountUp className="ml-1 h-3 w-3" />
      ) : (
        <FaSortAmountDown className="ml-1 h-3 w-3" />
      );
    }
    return null;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white shadow rounded-lg overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                User
              </th>
              {Object.entries(sortableFields).map(([field, label]) => (
                <th
                  key={field}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => onSort(field)}
                >
                  <div className="flex items-center">
                    {label}
                    {renderSortIcon(field)}
                  </div>
                </th>
              ))}
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users && users.length > 0 ? (
              users.map((user) => (
                // <motion.tr key={user._id} variants={itemVariants}>
                <UserRow key={user._id} user={user} onAction={onUserAction} />
                // </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  {isLoading ? "Loading users..." : "No users found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default UsersTable;
