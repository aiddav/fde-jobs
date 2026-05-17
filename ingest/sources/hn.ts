import { fetchJson } from "../lib/http";

type AlgoliaHit = {
  objectID: string;
  title: string;
  created_at: string;
};

type AlgoliaResponse = {
  hits: AlgoliaHit[];
};

type HnItem = {
  id: number;
  text?: string;
  by?: string;
  kids?: number[];
};

export async function latestWhoIsHiringThread() {
  const response = await fetchJson<AlgoliaResponse>(
    "https://hn.algolia.com/api/v1/search_by_date?query=Ask%20HN:%20Who%20is%20hiring&tags=story"
  );
  const hit = response.data?.hits.find((item) => /who is hiring/i.test(item.title));
  if (!hit) {
    throw new Error("Could not find latest Who is Hiring thread.");
  }
  return hit.objectID;
}

export async function fetchTopLevelComments(threadId: string) {
  const thread = await fetchJson<HnItem>(`https://hacker-news.firebaseio.com/v0/item/${threadId}.json`);
  const kids = thread.data?.kids ?? [];
  const comments = await Promise.all(
    kids.map(async (id) => {
      const response = await fetchJson<HnItem>(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
      return response.data;
    })
  );
  return comments.filter((comment): comment is HnItem => Boolean(comment?.text));
}
