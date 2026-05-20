# BuggyBoard REST API Test Plan

## Purpose

Define end-to-end and edge-case tests for the BuggyBoard backend API. The plan covers all exposed endpoints, including success scenarios and validation/failure cases.

## Assumptions

- Backend is available at `http://localhost:3000`
- Client requests use JSON body and `Content-Type: application/json`
- `users.json` contains valid credentials for login tests
- The database starts in a clean or known state for each test suite run

## Endpoints

- `GET /api/health`
- `POST /api/login`
- `GET /api/bugs`
- `POST /api/bugs`
- `GET /api/bugs/:id`
- `PUT /api/bugs/:id`
- `DELETE /api/bugs/:id`

---

## 1. GET /api/health

### 1.1 Positive
- Request: `GET /api/health`
- Expected response: `200`
- Response body:
  - `ok: true`
  - `message: "BuggyBoard API is running"`
  - `database: "connected"` when DB connection is available

### 1.2 Negative
- No negative request scenarios are defined in code for this endpoint, but the test should assert stable behavior even if DB is unavailable by verifying `database` becomes `error` when DB query fails.

---

## 2. POST /api/login

### 2.1 Positive
- Valid credentials
  - Request body: `{ "username": "<valid>", "password": "<valid>" }`
  - Expected response: `200`
  - Response body: `{ "username": "<valid>" }`

### 2.2 Negative
- Missing credentials
  - Request body: `{}`
  - Expected response: `400`
  - Error: `missing_credentials`
  - Message: `Please enter your username and password.`
- Blank username only
  - Request body: `{ "username": "", "password": "pass" }`
  - Expected response: `400`
  - Error: `blank_username`
  - Message: `Username cannot be blank.`
- Blank password only
  - Request body: `{ "username": "user", "password": "" }`
  - Expected response: `400`
  - Error: `blank_password`
  - Message: `Password cannot be blank.`
- Invalid credentials
  - Request body: `{ "username": "wrong", "password": "wrong" }`
  - Expected response: `401`
  - Error: `invalid_credentials`
  - Message: `Invalid username or password.`

---

## 3. GET /api/bugs

### 3.1 Positive
- Request: `GET /api/bugs`
- Expected response: `200`
- Response body: array of bug objects
- Each bug object includes: `id`, `title`, `severity`, `owner`, `description`, `state`

### 3.2 Negative
- No explicit negative failure path exists in code. The test should verify that an empty database returns `[]` and that the endpoint consistently returns JSON.

---

## 4. POST /api/bugs

### 4.1 Positive
- Create a new bug with valid data
  - Request body:
    - `title`: non-empty string
    - `severity`: `high`, `mid`, or `low`
    - `owner`: non-empty string
    - `description`: non-empty string
  - Expected response: `201`
  - Response body contains created bug with:
    - `id`: number
    - `title`, `owner`, `description`
    - `severity`: uppercase `HIGH`/`MID`/`LOW`
    - `state`: `OPEN`

### 4.2 Negative
- Blank title
  - Request body: missing or empty `title`
  - Expected response: `400`
  - Error: `blank_title`
  - Message: `Title is required.`
- Blank severity
  - Request body: missing or empty `severity`
  - Expected response: `400`
  - Error: `blank_severity`
  - Message: `Severity is required (high, mid, or low).`
- Invalid severity value
  - Request body: `severity: "critical"`
  - Expected response: `400`
  - Error: `blank_severity`
  - Message: `Severity is required (high, mid, or low).`
- Blank owner
  - Request body: missing or empty `owner`
  - Expected response: `400`
  - Error: `blank_owner`
  - Message: `Owner is required.`
- Blank description
  - Request body: missing or empty `description`
  - Expected response: `400`
  - Error: `blank_description`
  - Message: `Description is required.`

---

## 5. GET /api/bugs/:id

### 5.1 Positive
- Request: `GET /api/bugs/:id` with existing bug ID
- Expected response: `200`
- Response body is the bug object with matching `id`

### 5.2 Negative
- Invalid ID format
  - Request: `GET /api/bugs/abc`
  - Expected response: `400`
  - Error: `invalid_id`
  - Message: `Bug ID must be a number.`
- Missing bug
  - Request: `GET /api/bugs/999999`
  - Expected response: `404`
  - Error: `not_found`
  - Message: `Bug not found.`

---

## 6. PUT /api/bugs/:id

### 6.1 Positive
- Update existing bug with valid payload
  - Request body includes all fields:
    - `title`: non-empty string
    - `severity`: `high`, `mid`, or `low`
    - `owner`: non-empty string
    - `description`: non-empty string
    - `state`: `open` or `closed`
  - Expected response: `200`
  - Response body is updated bug object with normalized values:
    - `severity`: uppercase `HIGH`/`MID`/`LOW`
    - `state`: uppercase `OPEN`/`CLOSED`

### 6.2 Negative
- Invalid ID format
  - Request: `PUT /api/bugs/abc`
  - Expected response: `400`
  - Error: `invalid_id`
  - Message: `Bug ID must be a number.`
- Bug not found
  - Request: `PUT /api/bugs/999999`
  - Expected response: `404`
  - Error: `not_found`
  - Message: `Bug not found.`
- Blank title
  - Request body: `title: ""`
  - Expected response: `400`
  - Error: `blank_title`
  - Message: `Title is required.`
- Blank severity
  - Request body: `severity: ""`
  - Expected response: `400`
  - Error: `blank_severity`
  - Message: `Severity is required (high, mid, or low).`
- Invalid severity
  - Request body: `severity: "urgent"`
  - Expected response: `400`
  - Error: `blank_severity`
  - Message: `Severity is required (high, mid, or low).`
- Blank owner
  - Request body: `owner: ""`
  - Expected response: `400`
  - Error: `blank_owner`
  - Message: `Owner is required.`
- Blank description
  - Request body: `description: ""`
  - Expected response: `400`
  - Error: `blank_description`
  - Message: `Description is required.`
- Invalid state
  - Request body: `state: "pending"`
  - Expected response: `400`
  - Error: `invalid_state`
  - Message: `State must be Open or Closed.`

---

## 7. DELETE /api/bugs/:id

### 7.1 Positive
- Delete an existing bug by ID
  - Request: `DELETE /api/bugs/:id`
  - Expected response: `204`
  - No response body
  - Verifying the bug is removed by a subsequent `GET /api/bugs/:id` returning `404`

### 7.2 Negative
- Invalid ID format
  - Request: `DELETE /api/bugs/abc`
  - Expected response: `400`
  - Error: `invalid_id`
  - Message: `Bug ID must be a number.`
- Bug not found
  - Request: `DELETE /api/bugs/999999`
  - Expected response: `404`
  - Error: `not_found`
  - Message: `Bug not found.`

---

## 8. Additional API validation flow

- Verify that `PUT` and `POST` require all required fields and do not accept missing, empty, or invalid values.
- Verify that returned `severity` values are normalized to uppercase.
- Verify that returned `state` values are normalized to uppercase.
- Verify ID type enforcement on `GET`, `PUT`, and `DELETE` routes.
- Verify consistent JSON error shape: `{ error, message }`.

## 9. Recommended test structure

- Prepare a clean database state for each test case or suite.
- Create and remove bugs in setup/teardown flows when necessary.
- Use direct API calls rather than UI flows for this backend test plan.
- Keep tests independent and validate both response status and response payload shape.
