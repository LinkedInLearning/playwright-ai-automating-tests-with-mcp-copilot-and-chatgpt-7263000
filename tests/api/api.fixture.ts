import { randomUUID } from "node:crypto";
import { test as base, expect } from "@playwright/test";
import type { APIRequestContext } from "@playwright/test";

export interface Bug {
  id: number;
  title: string;
  severity: "HIGH" | "MID" | "LOW";
  owner: string;
  description: string;
  state: "OPEN" | "CLOSED";
}

export interface BugInput {
  title: string;
  severity: string;
  owner: string;
  description: string;
}

type ApiFixtures = {
  api: APIRequestContext;
  createBug: (overrides?: Partial<BugInput>) => Promise<Bug>;
};

const apiBaseUrl =
  process.env.BUGGYBOARD_API_URL ?? "http://localhost:3000/api";

export function apiUrl(path: string): string {
  return `${apiBaseUrl}${path}`;
}

export function uniqueTitle(): string {
  return `playwright-api-${randomUUID()}`;
}

export const test = base.extend<ApiFixtures>({
  api: async ({ request }, use) => {
    await use(request);
  },
  createBug: async ({ request }, use) => {
    const createdBugIds = new Set<number>();
    const createBug = async (
      overrides: Partial<BugInput> = {}
    ): Promise<Bug> => {
      const payload: BugInput = {
        title: uniqueTitle(),
        severity: "MID",
        owner: "playwright-api-test",
        description: "Created by an isolated Playwright API test.",
        ...overrides,
      };
      const response = await request.post(apiUrl("/bugs"), { data: payload });
      expect(response.status(), "creating this test's bug").toBe(201);
      const bug = (await response.json()) as Bug;
      createdBugIds.add(bug.id);
      return bug;
    };

    await use(createBug);

    for (const id of createdBugIds) {
      const response = await request.delete(apiUrl(`/bugs/${id}`));
      expect([204, 404], `cleaning up test bug ${id}`).toContain(
        response.status()
      );
    }
  },
});

export { expect };
