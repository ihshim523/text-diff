# text-diff

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A lightweight, zero-dependency text diff library in pure TypeScript. Uses the **Longest Common Subsequence (LCS)** algorithm to compute line-level diffs between two strings.

## Features

- **Zero runtime dependencies** — just TypeScript
- **Line-level diff** using the classic LCS dynamic programming approach
- **Unified-diff formatting** — output that looks like `git diff`
- **100% TypeScript** with full type declarations
- **Tiny** — ~70 lines of source, ~2KB compiled

## Installation

```bash
npm install text-diff
```

## Usage

```typescript
import { computeDiff, formatDiffAsText } from "text-diff";

const original = `hello
world
foo`;

const changed = `hello
there
foo`;

const diff = computeDiff(original, changed);
// [
//   { type: "unchanged", content: "hello" },
//   { type: "removed",  content: "world" },
//   { type: "added",    content: "there" },
//   { type: "unchanged", content: "foo" },
// ]

console.log(formatDiffAsText(diff));
//   hello
// - world
// + there
//   foo
```

### API

#### `computeDiff(original: string, changed: string): DiffLine[]`

Returns an ordered array of `DiffLine` objects:

| Property  | Type                              | Description                |
|-----------|-----------------------------------|----------------------------|
| `type`    | `"added" \| "removed" \| "unchanged"` | The change classification |
| `content` | `string`                          | The line content           |

#### `formatDiffAsText(diff: DiffLine[]): string`

Formats a `DiffLine` array into a unified-diff-style text representation:

- Lines prefixed with `+` were added
- Lines prefixed with `-` were removed
- Lines prefixed with `  ` (two spaces) are unchanged

## Algorithm

Uses the classic **Longest Common Subsequence (LCS)** approach:
1. Build a DP table of line matches between original and changed text
2. Backtrack through the table to classify each line as added, removed, or unchanged
3. Return the result in original document order

Time complexity: O(m × n) where m = original lines, n = changed lines

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build
```

## License

MIT © [ihshim523](https://github.com/ihshim523)

---

*Part of the [freeq.one](https://freeq.one) suite of online developer tools — a collection of fast, client-side utilities for developers. Originally extracted from the [free-online-tools](https://github.com/ihshim523/free-online-tools) project.*
