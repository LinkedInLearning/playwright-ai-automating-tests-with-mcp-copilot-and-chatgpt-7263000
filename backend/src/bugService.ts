import { db } from "./db.js";

/** Severity is stored in the database as HIGH, MID, LOW. */
export type Severity = "HIGH" | "MID" | "LOW";

export interface BugInput {
  title: string;
  /** Severity (accepts "high"/"mid"/"low" or "HIGH"/"MID"/"LOW"; stored as uppercase). */
  severity: string;
  owner: string;
  description: string;
}

export interface Bug extends BugInput {
  id: number;
  severity: Severity;
}

export type CreateBugResult =
  | { success: true; bug: Bug }
  | {
      success: false;
      code: "BLANK_TITLE" | "BLANK_SEVERITY" | "BLANK_OWNER" | "BLANK_DESCRIPTION" | "INVALID_SEVERITY";
    };

export type UpdateBugResult =
  | { success: true; bug: Bug }
  | { success: false; code: "NOT_FOUND" }
  | {
      success: false;
      code: "BLANK_TITLE" | "BLANK_SEVERITY" | "BLANK_OWNER" | "BLANK_DESCRIPTION" | "INVALID_SEVERITY";
    };

const SEVERITIES: Severity[] = ["HIGH", "MID", "LOW"];

function normalizeSeverity(s: string): Severity | null {
  const u = s.trim().toUpperCase();
  return SEVERITIES.includes(u as Severity) ? (u as Severity) : null;
}

/**
 * Create a bug. Validates required fields; ID is set by the database. Severity is stored as HIGH, MID, LOW.
 */
export function createBug(input: BugInput): CreateBugResult {
  const title = input.title.trim();
  const owner = input.owner.trim();
  const description = input.description.trim();
  const severity = normalizeSeverity(input.severity);

  if (title === "") return { success: false, code: "BLANK_TITLE" };
  if (severity === null) return { success: false, code: "INVALID_SEVERITY" };
  if (owner === "") return { success: false, code: "BLANK_OWNER" };
  if (description === "") return { success: false, code: "BLANK_DESCRIPTION" };

  const stmt = db.prepare(
    `INSERT INTO bugs (title, severity, owner, description) VALUES (?, ?, ?, ?)`
  );
  const result = stmt.run(title, severity, owner, description);
  const id = result.lastInsertRowid as number;

  const bug: Bug = { id, title, severity, owner, description };
  return { success: true, bug };
}

/**
 * Return a single bug by id, or null if not found.
 */
export function getBug(id: number): Bug | null {
  const row = db.prepare("SELECT id, title, severity, owner, description FROM bugs WHERE id = ?").get(id) as
    | { id: number; title: string; severity: string; owner: string; description: string }
    | undefined;
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    severity: row.severity as Severity,
    owner: row.owner,
    description: row.description,
  };
}

/**
 * Update an existing bug. Validates required fields. Returns NOT_FOUND if the bug does not exist.
 */
export function updateBug(id: number, input: BugInput): UpdateBugResult {
  const existing = getBug(id);
  if (!existing) return { success: false, code: "NOT_FOUND" };

  const title = input.title.trim();
  const owner = input.owner.trim();
  const description = input.description.trim();
  const severity = normalizeSeverity(input.severity);

  if (title === "") return { success: false, code: "BLANK_TITLE" };
  if (severity === null) return { success: false, code: "INVALID_SEVERITY" };
  if (owner === "") return { success: false, code: "BLANK_OWNER" };
  if (description === "") return { success: false, code: "BLANK_DESCRIPTION" };

  db.prepare(
    "UPDATE bugs SET title = ?, severity = ?, owner = ?, description = ? WHERE id = ?"
  ).run(title, severity, owner, description, id);

  const bug: Bug = { id, title, severity, owner, description };
  return { success: true, bug };
}

/**
 * Delete a bug by id. Returns NOT_FOUND if the bug does not exist.
 */
export function deleteBug(id: number): { success: true } | { success: false; code: "NOT_FOUND" } {
  const existing = getBug(id);
  if (!existing) return { success: false, code: "NOT_FOUND" };
  db.prepare("DELETE FROM bugs WHERE id = ?").run(id);
  return { success: true };
}

/**
 * Return all bugs from the database, in table order (e.g. by id).
 */
export function listBugs(): Bug[] {
  const rows = db.prepare("SELECT id, title, severity, owner, description FROM bugs ORDER BY id").all() as Array<{
    id: number;
    title: string;
    severity: string;
    owner: string;
    description: string;
  }>;
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    severity: r.severity as Severity,
    owner: r.owner,
    description: r.description,
  })) as Bug[];
}
