import { expect, test } from '@playwright/test';
import { CoursesApi } from '../clients/courses-api';
import { RecommendationsApi } from '../clients/recommendations-api';
import {
  courseTitles,
  invalidRecommendationRequests,
  recommendationApiPrompts,
} from '../data/learnspace-test-data';
import type { ApiCourse } from '../types/api';

test.describe('Recommendations API', { tag: '@api' }, () => {
  test('POST /api/recommendations returns supported catalog recommendations', async ({
    request,
  }) => {
    const coursesApi = new CoursesApi(request);
    const recommendationsApi = new RecommendationsApi(request);
    const catalogResponse = await coursesApi.getCourses();

    expect(catalogResponse.status()).toBe(200);
    const catalogBody: unknown = await catalogResponse.json();
    expect(catalogBody).toEqual(
      expect.objectContaining({ courses: expect.any(Array) }),
    );
    const catalog = (catalogBody as { courses: ApiCourse[] }).courses;
    const pythonCourse = catalog.find(
      (course) => course.title === courseTitles.pythonForDataAnalysis,
    );
    expect(pythonCourse).toBeDefined();

    const response = await recommendationsApi.getRecommendations({
      prompt: recommendationApiPrompts.python,
    });

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const body: unknown = await response.json();
    expect(body).toEqual(
      expect.objectContaining({ recommendations: expect.any(Array) }),
    );

    const recommendations = (body as { recommendations: unknown[] })
      .recommendations;
    const recommendationRecords: ApiCourse[] = [];

    for (const value of recommendations) {
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

      const recommendation = value as ApiCourse;
      expect(
        recommendation.keywords.every((keyword) => typeof keyword === 'string'),
      ).toBe(true);
      recommendationRecords.push(recommendation);
    }

    expect(recommendationRecords).toContainEqual(pythonCourse);

    for (const recommendation of recommendationRecords) {
      expect(catalog).toContainEqual(recommendation);
    }
  });

  test('POST /api/recommendations abstains for an unsupported topic', async ({
    request,
  }) => {
    const recommendationsApi = new RecommendationsApi(request);
    const response = await recommendationsApi.getRecommendations({
      prompt: recommendationApiPrompts.unsupported,
    });

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const body: unknown = await response.json();
    expect(body).toEqual({ recommendations: [] });
  });

  for (const { name, payload } of invalidRecommendationRequests) {
    test(`POST /api/recommendations rejects ${name}`, async ({ request }) => {
      const recommendationsApi = new RecommendationsApi(request);
      const response = await recommendationsApi.getRecommendations(payload);

      expect(response.status()).toBe(400);
      expect(response.headers()['content-type']).toContain('application/json');
      await expect(response.json()).resolves.toEqual({
        error: 'prompt must be a non-empty string',
      });
    });
  }
});
