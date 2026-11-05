# BuggyBoard REST API Test Plan

## Scope

Exercise every HTTP operation currently declared by the Express backend:

| Method | Path            | Purpose                              |
| ------ | --------------- | ------------------------------------ |
| GET    | `/api/health`   | Report API and database status       |
| POST   | `/api/login`    | Validate configured user credentials |
| GET    | `/api/bugs`     | List bugs                            |
| POST   | `/api/bugs`     | Create a bug                         |
| GET    | `/api/bugs/:id` | Retrieve one bug                     |
| PUT    | `/api/bugs/:id` | Replace all editable bug fields      |
| DELETE | `/api/bugs/:id` | Delete a bug                         |

This plan describes API-level checks, not browser/UI behavior. Assert both the
HTTP status and response body (including fields, types, and casing) where a
body is expected. For errors, assert the documented `error` code and message.
`DELETE` success is expected to return `204` with no response body.

## Test Data and Isolation

- Read valid login credentials from the project-root `users.json`; do not
  hardcode passwords in test code or logs.
- Use unique bug titles per test. Keep created IDs and delete test-owned bugs
  during teardown, including when an assertion fails.
- Avoid sharing mutable database state between parallel tests. Use a dedicated
  test database/process if the test setup supports it; otherwise serialize
  tests that create, update, list, or delete bugs.
- Create bugs through the API or controlled test setup, not assumptions about
  the initial database contents.
- Bug responses use uppercase `HIGH`, `MID`, `LOW` severity and uppercase
  `OPEN`, `CLOSED` state. Create requests omit state; new bugs default to
  `OPEN`. Update is a full replacement: title, severity, owner, description,
  and state are all required.

## Endpoint Scenarios

### 1. `GET /api/health`

#### 1.1. reports a healthy API and connected database

1. Send a GET request to `/api/health`.
   - expect: Status is `200` and the response is JSON.
   - expect: `ok` is `true`, `message` is `"BuggyBoard API is running"`, and
     `database` is `"connected"`.

#### 1.2. reports a database failure

1. In an isolated test process, make the database query fail and request
   `/api/health`.
   - expect (current behavior): Status is `200`, `ok` remains `true`, and
     `database` is `"error"`.
   - note: Confirm whether the health contract should instead return an
     unhealthy status when the database is unavailable.

### 2. `POST /api/login`

#### 2.1. accepts valid configured credentials

1. Submit a configured username and matching password.
   - expect: Status is `200` and JSON contains the normalized username only.
   - expect: No password is returned.

#### 2.2. trims surrounding username whitespace

1. Submit a valid username with leading/trailing whitespace and its correct
   password.
   - expect: Status is `200` and the response username is trimmed.

#### 2.3. rejects missing credentials

1. Submit an empty JSON object, then submit empty strings for both fields.
   - expect: Status is `400`, `error` is `"missing_credentials"`, and the
     message is `"Please enter your username and password."`.

#### 2.4. rejects a blank username

1. Submit a missing or whitespace-only username with a non-empty password.
   - expect: Status is `400`, `error` is `"blank_username"`, and the message
     is `"Username cannot be blank."`.

#### 2.5. rejects a blank password

1. Submit a configured username with a missing or empty password.
   - expect: Status is `400`, `error` is `"blank_password"`, and the message
     is `"Password cannot be blank."`.
2. Submit a configured username with a whitespace-only password.
   - expect (current behavior): It is treated as a non-empty password and
     returns `401` with `"invalid_credentials"`.
   - note: Confirm whether the login contract should treat whitespace-only
     passwords as blank.

#### 2.6. rejects unknown usernames and incorrect passwords

1. Submit an unknown username and a non-empty password.
2. Submit a configured username with an incorrect non-empty password.
   - expect: Both requests return status `401`, `error` is
     `"invalid_credentials"`, and the message is `"Invalid username or
password."`.
   - expect: The response does not reveal which credential was incorrect.

#### 2.7. handles malformed or incorrectly typed request bodies

1. Submit malformed JSON, a non-object JSON value, and non-string username or
   password values.
   - expect: Malformed JSON is rejected with a client error; invalid value
     types are rejected with status `400` and an `invalid_credentials_format`
     error, without an unhandled server error.

### 3. `GET /api/bugs`

#### 3.1. returns an empty list when there are no bugs

1. Request the collection in an isolated empty test database.
   - expect: Status is `200`, response is a JSON array, and the array is empty.

#### 3.2. returns all bugs in ascending ID order

1. Arrange at least two bugs with known IDs, severities, and states; request
   the collection.
   - expect: Status is `200` and each item contains `id`, `title`, `severity`,
     `owner`, `description`, and `state`.
   - expect: Items are ordered by ascending ID and values match persisted
     records, including uppercase severity and state.

#### 3.3. ignores unrelated query parameters

1. Request the collection with an arbitrary query parameter.
   - expect: Status is `200`; the response remains the complete ordered bug
     list because filtering and pagination are not implemented.

### 4. `POST /api/bugs`

#### 4.1. creates a bug with valid data

1. Submit nonblank title, owner, and description with severity `HIGH`.
   - expect: Status is `201`; JSON contains the supplied fields, a generated
     numeric ID, severity `HIGH`, and state `OPEN`.
   - expect: A subsequent GET by the returned ID returns the same bug.

#### 4.2. accepts all severity values and normalizes case and whitespace

1. Create separate bugs using `high`, `MID`, and `low` (including surrounding
   whitespace in one request).
   - expect: Each returns `201`; stored/returned severities are respectively
     `HIGH`, `MID`, and `LOW`.
   - expect: Required text fields are trimmed before persistence and response.

#### 4.3. rejects a missing, blank, or whitespace-only title

