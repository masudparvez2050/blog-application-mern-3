"use client";

import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useCreateUser } from "../../../hooks/useCreateUser";
import { CreateUserHeader } from "../../../components/admin/users/CreateUserHeader";
import { CreateUserForm } from "../../../components/admin/users/CreateUserForm";
import { MessageAlert } from "../../../components/shared/notifications/MessageAlert";

export default function CreateUser() {
  const { isAuthenticated, loading, isAdmin } = useAuth();
  const router = useRouter();

  // Move hook to top level
  const {
    formData,
    isSubmitting,
    errorMessage,
    successMessage,
    handleChange,
    handleSubmit,
  } = useCreateUser();

  // Redirect if not authenticated or not an admin
  if (!loading && (!isAuthenticated || !isAdmin)) {
    router.push("/login?redirect=/admin/users/create");
    return null;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-10">
      <CreateUserHeader />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Messages */}
        <MessageAlert message={errorMessage} type="error" />
        <MessageAlert message={successMessage} type="success" />

        <CreateUserForm
          formData={formData}
          isSubmitting={isSubmitting}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </main>
    </div>
  );
}
