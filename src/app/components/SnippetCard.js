export default function SnippetCard({ snippet }) {
  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-xl font-bold">{snippet.title}</h2>
      <p className="text-gray-600">{snippet.language}</p>
      <pre className="bg-gray-100 p-2 mt-2 rounded">
        <code>{snippet.code}</code>
      </pre>
      <p className="text-sm text-gray-500 mt-2">
        Created: {new Date(snippet.createdAt).toLocaleString()}
      </p>
    </div>
  );
}
