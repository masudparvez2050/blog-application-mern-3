// about page
export const teamMembers = [
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

  //about page map
 export const valueItem = [
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                  />
                </svg>
              ),
              title: "Inclusivity",
              desc: "We provide a platform for all voices, regardless of background or experience level. Everyone deserves to be heard.",
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                  />
                </svg>
              ),
              title: "Quality",
              desc: "We believe in the power of well-crafted content. We provide tools and support to help writers produce their best work.",
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>
              ),
              title: "Trust",
              desc: "We're committed to creating a safe, respectful environment for all users and protecting their data and privacy.",
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                  />
                </svg>
              ),
              title: "Community",
              desc: "We foster connections between writers and readers, creating a supportive ecosystem for growth and learning.",
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                  />
                </svg>
              ),
              title: "Innovation",
              desc: "We continuously improve our platform, embracing new technologies to enhance the writing and reading experience.",
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z"
                  />
                </svg>
              ),
              title: "Fairness",
              desc: "We ensure that our platform treats all contributors equitably, with transparent policies and practices.",
            },
        
  ]

    
  export const getEngagementData = (analytics) => {
    // Chart data for content growth
    const contentGrowthData = {
      labels,
      datasets: [
        {
          label: "Posts",
          data: analytics.postsPerMonth?.map((item) => item.count) || [],
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.5)",
          tension: 0.3,
        },
        {
          label: "Comments",
          data: analytics.commentsPerMonth?.map((item) => item.count) || [],
          borderColor: "rgb(147, 51, 234)",
          backgroundColor: "rgba(147, 51, 234, 0.5)",
          tension: 0.3,
        },
        {
          label: "Users",
          data: analytics.usersPerMonth?.map((item) => item.count) || [],
          borderColor: "rgb(16, 185, 129)",
          backgroundColor: "rgba(16, 185, 129, 0.5)",
          tension: 0.3,
        },
      ],
    };
  
    // Chart data for engagement
     const engagementData = {
      labels,
      datasets: [
        {
          label: "Views",
          data: analytics.viewsPerMonth?.map((item) => item.count) || [],
          borderColor: "rgb(245, 158, 11)",
          backgroundColor: "rgba(245, 158, 11, 0.5)",
          tension: 0.3,
        },
        {
          label: "Likes",
          data: analytics.likesPerMonth?.map((item) => item.count) || [],
          borderColor: "rgb(239, 68, 68)",
          backgroundColor: "rgba(239, 68, 68, 0.5)",
          tension: 0.3,
        },
      ],
    };
  
    // Chart options
     const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: false,
        },
        tooltip: {
          backgroundColor: "rgba(17, 24, 39, 0.9)",
          titleColor: "#fff",
          bodyColor: "#fff",
          padding: 12,
          borderColor: "rgba(255, 255, 255, 0.1)",
          borderWidth: 1,
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          usePointStyle: true,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(107, 114, 128, 0.1)",
          },
        },
        x: {
          grid: {
            color: "rgba(107, 114, 128, 0.05)",
          },
        },
      },
      elements: {
        point: {
          radius: 4,
          hoverRadius: 6,
        },
        line: {
          borderWidth: 3,
        },
      },
    };
  }

   // React Quill modules configuration
   export const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link", "image", "video"],
      ["clean"],
      [{ color: [] }, { background: [] }],
      ["blockquote", "code-block"],
    ],
  };





  export const infoData = [
    {
      q: "How do I create an account?",
      a: "You can create an account by clicking on the 'Register' button in the top navigation bar. Fill out the registration form with your details and submit. You'll receive a confirmation email to verify your account.",
    },
    {
      q: "Is it free to publish articles?",
      a: "Yes! Publishing articles on our platform is completely free. We believe in giving writers a platform to share their thoughts without any cost barriers.",
    },
    {
      q: "How long does it take for my article to be approved?",
      a: "Most articles are reviewed within 24-48 hours. Once approved, your article will be published immediately on our platform.",
    },
    {
      q: "Can I edit my published articles?",
      a: "Yes, you can edit your published articles at any time by going to your dashboard and selecting the article you wish to modify.",
    },
    {
      q: "How can I become a featured writer?",
      a: "Featured writers are selected based on the quality and consistency of their content. Publish high-quality articles regularly, engage with the community, and our editorial team might feature you.",
    },
    {
      q: "What types of content are not allowed?",
      a: "We don't allow plagiarized content, hate speech, explicit material, or content that violates copyright laws. Please review our community guidelines for more details.",
    },
  ]