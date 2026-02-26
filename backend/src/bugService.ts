import { db } from "./db.js";

export type Severity = "high" | "mid" | "low";

export interface BugInput {
  title: string;
  severity: Severity;
  owner: string;
  description: string;
}

export interface Bug extends BugInput {
  id: number;
}

export type CreateBugResult =
  | { success: true; bug: Bug }
  | {
      success: false;
      code: "BLANK_TITLE" | "BLANK_SEVERITY" | "BLANK_OWNER" | "BLANK_DESCRIPTION" | "INVALID_SEVERITY";
    };

const SEVERITIES: Severity[] = ["high", "mid", "low"];

function isSeverity(s: string): s is Severity {
  return SEVERITIES.includes(s as Severity);
}

/**
 * Create a bug. Validates required fields; ID is set by the database.
 */
export function createBug(input: BugInput): CreateBugResult {
  const title = input.title.trim();
  const owner = input.owner.trim();
  const description = input.description.trim();

  if (title === "") return { success: false, code: "BLANK_TITLE" };
  if (!isSeverity(input.severity)) return { success: false, code: "INVALID_SEVERITY" };
  if (owner === "") return { success: false, code: "BLANK_OWNER" };
  if (description === "") return { success: false, code: "BLANK_DESCRIPTION" };

  const stmt = db.prepare(
    `INSERT INTO bugs (title, severity, owner, description) VALUES (?, ?, ?, ?)`
  );
  const result = stmt.run(title, input.severity, owner, description);
  const id = result.lastInsertRowid as number;

  const bug: Bug = { id, title, severity: input.severity, owner, description };
  return { success: true, bug };
}
