import { useState, useEffect, useCallback } from "react";
import { validateProfileData } from "../utils/validations/profileValidation";

export const useProfileForm = (initialData, onSubmit) => {
  const [profileData, setProfileData] = useState(initialData);
  const [previousData, setPreviousData] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState(null);

  // Update initial data when it changes (e.g., after server fetch)
  useEffect(() => {
    setProfileData(initialData);
    setPreviousData(initialData);
  }, [initialData]);

  // Memoize handleSubmit to avoid recreating it on every render
  const handleSubmit = useCallback(
    async (e) => {
      if (e) {
        e.preventDefault();
      }

      const { isValid, errors } = validateProfileData(profileData);
      if (!isValid) {
        setErrors(errors);
        return;
      }

      try {
        setIsSubmitting(true);
        await onSubmit(profileData);
        setPreviousData(profileData);
        setIsEditing(false);
        setErrors({});
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          submit: error.message || "Failed to save changes",
        }));
      } finally {
        setIsSubmitting(false);
      }
    },
    [profileData, onSubmit]
  );

  // Check for unsaved changes and handle autosave
  useEffect(() => {
    const hasChanges =
      JSON.stringify(profileData) !== JSON.stringify(previousData);
    setHasUnsavedChanges(hasChanges);

    // Setup autosave if there are changes and editing is enabled
    if (hasChanges && isEditing) {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }

      const timeoutId = setTimeout(() => {
        if (validateProfileData(profileData).isValid) {
          handleSubmit();
        }
      }, 3000); // Autosave after 3 seconds of no changes

      setAutoSaveTimeout(timeoutId);
    }

    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [profileData, isEditing, previousData, autoSaveTimeout, handleSubmit]);

  // Validate on data change
  useEffect(() => {
    if (isEditing) {
      const { errors } = validateProfileData(profileData);
      setErrors(errors);
    }
  }, [profileData, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      const confirmCancel = window.confirm(
        "You have unsaved changes. Are you sure you want to cancel?"
      );
      if (!confirmCancel) return;
    }

    setProfileData(previousData);
    setIsEditing(false);
    setErrors({});
  };

  return {
    profileData,
    setProfileData,
    isEditing,
    isSubmitting,
    errors,
    hasUnsavedChanges,
    handleChange,
    handleEdit,
    handleCancel,
    handleSubmit,
  };
};
