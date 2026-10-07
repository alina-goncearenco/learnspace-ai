import type { APIRequestContext, APIResponse } from '@playwright/test';

export class RecommendationsApi {
  constructor(private readonly request: APIRequestContext) {}

  getRecommendations(payload: Record<string, unknown>): Promise<APIResponse> {
    return this.request.post('/api/recommendations', { data: payload });
  }
}
