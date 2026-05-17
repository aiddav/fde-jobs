import { mkdir, writeFile } from "node:fs/promises";
import { latestWhoIsHiringThread, fetchTopLevelComments } from "./sources/hn";

const threadId = await latestWhoIsHiringThread();
const comments = await fetchTopLevelComments(threadId);
await mkdir("ingest/raw", { recursive: true });
await writeFile("ingest/raw/hn-comments.json", `${JSON.stringify(comments, null, 2)}\n`);
console.log(`Fetched ${comments.length} top-level HN comments from thread ${threadId}. Open a PR after classifier extraction.`);
