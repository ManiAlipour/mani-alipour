"use client";

import type { Editor } from "@tiptap/react";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaCode,
  FaLink,
  FaImage,
  FaListUl,
  FaListOl,
  FaQuoteRight,
  FaMinus,
  FaUndo,
  FaRedo,
  FaTable,
  FaAlignRight,
  FaAlignCenter,
  FaAlignLeft,
  FaHighlighter,
  FaCodeBranch,
} from "react-icons/fa";
import { MdDataObject } from "react-icons/md";
import { CODE_LANGUAGES } from "./prog-blog-extensions";

function TbBtn({
  onClick,
  active,
  title,
  disabled,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`prog-blog-tb-btn ${active ? "is-active" : ""}`}
    >
      {children}
    </button>
  );
}

function promptUrl(label: string, defaultValue = ""): string | null {
  const url = window.prompt(label, defaultValue);
  if (url === null) return null;
  return url.trim() || null;
}

export default function ProgBlogToolbar({
  editor,
  sourceMode,
  onToggleSource,
}: {
  editor: Editor | null;
  sourceMode: boolean;
  onToggleSource: () => void;
}) {
  if (!editor) return null;

  const inTable = editor.isActive("table");
  const inCodeBlock = editor.isActive("codeBlock");
  const currentLang =
    (editor.getAttributes("codeBlock").language as string) || "javascript";

  const setCodeLanguage = (lang: string) => {
    editor.chain().focus().updateAttributes("codeBlock", { language: lang }).run();
  };

  return (
    <div className="prog-blog-editor-toolbar">
      {!sourceMode && (
        <>
          <div className="prog-blog-editor-toolbar-group">
            <TbBtn
              title="تیتر ۱"
              active={editor.isActive("heading", { level: 1 })}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
            >
              H1
            </TbBtn>
            <TbBtn
              title="تیتر ۲"
              active={editor.isActive("heading", { level: 2 })}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
            >
              H2
            </TbBtn>
            <TbBtn
              title="تیتر ۳"
              active={editor.isActive("heading", { level: 3 })}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
            >
              H3
            </TbBtn>
            <TbBtn
              title="پاراگراف"
              active={editor.isActive("paragraph")}
              onClick={() => editor.chain().focus().setParagraph().run()}
            >
              P
            </TbBtn>
          </div>

          <div className="prog-blog-editor-toolbar-divider" />

          <div className="prog-blog-editor-toolbar-group">
            <TbBtn
              title="بولد"
              active={editor.isActive("bold")}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <FaBold />
            </TbBtn>
            <TbBtn
              title="ایتالیک"
              active={editor.isActive("italic")}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <FaItalic />
            </TbBtn>
            <TbBtn
              title="زیرخط"
              active={editor.isActive("underline")}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <FaUnderline />
            </TbBtn>
            <TbBtn
              title="خط‌خورده"
              active={editor.isActive("strike")}
              onClick={() => editor.chain().focus().toggleStrike().run()}
            >
              <FaStrikethrough />
            </TbBtn>
            <TbBtn
              title="هایلایت"
              active={editor.isActive("highlight")}
              onClick={() => editor.chain().focus().toggleHighlight().run()}
            >
              <FaHighlighter />
            </TbBtn>
            <TbBtn
              title="کد اینلاین"
              active={editor.isActive("code")}
              onClick={() => editor.chain().focus().toggleCode().run()}
            >
              <FaCode />
            </TbBtn>
          </div>

          <div className="prog-blog-editor-toolbar-divider" />

          <div className="prog-blog-editor-toolbar-group">
            <TbBtn
              title="لیست نقطه‌ای"
              active={editor.isActive("bulletList")}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <FaListUl />
            </TbBtn>
            <TbBtn
              title="لیست شماره‌دار"
              active={editor.isActive("orderedList")}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <FaListOl />
            </TbBtn>
            <TbBtn
              title="نقل‌قول"
              active={editor.isActive("blockquote")}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              <FaQuoteRight />
            </TbBtn>
            <TbBtn
              title="خط جداکننده"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
            >
              <FaMinus />
            </TbBtn>
          </div>

          <div className="prog-blog-editor-toolbar-divider" />

          <div className="prog-blog-editor-toolbar-group">
            <TbBtn
              title="بلوک کد"
              active={inCodeBlock}
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleCodeBlock({ language: "javascript" })
                  .run()
              }
            >
              <FaCodeBranch />
            </TbBtn>
            {inCodeBlock && (
              <select
                className="prog-blog-lang-select"
                value={currentLang}
                onChange={(e) => setCodeLanguage(e.target.value)}
                title="زبان کد"
              >
                {CODE_LANGUAGES.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="prog-blog-editor-toolbar-divider" />

          <div className="prog-blog-editor-toolbar-group">
            <TbBtn
              title="لینک"
              active={editor.isActive("link")}
              onClick={() => {
                if (editor.isActive("link")) {
                  editor.chain().focus().unsetLink().run();
                  return;
                }
                const url = promptUrl("آدرس لینک (https://...)");
                if (url) editor.chain().focus().setLink({ href: url }).run();
              }}
            >
              <FaLink />
            </TbBtn>
            <TbBtn
              title="تصویر"
              onClick={() => {
                const url = promptUrl("آدرس تصویر (URL)");
                if (url) editor.chain().focus().setImage({ src: url }).run();
              }}
            >
              <FaImage />
            </TbBtn>
            <TbBtn
              title="درج جدول ۳×۳"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                  .run()
              }
            >
              <FaTable />
            </TbBtn>
          </div>

          {inTable && (
            <>
              <div className="prog-blog-editor-toolbar-divider" />
              <div className="prog-blog-editor-toolbar-group">
                <TbBtn
                  title="ردیف بالا"
                  onClick={() => editor.chain().focus().addRowBefore().run()}
                >
                  +ر↑
                </TbBtn>
                <TbBtn
                  title="ردیف پایین"
                  onClick={() => editor.chain().focus().addRowAfter().run()}
                >
                  +ر↓
                </TbBtn>
                <TbBtn
                  title="ستون راست"
                  onClick={() => editor.chain().focus().addColumnBefore().run()}
                >
                  +س→
                </TbBtn>
                <TbBtn
                  title="ستون چپ"
                  onClick={() => editor.chain().focus().addColumnAfter().run()}
                >
                  +س←
                </TbBtn>
                <TbBtn
                  title="حذف جدول"
                  onClick={() => editor.chain().focus().deleteTable().run()}
                >
                  ✕جدول
                </TbBtn>
              </div>
            </>
          )}

          <div className="prog-blog-editor-toolbar-divider" />

          <div className="prog-blog-editor-toolbar-group">
            <TbBtn
              title="راست‌چین"
              active={editor.isActive({ textAlign: "right" })}
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
            >
              <FaAlignRight />
            </TbBtn>
            <TbBtn
              title="وسط‌چین"
              active={editor.isActive({ textAlign: "center" })}
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
            >
              <FaAlignCenter />
            </TbBtn>
            <TbBtn
              title="چپ‌چین"
              active={editor.isActive({ textAlign: "left" })}
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
            >
              <FaAlignLeft />
            </TbBtn>
          </div>

          <div className="prog-blog-editor-toolbar-divider" />

          <div className="prog-blog-editor-toolbar-group">
            <TbBtn
              title="بازگشت"
              disabled={!editor.can().undo()}
              onClick={() => editor.chain().focus().undo().run()}
            >
              <FaUndo />
            </TbBtn>
            <TbBtn
              title="ازنو"
              disabled={!editor.can().redo()}
              onClick={() => editor.chain().focus().redo().run()}
            >
              <FaRedo />
            </TbBtn>
          </div>
        </>
      )}

      <div className="prog-blog-editor-toolbar-group mr-auto">
        <TbBtn
          title={sourceMode ? "حالت ویرایشگر" : "ویرایش HTML"}
          active={sourceMode}
          onClick={onToggleSource}
        >
          <MdDataObject />
          <span className="mr-1 hidden sm:inline">
            {sourceMode ? "ویژوال" : "HTML"}
          </span>
        </TbBtn>
      </div>
    </div>
  );
}
