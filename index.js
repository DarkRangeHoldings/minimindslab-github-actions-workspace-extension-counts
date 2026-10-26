import { appendFileSync } from "node:fs";

const payloadRaw = process.env.INPUT_PAYLOAD;
const outputFile = process.env.GITHUB_OUTPUT;

const parsed = JSON.parse(payloadRaw);
if (
  !parsed ||
  typeof parsed !== "object" ||
  !Object.prototype.hasOwnProperty.call(parsed, "paths") ||
  !Array.isArray(parsed.paths) ||
  !parsed.paths.every((p) => typeof p === "string")
) {
  throw new Error("Invalid input: payload must contain paths:Array<string>");
}

const counts = Object.create(null);
for (const p of parsed.paths) {
  const seg = p.split("/").pop() ?? "";
  const i = seg.lastIndexOf(".");
  const ext = i > 0 ? seg.slice(i) : "<none>";
  counts[ext] = (counts[ext] || 0) + 1;
}

const extensions = Object.keys(counts).sort();
const result = {
  counts: Object.fromEntries(extensions.map((k) => [k, counts[k]])),
  extensions,
  total: parsed.paths.length,
};

appendFileSync(outputFile, `result=${JSON.stringify(result)}\n`);