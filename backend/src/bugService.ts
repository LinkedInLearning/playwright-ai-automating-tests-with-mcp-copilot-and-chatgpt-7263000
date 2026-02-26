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
