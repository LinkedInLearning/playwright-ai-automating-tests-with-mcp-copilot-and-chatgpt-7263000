import { test, expect, type APIRequestContext } from '@playwright/test';

const apiBase = 'http://localhost:3000';

function uniqueValue(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function createBug(api: APIRequestContext, details?: Partial<Record<string, string>>) {
  const bug = {
    title: details?.title ?? uniqueValue('API create bug'),
    severity: details?.severity ?? 'high',
    owner: details?.owner ?? 'API Tester',
    description: details?.description ?? 'Created from API test',
  };
  const response = await api.post(`${apiBase}/api/bugs`, { data: bug });
  const body = await response.json();
  return { response, body, bug };
}

async function deleteBug(api: APIRequestContext, id: number) {
  return await api.delete(`${apiBase}/api/bugs/${id}`);
}

test.describe('BuggyBoard REST API', () => {
  test('GET /api/health returns healthy JSON', async ({ request }) => {
    const response = await request.get(`${apiBase}/api/health`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toEqual(
      expect.objectContaining({
        ok: true,
        message: 'BuggyBoard API is running',
      })
    );
    expect(body.database).toBeDefined();
  });

  test('POST /api/login succeeds with valid credentials', async ({ request }) => {
    const response = await request.post(`${apiBase}/api/login`, {
      data: { username: 'buggy', password: '1970beetle' },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toEqual({ username: 'buggy' });
  });

  test('POST /api/login fails when missing credentials', async ({ request }) => {
    const response = await request.post(`${apiBase}/api/login`, { data: {} });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toEqual({
      error: 'missing_credentials',
      message: 'Please enter your username and password.',
    });
  });

  test('POST /api/login fails when username is blank', async ({ request }) => {
    const response = await request.post(`${apiBase}/api/login`, {
      data: { username: '', password: '1970beetle' },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toEqual({
      error: 'blank_username',
      message: 'Username cannot be blank.',
    });
  });

  test('POST /api/login fails when password is blank', async ({ request }) => {
    const response = await request.post(`${apiBase}/api/login`, {
      data: { username: 'buggy', password: '' },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toEqual({
      error: 'blank_password',
      message: 'Password cannot be blank.',
    });
  });

  test('POST /api/login fails with invalid credentials', async ({ request }) => {
    const response = await request.post(`${apiBase}/api/login`, {
      data: { username: 'invalid-user', password: 'wrong-pass' },
    });
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body).toEqual({
      error: 'invalid_credentials',
      message: 'Invalid username or password.',
    });
  });

  test('GET /api/bugs returns array of bugs', async ({ request }) => {
    const { body } = await createBug(request);
    const createdBug = body;
    try {
      const response = await request.get(`${apiBase}/api/bugs`);
      expect(response.status()).toBe(200);
      const list = await response.json();
      expect(Array.isArray(list)).toBe(true);
      expect(list).toEqual(expect.arrayContaining([expect.objectContaining({ id: createdBug.id })]));
    } finally {
      await deleteBug(request, createdBug.id);
    }
  });

  test('POST /api/bugs creates a bug and returns normalized values', async ({ request }) => {
    const title = uniqueValue('API create positive');
    const response = await request.post(`${apiBase}/api/bugs`, {
      data: {
        title,
        severity: 'low',
        owner: 'API Owner',
        description: 'API create bug description',
      },
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        title,
        severity: 'LOW',
        owner: 'API Owner',
        description: 'API create bug description',
        state: 'OPEN',
      })
    );

    await deleteBug(request, body.id);
  });

  test('POST /api/bugs fails when title is blank', async ({ request }) => {
    const response = await request.post(`${apiBase}/api/bugs`, {
      data: { title: '', severity: 'high', owner: 'API', description: 'desc' },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toEqual({ error: 'blank_title', message: 'Title is required.' });
  });

  test('POST /api/bugs fails when severity is invalid', async ({ request }) => {
    const response = await request.post(`${apiBase}/api/bugs`, {
      data: { title: uniqueValue('invalid severity'), severity: 'critical', owner: 'API', description: 'desc' },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toEqual({
      error: 'blank_severity',
      message: 'Severity is required (high, mid, or low).',
    });
  });

  test('POST /api/bugs fails when owner is blank', async ({ request }) => {
    const response = await request.post(`${apiBase}/api/bugs`, {
      data: { title: uniqueValue('blank owner'), severity: 'mid', owner: '', description: 'desc' },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toEqual({ error: 'blank_owner', message: 'Owner is required.' });
  });

  test('POST /api/bugs fails when description is blank', async ({ request }) => {
    const response = await request.post(`${apiBase}/api/bugs`, {
      data: { title: uniqueValue('blank description'), severity: 'low', owner: 'API', description: '' },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toEqual({ error: 'blank_description', message: 'Description is required.' });
  });

  test('GET /api/bugs/:id returns existing bug', async ({ request }) => {
    const { body } = await createBug(request, { title: uniqueValue('GET bug') });
    const createdId = body.id;
    try {
      const response = await request.get(`${apiBase}/api/bugs/${createdId}`);
      expect(response.status()).toBe(200);
      const bug = await response.json();
      expect(bug).toEqual(expect.objectContaining({ id: createdId }));
    } finally {
      await deleteBug(request, createdId);
    }
  });

  test('GET /api/bugs/:id returns 400 for invalid id', async ({ request }) => {
    const response = await request.get(`${apiBase}/api/bugs/abc`);
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toEqual({ error: 'invalid_id', message: 'Bug ID must be a number.' });
  });

  test('GET /api/bugs/:id returns 404 when bug is not found', async ({ request }) => {
    const response = await request.get(`${apiBase}/api/bugs/9999999`);
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body).toEqual({ error: 'not_found', message: 'Bug not found.' });
  });

  test('PUT /api/bugs/:id updates an existing bug', async ({ request }) => {
    const { body } = await createBug(request, { title: uniqueValue('PUT bug') });
    const id = body.id;
    try {
      const updateResponse = await request.put(`${apiBase}/api/bugs/${id}`, {
        data: {
          title: 'Updated API Title',
          severity: 'mid',
          owner: 'Updated Owner',
          description: 'Updated description',
          state: 'closed',
        },
      });
      expect(updateResponse.status()).toBe(200);
      const updated = await updateResponse.json();
      expect(updated).toEqual(
        expect.objectContaining({
          id,
          title: 'Updated API Title',
          severity: 'MID',
          owner: 'Updated Owner',
          description: 'Updated description',
          state: 'CLOSED',
        })
      );
    } finally {
      await deleteBug(request, id);
    }
  });

  test('PUT /api/bugs/:id returns 400 for invalid bug id', async ({ request }) => {
    const response = await request.put(`${apiBase}/api/bugs/abc`, {
      data: {
        title: 'Invalid',
        severity: 'high',
        owner: 'API',
        description: 'desc',
        state: 'open',
      },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toEqual({ error: 'invalid_id', message: 'Bug ID must be a number.' });
  });

  test('PUT /api/bugs/:id returns 404 when bug not found', async ({ request }) => {
    const response = await request.put(`${apiBase}/api/bugs/9999999`, {
      data: {
        title: 'Missing bug',
        severity: 'high',
        owner: 'API',
        description: 'desc',
        state: 'open',
      },
    });
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body).toEqual({ error: 'not_found', message: 'Bug not found.' });
  });

  test('PUT /api/bugs/:id fails with invalid state', async ({ request }) => {
    const { body } = await createBug(request, { title: uniqueValue('invalid state') });
    const id = body.id;
    try {
      const response = await request.put(`${apiBase}/api/bugs/${id}`, {
        data: {
          title: 'Title',
          severity: 'high',
          owner: 'API',
          description: 'desc',
          state: 'pending',
        },
      });
      expect(response.status()).toBe(400);
      const errorBody = await response.json();
      expect(errorBody).toEqual({ error: 'invalid_state', message: 'State must be Open or Closed.' });
    } finally {
      await deleteBug(request, id);
    }
  });

  test('PUT /api/bugs/:id fails with blank fields', async ({ request }) => {
    const { body } = await createBug(request, { title: uniqueValue('blank-fields') });
    const id = body.id;
    try {
      const response = await request.put(`${apiBase}/api/bugs/${id}`, {
        data: {
          title: '',
          severity: '',
          owner: '',
          description: '',
          state: 'open',
        },
      });
      expect(response.status()).toBe(400);
      const body2 = await response.json();
      expect(body2).toEqual({ error: 'blank_title', message: 'Title is required.' });
    } finally {
      await deleteBug(request, id);
    }
  });

  test('DELETE /api/bugs/:id removes bug and returns 204', async ({ request }) => {
    const { body } = await createBug(request, { title: uniqueValue('DELETE bug') });
    const id = body.id;
    const deleteResponse = await request.delete(`${apiBase}/api/bugs/${id}`);
    expect(deleteResponse.status()).toBe(204);

    const getResponse = await request.get(`${apiBase}/api/bugs/${id}`);
    expect(getResponse.status()).toBe(404);
    const errorBody = await getResponse.json();
    expect(errorBody).toEqual({ error: 'not_found', message: 'Bug not found.' });
  });

  test('DELETE /api/bugs/:id returns 400 for invalid id', async ({ request }) => {
    const response = await request.delete(`${apiBase}/api/bugs/abc`);
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toEqual({ error: 'invalid_id', message: 'Bug ID must be a number.' });
  });

  test('DELETE /api/bugs/:id returns 404 when bug does not exist', async ({ request }) => {
    const response = await request.delete(`${apiBase}/api/bugs/9999999`);
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body).toEqual({ error: 'not_found', message: 'Bug not found.' });
  });
});
