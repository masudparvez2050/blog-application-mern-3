// "use client";

// import { useState, useEffect, useCallback, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import { blogApi } from "@/app/services/blogApi";
// import { pageTransition } from "@/app/utils/animation";
// import { formatDate } from "@/app/utils/dateFormatter";
// import { useAuth } from "@/app/context/AuthContext";
// import PostHeader from "./components/PostHeader";
// import PostContent from "./components/PostContent";
// import CommentSection from "./components/CommentSection";
// import RelatedPosts from "./components/RelatedPosts";
// import PostSidebar from "./components/PostSidebar";
// import PostSkeleton from "./components/PostSkeleton";
// import ErrorDisplay from "@/app/components/shared/ErrorDisplay";

// export default function BlogPostClient({ postId }) {
//   // State
//   const [post, setPost] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [likeStatus, setLikeStatus] = useState({
//     liked: false,
//     disliked: false,
//   });
//   const [likeCount, setLikeCount] = useState(0);
//   const [dislikeCount, setDislikeCount] = useState(0);
//   const [comments, setComments] = useState([]);
//   const [commentsLoading, setCommentsLoading] = useState(true);
//   const [commentsTotalPages, setCommentsTotalPages] = useState(1);
//   const [commentsCurrentPage, setCommentsCurrentPage] = useState(1);
//   const [relatedPosts, setRelatedPosts] = useState([]);
//   const [relatedLoading, setRelatedLoading] = useState(true);

//   const router = useRouter();
//   const contentRef = useRef(null);

//   // Fetch post data
//   useEffect(() => {
//     async function fetchPostData() {
//       setLoading(true);
//       setError(null);
//       try {
//         const postData = await blogApi.getPostById(postId);
//         setPost(postData);
//         setLikeCount(postData.likesCount || 0);
//         setDislikeCount(postData.dislikesCount || 0);

