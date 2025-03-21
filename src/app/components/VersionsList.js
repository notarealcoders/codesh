// src/app/components/VersionsList.js
export default function VersionsList({ versions, onLoadVersion }) {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold">Versions</h3>
      <div className="h-32 overflow-y-auto border p-2 rounded">
        {versions.length > 0 ? (
          versions.map((version) => (
            <div key={version.id} className="text-sm">
              Saved at {new Date(version.createdAt).toLocaleString()}
              <button
                onClick={() => onLoadVersion(version.code)}
                className="ml-2 text-blue-500 hover:underline"
              >
                Load
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No versions saved yet.</p>
        )}
      </div>
    </div>
  );
}
