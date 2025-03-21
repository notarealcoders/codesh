// src/utils/index.js

// Fetch all snippets
export async function getSnippets() {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/snippets`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      const text = await res.text();
      console.error(`Fetch snippets failed: ${res.status} - ${text}`);
      throw new Error(`Fetch failed with status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching snippets:", error);
    return [];
  }
}

// Fetch a single snippet by ID
export async function fetchSnippet(id) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/snippets/${id}`
    );
    if (!res.ok) {
      const text = await res.text();
      console.error(`Fetch snippet ${id} failed: ${res.status} - ${text}`);
      if (res.status === 404) {
        return null;
      }
      throw new Error(
        `Fetch failed for snippet ${id} with status: ${res.status}`
      );
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching selected snippet:", error);
    return null;
  }
}

// Fetch versions for a snippet
export async function fetchVersions(snippetId) {
  try {
    const res = await fetch(`/api/snippets/${snippetId}/versions`);
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      console.error(`Failed to fetch versions for ${snippetId}: ${res.status}`);
      return [];
    }
  } catch (error) {
    console.error(`Error fetching versions for ${snippetId}:`, error);
    return [];
  }
}

// Debounce utility
export function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Update liveCode with debounced PUT request
export const updateLiveCode = debounce(async (snippetId, liveCode) => {
  try {
    const res = await fetch(`/api/snippets/${snippetId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ liveCode }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error(
        `Failed to update liveCode for ${snippetId}: ${res.status} - ${text}`
      );
      return;
    }
    const data = await res.json();
    console.log(`LiveCode updated for ${snippetId}:`, data);
  } catch (error) {
    console.error(`Error in PUT request for ${snippetId}:`, error);
  }
}, 500);

// Generate random color (optional, if needed client-side)
export function getRandomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}
