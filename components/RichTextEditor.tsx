import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Undo, Redo } from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  content, 
  onChange, 
  placeholder = 'Commencez à écrire...',
  editable = true 
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const setBold = useCallback(() => {
    editor?.chain().focus().toggleBold().run();
  }, [editor]);

  const setItalic = useCallback(() => {
    editor?.chain().focus().toggleItalic().run();
  }, [editor]);

  const setBulletList = useCallback(() => {
    editor?.chain().focus().toggleBulletList().run();
  }, [editor]);

  const setOrderedList = useCallback(() => {
    editor?.chain().focus().toggleOrderedList().run();
  }, [editor]);

  const setHeading1 = useCallback(() => {
    editor?.chain().focus().toggleHeading({ level: 1 }).run();
  }, [editor]);

  const setHeading2 = useCallback(() => {
    editor?.chain().focus().toggleHeading({ level: 2 }).run();
  }, [editor]);

  const undo = useCallback(() => {
    editor?.chain().focus().undo().run();
  }, [editor]);

  const redo = useCallback(() => {
    editor?.chain().focus().redo().run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border-2 border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
      {/* Toolbar */}
      {editable && (
        <div className="flex items-center gap-2 p-2 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 flex-wrap">
          <button
            onClick={setBold}
            className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
              editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-700' : ''
            }`}
            title="Gras"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={setItalic}
            className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
              editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-700' : ''
            }`}
            title="Italique"
          >
            <Italic className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
          <button
            onClick={setHeading1}
            className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
              editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 dark:bg-gray-700' : ''
            }`}
            title="Titre 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            onClick={setHeading2}
            className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
              editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-gray-700' : ''
            }`}
            title="Titre 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
          <button
            onClick={setBulletList}
            className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
              editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-700' : ''
            }`}
            title="Liste à puces"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={setOrderedList}
            className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
              editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-700' : ''
            }`}
            title="Liste numérotée"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
          <button
            onClick={undo}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Annuler"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Refaire"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {/* Editor Content */}
      <div className="min-h-[200px] p-4">
        <EditorContent 
          editor={editor} 
          className="prose prose-sm max-w-none dark:prose-invert focus:outline-none"
        />
      </div>
    </div>
  );
};

