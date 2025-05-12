"use client";

import useCategory from "../../hooks/useCategory";
import PageHeader from "../../components/admin/category/PageHeader";
import CategoryNotification from "../../components/admin/category/CategoryNotification";
import CategorySearch from "../../components/admin/category/CategorySearch";
import CategoryForm from "../../components/admin/category/CategoryForm";
import CategoryTable from "../../components/admin/category/CategoryTable";
import Loading from "../../components/shared/Loading";

export default function CategoryPage() {
  const {
    categories,
    isLoading,
    searchTerm,
    setSearchTerm,
    showForm,
    setShowForm,
    editMode,
    currentCategory,
    formErrors,
    notification,
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    toggleCategoryStatus,
    resetForm,
  } = useCategory();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        showForm={showForm}
        onToggleForm={setShowForm}
        onResetForm={resetForm}
      />

      <CategoryNotification notification={notification} />

      {showForm && (
        <CategoryForm
          showForm={showForm}
          editMode={editMode}
          currentCategory={currentCategory}
          formErrors={formErrors}
          onSubmit={handleSubmit}
          onChange={handleInputChange}
          onCancel={resetForm}
        />
      )}

      <CategorySearch searchTerm={searchTerm} onSearch={setSearchTerm} />

      <CategoryTable
        categories={categories}
        searchTerm={searchTerm}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={toggleCategoryStatus}
        showForm={showForm}
      />
    </div>
  );
}
