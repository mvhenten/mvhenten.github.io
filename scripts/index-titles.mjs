import { readFile, writeFile } from "node:fs/promises";

const INDEX_PATH = new URL("../output/search-index.json", import.meta.url);
const TITLE_SCORE = 0.5;

const STOP_WORDS = new Set(
	"a an and are as at be but by for from had has have he her his how i if in into is it its no not of on or she so than that the their them then there these they this to was we were what when which who will with you".split(
		" ",
	),
);

const tokenize = (text) =>
	text
		.toLowerCase()
		.split(/[^a-z0-9]+/)
		.filter((t) => t.length > 1 && !STOP_WORDS.has(t));

const index = JSON.parse(await readFile(INDEX_PATH, "utf-8"));

index.docs.forEach((doc, docIdx) => {
	for (const term of new Set(tokenize(doc.title))) {
		const entries = index.index[term] ?? [];
		const existing = entries.find(([idx]) => idx === docIdx);
		if (existing) {
			existing[1] += TITLE_SCORE;
		} else {
			entries.push([docIdx, TITLE_SCORE]);
		}
		index.index[term] = entries;
	}
});

await writeFile(INDEX_PATH, JSON.stringify(index));
console.log("Indexed titles for", index.docs.length, "docs");
