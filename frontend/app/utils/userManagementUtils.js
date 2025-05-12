export const debounce = (callback, delay = 500) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => callback(...args), delay);
  };
};

export const getModalConfig = (action, userName) => {
  const configs = {
    delete: {
      title: "Delete User",
      message: `Are you sure you want to delete the user ${userName}? This action cannot be undone.`,
      confirmText: "Delete",
      buttonClasses: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
      iconClasses: "bg-red-100",
      iconColor: "text-red-600"
    },
    activate: {
      title: "Activate User",
      message: `Are you sure you want to activate the account for ${userName}?`,
      confirmText: "Activate",
      buttonClasses: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
      iconClasses: "bg-green-100",
      iconColor: "text-green-600"
    },
    deactivate: {
      title: "Deactivate User",
      message: `Are you sure you want to deactivate the account for ${userName}?`,
      confirmText: "Deactivate",
      buttonClasses: "bg-orange-600 hover:bg-orange-700 focus:ring-orange-500",
      iconClasses: "bg-orange-100",
      iconColor: "text-orange-600"
    },
    makeAdmin: {
      title: "Make Admin",
      message: `Are you sure you want to make ${userName} an admin? This will give them full access to the admin dashboard.`,
      confirmText: "Make Admin",
      buttonClasses: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
      iconClasses: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    removeAdmin: {
      title: "Remove Admin",
      message: `Are you sure you want to remove admin privileges from ${userName}?`,
      confirmText: "Remove Admin",
      buttonClasses: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
      iconClasses: "bg-blue-100",
      iconColor: "text-blue-600"
    }
  };

  return configs[action] || {
    title: "Confirm Action",
    message: "Are you sure you want to perform this action?",
    confirmText: "Confirm",
    buttonClasses: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    iconClasses: "bg-blue-100",
    iconColor: "text-blue-600"
  };
};

export const getRoleDisplay = (role) => ({
  admin: {
    bgColor: "bg-purple-100",
    textColor: "text-purple-800",
    icon: "shield",
    label: "Admin"
  },
  user: {
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
    icon: "user",
    label: "User"
  }
})[role] || {
  bgColor: "bg-gray-100",
  textColor: "text-gray-800",
  icon: "user",
  label: role.charAt(0).toUpperCase() + role.slice(1)
};

export const getStatusDisplay = (isActive) => ({
  true: {
    bgColor: "bg-green-100",
    textColor: "text-green-800",
    label: "Active"
  },
  false: {
    bgColor: "bg-red-100",
    textColor: "text-red-800",
    label: "Inactive"
  }
})[isActive];

export const formatUserData = (user) => ({
  ...user,
  displayId: user._id.substring(0, 8) + "...",
  formattedDate: new Date(user.createdAt).toLocaleDateString(),
  role: getRoleDisplay(user.role),
  status: getStatusDisplay(user.isActive)
});