//         // Track view count
//         try {
//           const viewResponse = await blogApi.incrementViewCount(postId);
//           setPost(prev => ({ ...prev, views: viewResponse.views }));
//         } catch (viewError) {
//           // Just log error, don't affect main post display
//           console.error("Error incrementing view count:", viewError);
//         }
//       } catch (err) {
//         console.error("Error fetching post:", err);
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (postId) {
//       fetchPostData();
//     }
//   }, [postId]);

//   // Get auth context
//   const { isAuthenticated } = useAuth();

//   // Fetch like status for the current user
//   useEffect(() => {
//     async function fetchLikeStatus() {
//       try {
//         if (!postId || !isAuthenticated) return;
//         const status = await blogApi.getLikeStatus(postId);
//         setLikeStatus({
//           liked: status.liked || false,
//           disliked: status.disliked || false,
//         });
//       } catch (err) {
//         console.error("Error fetching like status:", err);
//         // Don't set main error state for this non-critical feature
//       }
//     }

//     if (isAuthenticated) {
//       fetchLikeStatus();
//     }
//   }, [postId, isAuthenticated]);

//   // Fetch comments with pagination
//   const fetchComments = useCallback(
//     async (page = 1) => {
//       if (!postId) return;

//       setCommentsLoading(true);
//       try {
//         const commentsData = await blogApi.getPostComments(postId, page);
//         setComments(commentsData.comments || []);
//         setCommentsTotalPages(commentsData.totalPages || 1);
//         setCommentsCurrentPage(page);
//       } catch (err) {
//         console.error("Error fetching comments:", err);
//         // Don't set main error state for comments
//       } finally {
//         setCommentsLoading(false);
//       }
//     },
//     [postId]
//   );

//   // Fetch related posts
//   useEffect(() => {
//     async function fetchRelatedPosts() {
//       if (!postId) return;

//       setRelatedLoading(true);
//       try {
//         const relatedData = await blogApi.getSimilarPosts(postId);
//         setRelatedPosts(relatedData || []);
//       } catch (err) {
//         console.error("Error fetching related posts:", err);
//         // Don't set main error state for related posts
//       } finally {
//         setRelatedLoading(false);
//       }
//     }

//     // Only fetch related posts after main post has loaded
//     if (post) {
//       fetchRelatedPosts();
//     }
//   }, [postId, post]);

//   // Load initial comments
//   useEffect(() => {
//     if (post) {
//       fetchComments(1);
//     }
//   }, [post, fetchComments]);

//   // Handle like/dislike actions
//   const handleLike = useCallback(async () => {
//     try {
//       if (!postId || !isAuthenticated) {
//         router.push("/login");
//         return;
//       }

//       const response = await blogApi.likePost(postId);

//       setLikeStatus({
//         liked: response.liked,
//         disliked: false,
//       });

//       setLikeCount(response.likesCount || likeCount);
//       if (response.dislikesCount !== undefined) {
//         setDislikeCount(response.dislikesCount);
//       }
//     } catch (err) {
//       console.error("Error liking post:", err);
//       // Only show error to user if it's not an auth error
//       if (err.status !== 401) {
//         setError(err);
//       }
//     }
//   }, [postId, likeCount, router, isAuthenticated]);

//   const handleDislike = useCallback(async () => {
//     try {
//       if (!postId || !isAuthenticated) {
//         router.push("/login");
//         return;
//       }

//       const response = await blogApi.dislikePost(postId);

//       setLikeStatus({
//         liked: false,
//         disliked: response.disliked,
//       });

//       setDislikeCount(response.dislikesCount || dislikeCount);
//       if (response.likesCount !== undefined) {
//         setLikeCount(response.likesCount);
//       }
//     } catch (err) {
//       console.error("Error disliking post:", err);
//       // Only show error to user if it's not an auth error
//       if (err.status !== 401) {
//         setError(err);
//       }
//     }
//   }, [postId, dislikeCount, router, isAuthenticated]);

//   // Add new comment handler
//   const handleAddComment = useCallback(
//     async (content) => {
//       try {
//         if (!postId || !isAuthenticated) {
//           router.push("/login");
//           return;
//         }

//         await blogApi.createComment({
//           postId,
//           content,
//         });

//         // Refresh comments after adding new one
//         fetchComments(1);
//       } catch (err) {
//         console.error("Error adding comment:", err);
//         // Only show error to user if it's not an auth error
//         if (err.status !== 401) {
//           return { error: err.message || "Failed to add comment" };
//         }
//       }
//     },
//     [postId, fetchComments, router, isAuthenticated]
//   );

//   // Change comments page
//   const handleCommentPageChange = useCallback(
//     (page) => {
//       fetchComments(page);
//     },
//     [fetchComments]
//   );

//   // Error state
//   if (error) {
//     return (
//       <ErrorDisplay
//         error={error}
//         title="Failed to load post"
//         backLink="/blogs"
//         backText="Return to Blog"
//       />
//     );
//   }

//   // Loading state
//   if (loading) {
//     return <PostSkeleton />;
//   }

//   // Post not found
//   if (!post) {
//     return (
//       <ErrorDisplay
//         error={{ message: "Post not found" }}
//         title="Post Not Found"
//         backLink="/blogs"
//         backText="Return to Blog"
//       />
//     );
//   }

//   return (
//     <motion.div
//       className="pt-24 pb-16 min-h-screen bg-white"
//       ref={contentRef}
//       {...pageTransition}
//     >
//       <div className="container mx-auto px-4">
//         {/* Post Header */}
//         <PostHeader
//           title={post.title}
//           coverImage={post.coverImage}
//           author={post.author}
//           createdAt={formatDate(post.createdAt)}
//           category={post.category}
//           readTime={post.readTime || "5 min"}
//         />

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
//           {/* Main Content */}
//           <main className="lg:col-span-8 xl:col-span-9">
//             <PostContent
//               content={post.content}
//               tags={post.tags}
//               likeCount={likeCount}
//               dislikeCount={dislikeCount}
//               isLiked={likeStatus.liked}
//               isDisliked={likeStatus.disliked}
//               onLike={handleLike}
//               onDislike={handleDislike}
//             />

//             <CommentSection
//               comments={comments}
//               loading={commentsLoading}
//               currentPage={commentsCurrentPage}
//               totalPages={commentsTotalPages}
//               onPageChange={handleCommentPageChange}
//               onAddComment={handleAddComment}
//             />

//             <RelatedPosts posts={relatedPosts} loading={relatedLoading} />
//           </main>

//           {/* Sidebar */}
//           <aside className="lg:col-span-4 xl:col-span-3">
//             <PostSidebar
//               author={post.author}
//               category={post.category}
//               tags={post.tags}
//               createdAt={post.createdAt}
//             />
//           </aside>
//         </div>
//       </div>
//     </motion.div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { mockFeaturedPostsDetails } from "@/app/data/mockPosts";
import LikeDislikeButtons from "../../components/shared/LikeDislikeButtons";
import { motion } from "framer-motion";
import {
  FaRegClock,
  FaRegEye,
  FaRegComment,
  FaRegBookmark,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaLink,
  FaRegSadTear,
  FaPencilAlt,
  FaChevronRight,
  FaStar,
  FaRegCalendarAlt,
} from "react-icons/fa";

export default function BlogPost({ postId }) {
  const  id  = postId;
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [similarPosts, setSimilarPosts] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [sidebarLoading, setSidebarLoading] = useState(true);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        setLoading(true);
        const postResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`
        );

        if (!postResponse.ok) {
          throw new Error("Post not found");
        }

        const postData = await postResponse.json();
        setPost(postData);

        // Fetch comments for this post
        const commentsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/comments/post/${id}`
        );
        if (commentsResponse.ok) {
          const commentsData = await commentsResponse.json();
          setComments(commentsData);
        }

        // Fetch similar posts based on categories and tags
        const similarPostsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}/similar?limit=3`
        );
        if (similarPostsResponse.ok) {
          const similarPostsData = await similarPostsResponse.json();
          setSimilarPosts(similarPostsData);
        } else {
          // Fallback to mock data if API fails
          setSimilarPosts(
            mockFeaturedPostsDetails.filter((p) => p._id !== id).slice(0, 3)
          );
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchSidebarPosts = async () => {
      setSidebarLoading(true);
      try {
        // Fetch featured posts
        const featuredResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts?limit=3&isFeatured=true`
        );

        // Fetch recent posts
        const recentResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts?limit=6&sort=createdAt`
        );

        // Process featured posts response
        if (featuredResponse.ok) {
          const featuredData = await featuredResponse.json();
          setFeaturedPosts(featuredData.posts || []);
        } else {
          // Fallback to mock data
          setFeaturedPosts(
            mockFeaturedPostsDetails
              .filter((post) => post._id !== id)
              .slice(0, 4)
          );
        }

        // Process recent posts response
        if (recentResponse.ok) {
          const recentData = await recentResponse.json();
          setRecentPosts(recentData.posts || []);
        } else {
          // Fallback to mock data
          setRecentPosts(
            mockFeaturedPostsDetails
              .filter((post) => post._id !== id)
              .slice(0, 5)
          );
        }
      } catch (err) {
        console.error("Error fetching sidebar posts:", err);
        // Use mock data on error
        setFeaturedPosts(
          mockFeaturedPostsDetails.filter((post) => post._id !== id).slice(0, 4)
        );
        setRecentPosts(
          mockFeaturedPostsDetails.filter((post) => post._id !== id).slice(0, 5)
        );
      } finally {
        setSidebarLoading(false);
      }
    };

    fetchPostAndComments();
    fetchSidebarPosts();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const formatReadTime = (content) => {
    if (!content) return "1 min read";
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);
    return `${readTime} min read`;
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      router.push("/login?redirect=" + encodeURIComponent(`/blogs/${id}`));
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            content: commentText,
            postId: id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit comment");
      }

      const newComment = await response.json();
      setComments([newComment, ...comments]);
      setCommentText("");
    } catch (err) {
      console.error("Error submitting comment:", err);
      setError("Failed to submit comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(
      () => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  const isAuthor = post && user && post.author._id === user._id;
  const isAdmin = user && user.role === "admin";

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded-lg w-3/4 mb-6"></div>
          <div className="flex items-center mb-8">
            <div className="h-12 w-12 bg-gray-200 rounded-full mr-4"></div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>

          <div className="h-96 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl mb-10"></div>

          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    const mockPost =
      mockFeaturedPostsDetails.find((p) => p._id === id) ||
      mockFeaturedPostsDetails[0];

    return (
      <motion.div
        className="max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <FaRegSadTear className="h-5 w-5 text-yellow-500 mr-3" />
            <p className="text-sm text-yellow-700">
              {error} - Showing preview content instead.
            </p>
          </div>
        </div>

        <article>
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {mockPost.categories.map((category, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm bg-indigo-100 text-indigo-800 rounded-full"
                >
                  {category.name}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {mockPost.title}
            </h1>
            <div className="flex items-center mb-6">
              <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4 border-2 border-white shadow-md">
                <Image
                  src={
                    mockPost.author.profilePicture ||
                    `https://avatar.iran.liara.run/username?username=${mockPost.author.name.replace(
                      /\s+/g,
                      "+"
                    )}`
                  }
                  alt={mockPost.author.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = `https://avatar.iran.liara.run/username?username=${mockPost.author.name.replace(
                      /\s+/g,
                      "+"
                    )}`;
                  }}
                />
              </div>
              <div>
                <p className="text-md font-medium text-gray-900">
                  {mockPost.author.name}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <FaRegClock className="mr-1 h-3 w-3" />
                  <span className="mr-3">{formatDate(mockPost.createdAt)}</span>
                  <FaRegEye className="mr-1 h-3 w-3" />
                  <span className="mr-3">{mockPost.views} views</span>
                  <span>{formatReadTime(mockPost.content)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative h-96 md:h-[500px] w-full mb-10 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={mockPost.coverImage}
              alt={mockPost.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
              priority
              className="transition-transform duration-700 hover:scale-105"
            />
          </div>

          <div
            className="prose prose-lg max-w-none mb-12 text-gray-800 prose-headings:text-gray-900 prose-a:text-indigo-600"
            dangerouslySetInnerHTML={{ __html: mockPost.content }}
          />

          <div className="mt-8 p-5 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-blue-800 flex items-center">
              <FaRegBookmark className="mr-2" />
              This is demo content shown because the original post couldn&apos;t
              be found.{" "}
              <Link href="/blogs" className="font-medium underline ml-1">
                Browse all articles
              </Link>
            </p>
          </div>
        </article>
      </motion.div>
    );
  }

  if (!post) {
    return (
      <motion.div
        className="max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <FaRegSadTear className="h-16 w-16 mx-auto text-gray-400 mb-6" />
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Post Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          The blog post you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Link
          href="/blogs"
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-md inline-flex items-center"
        >
          Browse All Articles
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-gradient-to-b from-gray-50 to-white pt-16 pb-20 mt-14"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10">
          <article className="lg:flex-1">
            <div className="mb-8">
              <motion.div
                className="flex flex-wrap gap-2 mb-4"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {post.categories.map((category, index) => (
                  <motion.span
                    key={index}
                    className="px-3 py-1 text-sm bg-indigo-100 text-indigo-800 rounded-full"
                    variants={fadeIn}
                  >
                    {category.name}
                  </motion.span>
                ))}
              </motion.div>

              <motion.h1
                className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 mb-6 leading-tight"
                variants={fadeIn}
              >
                {post.title}
              </motion.h1>

              <motion.div className="flex items-center mb-8" variants={fadeIn}>
                <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4 border-2 border-white shadow-md">
                  <Image
                    src={
                      post.author.profilePicture ||
                      `https://avatar.iran.liara.run/username?username=${post.author.name.replace(
                        /\s+/g,
                        "+"
                      )}`
                    }
                    alt={post.author.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                    onError={(e) => {
                      e.target.src = `https://avatar.iran.liara.run/username?username=${post.author.name.replace(
                        /\s+/g,
                        "+"
                      )}`;
                    }}
                  />
                </div>
                <div>
                  <p className="text-md font-medium text-gray-900">
                    {post.author.name}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 flex-wrap">
                    <FaRegClock className="mr-1 h-3 w-3" />
                    <span className="mr-3">{formatDate(post.createdAt)}</span>
                    <FaRegEye className="mr-1 h-3 w-3" />
                    <span className="mr-3">{post.views} views</span>
                    <FaRegComment className="mr-1 h-3 w-3" />
                    <span>{comments.length} comments</span>
                    <span className="mx-3 hidden md:inline">•</span>
                    <span className="hidden md:inline">
                      {formatReadTime(post.content)}
                    </span>
                  </div>
                </div>

                {isAuthor && (
                  <motion.div
                    className="ml-auto"
                    variants={fadeIn}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Link
                      href={
                        isAdmin
                          ? `/admin/posts/edit/${post._id}`
                          : `/dashboard/edit-post/${post._id}`
                      }
                      className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 border border-indigo-200 inline-flex items-center shadow-sm transition-all"
                    >
                      <FaPencilAlt className="mr-2 h-3 w-3" />
                      Edit Post
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            </div>

            <motion.div
              className="relative h-96 md:h-[500px] w-full mb-10 rounded-2xl overflow-hidden shadow-lg"
              variants={fadeIn}
            >
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
                priority
                className="transition-transform duration-700 hover:scale-105"
              />
            </motion.div>

            <motion.div
              className="prose prose-lg max-w-none mb-12 text-gray-800 prose-headings:text-gray-900 prose-a:text-indigo-600 prose-img:rounded-xl prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: post.content }}
              variants={fadeIn}
            />

            <motion.div
              className="my-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              variants={fadeIn}
            >
              <div className="flex flex-wrap items-center justify-between">
                <div>
                  <h4 className="text-sm uppercase font-semibold text-gray-500 mb-2">
                    Was this article helpful?
                  </h4>
                  <LikeDislikeButtons
                    postId={post._id}
                    initialLikes={post.likes?.length || 0}
                    initialDislikes={post.dislikes?.length || 0}
                  />
                </div>

                <div className="mt-6 md:mt-0">
                  <h4 className="text-sm uppercase font-semibold text-gray-500 mb-2">
                    Share this article:
                  </h4>
                  <div className="flex space-x-2">
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                        window.location.href
                      )}&text=${encodeURIComponent(post.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-colors"
                      aria-label="Share on Twitter"
                    >
                      <FaTwitter className="h-5 w-5" />
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        window.location.href
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-800 hover:text-white transition-colors"
                      aria-label="Share on Facebook"
                    >
                      <FaFacebook className="h-5 w-5" />
                    </a>
                    <a
                      href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                        window.location.href
                      )}&title=${encodeURIComponent(post.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-700 hover:text-white transition-colors"
                      aria-label="Share on LinkedIn"
                    >
                      <FaLinkedin className="h-5 w-5" />
                    </a>
                    <button
                      onClick={copyToClipboard}
                      className={`p-2 rounded-full transition-colors ${
                        isCopied
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-600 hover:text-white"
                      }`}
                      aria-label="Copy link"
                    >
                      <FaLink className="h-5 w-5" />
                    </button>
                    {isCopied && (
                      <span className="text-green-600 text-sm ml-2 self-center">
                        Link copied!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {post.tags && post.tags.length > 0 && (
              <motion.div className="mb-12" variants={fadeIn}>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div
              className="mb-16 bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
              variants={fadeIn}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                About the Author
              </h3>
              <div className="flex flex-col md:flex-row items-center md:items-start">
                <div className="relative h-20 w-20 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-6 border-2 border-indigo-100 shadow-md">
                  <Image
                    src={
                      post.author.profilePicture ||
                      `https://avatar.iran.liara.run/username?username=${post.author.name.replace(
                        /\s+/g,
                        "+"
                      )}`
                    }
                    alt={post.author.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="text-center md:text-left">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    {post.author.name}
                  </h4>
                  <p className="text-gray-700 mb-4">
                    {post.author.bio || "No bio available."}
                  </p>
                  <Link
                    href={`/profile/${post.author._id}`}
                    className="text-indigo-600 font-medium hover:underline"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.section className="mb-16" variants={fadeIn}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FaRegComment className="mr-2" /> Comments ({comments.length})
              </h3>

              {isAuthenticated ? (
                <form
                  onSubmit={handleCommentSubmit}
                  className="mb-10 bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                  <h4 className="text-lg font-medium mb-4">Leave a comment</h4>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px] bg-gray-50"
                    required
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      type="submit"
                      disabled={submitting || !commentText.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-xl hover:from-indigo-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-md"
                    >
                      {submitting ? "Submitting..." : "Post Comment"}
                    </button>
                  </div>
                </form>
              ) : (
                <motion.div
                  className="bg-indigo-50 p-8 rounded-2xl mb-10 border border-indigo-100 text-center"
                  variants={fadeIn}
                >
                  <h4 className="text-lg font-medium text-indigo-900 mb-3">
                    Join the conversation!
                  </h4>
                  <p className="text-indigo-800 mb-6">
                    You need to be logged in to comment on this article.
                  </p>
                  <Link
                    href={`/login?redirect=${encodeURIComponent(
                      `/blogs/${id}`
                    )}`}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-sm inline-block"
                  >
                    Sign In to Comment
                  </Link>
                </motion.div>
              )}

              <motion.div className="space-y-6" variants={staggerContainer}>
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <motion.div
                      key={comment._id}
                      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                      variants={fadeIn}
                    >
                      <div className="flex items-start">
                        <div className="relative h-10 w-10 rounded-full overflow-hidden mr-4 border border-gray-200">
                          <Image
                            src={
                              comment.author.profilePicture ||
                              `https://avatar.iran.liara.run/username?username=${comment.author.name.replace(
                                /\s+/g,
                                "+"
                              )}`
                            }
                            alt={comment.author.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-2">
                            <p className="font-medium text-gray-900">
                              {comment.author.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(comment.createdAt)}
                            </p>
                          </div>
                          <p className="text-gray-700">{comment.content}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100"
                    variants={fadeIn}
                  >
                    <FaRegComment className="h-10 w-10 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 mb-1">No comments yet.</p>
                    <p className="text-gray-700 font-medium">
                      Be the first to share your thoughts!
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </motion.section>

            {similarPosts.length > 0 && (
              <motion.section className="mt-20 lg:hidden" variants={fadeIn}>
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  You might also like
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {similarPosts.map((similarPost) => (
                    <motion.div
                      key={similarPost._id}
                      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 group"
                      whileHover={{ y: -5 }}
                      variants={fadeIn}
                    >
                      <div className="relative h-56 w-full overflow-hidden">
                        <Image
                          src={similarPost.coverImage}
                          alt={similarPost.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          style={{ objectFit: "cover" }}
                          className="transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="p-6">
                        <h4 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                          {similarPost.title}
                        </h4>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {similarPost.excerpt}
                        </p>
                        <Link
                          href={`/blogs/${similarPost._id}`}
                          className="inline-flex items-center text-indigo-600 font-medium hover:underline"
                        >
                          Read article
                          <svg
                            className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            ></path>
                          </svg>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}
          </article>

          <motion.div
            className="lg:w-80 xl:w-96 space-y-8"
            variants={fadeIn}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-4">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <FaStar className="mr-2" /> Featured Posts
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {sidebarLoading ? (
                  Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="p-4 flex gap-3">
                        <div className="w-20 h-16 bg-gray-200 rounded animate-pulse"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-5/6 mb-2 animate-pulse"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                        </div>
                      </div>
                    ))
                ) : featuredPosts.length > 0 ? (
                  featuredPosts.slice(0, 4).map((post) => (
                    <Link
                      href={`/blogs/${post._id}`}
                      key={post._id}
                      className="block p-4 hover:bg-indigo-50 transition-colors group"
                    >
                      <div className="flex gap-3">
                        <div className="relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                            {post.title}
                          </h4>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <FaRegEye className="mr-1" />
                            <span>{post.views || 0} views</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    No featured posts available
                  </div>
                )}
              </div>
              <div className="bg-gray-50 px-4 py-3 text-center">
                <Link
                  href="/blogs"
                  className="inline-flex items-center text-indigo-600 font-medium hover:underline text-sm"
                >
                  View all posts
                  <FaChevronRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <FaRegCalendarAlt className="mr-2" /> Recent Posts
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {sidebarLoading ? (
                  Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="p-4">
                        <div className="h-4 bg-gray-200 rounded w-5/6 mb-2 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                      </div>
                    ))
                ) : recentPosts.length > 0 ? (
                  recentPosts.slice(0, 5).map((post) => (
                    <Link
                      href={`/blogs/${post._id}`}
                      key={post._id}
                      className="block p-4 hover:bg-blue-50 transition-colors group"
                    >
                      <h4 className="font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h4>
                      <div className="flex items-center text-xs text-gray-500">
                        <FaRegClock className="mr-1" />
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    No recent posts available
                  </div>
                )}
              </div>
              <div className="bg-gray-50 px-4 py-3 text-center">
                <Link
                  href="/blogs"
                  className="inline-flex items-center text-blue-600 font-medium hover:underline text-sm"
                >
                  Read more articles
                  <FaChevronRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
