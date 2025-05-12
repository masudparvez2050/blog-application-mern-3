import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { FaFacebook } from "react-icons/fa";
import { motion } from "framer-motion";

export default function SocialAuthButtons({
  onGoogleSuccess,
  onFacebookSuccess,
  isLoading,
}) {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <div className="space-y-4 mt-6">
      <motion.div variants={itemVariants}>
        <p className="text-center text-sm text-gray-600 mb-3">
          or continue with
        </p>
        <div className="grid grid-cols-2 gap-4">
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
            onScriptLoadSuccess={() => {
              console.log("Google Sign-In script loaded successfully");
              console.log("Current origin:", window.location.origin);
            }}
            onScriptLoadError={(error) => {
              console.error("Google Script Load Error:", error);
              console.error("Current origin:", window.location.origin);
            }}
            scriptProps={{
              nonce: undefined,
              defer: true,
              async: true,
              appendTo: "head",
              baseUrl: "http://localhost:3000"
            }}
          >
            <div className="w-full h-11 flex items-center justify-center">
              <GoogleLogin
                onSuccess={onGoogleSuccess}
                onError={(error) => {
                  console.error("Google Login Failed:", error);
                  window.alert("Google login failed. Please check if you have third-party cookies enabled.");
                }}
                useOneTap
                shape="pill"
                size="large"
                text="continue_with"
                disabled={isLoading}
                locale="en"
                width={300}
              />
            </div>
          </GoogleOAuthProvider>

          <FacebookLogin
            appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || ""}
            onSuccess={onFacebookSuccess}
            className="flex items-center justify-center gap-2 bg-[#1877F2] text-white py-2 px-4 rounded-full w-full hover:bg-[#166FE5] transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isLoading}
            render={({ onClick }) => (
              <button
                type="button"
                onClick={onClick}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 bg-[#1877F2] text-white py-2.5 px-4 rounded-full w-full hover:bg-[#166FE5] transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <FaFacebook className="h-5 w-5" />
                <span>{isLoading ? "Loading..." : "Facebook"}</span>
              </button>
            )}
          />
        </div>
      </motion.div>
    </div>
  );
}
