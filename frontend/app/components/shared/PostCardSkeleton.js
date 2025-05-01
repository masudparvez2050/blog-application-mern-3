export default function PostCardSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-lg overflow-hidden shadow-md">
      <div className="h-48 bg-gray-300"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6 mb-6"></div>
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gray-300 mr-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
}
