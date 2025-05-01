"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { mockFeaturedPostsDetails } from "@/app/data/mockPosts";

export default function BlogPost({ params }) {
  const { id } = params;
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [similarPosts, setSimilarPosts] = useState([]);

  console.log(post);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        setLoading(true);
        const postResponse = await fetch(
          `http://localhost:5000/api/posts/${id}`
        );

        if (!postResponse.ok) {
          throw new Error("Post not found");
        }

        const postData = await postResponse.json();
        setPost(postData);

        // Fetch comments for this post
        const commentsResponse = await fetch(
          `http://localhost:5000/api/comments/post/${id}`
        );
        if (commentsResponse.ok) {
          const commentsData = await commentsResponse.json();
          setComments(commentsData);
        }

        // Set similar posts - in a real app you would fetch this from an API
        // Here we're just using mock data for demonstration
        setSimilarPosts(
          mockFeaturedPostsDetails.filter((p) => p._id !== id).slice(0, 2)
        );

        setError(null);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      router.push("/login?redirect=" + encodeURIComponent(`/blogs/${id}`));
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch("http://localhost:5000/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          content: commentText,
          postId: id,
        }),
      });

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

  const isAuthor = post && user && post.author._id === user._id;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6 mb-6"></div>
        <div className="h-64 bg-gray-300 rounded mb-8"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    // Use mock featured post when there's an error
    const mockPost =
      mockFeaturedPostsDetails.find((p) => p._id === id) ||
      mockFeaturedPostsDetails[0];

    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                {error} - Showing preview content instead.
              </p>
            </div>
          </div>
        </div>

        <article>
          {/* Post Header */}
                  <div className="mb-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {mockPost.categories.map((category, index) => (
                    <span
                    key={index}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                    >
                    {category}
                    </span>
                    ))}
                  </div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {mockPost.title}
                  </h1>
                  <div className="flex items-center mb-6">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                    <Image
                    src={mockPost.author.profilePicture || `https://avatar.iran.liara.run/username?username=${mockPost.author.name.replace(/\s+/g, '+')}`}
                    alt={mockPost.author.name}
                    fill
                    style={{ objectFit: "cover" }}
                    onError={(e) => {
                      e.target.src = `https://avatar.iran.liara.run/username?username=${mockPost.author.name.replace(/\s+/g, '+')}`;
                    }}
                    />
                    </div>
                    <div>
                    <p className="text-md font-medium text-gray-900">
                    {mockPost.author.name}
                    </p>
                    <p className="text-sm text-gray-500">
                    {formatDate(mockPost.createdAt)} · {mockPost.views} views
                    </p>
                    </div>
                  </div>
                  </div>

                  {/* Post Cover Image */}
          <div className="relative h-96 w-full mb-8 rounded-xl overflow-hidden">
            <Image
              src={mockPost.coverImage}
              alt={mockPost.title}
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>

          {/* Post Content */}
          <div
            className="prose prose-lg max-w-none mb-12 text-black"
            dangerouslySetInnerHTML={{ __html: mockPost.content }}
          />

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">
              This is demo content shown because the original post couldn&apos;t be
              found.{" "}
              <Link href="/blogs" className="font-medium underline">
                Browse all articles
              </Link>
            </p>
          </div>
        </article>
      </div>
    );
  }

  if (!post) {
    // Use mock featured post when post is not found
    const mockPost =
      mockFeaturedPostsDetails.find((p) => p._id === id) ||
      mockFeaturedPostsDetails[0];

    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Post not found - Showing preview content instead.
              </p>
            </div>
          </div>
        </div>

        <article>
          {/* Post Header */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {mockPost.categories.map((category, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                >
                  {category}
                </span>
              ))}
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {mockPost.title}
            </h1>
            <div className="flex items-center mb-6">
              <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                <Image
                  src={mockPost.author.profilePicture}
                  alt={mockPost.author.name}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div>
                <p className="text-md font-medium text-gray-900">
                  {mockPost.author.name}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(mockPost.createdAt)} · {mockPost.views} views
                </p>
              </div>
            </div>
          </div>

          {/* Post Cover Image */}
          <div className="relative h-96 w-full mb-8 rounded-xl overflow-hidden">
            <Image
              src={mockPost.coverImage}
              alt={mockPost.title}
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>

          {/* Post Content */}
          <div
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: mockPost.content }}
          />

          {/* Tags */}
          {mockPost.tags && mockPost.tags.length > 0 && (
            <div className="mb-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {mockPost.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Author Bio */}
          <div className="border-t border-b py-8 mb-12">
            <h3 className="text-xl font-medium text-gray-900 mb-4">
              About the Author
            </h3>
            <div className="flex items-start">
              <div className="relative h-16 w-16 rounded-full overflow-hidden mr-6">
                <Image
                  src={mockPost.author.profilePicture}
                  alt={mockPost.author.name}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-1">
                  {mockPost.author.name}
                </h4>
                <p className="text-gray-700">
                  {mockPost.author.bio || "No bio available."}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">
              This is demo content shown because the original post couldn&apos;t be
              found.{" "}
              <Link href="/blogs" className="font-medium underline">
                Browse all articles
              </Link>
            </p>
          </div>

          {/* More Articles Section */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              More Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {mockFeaturedPostsDetails
                .filter((p) => p._id !== mockPost._id)
                .slice(0, 2)
                .map((relatedPost) => (
                  <div
                    key={relatedPost._id}
                    className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="relative h-48 w-full">
                      <Image
                        src={relatedPost.coverImage}
                        alt={relatedPost.title}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="text-xl font-semibold mb-2">
                        {relatedPost.title}
                      </h4>
                      <p className="text-gray-600 mb-4">
                        {relatedPost.excerpt}
                      </p>
                      <Link
                        href={`/blogs/${relatedPost._id}`}
                        className="text-blue-600 font-medium hover:underline"
                      >
                        Read article →
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </article>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto py-8">
      {/* Post Header */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {post.categories.map((category, index) => (
            <span
              key={index}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
            >
              {category}
            </span>
          ))}
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

        {/* Author info and date */}
        <div className="flex items-center mb-6">
          <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
            <Image
              src={post.author.profilePicture}
              alt={post.author.name}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <div>
            <p className="text-md font-medium text-gray-900">
              {post.author.name}
            </p>
            <p className="text-sm text-gray-500">
              {formatDate(post.createdAt)} · {post.views} views
            </p>
          </div>
        </div>
      </div>

      {/* Post Cover Image */}
      <div className="relative h-96 w-full mb-8 rounded-xl overflow-hidden">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      {/* Post Content */}
      <div
        className="prose prose-lg max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mb-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Author Bio */}
      <div className="border-t border-b py-8 mb-12">
        <h3 className="text-xl font-medium text-gray-900 mb-4">
          About the Author
        </h3>
        <div className="flex items-start">
          <div className="relative h-16 w-16 rounded-full overflow-hidden mr-6">
            <Image
              src={post.author.profilePicture}
              alt={post.author.name}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-1">
              {post.author.name}
            </h4>
            <p className="text-gray-700">
              {post.author.bio || "No bio available."}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Post Button (Only for author) */}
      {isAuthor && (
        <div className="mb-12 flex justify-end">
          <Link
            href={`/dashboard/edit/${post._id}`}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Edit Post
          </Link>
        </div>
      )}

      {/* Comments Section */}
      <section className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Comments ({comments.length})
        </h3>

        {/* Comment Form */}
        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              required
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={submitting || !commentText.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {submitting ? "Submitting..." : "Submit Comment"}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-gray-100 p-6 rounded-lg mb-8 text-center">
            <p className="text-gray-700 mb-4">
              You need to be logged in to comment.
            </p>
            <Link
              href={`/login?redirect=${encodeURIComponent(`/blogs/${id}`)}`}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Log In
            </Link>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-6">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden mr-4">
                    <Image
                      src={comment.author.profilePicture}
                      alt={comment.author.name}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {comment.author.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      </section>

      {/* Similar Posts Section */}
      {similarPosts.length > 0 && (
        <section className="mt-12 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            You might also like
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {similarPosts.map((similarPost) => (
              <div
                key={similarPost._id}
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={similarPost.coverImage}
                    alt={similarPost.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-xl font-semibold mb-2">
                    {similarPost.title}
                  </h4>
                  <p className="text-gray-600 mb-4">{similarPost.excerpt}</p>
                  <Link
                    href={`/blogs/${similarPost._id}`}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Read article →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
