import { handleApiError } from '../utils/errorHandler';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchUsers = async ({ page, limit = 10, sortField, sortDirection, search, token }) => {
  try {
    const response = await fetch(
      `${API_URL}/api/admin/users?page=${page}&limit=${limit}&sortField=${sortField}&sortDirection=${sortDirection}&search=${search}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return await response.json();
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateUserStatus = async ({ userId, action, token }) => {
  try {
    let endpoint = `${API_URL}/api/admin/users/${userId}`;
    let method = 'PUT';
    let body = null;

    switch (action) {
      case 'delete':
        method = 'DELETE';
        break;
      case 'activate':
        endpoint = `${endpoint}/activate`;
        break;
      case 'deactivate':
        endpoint = `${endpoint}/deactivate`;
        break;
      case 'makeAdmin':
        endpoint = `${endpoint}/role`;
        body = JSON.stringify({ role: 'admin' });
        break;
      case 'removeAdmin':
        endpoint = `${endpoint}/role`;
        body = JSON.stringify({ role: 'user' });
        break;
      default:
        throw new Error('Invalid action');
    }

    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body,
    });

    if (!response.ok) {
      throw new Error(`Failed to ${action} user`);
    }

    return await response.json();
  } catch (error) {
    throw handleApiError(error);
  }
};
