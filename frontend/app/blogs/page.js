import { Suspense } from "react";
import BlogsPageClient from "./BlogsPageClient";

export const metadata = {
  title: "Blog Posts | Bloggenix",
  description:
    "Discover articles, stories, and insights from our community of writers.",
  openGraph: {
    title: "Blog Posts | Bloggenix",
    description:
      "Discover articles, stories, and insights from our community of writers.",
    images: ["/images/blog-og.jpg"],
  },
};

export default function BlogsPage() {
  return (
    <Suspense fallback={<BlogsLoadingFallback />}>
      <BlogsPageClient />
    </Suspense>
  );
}

function BlogsLoadingFallback() {
  return (
    <div className="min-h-screen pt-16 pb-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 mt-8 md:mt-12">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded-lg mb-8 w-3/4 mx-auto"></div>
          <div className="h-10 bg-gray-200 rounded-lg mb-8 w-full"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-200 rounded-xl h-64"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
