"use client";

import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { fetchVersions, updateLiveCode } from "../../utils";
import Button from "./Button";
import SnippetForm from "./SnippetForm";
import VersionsList from "./VersionsList";
import ChatBox from "./ChatBox";
import EditorContainer from "./EditorContainer";

const socket = io("https://codesh.onrender.com");

export default function CodeEditor({ snippetId, initialCode, onSubmit }) {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState(initialCode || "");
  const [language, setLanguage] = useState("javascript");
  const [users, setUsers] = useState([]);
  const [cursors, setCursors] = useState({});
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [userName, setUserName] = useState("");
  const [theme, setTheme] = useState("dark");
  const [versions, setVersions] = useState([]);
  const editorRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const lastCursorPositionRef = useRef(null);

  useEffect(() => {
    if (snippetId) {
      const name = userName || prompt("Enter your name for collaboration:");
      setUserName(name);
      socket.emit("join-snippet", { snippetId, userName: name });

      fetchVersions(snippetId).then((data) => setVersions(data));

      socket.on("connect", () => console.log("Connected to Socket.IO"));
      socket.on("code-updated", (newCode) => {
        console.log("Code updated:", newCode);
        setCode(newCode);
      });

      socket.on("users-updated", (userList) => {
        console.log("Users updated:", userList);
        setUsers(userList);
      });

      socket.on("typing-updated", ({ userId, isTyping }) => {
        setUsers((prevUsers) =>
          prevUsers.map(([id, user]) =>
            id === userId ? [id, { ...user, typing: isTyping }] : [id, user]
          )
        );
      });

      socket.on("cursor-updated", ({ userId, position }) => {
        console.log("Cursor updated:", userId, position);
        setCursors((prev) => ({ ...prev, [userId]: position }));
      });

      socket.on("message-received", ({ userId, message, timestamp }) => {
        console.log("Message received:", userId, message);
        setMessages((prev) => [...prev, { userId, message, timestamp }]);
      });

      socket.on("version-saved", (version) => {
        console.log("Version saved:", version);
        setVersions((prev) => [version, ...prev]);
      });

      return () => {
        socket.off("connect");
        socket.off("code-updated");
        socket.off("users-updated");
        socket.off("typing-updated");
        socket.off("cursor-updated");
        socket.off("message-received");
        socket.off("version-saved");
      };
    }
  }, [snippetId]);

  const handleCodeChange = (value) => {
    setCode(value);
    if (snippetId) {
      socket.emit("code-update", { snippetId, code: value });
      updateLiveCode(snippetId, value);
      socket.emit("typing", { snippetId, isTyping: true });
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("typing", { snippetId, isTyping: false });
      }, 1000);
    }
  };

  const handleCursorMove = (viewUpdate) => {
    if (snippetId && editorRef.current) {
      const view = editorRef.current.view;
      if (view) {
        const position = view.state.selection.main.head;
        if (position !== lastCursorPositionRef.current) {
          socket.emit("cursor-update", { snippetId, position });
          lastCursorPositionRef.current = position;
        }
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ title, code, language });
      setTitle("");
      setCode("");
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (chatInput.trim() && snippetId) {
      socket.emit("send-message", { snippetId, message: chatInput });
      setChatInput("");
    }
  };

  const handleSaveVersion = () => {
    if (snippetId) {
      socket.emit("save-version", { snippetId, code });
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(code).then(() => {
      alert("Code copied to clipboard!");
    });
  };

  return (
    <div className="space-y-4">
      <SnippetForm
        title={title}
        setTitle={setTitle}
        language={language}
        setLanguage={setLanguage}
        onSubmit={handleSubmit}
        isEditing={!!snippetId}
      />
      <div className="flex gap-2">
        <Button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="bg-gray-500 hover:bg-gray-600"
        >
          Toggle {theme === "dark" ? "Light" : "Dark"} Theme
        </Button>
        {snippetId && (
          <Button
            onClick={handleSaveVersion}
            className="bg-yellow-500 hover:bg-yellow-600"
          >
            Save Version
          </Button>
        )}
        <Button
          onClick={handleCopyToClipboard}
          className="bg-purple-500 hover:bg-purple-600"
        >
          Copy Code
        </Button>
      </div>
      <EditorContainer
        editorRef={editorRef}
        code={code}
        language={language}
        theme={theme}
        onChange={handleCodeChange}
        onUpdate={handleCursorMove}
        cursors={cursors}
        users={users}
      />
      {snippetId && (
        <div className="text-sm text-gray-600">
          Connected Users: {users.length}{" "}
          {users.length > 0
            ? users
                .map(([id, { name, typing }]) => (
                  <span key={id}>
                    {name} {typing && "(typing...)"}
                  </span>
                ))
                .reduce((prev, curr) => [prev, ", ", curr], [])
            : "None"}
        </div>
      )}
      {snippetId && (
        <>
          <VersionsList versions={versions} onLoadVersion={setCode} />
          <ChatBox
            messages={messages}
            users={users}
            chatInput={chatInput}
            setChatInput={setChatInput}
            onSendMessage={handleSendMessage}
          />
        </>
      )}
    </div>
  );
}
