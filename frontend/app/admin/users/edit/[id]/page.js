"use client";

import { useAuth } from "../../../../context/AuthContext";
import { useEditUser } from "../../../../hooks/useEditUser";
import { EditUserHeader } from "../../../../components/admin/users/EditUserHeader";
import { EditUserForm } from "../../../../components/admin/users/EditUserForm";
import { MessageAlert } from "../../../../components/shared/notifications/MessageAlert";

export default function EditUser({ params }) {
  const { isAuthenticated, loading, isAdmin } = useAuth();
  const {
    formData,
    isLoadingData,
    isSubmitting,
    errorMessage,
    successMessage,
    handleChange,
    handleSubmit,
  } = useEditUser(params.id);

  // Show loading state while checking auth or loading data
  if (loading || isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect if not authenticated or not an admin
  if (!isAuthenticated || !isAdmin) {
    window.location.href = "/login?redirect=/admin/users";
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-10">
      <EditUserHeader />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Messages */}
        <MessageAlert message={errorMessage} type="error" />
        <MessageAlert message={successMessage} type="success" />

        <EditUserForm
          formData={formData}
          isSubmitting={isSubmitting}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </main>
    </div>
  );
}
