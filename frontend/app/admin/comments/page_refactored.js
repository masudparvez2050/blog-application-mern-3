"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCommentAlt, FaCheck, FaTimes, FaTrash } from "react-icons/fa";

// Import components
import ProtectedRoute from "@/app/components/auth/ProtectedRoute";
import CommentHeader from "@/app/components/admin/comments/CommentHeader";
import CommentFilters from "@/app/components/admin/comments/CommentFilters";
import CommentItem from "@/app/components/admin/comments/CommentItem";
import Notification from "@/app/components/admin/comments/Notification";
import {
  EmptyState,
  Pagination,
} from "@/app/components/admin/comments/CommentListUtils";
import useCommentManagement from "@/app/hooks/useCommentManagement";
import ConfirmationModal from "@/app/components/admin/comments/ConfirmationModal";

export default function CommentManagement() {
  const {
    comments,
    isLoading,
    searchTerm,
    setSearchTerm,
    isSearching,
    currentPage,
    setCurrentPage,
    totalPages,
    filterStatus,
    sortOrder,
    actionResult,
    expandedComments,
    handlers,
  } = useCommentManagement();

  // Local state for confirmation modal
  const [selectedComment, setSelectedComment] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  // Local state for filter visibility
  const [showFilters, setShowFilters] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  // Handler functions
  const handleConfirmAction = (comment, action) => {
    setSelectedComment(comment);
    setActionType(action);
    setShowConfirmModal(true);
  };

  const handleCancelAction = () => {
    setSelectedComment(null);
    setActionType(null);
    setShowConfirmModal(false);
  };

  const executeAction = async () => {
    if (!selectedComment || !actionType) return;

    await handlers.handleAction(selectedComment, actionType);

    setShowConfirmModal(false);
    setSelectedComment(null);
    setActionType(null);
  };

  if (isLoading && comments.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <CommentHeader
        title="Comment Management"
        subtitle="Manage and moderate user comments across your blog platform"
        isSearching={isSearching}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handlers.handleSearch}
      />

      {/* Action Result Notification */}
      <AnimatePresence>
        {actionResult.message && (
          <Notification
            message={actionResult.message}
            type={actionResult.type}
          />
        )}
      </AnimatePresence>

      {/* Search and Filters */}
      <CommentFilters
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        filterStatus={filterStatus}
        handleFilterChange={handlers.handleFilterChange}
        sortOrder={sortOrder}
        handleSortChange={handlers.handleSortChange}
      />

      {/* Comments List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white shadow-sm rounded-xl overflow-hidden"
      >
        {comments.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            <AnimatePresence>
              {comments.map((comment) => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  onAction={handleConfirmAction}
                  itemVariants={itemVariants}
                  isExpanded={expandedComments[comment._id]}
                  onToggleExpand={() =>
                    handlers.toggleCommentExpand(comment._id)
                  }
                />
              ))}
            </AnimatePresence>
          </ul>
        ) : (
          <EmptyState itemVariants={itemVariants} />
        )}
      </motion.div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        show={showConfirmModal}
        comment={selectedComment}
        actionType={actionType}
        onConfirm={executeAction}
        onCancel={handleCancelAction}
      />
    </div>
  );
}
