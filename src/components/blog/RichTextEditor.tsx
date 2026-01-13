import { useRef, useCallback, useEffect } from "react";
import { Bold, Italic, Heading2, Heading3, ChevronDown, List, ListOrdered, Minus, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const FONTS = [
    { name: "Mặc định", value: "" },
    { name: "Georgia", value: "Georgia" },
    { name: "Times New Roman", value: "Times New Roman" },
    { name: "Arial", value: "Arial" },
    { name: "Verdana", value: "Verdana" },
];

const FONT_SIZES = [
    { name: "Rất nhỏ", value: "1" },
    { name: "Nhỏ", value: "2" },
    { name: "Bình thường", value: "3" },
    { name: "Lớn", value: "4" },
    { name: "Rất lớn", value: "5" },
    { name: "Cực lớn", value: "6" },
];

const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
    const editorRef = useRef<HTMLDivElement>(null);

    // Focus editor and restore selection
    const focusEditor = useCallback(() => {
        if (editorRef.current) {
            editorRef.current.focus();
        }
    }, []);

    // Execute formatting command on selected text
    const execCommand = useCallback((command: string, value: string | undefined = undefined) => {
        focusEditor();
        document.execCommand(command, false, value);
        // Trigger onChange after formatting
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    }, [focusEditor, onChange]);

    // Handle input
    const handleInput = useCallback(() => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    }, [onChange]);

    // Handle paste - strip formatting but keep line breaks
    const handlePaste = useCallback((e: React.ClipboardEvent) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text/plain");
        // Convert line breaks to <br> tags
        const html = text.replace(/\n/g, '<br>');
        document.execCommand("insertHTML", false, html);
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    }, [onChange]);

    // Set initial content
    useEffect(() => {
        if (editorRef.current && value && editorRef.current.innerHTML !== value) {
            // Only set if different to avoid cursor jumping
            const currentContent = editorRef.current.innerHTML;
            if (currentContent !== value && !editorRef.current.matches(':focus')) {
                editorRef.current.innerHTML = value;
            }
        }
    }, [value]);

    return (
        <div className="border border-border rounded-md overflow-hidden bg-background">
            {/* Formatting Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 p-1.5 bg-muted/50 border-b border-border">
                {/* Font Family */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs gap-1"
                        >
                            Font
                            <ChevronDown className="h-3 w-3" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        {FONTS.map((font) => (
                            <DropdownMenuItem
                                key={font.name}
                                onClick={() => execCommand("fontName", font.value || "inherit")}
                                style={{ fontFamily: font.value || "inherit" }}
                            >
                                {font.name}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Font Size */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs gap-1"
                        >
                            <Type className="h-3.5 w-3.5" />
                            <ChevronDown className="h-3 w-3" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        {FONT_SIZES.map((size) => (
                            <DropdownMenuItem
                                key={size.value}
                                onClick={() => execCommand("fontSize", size.value)}
                            >
                                {size.name}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="w-px h-5 bg-border mx-0.5" />

                {/* Bold */}
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => execCommand("bold")}
                    title="Đậm (Ctrl+B)"
                >
                    <Bold className="h-4 w-4" />
                </Button>

                {/* Italic */}
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => execCommand("italic")}
                    title="Nghiêng (Ctrl+I)"
                >
                    <Italic className="h-4 w-4" />
                </Button>

                <div className="w-px h-5 bg-border mx-0.5" />

                {/* Headings */}
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => execCommand("formatBlock", "<h2>")}
                    title="Tiêu đề lớn"
                >
                    <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => execCommand("formatBlock", "<h3>")}
                    title="Tiêu đề vừa"
                >
                    <Heading3 className="h-4 w-4" />
                </Button>

                <div className="w-px h-5 bg-border mx-0.5" />

                {/* Lists */}
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => execCommand("insertUnorderedList")}
                    title="Danh sách"
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => execCommand("insertOrderedList")}
                    title="Danh sách có số"
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>

                {/* Horizontal Line */}
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => execCommand("insertHorizontalRule")}
                    title="Đường kẻ ngang"
                >
                    <Minus className="h-4 w-4" />
                </Button>
            </div>

            {/* Editable Content Area */}
            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                onPaste={handlePaste}
                className="min-h-[200px] max-h-[400px] overflow-y-auto p-4 text-foreground focus:outline-none"
                data-placeholder={placeholder}
            />

            {/* Styles */}
            <style>{`
                [contenteditable] {
                    line-height: 1.7;
                }
                [contenteditable]:empty:before {
                    content: attr(data-placeholder);
                    color: hsl(var(--muted-foreground));
                    pointer-events: none;
                }
                [contenteditable] p,
                [contenteditable] div {
                    margin-bottom: 0.75rem;
                }
                [contenteditable] h2 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin: 1.25rem 0 0.5rem 0;
                }
                [contenteditable] h3 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin: 1rem 0 0.5rem 0;
                }
                [contenteditable] ul,
                [contenteditable] ol {
                    padding-left: 1.5rem;
                    margin-bottom: 0.75rem;
                }
                [contenteditable] li {
                    margin-bottom: 0.25rem;
                }
                [contenteditable] hr {
                    border: none;
                    border-top: 1px solid hsl(var(--border));
                    margin: 1rem 0;
                }
                [contenteditable] font[size="1"] { font-size: 0.625rem; }
                [contenteditable] font[size="2"] { font-size: 0.75rem; }
                [contenteditable] font[size="3"] { font-size: 1rem; }
                [contenteditable] font[size="4"] { font-size: 1.125rem; }
                [contenteditable] font[size="5"] { font-size: 1.5rem; }
                [contenteditable] font[size="6"] { font-size: 2rem; }
            `}</style>
        </div>
    );
};

export default RichTextEditor;
