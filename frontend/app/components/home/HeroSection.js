import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 mb-4">
              Discover, Create, and Share{" "}
              <span
                className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 animate-gradient animate-pulse"
                style={{
                  backgroundSize: "200% auto",
                  animation: "gradient 3s linear infinite",
                }}
              >
                Amazing Blogs
              </span>
            </h1>
            <style jsx>{`
              @keyframes gradient {
                0% {
                  background-position: 0% center;
                }
                50% {
                  background-position: 100% center;
                }
                100% {
                  background-position: 0% center;
                }
              }
            `}</style>

            <p className="text-lg text-gray-700 mb-8 max-w-lg">
              Join our community of writers and readers. Find inspiration,
              knowledge, and entertainment through thoughtful articles.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="/blogs"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Explore Blogs
              </Link>
              <Link
                href="/register"
                className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium shadow-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Join Now
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2 relative mt-8 md:mt-0">
            <div className="w-full h-64 md:h-96 lg:h-[450px] relative rounded-lg overflow-hidden shadow-xl transform rotate-2">
              <Image
                src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                alt="Blog Hero"
                fill
                style={{ objectFit: "cover" }}
                className="transition-transform duration-300 hover:scale-105"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-yellow-400 rounded-full"></div>
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-400 rounded-full opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
