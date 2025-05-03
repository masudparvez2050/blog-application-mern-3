"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaRegThumbsUp,
  FaRegThumbsDown,
} from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function LikeDislikeButtons({
  postId,
  initialLikes = 0,
  initialDislikes = 0,
  compact = false, // Add compact mode
}) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userAction, setUserAction] = useState("none"); // "none", "liked", or "disliked"
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // If user is authenticated, fetch their current like/dislike status
    if (isAuthenticated && user) {
      const fetchLikeStatus = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            setIsLoading(false);
            return;
          }

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}/like-status`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setLikes(data.likes);
            setDislikes(data.dislikes);
            setUserAction(data.userAction);
          }
        } catch (error) {
          console.error("Error fetching like status:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchLikeStatus();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, postId]);

  const handleAction = async (action) => {
    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push(`/login?redirect=/blogs/${postId}`);
      return;
    }

    if (isUpdating) return; // Prevent multiple clicks

    try {
      setIsUpdating(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}/${action}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setLikes(data.likes);
        setDislikes(data.dislikes);
        setUserAction(data.userAction);
      }
    } catch (error) {
      console.error(`Error ${action} post:`, error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    // Smaller loading state for compact mode
    if (compact) {
      return (
        <div className="flex items-center gap-2">
          <div className="animate-pulse h-5 w-12 bg-gray-200 rounded"></div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-4 mt-2">
        <div className="animate-pulse h-8 w-20 bg-gray-200 rounded"></div>
        <div className="animate-pulse h-8 w-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  // Compact version for PostCard
  if (compact) {
    return (
      <div className="flex items-center gap-4">
        <button
          onClick={(e) => {
            e.preventDefault(); // Stop Link propagation
            handleAction("like");
          }}
          disabled={isUpdating}
          className="flex items-center gap-1 text-gray-600"
          aria-label="Like post"
        >
          {userAction === "liked" ? (
            <FaThumbsUp className="text-blue-600" />
          ) : (
            <FaRegThumbsUp />
          )}
          <span className="text-sm">{likes}</span>
        </button>

        <button
          onClick={(e) => {
            e.preventDefault(); // Stop Link propagation
            handleAction("dislike");
          }}
          disabled={isUpdating}
          className="flex items-center gap-1 text-gray-600"
          aria-label="Dislike post"
        >
          {userAction === "disliked" ? (
            <FaThumbsDown className="text-red-600" />
          ) : (
            <FaRegThumbsDown />
          )}
          <span className="text-sm">{dislikes}</span>
        </button>
      </div>
    );
  }

  // Full version for blog post detail
  return (
    <div className="flex items-center gap-6 mt-4">
      <button
        onClick={() => handleAction("like")}
        disabled={isUpdating}
        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
          userAction === "liked"
            ? "bg-blue-100 text-blue-700"
            : "text-gray-600 hover:bg-gray-100"
        }`}
        aria-label="Like post"
      >
        {userAction === "liked" ? (
          <FaThumbsUp className="text-blue-600" />
        ) : (
          <FaRegThumbsUp />
        )}
        <span>{likes}</span>
      </button>

      <button
        onClick={() => handleAction("dislike")}
        disabled={isUpdating}
        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
          userAction === "disliked"
            ? "bg-red-100 text-red-700"
            : "text-gray-600 hover:bg-gray-100"
        }`}
        aria-label="Dislike post"
      >
        {userAction === "disliked" ? (
          <FaThumbsDown className="text-red-600" />
        ) : (
          <FaRegThumbsDown />
        )}
        <span>{dislikes}</span>
      </button>
    </div>
  );
}
