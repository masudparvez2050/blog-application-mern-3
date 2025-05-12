'use client";';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEdit,
  FaTrash,
  FaLock,
  FaUnlock,
  FaUserShield,
} from "react-icons/fa";
import {
  getStatusDisplay,
  getRoleDisplay,
} from "../../../utils/userManagementUtils";

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

const UserRow = ({ user, onAction }) => {
  const {
    _id,
    name,
    email,
    profilePicture,
    isVerified,
    isActive,
    role,
    createdAt,
  } = user;

  const roleDisplay = getRoleDisplay(role);
  const statusDisplay = getStatusDisplay(isActive);

  return (
    <motion.tr ariants={itemVariants}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 relative">
            {profilePicture ? (
              <Image
                src={profilePicture}
                alt={name}
                className="rounded-full"
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <FaUser className="h-5 w-5 text-gray-400" />
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{name}</div>
            <div className="text-sm text-gray-500">
              ID: {_id.substring(0, 8)}...
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{email}</div>
        <div className="text-xs text-gray-500">
          {isVerified ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Verified
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Unverified
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleDisplay.bgColor} ${roleDisplay.textColor}`}
        >
          {roleDisplay.icon === "shield" ? (
            <FaUserShield className="mr-1 h-3 w-3" />
          ) : (
            <FaUser className="mr-1 h-3 w-3" />
          )}
          {roleDisplay.label}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDisplay.bgColor} ${statusDisplay.textColor}`}
        >
          {statusDisplay.label}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(createdAt).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end space-x-2">
          <Link
            href={`/admin/users/edit/${_id}`}
            className="text-blue-600 hover:text-blue-900"
          >
            <FaEdit className="h-5 w-5" />
          </Link>
          <button
            onClick={() => onAction(user, "delete")}
            className="text-red-600 hover:text-red-900"
          >
            <FaTrash className="h-5 w-5" />
          </button>
          {isActive ? (
            <button
              onClick={() => onAction(user, "deactivate")}
              className="text-orange-600 hover:text-orange-900"
              title="Deactivate user"
            >
              <FaLock className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={() => onAction(user, "activate")}
              className="text-green-600 hover:text-green-900"
              title="Activate user"
            >
              <FaUnlock className="h-5 w-5" />
            </button>
          )}
          {role === "admin" ? (
            <button
              onClick={() => onAction(user, "removeAdmin")}
              className="text-purple-600 hover:text-purple-900"
              title="Remove admin privileges"
            >
              <FaUserShield className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={() => onAction(user, "makeAdmin")}
              className="text-gray-600 hover:text-gray-900"
              title="Make admin"
            >
              <FaUserShield className="h-5 w-5" />
            </button>
          )}
        </div>
      </td>
    </motion.tr>
  );
};

export default UserRow;
