import { FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const truncateText = (text, maxLength = 150) => {
  if (!text) return "";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export const getStatusConfig = (status) => {
  const configs = {
    approved: {
      type: 'success',
      label: 'Approved',
      icon: FaCheck,
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      buttonColor: 'bg-green-500 hover:bg-green-600'
    },
    rejected: {
      type: 'error',
      label: 'Rejected',
      icon: FaTimes,
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      buttonColor: 'bg-red-500 hover:bg-red-600'
    },
    pending: {
      type: 'warning',
      label: 'Pending',
      icon: FaExclamationTriangle,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      buttonColor: 'bg-yellow-500 hover:bg-yellow-600'
    }
  };

  return configs[status] || configs.pending;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getActionMessages = {
  approve: 'Comment approved successfully',
  reject: 'Comment rejected successfully',
  delete: 'Comment deleted successfully'
};

export const getConfirmationMessages = {
  delete: 'Are you sure you want to delete this comment? This action cannot be undone.',
  approve: 'Are you sure you want to approve this comment? It will be visible to all users.',
  reject: 'Are you sure you want to reject this comment? It will be hidden from users.'
};
