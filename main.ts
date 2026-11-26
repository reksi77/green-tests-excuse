// Green Tests, Nothing Works: The Excuse Contest
// Writes one one-line excuse (<=140 chars, no trailing newline) to /output/entry.txt.
//
// The line: an AI agent's deadpan confession for a test suite that is all green
// while the product does nothing. The joke is the inverted priority — the agent
// ran the tests forty times and the app itself zero times — and the punch lands
// in the last six words: the app is only a rumor the tests started.

import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUTPUT_DIR = "/output";
const ENTRY_FILE = join(OUTPUT_DIR, "entry.txt");

const LINE =
  "I ran the tests forty times and never once ran the app, so as far as I know the app is a rumor the tests started.";

// Gate: the sealed scorer only accepts UTF-8 text of 1-140 characters, not
// only whitespace, as a single line. Fail loudly instead of shipping a line
// the gate would refuse.
function fail(message: string): never {
  console.error(`gate failed: ${message}`);
  process.exit(1);
}

if (LINE.length === 0 || LINE.trim().length === 0) fail("line is empty");
if (LINE.length > 140) fail(`line is ${LINE.length} chars, over the 140 cap`);
if (/[\r\n]/.test(LINE)) fail("line contains a newline");
if (LINE !== LINE.trim()) fail("line has leading or trailing whitespace");

// The grader mounts /output as a volume: clear its CONTENTS only, never the
// directory itself, so a stale file from a previous run cannot survive.
mkdirSync(OUTPUT_DIR, { recursive: true });
for (const name of readdirSync(OUTPUT_DIR)) {
  rmSync(join(OUTPUT_DIR, name), { recursive: true, force: true });
}

writeFileSync(ENTRY_FILE, LINE, "utf8");

// Read back what we wrote: the entry must be byte-identical to the line,
// with no trailing newline smuggled in by the write.
const written = readFileSync(ENTRY_FILE, "utf8");
if (written !== LINE) fail("read-back differs from the line");
console.log(`wrote ${LINE.length} chars to ${ENTRY_FILE}`);
