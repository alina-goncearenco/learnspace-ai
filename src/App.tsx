
import { useState } from "react";
import "./App.css";

type Course = {
  id: number;
  title: string;
  category: string;
  level: string;
  description: string;
  keywords: string[];
};

const courses: Course[] = [
  {
    id: 1,
    title: "TypeScript Fundamentals",
    category: "Programming",
    level: "Beginner",
    description: "Learn types, interfaces, functions and practical TypeScript.",
    keywords: ["typescript", "programming", "code", "javascript"],
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

const categories = ["All", ...new Set(courses.map((c) => c.category))];

function recommend(question: string): Course[] {
  const words = question.toLowerCase().match(/[a-z]+/g) ?? [];

  return courses
    .map((course) => {
      const text = [
        course.title,
        course.description,
        ...course.keywords,
      ].join(" ").toLowerCase();

      const score = words.reduce(
        (total, word) =>
          total + (word.length > 2 && text.includes(word) ? 1 : 0),
        0
      );

      return { course, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.course);
}

export default function App() {
  const [page, setPage] = useState<"catalog" | "assistant">("catalog");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [recommended, setRecommended] = useState<Course[]>([]);

  const visibleCourses = courses.filter((course) => {
    const matchesCategory =
      category === "All" || course.category === category;

    const matchesSearch =
      `${course.title} ${course.description}`
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  function askAssistant() {
    const prompt = question.trim();
    if (!prompt) return;

    const results = recommend(prompt);
    setRecommended(results);

    setAnswer(
      results.length
        ? "Here are some courses that may help with your learning goal:"
        : "I couldn't find a matching course. Try asking about testing, Python, AI, SQL or security."
    );

    setQuestion("");
  }

  return (
    <main className="app">
      <header className="header">
        <div className="brand">
          <span className="brand-icon">✦</span>
          <span>LearnSpace</span>
        </div>

        <nav>
          <button
            className={page === "catalog" ? "nav active" : "nav"}
            onClick={() => setPage("catalog")}
          >
            Courses
          </button>
          <button
            className={page === "assistant" ? "nav active" : "nav"}
            onClick={() => setPage("assistant")}
          >
            Learning assistant
          </button>
        </nav>
      </header>

      {page === "catalog" ? (
        <section>
          <div className="hero">
            <p className="eyebrow">YOUR LEARNING JOURNEY</p>
            <h1>
              Grow your skills, <span>your way.</span>
            </h1>
            <p>
              Explore practical courses and discover what to learn next.
            </p>
            <button
              className="primary"
              onClick={() => setPage("assistant")}
            >
              Ask the learning assistant →
            </button>
          </div>

          <div className="catalog">
            <div className="catalog-heading">
              <div>
                <h2>Explore courses</h2>
                <p>Find a course that matches your goals.</p>
              </div>
              <span className="count">
                {visibleCourses.length} courses
              </span>
            </div>

            <input
              className="search"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search courses"
            />

            <div className="filters">
              {categories.map((item) => (
                <button
                  key={item}
                  className={
                    category === item ? "filter selected" : "filter"
                  }
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="course-grid">
              {visibleCourses.map((course) => (
                <article className="course-card" key={course.id}>
                  <div className={`course-art art-${course.id}`}>
                    <span>
                      {["⌘", "▦", "◇", "⌁", "↗", "✧", "▤", "◎"][
                        course.id - 1
                      ]}
                    </span>
                  </div>

                  <div className="course-info">
                    <div className="course-meta">
                      <span>{course.category}</span>
                      <span>{course.level}</span>
                    </div>
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>
                    <button
                      className="text-button"
                      onClick={() => setPage("assistant")}
                    >
                      Get a recommendation →
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {visibleCourses.length === 0 && (
              <p className="empty">
                No courses found. Try another search.
              </p>
            )}
          </div>
        </section>
      ) : (
        <section className="assistant">
          <button className="back" onClick={() => setPage("catalog")}>
            ← Back to courses
          </button>

          <div className="assistant-panel">
            <div className="assistant-top">
              <div className="assistant-icon">✦</div>
              <div>
                <h2>Your learning assistant</h2>
                <p>Ask a question and get course suggestions.</p>
              </div>
            </div>

            <div className="chat">
              <div className="bubble bot">
                Hi! Tell me what you'd like to learn, and I'll suggest
                some courses from our catalog.
              </div>

              {answer && <div className="bubble bot">{answer}</div>}

              {recommended.map((course) => (
                <article className="suggestion" key={course.id}>
                  <div className="course-meta">
                    <span>{course.category}</span>
                    <span>{course.level}</span>
                  </div>
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                </article>
              ))}
            </div>

            <div className="prompt-area">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") askAssistant();
                }}
                placeholder="e.g. I want to learn browser automation..."
                aria-label="Ask the learning assistant"
              />
              <button className="primary" onClick={askAssistant}>
                Send ↑
              </button>
            </div>

            <p className="note">
              Demo assistant uses keyword matching, not a live AI model.
            </p>
          </div>
        </section>
      )}

      <footer>LearnSpace · AI Learning Assistant</footer>
    </main>
  );
}