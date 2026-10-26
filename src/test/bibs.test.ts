import { describe, it, expect } from "vitest";
import { buildBibAssignments, nextBibStart } from "@/lib/bibs";

describe("bib generation", () => {
  const regs = [
    { id: "r2", bib_number: null, registration_number: "A002" },
    { id: "r1", bib_number: null, registration_number: "A001" },
    { id: "r3", bib_number: "BIB-009", registration_number: "A003" },
  ];

  it("assigns sequential bibs in registration order, skipping assigned ones", () => {
    const out = buildBibAssignments(regs, { prefix: "BIB" });
    expect(out).toEqual([
      { id: "r1", bib_number: "BIB-001" },
      { id: "r2", bib_number: "BIB-002" },
    ]);
  });

  it("continues the sequence after existing bibs of the same prefix", () => {
    expect(nextBibStart(regs, "BIB")).toBe(10);
    const out = buildBibAssignments(regs, { prefix: "BIB", startAt: nextBibStart(regs, "BIB") });
    expect(out.map((a) => a.bib_number)).toEqual(["BIB-010", "BIB-011"]);
  });

  it("pads numbers to three digits and uppercases the prefix", () => {
    const out = buildBibAssignments([{ id: "r1", bib_number: null, registration_number: "A001" }], { prefix: "tdk", startAt: 5 });
    expect(out[0].bib_number).toBe("TDK-005");
  });
});
