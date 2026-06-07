"use client";

import { useCallback, useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import ProgBlogToolbar from "./editor/ProgBlogToolbar";
import { getProgBlogExtensions } from "./editor/prog-blog-extensions";
import "./editor/prog-blog-editor.css";

type EditorBlockProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
};

export default function EditorBlock({
  value,
  onChange,
  placeholder,
  readOnly = false,
  className = "",
}: EditorBlockProps) {
  const [sourceMode, setSourceMode] = useState(false);
  const [sourceHtml, setSourceHtml] = useState(value);

  const editor = useEditor({
    extensions: getProgBlogExtensions(placeholder),
    content: value || "",
    editable: !readOnly,
    immediatelyRender: false,
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML();
      onChange(html);
      setSourceHtml(html);
    },
    editorProps: {
      attributes: {
        class: "prog-blog-editor-content",
        dir: "rtl",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!readOnly);
  }, [editor, readOnly]);

  useEffect(() => {
    if (!editor || sourceMode) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || "", { emitUpdate: false });
      setSourceHtml(value || "");
    }
  }, [value, editor, sourceMode]);

  const toggleSource = useCallback(() => {
    if (!editor) return;
    if (!sourceMode) {
      setSourceHtml(editor.getHTML());
      setSourceMode(true);
    } else {
      editor.commands.setContent(sourceHtml || "", { emitUpdate: false });
      onChange(sourceHtml);
      setSourceMode(false);
    }
  }, [editor, sourceMode, sourceHtml, onChange]);

  const handleSourceBlur = () => {
    onChange(sourceHtml);
    if (editor) {
      editor.commands.setContent(sourceHtml || "", { emitUpdate: false });
    }
  };

  const wordCount = editor
    ? editor.storage.characterCount?.words?.() ??
      editor.getText().trim().split(/\s+/).filter(Boolean).length
    : 0;

  return (
    <div className={`prog-blog-editor ${className}`}>
      {!readOnly && (
        <ProgBlogToolbar
          editor={editor}
          sourceMode={sourceMode}
          onToggleSource={toggleSource}
        />
      )}

      <div className="prog-blog-editor-body">
        {sourceMode ? (
          <textarea
            className="prog-blog-source"
            value={sourceHtml}
            onChange={(e) => setSourceHtml(e.target.value)}
            onBlur={handleSourceBlur}
            spellCheck={false}
            aria-label="ویرایش HTML"
          />
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>

      <div className="prog-blog-editor-footer">
        <span>ادیتور وبلاگ فنی · TipTap + Syntax Highlight</span>
        {!sourceMode && editor && (
          <span>{wordCount} کلمه</span>
        )}
      </div>
    </div>
  );
}
