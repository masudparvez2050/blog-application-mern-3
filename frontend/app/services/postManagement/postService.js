/**
 * Service for managing blog posts in the admin interface
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Fetch posts with filters
export const fetchPosts = async (params) => {
  const { page = 1, limit = 10, sortField = 'createdAt', sortDirection = 'desc', status = 'all', search = '' } = params;
  
  const token = localStorage.getItem('token');
  const response = await fetch(
    `${BASE_URL}/api/admin/posts?page=${page}&limit=${limit}&sortField=${sortField}&sortDirection=${sortDirection}&status=${status}&search=${search}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }

  return response.json();
};

// Delete post
export const deletePost = async (postId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/api/admin/posts/${postId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete post');
  }

  return response.json();
};

// Update post status
export const updatePostStatus = async (postId, status) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/api/admin/posts/${postId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error('Failed to update post status');
  }

  return response.json();
};

// Toggle post featured status
export const togglePostFeatured = async (postId, isFeatured) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/api/admin/posts/${postId}/feature`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ isFeatured }),
  });

  if (!response.ok) {
    throw new Error('Failed to update post featured status');
  }

  return response.json();
};
