import { handleApiError } from '../utils/errorHandler';

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/categories`;

export const fetchCategories = async (token) => {
  try {
    const response = await fetch(BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch categories');
    return await response.json();
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const createCategory = async (categoryData, token) => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) throw new Error('Failed to create category');
    return await response.json();
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const updateCategory = async (id, categoryData, token) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) throw new Error('Failed to update category');
    return await response.json();
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const deleteCategory = async (id, token) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to delete category');
    return true;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const toggleCategoryStatus = async (category, token) => {
  try {
    return await updateCategory(
      category._id,
      { ...category, isActive: !category.isActive },
      token
    );
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};
