import CodeEditor from "./components/CodeEditor";
import SnippetCard from "./components/SnippetCard";
import { getSnippets, fetchSnippet } from "../utils";

export default async function Home({ searchParams }) {
  const snippets = await getSnippets();
  const awaitedSearchParams = await searchParams;
  const snippetId = awaitedSearchParams.id;
  let selectedSnippet = null;

  if (snippetId) {
    selectedSnippet = await fetchSnippet(snippetId);
  }

  async function handleSubmit(formData) {
    "use server";
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/snippets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
  }

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">CodeShare</h1>
      {snippetId ? (
        <div>
          <h2 className="text-2xl mb-4">
            {selectedSnippet?.title || "Snippet Not Found"} (Live Editing)
          </h2>
          <CodeEditor
            snippetId={snippetId}
            initialCode={
              selectedSnippet?.liveCode || selectedSnippet?.code || ""
            }
          />
        </div>
      ) : (
        <CodeEditor onSubmit={handleSubmit} />
      )}
      <div className="grid gap-4 mt-6">
        {snippets.map((snippet) => (
          <a href={`/?id=${snippet.id}`} key={snippet.id}>
            <SnippetCard snippet={snippet} />
          </a>
        ))}
      </div>
    </main>
  );
}
