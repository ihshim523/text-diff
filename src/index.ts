export type DiffType = "added" | "removed" | "unchanged";

export interface DiffLine {
  type: DiffType;
  content: string;
}

/**
 * Compute a line-level diff between two strings using the
 * Longest Common Subsequence (LCS) algorithm.
 *
 * Returns an ordered array of DiffLine objects describing which
 * lines were added, removed, or remained unchanged.
 */
export function computeDiff(original: string, changed: string): DiffLine[] {
  if (!original && !changed) {
    return [];
  }

  if (original === changed) {
    return original.split("\n").map((line) => ({ type: "unchanged" as const, content: line }));
  }

  if (!original) {
    return changed.split("\n").map((line) => ({ type: "added" as const, content: line }));
  }

  if (!changed) {
    return original.split("\n").map((line) => ({ type: "removed" as const, content: line }));
  }

  const originalLines = original.split("\n");
  const changedLines = changed.split("\n");
  const m = originalLines.length;
  const n = changedLines.length;

  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (originalLines[i - 1] === changedLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const result: DiffLine[] = [];
  let i = m;
  let j = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && originalLines[i - 1] === changedLines[j - 1]) {
      result.push({ type: "unchanged", content: originalLines[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.push({ type: "added", content: changedLines[j - 1] });
      j--;
    } else {
      result.push({ type: "removed", content: originalLines[i - 1] });
      i--;
    }
  }

  return result.reverse();
}

/**
 * Format a DiffLine array into a unified-diff-style text representation.
 *
 * - Lines prefixed with `+` were added
 * - Lines prefixed with `-` were removed
 * - Lines prefixed with ` ` (two spaces) are unchanged
 */
export function formatDiffAsText(diff: DiffLine[]): string {
  return diff
    .map((line) => {
      switch (line.type) {
        case "added":
          return `+ ${line.content}`;
        case "removed":
          return `- ${line.content}`;
        case "unchanged":
          return `  ${line.content}`;
      }
    })
    .join("\n");
}
