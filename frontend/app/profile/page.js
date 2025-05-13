import ProfileClient from "./ProfileClient";

export const metadata = {
  title: "Profile | Bloggenix",
  description:
    "Manage your profile settings, update personal information, and change security preferences",
};

export default function ProfilePage() {
  return (
    <div className="h-[calc(100vh-4rem)] overflow-auto overscroll-none bg-gradient-to-b from-indigo-50/70 via-blue-50/60 to-white scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent scrollbar-thumb-rounded-full mt-16">
      <ProfileClient />
    </div>
  );
}
