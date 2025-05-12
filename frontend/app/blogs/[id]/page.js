import BlogPostClient from "./BlogPostClient";
import { getBlogPostById } from "@/app/services/blogApi";

// Dynamic metadata generation
export async function generateMetadata({ params }) {
  try {
    const post = await getBlogPostById(params.id);

    if (!post) {
      return {
        title: "Post Not Found | Bloggenix",
        description: "The requested blog post could not be found.",
      };
    }

    return {
      title: `${post.title} | Bloggenix`,
      description:
        post.excerpt || `Read ${post.title} and more articles on Bloggenix`,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        images: [post.coverImage],
        type: "article",
        authors: [post.author.name],
        publishedTime: post.createdAt,
        tags: post.tags,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Blog Post | Bloggenix",
      description: "Discover interesting articles on Bloggenix",
    };
  }
}

export default function BlogPostPage({ params }) {
  return <BlogPostClient postId={params.id} />;
}

