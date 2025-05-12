/**
 * Format date in a human-readable way
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.round((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
};

/**
 * Get CSS classes for status badge based on post status
 */
export const getStatusBadgeColor = (status) => {
  const colors = {
    published: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    draft: 'bg-amber-100 text-amber-800 border border-amber-200',
    pending: 'bg-sky-100 text-sky-800 border border-sky-200',
    rejected: 'bg-rose-100 text-rose-800 border border-rose-200',
  };

  return colors[status] || 'bg-gray-100 text-gray-800 border border-gray-200';
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text, length = 100) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};
