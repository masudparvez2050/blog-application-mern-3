"use client";

/**
 * Auth Loading State component to display during authentication check
 */
const AuthLoadingState = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-indigo-500 animate-spin"></div>
        <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-4 border-b-4 border-indigo-200 animate-pulse"></div>
      </div>
    </div>
  );
};

export default AuthLoadingState;
