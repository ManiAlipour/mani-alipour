import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { createLowlight, common } from "lowlight";

export const lowlight = createLowlight(common);

export const CODE_LANGUAGES = [
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "jsx", label: "JSX" },
  { id: "tsx", label: "TSX" },
  { id: "python", label: "Python" },
  { id: "bash", label: "Bash" },
  { id: "shell", label: "Shell" },
  { id: "json", label: "JSON" },
  { id: "html", label: "HTML" },
  { id: "css", label: "CSS" },
  { id: "sql", label: "SQL" },
  { id: "rust", label: "Rust" },
  { id: "go", label: "Go" },
  { id: "java", label: "Java" },
  { id: "csharp", label: "C#" },
  { id: "php", label: "PHP" },
  { id: "yaml", label: "YAML" },
  { id: "markdown", label: "Markdown" },
  { id: "dockerfile", label: "Dockerfile" },
  { id: "plaintext", label: "Plain Text" },
] as const;

export function getProgBlogExtensions(placeholder?: string) {
  return [
    StarterKit.configure({
      codeBlock: false,
      heading: { levels: [1, 2, 3] },
    }),
    Underline,
    Highlight.configure({ multicolor: false }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: "prog-blog-link",
        rel: "noopener noreferrer",
      },
    }),
    Image.configure({
      HTMLAttributes: { class: "prog-blog-image" },
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
      defaultAlignment: "right",
    }),
    Placeholder.configure({
      placeholder: placeholder ?? "محتوای مقاله را بنویسید — کد، جدول، تصویر و...",
    }),
    CodeBlockLowlight.configure({
      lowlight,
      defaultLanguage: "javascript",
      HTMLAttributes: {
        class: "prog-code-block",
      },
    }),
    Table.configure({
      resizable: true,
      HTMLAttributes: { class: "prog-blog-table" },
    }),
    TableRow,
    TableHeader,
    TableCell,
  ];
}
