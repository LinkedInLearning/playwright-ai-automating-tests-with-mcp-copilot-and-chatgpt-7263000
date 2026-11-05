import { readFileSync } from "node:fs";
import type { APIResponse } from "@playwright/test";
import { test, expect, apiUrl, uniqueTitle } from "./api.fixture";
import type { Bug, BugInput } from "./api.fixture";

type ApiError = { error: string; message: string };
type User = { username: string; password: string };

const users = JSON.parse(
  readFileSync(new URL("../../users.json", import.meta.url), "utf8")
) as User[];

function firstUser(): User {
  const user = users[0];
  if (!user) {
    throw new Error("No users are configured in users.json.");
  }
  return user;
}

async function expectApiError(
  response: APIResponse,
  status: number,
  error: string,
  message?: string
): Promise<void> {
  expect(response.status()).toBe(status);
  expect(response.headers()["content-type"]).toContain("application/json");
  const body = (await response.json()) as ApiError;
  expect(body.error).toBe(error);
  if (message !== undefined) {
    expect(body.message).toBe(message);
  }
}

function validBugInput(title = uniqueTitle()): BugInput {
  return {
    title,
    severity: "MID",
    owner: "playwright-api-test",
    description: "A unique test-owned bug.",
  };
}

test.describe("BuggyBoard REST API", () => {
  test("GET /api/health reports a running API and connected database", async ({
    api,
  }) => {
    const response = await api.get(apiUrl("/health"));
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/json");
    await expect(response.json()).resolves.toEqual({
      ok: true,
      message: "BuggyBoard API is running",
      database: "connected",
    });
  });

  test.skip("GET /api/health reports database failure when the probe fails", async () => {
    // The running backend exposes no way to make only its health probe fail.
  });

  test("POST /api/login accepts valid configured credentials without returning the password", async ({
    api,
  }) => {
    const user = firstUser();
    const response = await api.post(apiUrl("/login"), {
      data: { username: user.username, password: user.password },
    });
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/json");
    await expect(response.json()).resolves.toEqual({ username: user.username });
  });

  test("POST /api/login trims surrounding username whitespace", async ({
    api,
  }) => {
    const user = firstUser();
    const response = await api.post(apiUrl("/login"), {
      data: { username: `  ${user.username}  `, password: user.password },
    });
    expect(response.status()).toBe(200);
    await expect(response.json()).resolves.toEqual({ username: user.username });
  });

  test("POST /api/login rejects missing credentials and blank usernames", async ({
    api,
  }) => {
    const user = firstUser();
    await expectApiError(
      await api.post(apiUrl("/login"), { data: {} }),
      400,
      "missing_credentials",
      "Please enter your username and password."
    );
    await expectApiError(
      await api.post(apiUrl("/login"), {
        data: { username: "", password: "" },
      }),
      400,
      "missing_credentials",
      "Please enter your username and password."
    );
    for (const username of [undefined, "   "]) {
      await expectApiError(
        await api.post(apiUrl("/login"), {
          data: { username, password: user.password },
        }),
        400,
        "blank_username",
        "Username cannot be blank."
      );
    }
  });

  test("POST /api/login rejects missing or empty passwords and treats whitespace as an invalid password", async ({
    api,
  }) => {
    const user = firstUser();
    for (const password of [undefined, ""]) {
      await expectApiError(
        await api.post(apiUrl("/login"), {
          data: { username: user.username, password },
        }),
        400,
        "blank_password",
        "Password cannot be blank."
      );
    }
    await expectApiError(
      await api.post(apiUrl("/login"), {
        data: { username: user.username, password: "   " },
      }),
      401,
      "invalid_credentials",
      "Invalid username or password."
    );
  });

  test("POST /api/login responds identically for unknown users and incorrect passwords", async ({
    api,
  }) => {
    const user = firstUser();
    const unknownUser = await api.post(apiUrl("/login"), {
      data: { username: uniqueTitle(), password: user.password },
    });
    const incorrectPassword = await api.post(apiUrl("/login"), {
      data: { username: user.username, password: uniqueTitle() },
    });
    await expectApiError(
      unknownUser,
      401,
      "invalid_credentials",
      "Invalid username or password."
    );
    await expectApiError(
      incorrectPassword,
      401,
      "invalid_credentials",
      "Invalid username or password."
    );
    await expect(unknownUser.json()).resolves.toEqual(
      await incorrectPassword.json()
    );
  });

  test("POST /api/login rejects malformed JSON and incorrectly typed request bodies", async ({
    api,
  }) => {
    const malformed = await api.post(apiUrl("/login"), {
      data: '{"username":',
      headers: { "content-type": "application/json" },
    });
    expect(malformed.status()).toBe(400);

    for (const data of [null, [], 1]) {
      expect((await api.post(apiUrl("/login"), { data })).status()).toBe(400);
    }
    for (const data of [
      { username: 1, password: "value" },
      { username: "user", password: 1 },
    ]) {
      await expectApiError(
        await api.post(apiUrl("/login"), { data }),
        400,
        "invalid_credentials_format",
        "Username and password must be strings."
      );
    }
  });

  test("GET /api/bugs returns an ordered collection containing only correctly shaped bug records", async ({
    api,
    createBug,
  }) => {
    const first = await createBug();
    const second = await createBug();
    const response = await api.get(apiUrl("/bugs"));
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/json");
    const bugs = (await response.json()) as Bug[];
    expect(Array.isArray(bugs)).toBe(true);

    const owned = bugs.filter((bug) => [first.id, second.id].includes(bug.id));
    expect(owned).toEqual([first, second]);
    for (const bug of owned) {
      expect(Object.keys(bug).sort()).toEqual(
        ["id", "title", "severity", "owner", "description", "state"].sort()
      );
    }
  });

  test.skip("GET /api/bugs returns an empty list in an isolated empty database", async () => {
    // The configured development server uses the shared persistent database.
  });

  test("GET /api/bugs ignores unrelated query parameters", async ({
    api,
    createBug,
  }) => {
    const bug = await createBug();
    const response = await api.get(
      apiUrl(`/bugs?unrecognized=${encodeURIComponent(uniqueTitle())}`)
    );
    expect(response.status()).toBe(200);
    const bugs = (await response.json()) as Bug[];
    expect(bugs).toContainEqual(bug);
  });

  test("POST /api/bugs creates a bug with generated ID and default OPEN state", async ({
    api,
    createBug,
  }) => {
    const input = validBugInput();
    const bug = await createBug(input);
    expect(bug).toMatchObject({
      ...input,
      severity: "MID",
      state: "OPEN",
    });
    expect(Number.isInteger(bug.id)).toBe(true);
    expect(bug.id).toBeGreaterThan(0);

    const response = await api.get(apiUrl(`/bugs/${bug.id}`));
    expect(response.status()).toBe(200);
    await expect(response.json()).resolves.toEqual(bug);
  });

  test("POST /api/bugs accepts each severity and trims values", async ({
    createBug,
  }) => {
    const cases = [
      { severity: " high ", expected: "HIGH" },
      { severity: "MID", expected: "MID" },
      { severity: "low", expected: "LOW" },
    ] as const;
    for (const { severity, expected } of cases) {
      const input = validBugInput(` ${uniqueTitle()} `);
      const bug = await createBug({
        ...input,
        owner: "  owner  ",
        description: "  description  ",
        severity,
      });
      expect(bug.severity).toBe(expected);
      expect(bug.title).toBe(input.title.trim());
      expect(bug.owner).toBe("owner");
      expect(bug.description).toBe("description");
    }
  });

  test("POST /api/bugs rejects missing, empty, and whitespace-only required fields", async ({
    api,
  }) => {
    const valid = validBugInput();
    const cases: Array<{
      field: keyof BugInput;
      values: Array<string | undefined>;
      error: string;
      message: string;
    }> = [
      {
        field: "title",
        values: [undefined, "", "   "],
        error: "blank_title",
        message: "Title is required.",
      },
      {
        field: "severity",
        values: [undefined, "", "   "],
        error: "blank_severity",
        message: "Severity is required (high, mid, or low).",
      },
      {
        field: "owner",
        values: [undefined, "", "   "],
        error: "blank_owner",
        message: "Owner is required.",
      },
      {
        field: "description",
        values: [undefined, "", "   "],
        error: "blank_description",
        message: "Description is required.",
      },
    ];

    for (const { field, values, error, message } of cases) {
      for (const value of values) {
        const payload: Partial<BugInput> = { ...valid, [field]: value };
        await expectApiError(
          await api.post(apiUrl("/bugs"), { data: payload }),
          400,
          error,
          message
        );
      }
    }
  });

  test("POST /api/bugs rejects unsupported severities", async ({ api }) => {
    for (const severity of ["urgent", ""]) {
      await expectApiError(
        await api.post(apiUrl("/bugs"), {
          data: { ...validBugInput(), severity },
        }),
        400,
        "blank_severity",
        "Severity is required (high, mid, or low)."
      );
    }
  });

  test("POST /api/bugs rejects malformed JSON and non-string field values", async ({
    api,
  }) => {
    const malformed = await api.post(apiUrl("/bugs"), {
      data: '{"title":',
      headers: { "content-type": "application/json" },
    });
    expect(malformed.status()).toBe(400);

    const cases: Array<{
      field: keyof BugInput;
      error: string;
      message: string;
    }> = [
      { field: "title", error: "blank_title", message: "Title is required." },
      {
        field: "severity",
        error: "blank_severity",
        message: "Severity is required (high, mid, or low).",
      },
      { field: "owner", error: "blank_owner", message: "Owner is required." },
      {
        field: "description",
        error: "blank_description",
        message: "Description is required.",
      },
    ];
    for (const { field, error, message } of cases) {
      await expectApiError(
        await api.post(apiUrl("/bugs"), {
          data: { ...validBugInput(), [field]: 42 },
        }),
        400,
        error,
        message
      );
    }
  });

  test("GET /api/bugs/:id returns an existing bug", async ({
    api,
    createBug,
  }) => {
    const bug = await createBug();
    const response = await api.get(apiUrl(`/bugs/${bug.id}`));
    expect(response.status()).toBe(200);
    await expect(response.json()).resolves.toEqual(bug);
  });

  test("GET /api/bugs/:id rejects malformed and numeric-prefix IDs", async ({
    api,
    createBug,
  }) => {
    const bug = await createBug();
    for (const id of ["not-a-number", `${bug.id}x`]) {
      await expectApiError(
        await api.get(apiUrl(`/bugs/${id}`)),
        400,
        "invalid_id",
        "Bug ID must be a number."
      );
    }
  });

  test("GET /api/bugs/:id returns 404 for a valid nonexistent ID", async ({
    api,
  }) => {
    await expectApiError(
      await api.get(apiUrl(`/bugs/${Number.MAX_SAFE_INTEGER}`)),
      404,
      "not_found",
      "Bug not found."
    );
  });

  test("PUT /api/bugs/:id replaces all editable fields", async ({
    api,
    createBug,
  }) => {
    const bug = await createBug();
    const payload = {
      title: ` ${uniqueTitle()} `,
      severity: "high",
      owner: "  updated-owner  ",
      description: "  updated description  ",
      state: "closed",
    };
    const response = await api.put(apiUrl(`/bugs/${bug.id}`), {
      data: payload,
    });
    expect(response.status()).toBe(200);
    const updated = (await response.json()) as Bug;
    expect(updated).toEqual({
      id: bug.id,
      title: payload.title.trim(),
      severity: "HIGH",
      owner: "updated-owner",
      description: "updated description",
      state: "CLOSED",
    });
    await expect(
      (await api.get(apiUrl(`/bugs/${bug.id}`))).json()
    ).resolves.toEqual(updated);
  });

  test("PUT /api/bugs/:id accepts every supported severity and state", async ({
    api,
    createBug,
  }) => {
    const bug = await createBug();
    const severities = [
      ["high", "HIGH"],
      ["MID", "MID"],
      ["low", "LOW"],
    ] as const;
    const states = [
      ["open", "OPEN"],
      ["CLOSED", "CLOSED"],
    ] as const;
    for (const [severity, expectedSeverity] of severities) {
      for (const [state, expectedState] of states) {
        const response = await api.put(apiUrl(`/bugs/${bug.id}`), {
          data: { ...bug, severity, state },
        });
        expect(response.status()).toBe(200);
        const updated = (await response.json()) as Bug;
        expect(updated.severity).toBe(expectedSeverity);
        expect(updated.state).toBe(expectedState);
      }
    }
  });

  test("PUT /api/bugs/:id rejects invalid IDs and returns 404 before validating a missing record", async ({
    api,
    createBug,
  }) => {
    const bug = await createBug();
    const validUpdate = {
      ...bug,
      title: uniqueTitle(),
    };
    for (const id of ["invalid", `${bug.id}x`]) {
      await expectApiError(
        await api.put(apiUrl(`/bugs/${id}`), { data: validUpdate }),
        400,
        "invalid_id",
        "Bug ID must be a number."
      );
    }
    await expectApiError(
      await api.put(apiUrl(`/bugs/${Number.MAX_SAFE_INTEGER}`), { data: {} }),
      404,
      "not_found",
      "Bug not found."
    );
    await expect(
      (await api.get(apiUrl(`/bugs/${bug.id}`))).json()
    ).resolves.toEqual(bug);
  });

  test("PUT /api/bugs/:id rejects missing, blank, and whitespace-only required fields without changing the bug", async ({
    api,
    createBug,
  }) => {
    const bug = await createBug();
    const cases: Array<{
      field: "title" | "severity" | "owner" | "description" | "state";
      values: Array<string | undefined>;
      error: string;
      message: string;
    }> = [
      {
        field: "title",
        values: [undefined, "", "   "],
        error: "blank_title",
        message: "Title is required.",
      },
      {
        field: "severity",
        values: [undefined, "", "   "],
        error: "blank_severity",
        message: "Severity is required (high, mid, or low).",
      },
      {
        field: "owner",
        values: [undefined, "", "   "],
        error: "blank_owner",
        message: "Owner is required.",
      },
      {
        field: "description",
        values: [undefined, "", "   "],
        error: "blank_description",
        message: "Description is required.",
      },
      {
        field: "state",
        values: [undefined, "", "   "],
        error: "invalid_state",
        message: "State must be Open or Closed.",
      },
    ];

    for (const { field, values, error, message } of cases) {
      for (const value of values) {
        const payload: Record<string, unknown> = { ...bug, [field]: value };
        await expectApiError(
          await api.put(apiUrl(`/bugs/${bug.id}`), { data: payload }),
          400,
          error,
          message
        );
        await expect(
          (await api.get(apiUrl(`/bugs/${bug.id}`))).json()
        ).resolves.toEqual(bug);
      }
    }
  });

  test("PUT /api/bugs/:id rejects unsupported severity and state values without changing the bug", async ({
    api,
    createBug,
  }) => {
    const bug = await createBug();
    const invalidValues = [
      {
        severity: "urgent",
        error: "blank_severity",
        message: "Severity is required (high, mid, or low).",
      },
      {
        state: "in-progress",
        error: "invalid_state",
        message: "State must be Open or Closed.",
      },
    ] as const;
    for (const invalid of invalidValues) {
      await expectApiError(
        await api.put(apiUrl(`/bugs/${bug.id}`), {
          data: { ...bug, ...invalid },
        }),
        400,
        invalid.error,
        invalid.message
      );
      await expect(
        (await api.get(apiUrl(`/bugs/${bug.id}`))).json()
      ).resolves.toEqual(bug);
    }
  });

  test("PUT /api/bugs/:id rejects partial updates without changing the bug", async ({
    api,
    createBug,
  }) => {
    const bug = await createBug();
    await expectApiError(
      await api.put(apiUrl(`/bugs/${bug.id}`), {
        data: { title: uniqueTitle() },
      }),
      400,
      "blank_severity",
      "Severity is required (high, mid, or low)."
    );
    await expect(
      (await api.get(apiUrl(`/bugs/${bug.id}`))).json()
    ).resolves.toEqual(bug);
  });

  test("PUT /api/bugs/:id rejects malformed JSON and non-string fields without changing the bug", async ({
    api,
    createBug,
  }) => {
    const bug = await createBug();
    const malformed = await api.put(apiUrl(`/bugs/${bug.id}`), {
      data: '{"title":',
      headers: { "content-type": "application/json" },
    });
    expect(malformed.status()).toBe(400);

    const cases: Array<{
      field: "title" | "severity" | "owner" | "description" | "state";
      error: string;
      message: string;
    }> = [
      { field: "title", error: "blank_title", message: "Title is required." },
      {
        field: "severity",
        error: "blank_severity",
        message: "Severity is required (high, mid, or low).",
      },
      { field: "owner", error: "blank_owner", message: "Owner is required." },
      {
        field: "description",
        error: "blank_description",
        message: "Description is required.",
      },
      {
        field: "state",
        error: "invalid_state",
        message: "State must be Open or Closed.",
      },
    ];
    for (const { field, error, message } of cases) {
      await expectApiError(
        await api.put(apiUrl(`/bugs/${bug.id}`), {
          data: { ...bug, [field]: 42 },
        }),
        400,
        error,
        message
      );
    }
    await expect(
      (await api.get(apiUrl(`/bugs/${bug.id}`))).json()
    ).resolves.toEqual(bug);
  });

  test("DELETE /api/bugs/:id deletes an existing bug and returns no content", async ({
    api,
    createBug,
  }) => {
    const bug = await createBug();
    const response = await api.delete(apiUrl(`/bugs/${bug.id}`));
    expect(response.status()).toBe(204);
    expect(await response.text()).toBe("");
    await expectApiError(
      await api.get(apiUrl(`/bugs/${bug.id}`)),
      404,
      "not_found",
      "Bug not found."
    );
  });

  test("DELETE /api/bugs/:id rejects invalid IDs without deleting the bug", async ({
    api,
    createBug,
  }) => {
    const bug = await createBug();
    for (const id of ["not-a-number", `${bug.id}x`]) {
      await expectApiError(
        await api.delete(apiUrl(`/bugs/${id}`)),
        400,
        "invalid_id",
        "Bug ID must be a number."
      );
    }
    await expect(
      (await api.get(apiUrl(`/bugs/${bug.id}`))).json()
    ).resolves.toEqual(bug);
  });

  test("DELETE /api/bugs/:id returns 404 for nonexistent and already deleted bugs", async ({
    api,
    createBug,
  }) => {
    const bug = await createBug();
    await expectApiError(
      await api.delete(apiUrl(`/bugs/${Number.MAX_SAFE_INTEGER}`)),
      404,
      "not_found",
      "Bug not found."
    );
    expect((await api.delete(apiUrl(`/bugs/${bug.id}`))).status()).toBe(204);
    await expectApiError(
      await api.delete(apiUrl(`/bugs/${bug.id}`)),
      404,
      "not_found",
      "Bug not found."
    );
  });

  test("API CORS preflight advertises the configured origin, methods, and headers", async ({
    api,
  }) => {
    const response = await api.fetch(apiUrl("/bugs"), {
      method: "OPTIONS",
      headers: {
        Origin: "http://localhost:5173",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "content-type",
      },
    });
    expect(response.status()).toBe(200);
    expect(response.headers()["access-control-allow-origin"]).toBe(
      "http://localhost:5173"
    );
    expect(response.headers()["access-control-allow-methods"]).toBe(
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    expect(response.headers()["access-control-allow-headers"]).toBe(
      "Content-Type"
    );
  });

  test("unknown routes and unsupported methods return 404", async ({ api }) => {
    expect((await api.get(apiUrl("/unknown-endpoint"))).status()).toBe(404);
    expect((await api.post(apiUrl("/health"), { data: {} })).status()).toBe(
      404
    );
  });

  test("API validation errors are JSON and do not expose stack traces", async ({
    api,
  }) => {
    const response = await api.get(apiUrl("/bugs/invalid"));
    await expectApiError(
      response,
      400,
      "invalid_id",
      "Bug ID must be a number."
    );
    const text = await response.text();
    expect(text).not.toMatch(/SyntaxError|TypeError|at \S+:\d+:\d+/);
  });
});
