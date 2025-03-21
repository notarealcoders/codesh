// src/app/components/SnippetForm.js
import Button from "./Button";

export default function SnippetForm({
  title,
  setTitle,
  language,
  setLanguage,
  onSubmit,
  isEditing = false,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Snippet Title"
        className="w-full p-2 border rounded"
        required={!isEditing}
      />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="css">CSS</option>
        <option value="html">HTML</option>
      </select>
      {!isEditing && (
        <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
          Share Code
        </Button>
      )}
    </form>
  );
}
