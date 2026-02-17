"use client";

import { useCallback, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TextAlign } from "@tiptap/extension-text-align";
import { Image as TiptapImage } from "@tiptap/extension-image";
import { TextStyle, FontSize } from "@tiptap/extension-text-style";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ImagePlus,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadEditorImage } from "@/actions/upload";
import "./rich-text-editor.css";


interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

const FONT_SIZES = [
  { label: "Kecil", value: "12px" },
  { label: "Normal", value: "14px" },
  { label: "Sedang", value: "16px" },
  { label: "Besar", value: "18px" },
  { label: "Lebih Besar", value: "20px" },
  { label: "Sangat Besar", value: "24px" },
];

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Tulis konten...",
  className,
}: RichTextEditorProps) {
  const [uploading, setUploading] = useState(false);
  const [showFontSize, setShowFontSize] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fontSizeRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Placeholder.configure({ placeholder }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TiptapImage.configure({
        HTMLAttributes: {
          class: "editor-image",
        },
      }),
      TextStyle,
      FontSize,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose max-w-none focus:outline-none min-h-[200px] px-4 py-3",
      },
    },
  });

  const handleImageUpload = useCallback(async () => {
    fileInputRef.current?.click();
  }, []);

  const onFileSelected = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const result = await uploadEditorImage(formData);

        if (result.success && result.url) {
          editor
            .chain()
            .focus()
            .setImage({ src: result.url, alt: file.name })
            .run();
        } else {
          alert(result.error || "Upload gagal");
        }
      } catch {
        alert("Terjadi kesalahan saat upload gambar");
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [editor]
  );

  const setFontSize = useCallback(
    (size: string) => {
      if (!editor) return;
      (editor.chain().focus() as any).setFontSize(size);
      setShowFontSize(false);
    },
    [editor]
  );

  const getCurrentFontSize = useCallback(() => {
    if (!editor) return "Normal";
    const attrs = editor.getAttributes("textStyle");
    const size = attrs?.fontSize;
    const match = FONT_SIZES.find((f) => f.value === size);
    return match?.label || "Normal";
  }, [editor]);

  if (!editor) return null;

  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white overflow-hidden focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-colors",
        className
      )}
    >
      {/* Toolbar Row 1 */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50/80 px-2 py-1.5">
        {/* Font Size Dropdown */}
        <div className="relative" ref={fontSizeRef}>
          <button
            type="button"
            onClick={() => setShowFontSize(!showFontSize)}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-gray-600 hover:bg-gray-200/60 transition-colors min-w-[80px]"
            title="Ukuran Font"
          >
            <span className="truncate">{getCurrentFontSize()}</span>
            <ChevronDown className="h-3 w-3 shrink-0" />
          </button>
          {showFontSize && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[130px] py-1">
              {FONT_SIZES.map((size) => (
                <button
                  key={size.value}
                  type="button"
                  onClick={() => setFontSize(size.value)}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  style={{ fontSize: size.value }}
                >
                  {size.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <ToolbarDivider />

        {/* Headings */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive("heading", { level: 1 })}
            title="Judul 1"
          >
            <Heading1 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive("heading", { level: 2 })}
            title="Judul 2"
          >
            <Heading2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive("heading", { level: 3 })}
            title="Judul 3"
          >
            <Heading3 className="h-4 w-4" />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Formatting */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            title="Tebal (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            title="Miring (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            title="Garis Bawah (Ctrl+U)"
          >
            <UnderlineIcon className="h-4 w-4" />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Alignment */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" })}
            title="Rata Kiri"
          >
            <AlignLeft className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
            title="Rata Tengah"
          >
            <AlignCenter className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={editor.isActive({ textAlign: "right" })}
            title="Rata Kanan"
          >
            <AlignRight className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            isActive={editor.isActive({ textAlign: "justify" })}
            title="Rata Kanan Kiri"
          >
            <AlignJustify className="h-4 w-4" />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Lists */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Block & Media */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            title="Kutipan"
          >
            <Quote className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Garis Pemisah"
          >
            <Minus className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={handleImageUpload}
            disabled={uploading}
            title="Tambah Gambar"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ImagePlus className="h-4 w-4" />
            )}
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Undo/Redo */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo (Ctrl+Z)"
          >
            <Undo className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo className="h-4 w-4" />
          </ToolbarButton>
        </ToolbarGroup>
      </div>

      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={onFileSelected}
      />

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
}

// Helper components
function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>;
}

function ToolbarDivider() {
  return <div className="w-px h-5 bg-gray-200 mx-1" />;
}

function ToolbarButton({
  onClick,
  isActive,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "p-1.5 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-200/60 transition-colors",
        isActive && "bg-blue-100 text-blue-700 hover:bg-blue-100 hover:text-blue-700",
        disabled && "opacity-30 cursor-not-allowed hover:bg-transparent hover:text-gray-500"
      )}
    >
      {children}
    </button>
  );
}
