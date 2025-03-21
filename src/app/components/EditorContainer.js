// src/app/components/EditorContainer.js
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { solarizedLight } from "@uiw/codemirror-theme-solarized";

const languageExtensions = {
  javascript: [javascript()],
  python: [python()],
  css: [css()],
  html: [html()],
};

const themes = {
  dark: vscodeDark,
  light: solarizedLight,
};

export default function EditorContainer({
  editorRef,
  code,
  language,
  theme,
  onChange,
  onUpdate,
  cursors,
  users,
}) {
  return (
    <div className="relative">
      <CodeMirror
        className="rounded-full"
        ref={editorRef}
        value={code}
        height="16rem"
        theme={themes[theme]}
        extensions={languageExtensions[language] || [javascript()]}
        onChange={onChange}
        onUpdate={onUpdate}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          tabSize: 2,
        }}
      />
      {Object.entries(cursors).map(([userId, position]) => {
        const user = users.find(([id]) => id === userId)?.[1];
        return (
          user && (
            <span
              key={userId}
              className="absolute w-0.5 h-4 z-10"
              style={{
                backgroundColor: user.color,
                left: `${(position % 80) * 0.6}rem`,
                top: `${Math.floor(position / 80) * 1.5 + 0.5}rem`,
              }}
              title={user.name}
            />
          )
        );
      })}
    </div>
  );
}
