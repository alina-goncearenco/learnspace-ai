import { expect, test } from '@playwright/test';
import { CoursesApi } from '../clients/courses-api';
import { canonicalCourseTitles, courseTitles } from '../data/learnspace-test-data';
import type { ApiCourse } from '../types/api';

test.describe('Courses API', { tag: '@api' }, () => {
  test('GET /api/courses returns the catalog with valid course records', async ({
    request,
  }) => {
    const coursesApi = new CoursesApi(request);
    const response = await coursesApi.getCourses();

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const body: unknown = await response.json();
    expect(body).toEqual(expect.objectContaining({ courses: expect.any(Array) }));

    const courses = (body as { courses: unknown[] }).courses;
    const courseRecords: ApiCourse[] = [];

    for (const value of courses) {
      expect(value).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          title: expect.any(String),
          category: expect.any(String),
          level: expect.any(String),
          description: expect.any(String),
          keywords: expect.any(Array),
        }),
      );

      const course = value as ApiCourse;
      expect(course.keywords.every((keyword) => typeof keyword === 'string')).toBe(
        true,
      );
      courseRecords.push(course);
    }

    const courseIds = courseRecords.map((course) => course.id);
    expect(new Set(courseIds).size).toBe(courseIds.length);

    const returnedTitles = courseRecords.map((course) => course.title);
    for (const title of canonicalCourseTitles) {
      expect(returnedTitles).toContain(title);
    }

    expect(
      courseRecords.find(
        (course) => course.title === courseTitles.typeScriptFundamentals,
      ),
    )
      .toMatchObject({
        title: courseTitles.typeScriptFundamentals,
        category: 'Programming',
        level: 'Beginner',
        description:
          'Learn types, interfaces, functions and practical TypeScript.',
        keywords: [
          'typescript',
          'programming',
          'code',
          'javascript',
          'automation',
        ],
      });
  });
});
