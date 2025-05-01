import Link from "next/link";

export default function CallToActionSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl py-12 px-8 md:px-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to share your story?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our community of writers and readers. Create an account to
            start sharing your knowledge and connect with others.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/register"
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-medium shadow-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            >
              Sign Up Now
            </Link>
            <Link
              href="/blogs"
              className="px-8 py-3 bg-transparent text-white border border-white rounded-lg font-medium hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            >
              Explore Blogs
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
