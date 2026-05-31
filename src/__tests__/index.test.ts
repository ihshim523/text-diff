import { describe, it, expect } from "vitest";
import { computeDiff, formatDiffAsText, DiffLine } from "../index";

describe("computeDiff", () => {
  it("returns unchanged for identical strings", () => {
    const result = computeDiff("hello\nworld", "hello\nworld");
    expect(result).toEqual([
      { type: "unchanged", content: "hello" },
      { type: "unchanged", content: "world" },
    ]);
  });

  it("returns all added when original is empty", () => {
    const result = computeDiff("", "line1\nline2");
    expect(result).toEqual([
      { type: "added", content: "line1" },
      { type: "added", content: "line2" },
    ]);
  });

  it("returns all removed when changed is empty", () => {
    const result = computeDiff("line1\nline2", "");
    expect(result).toEqual([
      { type: "removed", content: "line1" },
      { type: "removed", content: "line2" },
    ]);
  });

  it("detects added lines in the middle", () => {
    const original = "a\nc";
    const changed = "a\nb\nc";
    const result = computeDiff(original, changed);
    expect(result).toEqual([
      { type: "unchanged", content: "a" },
      { type: "added", content: "b" },
      { type: "unchanged", content: "c" },
    ]);
  });

  it("detects removed lines", () => {
    const original = "a\nb\nc";
    const changed = "a\nc";
    const result = computeDiff(original, changed);
    expect(result).toEqual([
      { type: "unchanged", content: "a" },
      { type: "removed", content: "b" },
      { type: "unchanged", content: "c" },
    ]);
  });

  it("detects line modifications (remove + add)", () => {
    const original = "hello\nworld";
    const changed = "hello\nthere";
    const result = computeDiff(original, changed);
    expect(result).toEqual([
      { type: "unchanged", content: "hello" },
      { type: "removed", content: "world" },
      { type: "added", content: "there" },
    ]);
  });

  it("handles completely different content", () => {
    const original = "aaa";
    const changed = "bbb";
    const result = computeDiff(original, changed);
    expect(result).toEqual([
      { type: "removed", content: "aaa" },
      { type: "added", content: "bbb" },
    ]);
  });

  it("handles single-line strings", () => {
    const result = computeDiff("foo", "bar");
    expect(result).toEqual([
      { type: "removed", content: "foo" },
      { type: "added", content: "bar" },
    ]);
  });

  it("handles empty inputs", () => {
    expect(computeDiff("", "")).toEqual([]);
  });

  it("handles trailing newlines correctly", () => {
    const result = computeDiff("a\nb\n", "a\nb\nc\n");
    expect(result).toEqual([
      { type: "unchanged", content: "a" },
      { type: "unchanged", content: "b" },
      { type: "added", content: "c" },
      { type: "unchanged", content: "" },
    ]);
  });

  it("handles unix-style unified diff example", () => {
    const original = "line1\nline2\nline3\nline4";
    const changed = "line1\nline2\nline3-modified\nline4";
    const result = computeDiff(original, changed);
    expect(result.length).toBeGreaterThan(3);
    expect(result.filter((l) => l.type === "removed").map((l) => l.content)).toContain("line3");
    expect(result.filter((l) => l.type === "added").map((l) => l.content)).toContain("line3-modified");
  });
});

describe("formatDiffAsText", () => {
  it("formats added lines with + prefix", () => {
    const diff: DiffLine[] = [{ type: "added", content: "new line" }];
    expect(formatDiffAsText(diff)).toBe("+ new line");
  });

  it("formats removed lines with - prefix", () => {
    const diff: DiffLine[] = [{ type: "removed", content: "old line" }];
    expect(formatDiffAsText(diff)).toBe("- old line");
  });

  it("formats unchanged lines with two-space prefix", () => {
    const diff: DiffLine[] = [{ type: "unchanged", content: "same" }];
    expect(formatDiffAsText(diff)).toBe("  same");
  });

  it("formats a mixed diff correctly", () => {
    const diff: DiffLine[] = [
      { type: "unchanged", content: "keep" },
      { type: "removed", content: "remove" },
      { type: "added", content: "add" },
    ];
    expect(formatDiffAsText(diff)).toBe("  keep\n- remove\n+ add");
  });

  it("joins lines with newline", () => {
    const diff: DiffLine[] = [
      { type: "unchanged", content: "a" },
      { type: "added", content: "b" },
    ];
    expect(formatDiffAsText(diff)).toBe("  a\n+ b");
  });
});
