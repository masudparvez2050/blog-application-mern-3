import { handleApiError } from '../utils/errorHandler';

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/comments`;

export const fetchComments = async ({ page, limit, search, status, sort }) => {
  try {
    const token = localStorage.getItem('token');
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(search && { search }),
      ...(status !== 'all' && { status }),
      ...(sort && { sort })
    });

    const response = await fetch(`${BASE_URL}/admin?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }

    return await response.json();
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateCommentStatus = async (commentId, status) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ isApproved: status === 'approve' })
    });

    if (!response.ok) {
      throw new Error(`Failed to ${status} comment`);
    }

    return await response.json();
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteComment = async (commentId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/${commentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete comment');
    }

    return await response.json();
  } catch (error) {
    throw handleApiError(error);
  }
};
