import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createUser } from '../services/userManagement/createUser';
import { validateUserForm } from '../utils/validations/userValidation';

const INITIAL_FORM_STATE = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'user',
  isActive: true,
  isVerified: false,
};

export const useCreateUser = () => {
  const router = useRouter();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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

    const validationResult = validateUserForm(formData);
    if (!validationResult.isValid) {
      setErrorMessage(validationResult.error);
      return;
    }

    setIsSubmitting(true);

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...userData } = formData;
      await createUser(userData);
      
      setSuccessMessage('User created successfully!');
      setFormData(INITIAL_FORM_STATE);
      
      // Redirect to users list after a short delay
      setTimeout(() => {
        router.push('/admin/users');
      }, 2000);
    } catch (error) {
      console.error('Error creating user:', error);
      setErrorMessage(error.message || 'Failed to create user');
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
    isSubmitting,
    errorMessage,
    successMessage,
    handleChange,
    handleSubmit,
  };
};
