const sampleData = {
  isFresher: false,
  activeOptional: ["certifications", "achievements", "opensource"],

  personalInfo: {
    fullName: "Arjun Sharma",
    headline: "Full-Stack Developer",
    email: "arjun.sharma@email.com",
    phone: "+91 98765 43210",
    city: "Bangalore, India",
  },

  links: [
    { id: "lnk-s1", type: "LinkedIn", url: "https://linkedin.com/in/arjunsharma" },
    { id: "lnk-s2", type: "GitHub", url: "https://github.com/arjunsharma" },
    { id: "lnk-s3", type: "Portfolio", url: "https://arjunsharma.dev" },
  ],

  summary:
    "Passionate full-stack developer with 2+ years of experience building scalable web applications. Proficient in React, Node.js, and cloud technologies. Strong problem-solver with a keen eye for clean UI design and efficient backend architecture.",

  education: [
    {
      id: "edu-s1",
      college: "Indian Institute of Technology, Bombay",
      degree: "B.Tech",
      branch: "Computer Science & Engineering",
      startYear: "2019",
      endYear: "2023",
      cgpa: "8.72",
    },
  ],

  skills: {
    languages: ["JavaScript", "TypeScript", "Python", "C++", "SQL"],
    web: ["React", "Next.js", "Node.js", "Express", "Tailwind CSS", "HTML/CSS"],
    databases: ["PostgreSQL", "MongoDB", "Redis", "Firebase"],
    tools: ["Git", "Docker", "AWS", "Figma", "Postman", "Linux"],
  },

  projects: [
    {
      id: "proj-s1",
      name: "TaskFlow — Project Management App",
      techStack: "React, Node.js, PostgreSQL, Socket.io",
      liveLink: "https://taskflow.arjunsharma.dev",
      githubLink: "https://github.com/arjunsharma/taskflow",
      bullets: [
        "Built a real-time Kanban board with drag-and-drop, WebSocket updates, and team collaboration features.",
        "Implemented JWT auth, role-based access control, and REST API serving 500+ daily active users.",
        "Optimized database queries reducing average response time by 40% using indexing and caching.",
      ],
    },
    {
      id: "proj-s2",
      name: "DevBlog — Technical Blogging Platform",
      techStack: "Next.js, MDX, Tailwind CSS, Vercel",
      liveLink: "https://devblog.arjunsharma.dev",
      githubLink: "https://github.com/arjunsharma/devblog",
      bullets: [
        "Designed a markdown-powered blog with syntax highlighting, SEO optimization, and RSS feed generation.",
        "Achieved 95+ Lighthouse performance score with SSG, image optimization, and lazy loading.",
      ],
    },
  ],

  experience: [
    {
      id: "exp-s1",
      company: "Razorpay",
      role: "Software Engineering Intern",
      duration: "May 2022 – Jul 2022",
      bullets: [
        "Developed and shipped a merchant analytics dashboard used by 10,000+ businesses to track payment trends.",
        "Refactored legacy API endpoints to a microservices architecture, improving deployment frequency by 3×.",
        "Wrote 50+ unit and integration tests achieving 92% code coverage on critical payment flow modules.",
      ],
    },
    {
      id: "exp-s2",
      company: "Google Summer of Code — Mozilla",
      role: "Open Source Contributor",
      duration: "Jun 2021 – Sep 2021",
      bullets: [
        "Contributed to Firefox DevTools, fixing 12 bugs and implementing a CSS grid overlay feature.",
        "Collaborated with a distributed team of 8 mentors and contributors across 4 time zones.",
      ],
    },
  ],

  certifications: [
    {
      id: "cert-s1",
      name: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      issueDate: "2023",
      url: "https://aws.amazon.com/certification",
    },
    {
      id: "cert-s2",
      name: "Certified Kubernetes Application Developer (CKAD)",
      issuer: "Cloud Native Computing Foundation",
      issueDate: "2024",
      url: "https://www.cncf.io",
    },
  ],

  leadership: [
    {
      id: "lead-s1",
      organization: "Developer Student Club IIT Bombay",
      role: "Technical Lead",
      duration: "Aug 2021 – May 2022",
      bullets: [
        "Mentored 120+ student engineers across full-stack workshops and hackathons.",
        "Organized 4 community tech meetups with guest speakers from top tech firms.",
      ],
    },
  ],

  achievements: [
    { id: "ach-s1", text: "Ranked in the top 0.5% in Google Code Jam 2022 (Round 2 qualifier)." },
    { id: "ach-s2", text: "AWS Certified Solutions Architect – Associate (2023)." },
    { id: "ach-s3", text: "Winner, Smart India Hackathon 2022 – Built an AI-powered crop disease detection system." },
    { id: "ach-s4", text: "Published a research paper on distributed caching strategies at IEEE ICCCNT 2023." },
  ],

  opensource: [
    {
      id: "oss-s1",
      projectName: "Firefox DevTools",
      role: "Contributor",
      link: "https://github.com/firefox-devtools",
      description: "Implemented CSS Grid overlay inspection features and patched layout bugs.",
    },
  ],

  publications: [
    {
      id: "pub-s1",
      title: "Distributed Caching Strategies for High-Throughput Edge Nodes",
      venue: "IEEE ICCCNT",
      date: "2023",
      link: "https://doi.org/10.1109/ICCCNT.2023.1001",
    },
  ],

  languages: [
    { id: "lang-s1", language: "English", proficiency: "Native / Bilingual" },
    { id: "lang-s2", language: "Hindi", proficiency: "Native / Bilingual" },
    { id: "lang-s3", language: "German", proficiency: "Elementary (A2)" },
  ],

  interests: [
    { id: "int-s1", name: "Distributed Systems Architecture" },
    { id: "int-s2", name: "Chess & Game Theory" },
    { id: "int-s3", name: "Competitive Programming" },
  ],

  custom: [
    {
      id: "cust-s1",
      heading: "Volunteering & Community",
      bullets: [
        "Volunteered as code tutor for underprivileged STEM students.",
        "Delivered a lightning talk on modern React rendering paradigms at BangaloreJS.",
      ],
    },
  ],

  coursework: [
    { id: "cw-s1", course: "Data Structures & Algorithms" },
    { id: "cw-s2", course: "Operating Systems & Networking" },
    { id: "cw-s3", course: "Database Management Systems" },
    { id: "cw-s4", course: "Cloud Computing & Distributed Systems" },
  ],

  testScores: [
    {
      id: "ts-s1",
      examName: "GRE",
      score: "332 / 340",
      date: "2023",
      percentile: "96th Percentile",
    },
  ],
};

export default sampleData;
