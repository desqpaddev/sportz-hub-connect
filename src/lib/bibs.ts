export interface BibSource {
  id: string;
  bib_number: string | null;
  registration_number?: string | null;
}

export interface BibAssignment {
  id: string;
  bib_number: string;
}

/**
 * Builds sequential bib assignments for a list of registrations.
 * Registrations are ordered by their registration number (A001, A002, ...)
 * so bibs follow the same order participants registered in.
 */
export const buildBibAssignments = (
  registrations: BibSource[],
  options?: { prefix?: string; startAt?: number; skipAssigned?: boolean }
): BibAssignment[] => {
  const prefix = (options?.prefix || "BIB").trim().toUpperCase();
  const startAt = options?.startAt ?? 1;
  const skipAssigned = options?.skipAssigned ?? true;

  const pending = registrations
    .filter((r) => (skipAssigned ? !r.bib_number : true))
    .sort((a, b) => (a.registration_number || "").localeCompare(b.registration_number || ""));

  return pending.map((r, i) => ({
    id: r.id,
    bib_number: `${prefix}-${String(startAt + i).padStart(3, "0")}`,
  }));
};

/**
 * Finds the highest existing numeric suffix for bibs like "PREFIX-012"
 * so a new batch continues the sequence instead of colliding.
 */
export const nextBibStart = (registrations: BibSource[], prefix: string): number => {
  const p = (prefix || "BIB").trim().toUpperCase();
  const pattern = new RegExp(`^${p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}-(\\d+)$`, "i");
  let max = 0;
  registrations.forEach((r) => {
    const m = r.bib_number?.match(pattern);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  });
  return max + 1;
};