1. Omit title, then submit an empty or whitespace-only title while other
   fields are valid.
   - expect: Status is `400`, `error` is `"blank_title"`, and the message is
     `"Title is required."`.
   - expect: No bug is created.

#### 4.4. rejects missing or invalid severity

1. Omit severity, submit an empty/whitespace value, and submit an unsupported
   value such as `urgent`.
   - expect: Each returns `400`, `error` is `"blank_severity"`, and the message
     is `"Severity is required (high, mid, or low)."`.
   - expect: No bug is created.

#### 4.5. rejects a missing, blank, or whitespace-only owner

1. Omit owner, then submit an empty or whitespace-only owner while other
   fields are valid.
   - expect: Status is `400`, `error` is `"blank_owner"`, and the message is
     `"Owner is required."`.
   - expect: No bug is created.

#### 4.6. rejects a missing, blank, or whitespace-only description

1. Omit description, then submit an empty or whitespace-only description
   while other fields are valid.
   - expect: Status is `400`, `error` is `"blank_description"`, and the
     message is `"Description is required."`.
   - expect: No bug is created.

#### 4.7. rejects malformed JSON and non-string field values

1. Submit malformed JSON and, separately, non-string values for required
   fields.
   - expect: Malformed JSON is rejected with a client error.
   - expect: Invalid field types are rejected with status `400` and do not
     create a bug.

### 5. `GET /api/bugs/:id`

#### 5.1. returns an existing bug

1. Create a bug and request its numeric ID.
   - expect: Status is `200`; the response contains all six bug fields and
     matches the created record.

#### 5.2. rejects an invalid ID

1. Request a non-numeric ID.
   - expect: Status is `400`, `error` is `"invalid_id"`, and the message is
     `"Bug ID must be a number."`.
2. Request a malformed numeric prefix (for example, `12x`).
   - expect: It is rejected with `400`; it must not be interpreted as ID `12`.
   - expect: IDs outside JavaScript's safe integer range are also rejected.

#### 5.3. returns not found for a valid but nonexistent ID

1. Request a positive numeric ID that does not exist.
   - expect: Status is `404`, `error` is `"not_found"`, and the message is
     `"Bug not found."`.

### 6. `PUT /api/bugs/:id`

#### 6.1. replaces all editable fields on an existing bug

1. Create a bug, then submit valid title, severity, owner, description, and
   state values for its ID.
   - expect: Status is `200`; the response contains the same ID and the
     updated values.
   - expect: Severity and state are normalized to uppercase, and required
     text fields are trimmed.
   - expect: A subsequent GET returns the updated values.

#### 6.2. accepts each supported severity and state

1. Update bugs using each severity (`high`, `mid`, `low`) and each state
   (`open`, `closed`), including mixed case.
   - expect: Each update returns `200` and the normalized uppercase value.

#### 6.3. rejects an invalid ID or nonexistent bug

1. Use a non-numeric (and numeric-prefix malformed) ID.
   - expect: Status is `400` with `error` `"invalid_id"`.
2. Use a valid numeric ID that does not exist.
   - expect: Status is `404` with `error` `"not_found"`, even if the body is
     also invalid.

#### 6.4. rejects each missing or blank required field

1. For an existing bug, omit or blank one field at a time: title, severity,
   owner, description, and state. For text fields, include whitespace-only
   values.
   - expect: Each request returns `400` with the corresponding error:
     `"blank_title"`, `"blank_severity"`, `"blank_owner"`,
     `"blank_description"`, or `"invalid_state"`.
   - expect: The existing record remains unchanged after each rejected update.
   - note: Invalid severity uses the same `"blank_severity"` error response as
     blank severity.

#### 6.5. rejects unsupported severity and state values

1. Submit a severity outside `high`/`mid`/`low`, then a state outside
   `open`/`closed`.
   - expect: Invalid severity returns `400` with `error` `"blank_severity"`;
     invalid state returns `400` with `error` `"invalid_state"`.
   - expect: The record remains unchanged.

#### 6.6. rejects partial updates

1. Submit a request containing only one changed field.
   - expect: Status is `400` for the first missing required field; the
     endpoint does not apply a partial update.
   - expect: The stored record remains unchanged.

#### 6.7. rejects malformed JSON and invalid field types

1. Submit malformed JSON and non-string values for fields.
   - expect: Malformed JSON is rejected with a client error; invalid required
     values are rejected with status `400`, without changing the record.

### 7. `DELETE /api/bugs/:id`

#### 7.1. deletes an existing bug

1. Create a bug and delete it by numeric ID.
   - expect: Status is `204` and the response has no body.
   - expect: A subsequent GET by that ID returns `404`.

#### 7.2. rejects an invalid ID

1. Delete using a non-numeric (and numeric-prefix malformed) ID.
   - expect: Status is `400` with `error` `"invalid_id"`.
   - expect: No bug is deleted.

#### 7.3. returns not found for a nonexistent or already deleted ID

1. Delete a valid numeric ID that does not exist.
2. Delete the same ID again after a successful deletion.
   - expect: Each request returns `404` with `error` `"not_found"`.

## Cross-Cutting HTTP Checks

- Send `OPTIONS` preflight requests from `http://localhost:5173` to API routes.
  Verify the configured CORS origin, allowed methods, and allowed headers.
- Verify unsupported methods and unknown `/api/...` paths do not accidentally
  invoke another operation; expect Express's not-found response (`404`).
- Verify JSON endpoints return JSON content types and that error responses do
  not contain stack traces.
- The current login endpoint validates credentials but does not issue a
  cookie/token, and bug routes do not check authentication. Record this as
  current API behavior; do not assume CRUD authentication until an API auth
  contract is added.
