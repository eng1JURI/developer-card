// كل الطلبات هنا فقط. هذا الملف لا يلمس الصفحة أبدًا.

const USERNAME = "eng1JURI";

const GITHUB_API = "https://api.github.com";
const CONTACT_URL = "https://jsonplaceholder.typicode.com/posts";

export class ApiError extends Error {
  constructor(kind, status = 0) {
    super(kind);
    this.name = "ApiError";
    this.kind = kind; // "not-found" | "rate-limit" | "network" | "other"
    this.status = status;
  }
}

async function request(url, options) {
  let response;

  try {
    response = await fetch(url, options);
  } catch {
    throw new ApiError("network");
  }

  if (response.status === 404) {
    throw new ApiError("not-found", 404);
  }

  const limitReached = response.headers.get("x-ratelimit-remaining") === "0";
  if ((response.status === 403 || response.status === 429) && limitReached) {
    throw new ApiError("rate-limit", response.status);
  }

  if (!response.ok) {
    throw new ApiError("other", response.status);
  }

  return response.json();
}

export function getUser() {
  return request(`${GITHUB_API}/users/${encodeURIComponent(USERNAME)}`, {
    headers: { Accept: "application/vnd.github+json" },
  });
}

export function getRepos() {
  const url = `${GITHUB_API}/users/${encodeURIComponent(USERNAME)}/repos?per_page=100&sort=updated`;
  return request(url, {
    headers: { Accept: "application/vnd.github+json" },
  });
}

export function sendContact(payload) {
  return request(CONTACT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
