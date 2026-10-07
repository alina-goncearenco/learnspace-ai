import { courses, type Course } from './data/courses';

const assistantStopWords = new Set([
  'i',
  'want',
  'to',
  'learn',
  'the',
  'a',
  'an',
  'about',
  'course',
  'courses',
  'for',
  'how',
  'me',
  'please',
]);

export function recommend(question: string): Course[] {
  const words = (question.toLowerCase().match(/[a-z]+/g) ?? []).filter(
    (word) => word.length > 2 && !assistantStopWords.has(word),
  );

  return courses
    .map((course) => {
      const text = [
        course.title,
        course.description,
        ...course.keywords,
      ].join(' ').toLowerCase();

      const score = words.reduce(
        (total, word) => total + (text.includes(word) ? 1 : 0),
        0,
      );

      return { course, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.course);
}