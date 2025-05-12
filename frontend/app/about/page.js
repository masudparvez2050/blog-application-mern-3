
import AboutPageClient from "../components/about/AboutPageClient";

// Proper metadata implementation for better SEO
export const metadata = {
  title: "About Us | Bloggenix",
  description: "Learn more about our blog platform, mission, and team",
  openGraph: {
    title: "About Us | Bloggenix",
    description: "Learn more about our blog platform, mission, and team",
    images: ["/images/about-og.jpg"],
  },
};

// Server component for initial rendering
export default function AboutPage() {
  // Team members data could be fetched from an API in a real production app
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      bio: "Sarah founded our platform in 2022 with a vision to create a space for diverse voices and perspectives.",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop",
    },
    {
      name: "Michael Chen",
      role: "Chief Editor",
      bio: "Michael brings over 15 years of editorial experience, ensuring our content meets the highest standards.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop",
    },
    {
      name: "Aisha Patel",
      role: "Head of Technology",
      bio: "Aisha leads our technical team, continuously improving our platform with innovative features.",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&h=200&auto=format&fit=crop",
    },
  ];

  // Company values data
  const values = [
    {
      title: "Inclusivity",
      desc: "We provide a platform for all voices, regardless of background or experience level. Everyone deserves to be heard.",
      icon: "globe",
    },
    {
      title: "Quality",
      desc: "We believe in the power of well-crafted content. We provide tools and support to help writers produce their best work.",
      icon: "sparkle",
    },
    {
      title: "Trust",
      desc: "We're committed to creating a safe, respectful environment for all users and protecting their data and privacy.",
      icon: "shield",
    },
    {
      title: "Community",
      desc: "We foster connections between writers and readers, creating a supportive ecosystem for growth and learning.",
      icon: "users",
    },
    {
      title: "Innovation",
      desc: "We continuously improve our platform, embracing new technologies to enhance the writing and reading experience.",
      icon: "bolt",
    },
    {
      title: "Fairness",
      desc: "We ensure that our platform treats all contributors equitably, with transparent policies and practices.",
      icon: "scale",
    },
  ];

  // Company stats
  const stats = [
    { label: "Articles Published", value: "50K+" },
    { label: "Active Writers", value: "10K+" },
    { label: "Countries", value: "100+" },
  ];

  return (
    <AboutPageClient teamMembers={teamMembers} values={values} stats={stats} />
  );
}
