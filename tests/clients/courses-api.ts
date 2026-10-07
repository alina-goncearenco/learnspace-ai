import type { APIRequestContext, APIResponse } from '@playwright/test';

export class CoursesApi {
  constructor(private readonly request: APIRequestContext) {}

  getCourses(): Promise<APIResponse> {
    return this.request.get('/api/courses');
  }
}
