"use client"

import { useRef, useMemo } from "react";
import JEditor from "jodit-react";

type EditorBlockProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
};

const EditorBlock = ({
  value,
  onChange,
  placeholder,
  readOnly = false,
  className = "",
}: EditorBlockProps) => {
  const editor = useRef(null);

  // Memoize config to avoid object recreation on each render
  const config = useMemo(
    () => ({
      readonly: readOnly,
      placeholder: placeholder || "چیزی بنویسید...",
      theme: "dark",
      height: 320,
      style: { background: "#0a0f1d", color: "#e5e7eb" },
      uploader: {
        insertImageAsBase64URI: true, // Enable base64 image insert
      },
      buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "eraser",
        "ul",
        "ol",
        "outdent",
        "indent",
        "font",
        "fontsize",
        "paragraph",
        "image", // Add image button
        "link",
        "table",
        "align",
        "undo",
        "redo",
        "hr",
        "fullsize",
      ],
      buttonsXS: [
        "bold",
        "italic",
        "ul",
        "ol",
        "image",
        "link",
        "undo",
        "redo",
        "fullsize",
      ],
    }),
    [readOnly, placeholder]
  );

  return (
    <div className={className}>
      <JEditor
        ref={editor}
        value={value}
        config={config}
        onBlur={onChange}
        tabIndex={1}
      />
    </div>
  );
};

export default EditorBlock;