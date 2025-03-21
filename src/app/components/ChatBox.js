// src/app/components/ChatBox.js
import Button from "./Button";

export default function ChatBox({
  messages,
  users,
  chatInput,
  setChatInput,
  onSendMessage,
}) {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold">Chat</h3>
      <div className="h-32 overflow-y-auto border p-2 rounded">
        {messages.map(({ userId, message, timestamp }, idx) => {
          const user = users.find(([id]) => id === userId)?.[1];
          return (
            <div key={idx} className="text-sm">
              <span style={{ color: user?.color || "#000" }}>
                {user?.name || "Unknown"}:
              </span>{" "}
              {message}{" "}
              <span className="text-gray-400 text-xs">
                ({new Date(timestamp).toLocaleTimeString()})
              </span>
            </div>
          );
        })}
      </div>
      <form onSubmit={onSendMessage} className="mt-2 flex gap-2">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Type a message..."
          className="w-full p-2 border rounded"
        />
        <Button type="submit" className="bg-green-500 hover:bg-green-600">
          Send
        </Button>
      </form>
    </div>
  );
}
