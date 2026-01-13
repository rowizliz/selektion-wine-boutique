import { useState, useRef, useCallback } from "react";
import { Bold, Italic, Heading2, Heading3, Type, ChevronDown, AlignLeft, List, ListOrdered, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const FONTS = [
    { name: "Mặc định", value: "inherit" },
    { name: "Georgia (Serif)", value: "'Georgia', serif" },
    { name: "Inter (Sans)", value: "'Inter', sans-serif" },
    { name: "Times New Roman", value: "'Times New Roman', serif" },
    { name: "Arial", value: "Arial, sans-serif" },
];

const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [currentFont, setCurrentFont] = useState(FONTS[0]);

    // Insert HTML tag around selected text
    const wrapSelection = useCallback((tag: string, attributes?: string) => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const selectedText = range.toString();

        if (!selectedText) {
            document.execCommand("insertHTML", false, attributes
                ? `<${tag} ${attributes}>Text</${tag}>`
                : `<${tag}>Text</${tag}>`
            );
        } else {
            document.execCommand("insertHTML", false, attributes
                ? `<${tag} ${attributes}>${selectedText}</${tag}>`
                : `<${tag}>${selectedText}</${tag}>`
            );
        }

        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    }, [onChange]);

    // Execute formatting command
    const handleFormat = useCallback((format: string, extra?: string) => {
        switch (format) {
            case "bold":
                document.execCommand("bold", false);
                break;
            case "italic":
                document.execCommand("italic", false);
                break;
            case "h2":
                wrapSelection("h2");
                break;
            case "h3":
                wrapSelection("h3");
                break;
            case "small":
                wrapSelection("span", 'style="font-size: 0.875rem"');
                break;
            case "large":
                wrapSelection("span", 'style="font-size: 1.25rem"');
                break;
            case "paragraph":
                document.execCommand("insertParagraph", false);
                break;
            case "insertUnorderedList":
                document.execCommand("insertUnorderedList", false);
                break;
            case "insertOrderedList":
                document.execCommand("insertOrderedList", false);
                break;
            case "insertHorizontalRule":
                document.execCommand("insertHorizontalRule", false);
                break;
            case "font":
                if (extra) {
                    const font = FONTS.find(f => f.value === extra);
                    if (font) {
                        setCurrentFont(font);
                        if (editorRef.current) {
                            editorRef.current.style.fontFamily = extra;
                        }
                    }
                }
                break;
            default:
                break;
        }

        if (editorRef.current && format !== "font") {
            onChange(editorRef.current.innerHTML);
        }
    }, [onChange, wrapSelection]);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text/plain");
        // Keep line breaks when pasting
        const html = text.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
        document.execCommand("insertHTML", false, `<p>${html}</p>`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Enter creates new paragraph
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            document.execCommand("insertParagraph", false);
            if (editorRef.current) {
                onChange(editorRef.current.innerHTML);
            }
        }
    };

    return (
        <div className="space-y-0">
            {/* Formatting Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/50 rounded-t-md border border-border border-b-0">
                {/* Font Selector */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1 px-2 text-xs min-w-[100px] justify-between"
                        >
                            <span className="truncate">{currentFont.name}</span>
                            <ChevronDown className="h-3 w-3 flex-shrink-0" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        {FONTS.map((font) => (
                            <DropdownMenuItem
                                key={font.value}
                                onClick={() => handleFormat("font", font.value)}
                                style={{ fontFamily: font.value }}
                            >
                                {font.name}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="w-px h-5 bg-border mx-1" />

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleFormat("bold")}
                    title="Đậm (Ctrl+B)"
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleFormat("italic")}
                    title="Nghiêng (Ctrl+I)"
                >
                    <Italic className="h-4 w-4" />
                </Button>

                <div className="w-px h-5 bg-border mx-1" />

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleFormat("h2")}
                    title="Tiêu đề lớn"
                >
                    <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleFormat("h3")}
                    title="Tiêu đề vừa"
                >
                    <Heading3 className="h-4 w-4" />
                </Button>

                <div className="w-px h-5 bg-border mx-1" />

                {/* Font Size Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1 px-2"
                            title="Cỡ chữ"
                        >
                            <Type className="h-4 w-4" />
                            <ChevronDown className="h-3 w-3" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={() => handleFormat("small")}>
                            <span className="text-sm">Chữ nhỏ</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleFormat("normal")}>
                            <span>Chữ thường</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleFormat("large")}>
                            <span className="text-lg">Chữ lớn</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="w-px h-5 bg-border mx-1" />

                {/* Lists */}
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleFormat("insertUnorderedList")}
                    title="Danh sách"
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleFormat("insertOrderedList")}
                    title="Danh sách đánh số"
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleFormat("insertHorizontalRule")}
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
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onPaste={handlePaste}
                onKeyDown={handleKeyDown}
                className={`min-h-[200px] p-4 border rounded-b-md bg-background text-foreground focus:outline-none ${isFocused ? "border-primary ring-1 ring-primary" : "border-border"
                    }`}
                dangerouslySetInnerHTML={{ __html: value || "" }}
                data-placeholder={placeholder}
                style={{
                    wordBreak: "break-word",
                    fontFamily: currentFont.value,
                }}
            />

            {/* Editor Styles */}
            <style>{`
                [contenteditable]:empty:before {
                    content: attr(data-placeholder);
                    color: hsl(var(--muted-foreground));
                    pointer-events: none;
                    display: block;
                }
                [contenteditable] {
                    line-height: 1.8;
                }
                [contenteditable] p {
                    margin-bottom: 1rem;
                    min-height: 1.5em;
                }
                [contenteditable] h2 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin-top: 1.5rem;
                    margin-bottom: 0.75rem;
                    line-height: 1.3;
                }
                [contenteditable] h3 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin-top: 1.25rem;
                    margin-bottom: 0.5rem;
                    line-height: 1.4;
                }
                [contenteditable] ul, [contenteditable] ol {
                    padding-left: 1.5rem;
                    margin-bottom: 1rem;
                }
                [contenteditable] li {
                    margin-bottom: 0.25rem;
                }
                [contenteditable] hr {
                    border: none;
                    border-top: 1px solid hsl(var(--border));
                    margin: 1.5rem 0;
                }
            `}</style>
        </div>
    );
};

export default RichTextEditor;
