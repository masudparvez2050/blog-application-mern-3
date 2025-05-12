"use client";

import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { FaFacebook } from "react-icons/fa";

/**
 * SocialLoginButtons Component - Provides social login options (Google, Facebook)
 *
 * @param {Object} props
 * @param {Function} props.onGoogleLogin - Handler for Google login
 * @param {Function} props.onGoogleError - Handler for Google login errors
 * @param {Function} props.onFacebookLogin - Handler for Facebook login
 * @param {boolean} props.isLoading - Whether a login is in progress
 */
const SocialLoginButtons = ({
  onGoogleLogin,
  onGoogleError,
  onFacebookLogin,
  isLoading = false,
}) => {
  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300/50"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white bg-opacity-70 text-gray-500 backdrop-blur-sm">
            Or continue with
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="transform hover:scale-105 transition-transform">
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
          >
            <GoogleLogin
              onSuccess={onGoogleLogin}
              onError={onGoogleError}
              useOneTap
              type="standard"
              width="100%"
              logo_alignment="center"
              shape="pill"
              text="signin_with"
            />
          </GoogleOAuthProvider>
        </div>
        <div className="transform hover:scale-105 transition-transform">
          <FacebookLogin
            appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}
            autoLoad={false}
            fields="name,email,picture"
            callback={onFacebookLogin}
            render={(renderProps) => (
              <button
                onClick={renderProps.onClick}
                className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-full shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                disabled={isLoading}
              >
                <FaFacebook className="h-5 w-5 text-blue-600 mr-2" />
                <span>Facebook</span>
              </button>
            )}
          />
        </div>
      </div>
    </>
  );
};

export default SocialLoginButtons;
