"use client";

import "./styles.scss";

import { useEffect } from "react";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { MenuBar } from "./MenuBar.jsx";

type Props = {
  value?: string;
  onChange: (payload: { html: string; json: Record<string, unknown> | undefined }) => void;
};

const extensions = [TextStyleKit, StarterKit];

export function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions,
    content: value || "<p></p>",
    immediatelyRender: false,
    onUpdate: ({ editor: currentEditor }) => {
      onChange({
        html: currentEditor.getHTML(),
        json: currentEditor.getJSON() as Record<string, unknown>,
      });
    },
  });

  useEffect(() => {
    if (!editor) return;
    onChange({
      html: editor.getHTML(),
      json: editor.getJSON() as Record<string, unknown>,
    });
  }, [editor, onChange]);

  if (!editor) {
    return null;
  }

  return (
    <div className="tiptap-shell">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
