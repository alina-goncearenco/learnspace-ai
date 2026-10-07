export type Course = {
  id: number;
  title: string;
  category: string;
  level: string;
  description: string;
  keywords: string[];
};

export const courses: Course[] = [
  {
    id: 1,
    title: "TypeScript Fundamentals",
    category: "Programming",
    level: "Beginner",
    description: "Learn types, interfaces, functions and practical TypeScript.",
    keywords: ["typescript", "programming", "code", "javascript", "automation"],
  },
  {
    id: 2,
    title: "Python for Data Analysis",
    category: "Programming",
    level: "Intermediate",
    description: "Explore Python, data structures and data analysis.",
    keywords: ["python", "data", "programming", "analysis"],
  },
  {
    id: 3,
    title: "Introduction to Cybersecurity",
    category: "Security",
    level: "Beginner",
    description: "Understand security principles, threats and safe practices.",
    keywords: ["security", "cybersecurity", "privacy", "threats"],
  },
  {
    id: 4,
    title: "Advanced Playwright",
    category: "Testing",
    level: "Advanced",
    description: "Build maintainable browser automation and end-to-end tests.",
    keywords: ["playwright", "testing", "automation", "browser", "qa"],
  },
  {
    id: 5,
    title: "API Testing Fundamentals",
    category: "Testing",
    level: "Beginner",
    description: "Learn HTTP, API checks, assertions and test design.",
    keywords: ["api", "testing", "automation", "qa", "http"],
  },
  {
    id: 6,
    title: "AI for Software Engineers",
    category: "AI",
    level: "Beginner",
    description: "Explore AI concepts, language models and practical use cases.",
    keywords: ["ai", "llm", "artificial intelligence", "machine learning"],
  },
  {
    id: 7,
    title: "SQL Fundamentals",
    category: "Data",
    level: "Beginner",
    description: "Query and organize relational data using SQL.",
    keywords: ["sql", "database", "data", "query"],
  },
  {
    id: 8,
    title: "Leadership Essentials",
    category: "Business",
    level: "Intermediate",
    description: "Build communication, collaboration and leadership skills.",
    keywords: ["leadership", "management", "communication", "team"],
  },
];