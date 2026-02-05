import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Link as LinkIcon,
    Undo,
    Redo,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export function RichTextEditor({
    content,
    onChange,
    placeholder = 'Start typing...',
    className,
    disabled = false
}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [2, 3],
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline underline-offset-4',
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content,
        editable: !disabled,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg dark:prose-invert focus:outline-none min-h-[150px] max-w-none p-4',
            },
        },
    });

    if (!editor) {
        return null;
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Enter URL:', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className={cn('border rounded-md overflow-hidden', className)}>
            {/* Toolbar */}
            <div className="border-b bg-muted/30 p-2 flex flex-wrap gap-1">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={cn(
                        'h-8 w-8 p-0',
                        editor.isActive('bold') && 'bg-accent'
                    )}
                    title="Bold (Ctrl+B)"
                >
                    <Bold className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    className={cn(
                        'h-8 w-8 p-0',
                        editor.isActive('italic') && 'bg-accent'
                    )}
                    title="Italic (Ctrl+I)"
                >
                    <Italic className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={!editor.can().chain().focus().toggleStrike().run()}
                    className={cn(
                        'h-8 w-8 p-0',
                        editor.isActive('strike') && 'bg-accent'
                    )}
                    title="Strikethrough"
                >
                    <Strikethrough className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    disabled={!editor.can().chain().focus().toggleCode().run()}
                    className={cn(
                        'h-8 w-8 p-0',
                        editor.isActive('code') && 'bg-accent'
                    )}
                    title="Inline Code"
                >
                    <Code className="h-4 w-4" />
                </Button>

                <div className="w-px h-8 bg-border mx-1" />

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={cn(
                        'h-8 w-8 p-0',
                        editor.isActive('heading', { level: 2 }) && 'bg-accent'
                    )}
                    title="Heading 2"
                >
                    <Heading2 className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={cn(
                        'h-8 w-8 p-0',
                        editor.isActive('heading', { level: 3 }) && 'bg-accent'
                    )}
                    title="Heading 3"
                >
                    <Heading3 className="h-4 w-4" />
                </Button>

                <div className="w-px h-8 bg-border mx-1" />

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={cn(
                        'h-8 w-8 p-0',
                        editor.isActive('bulletList') && 'bg-accent'
                    )}
                    title="Bullet List"
                >
                    <List className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={cn(
                        'h-8 w-8 p-0',
                        editor.isActive('orderedList') && 'bg-accent'
                    )}
                    title="Numbered List"
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={cn(
                        'h-8 w-8 p-0',
                        editor.isActive('blockquote') && 'bg-accent'
                    )}
                    title="Blockquote"
                >
                    <Quote className="h-4 w-4" />
                </Button>

                <div className="w-px h-8 bg-border mx-1" />

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={setLink}
                    className={cn(
                        'h-8 w-8 p-0',
                        editor.isActive('link') && 'bg-accent'
                    )}
                    title="Add Link"
                >
                    <LinkIcon className="h-4 w-4" />
                </Button>

                <div className="w-px h-8 bg-border mx-1" />

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().chain().focus().undo().run()}
                    className="h-8 w-8 p-0"
                    title="Undo (Ctrl+Z)"
                >
                    <Undo className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().chain().focus().redo().run()}
                    className="h-8 w-8 p-0"
                    title="Redo (Ctrl+Y)"
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>

            {/* Editor Content */}
            <EditorContent editor={editor} />
        </div>
    );
}
