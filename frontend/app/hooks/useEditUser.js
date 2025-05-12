import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchUserById, updateUser } from '../services/userManagement/editUser';

const INITIAL_FORM_STATE = {
  name: '',
  email: '',
  role: 'user',
  isActive: true,
  isVerified: false,
};

export const useEditUser = (userId) => {
  const router = useRouter();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await fetchUserById(userId);
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          role: userData.role || 'user',
          isActive: userData.isActive !== undefined ? userData.isActive : true,
          isVerified: userData.isVerified !== undefined ? userData.isVerified : false,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        setErrorMessage(error.message || 'Failed to load user data');
      } finally {
        setIsLoadingData(false);
      }
    };

    if (userId) {
      loadUserData();
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      await updateUser(userId, formData);
      setSuccessMessage('User updated successfully!');
      
      // Redirect to users list after a short delay
      setTimeout(() => {
        router.push('/admin/users');
      }, 2000);
    } catch (error) {
      console.error('Error updating user:', error);
      setErrorMessage(error.message || 'Failed to update user');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);

  return {
    formData,
    isLoadingData,
    isSubmitting,
    errorMessage,
    successMessage,
    handleChange,
    handleSubmit,
  };
};
