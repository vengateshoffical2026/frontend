import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { useEffect, useState } from "react";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
  FaListUl,
  FaListOl,
} from "react-icons/fa";

// props for the rich text editor component
export type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  customisedStyle?:boolean
};

type Level = 1 | 2 | 3;

/* ---------------- Toolbar Button ---------------- */
const ToolbarButton = ({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onMouseDown={(e) => {
      e.preventDefault();
      onClick();
    }}
    className={`px-3 py-2 rounded-md transition ${
      active
        ? "bg-blue-500 text-white"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`}
  >
    {children}
  </button>
);

/* ---------------- Editor ---------------- */
export default function RichTextEditor({
  value,
  onChange,
  customisedStyle,
}: RichTextEditorProps) {
  const [lastHeadingLevel] = useState<Level>(1);
  const [, forceUpdate] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit, // ✅ DO NOT disable list extensions
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph", "listItem"],
      }),
      Placeholder.configure({
        placeholder: "Start typing...",
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()); // ✅ stores semantic HTML
    },
  });

  /* 🔄 FORCE TOOLBAR STATE UPDATE */
  useEffect(() => {
    if (!editor) return;

    const update = () => forceUpdate((v) => v + 1);

    editor.on("selectionUpdate", update);
    editor.on("transaction", update);

    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
    };
  }, [editor]);

  if (!editor) return null;

  /* ---------------- Helpers ---------------- */
  const toggleHeading = () => {
    if (editor.isActive("heading")) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().toggleHeading({ level: lastHeadingLevel }).run();
    }
  };

  const isMarkActive = (mark: string) =>
    editor.isActive(mark) ||
    editor.state.storedMarks?.some((m) => m.type.name === mark);

  /* ---------------- Insert New Line ---------------- */
  const insertNewLine = () => {
    editor.chain().focus().insertContent("<p><br></p>").run();
  };
  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden flex flex-col h-full ${customisedStyle && "max-w-[500px] rounded-none border-gray-50"} `}>
      {/* ---------------- Toolbar ---------------- */}
      <div className="flex flex-wrap items-center gap-2 p-2 bg-blue-50 border-b border-gray-300 sticky top-0 z-10 ">
        <ToolbarButton
          active={editor.isActive("heading")}
          onClick={toggleHeading}
        >
          H
        </ToolbarButton>

        <ToolbarButton
          active={isMarkActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <FaBold />
        </ToolbarButton>

        <ToolbarButton
          active={isMarkActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <FaItalic />
        </ToolbarButton>

        <ToolbarButton
          active={isMarkActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <FaUnderline />
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <FaAlignLeft />
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <FaAlignCenter />
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <FaAlignRight />
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive({ textAlign: "justify" })}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        >
          <FaAlignJustify />
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <FaListUl />
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <FaListOl />
        </ToolbarButton>

        <ToolbarButton onClick={insertNewLine}>↵</ToolbarButton>
      </div>

      {/* ---------------- Editor ---------------- */}
      <div className="flex-1 overflow-auto p-3">
        <EditorContent editor={editor} className={`${customisedStyle ? "tiptap-large" : "tiptap-small"}`}/>
      </div>
    </div>
  );
}
