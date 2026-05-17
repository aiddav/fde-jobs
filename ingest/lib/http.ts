const userAgent = "FDEJobs/1.0 (+https://aiddav.github.io/fde-jobs; remove@fdejobs.local)";

export async function fetchJson<T>(url: string, etag?: string): Promise<{
  data: T | null;
  etag: string | null;
  status: number;
}> {
  let delay = 1000;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const response = await fetch(url, {
      headers: {
        "User-Agent": userAgent,
        Accept: "application/json",
        ...(etag ? { "If-None-Match": etag } : {})
      }
    });

    if (response.status === 304) {
      return { data: null, etag: response.headers.get("etag"), status: 304 };
    }

    if (response.status !== 429) {
      if (!response.ok) {
        throw new Error(`${url} failed with ${response.status}`);
      }
      return {
        data: await response.json() as T,
        etag: response.headers.get("etag"),
        status: response.status
      };
    }

    if (attempt === 3) {
      throw new Error(`${url} rate-limited after retries`);
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
    delay *= 2;
  }

  throw new Error(`${url} exhausted retry loop`);
}

export async function fetchText(url: string) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": userAgent,
      Accept: "text/html,application/xhtml+xml"
    }
  });
  if (!response.ok) {
    throw new Error(`${url} failed with ${response.status}`);
  }
  return response.text();
}
