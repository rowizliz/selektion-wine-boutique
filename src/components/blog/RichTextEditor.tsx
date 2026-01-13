import { useState, useRef, useCallback } from "react";
import { Bold, Italic, Heading2, Heading3, Type, ChevronDown } from "lucide-react";
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

const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    // Insert HTML tag around selected text
    const wrapSelection = useCallback((tag: string, attributes?: string) => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const selectedText = range.toString();

        if (!selectedText) {
            // If no text selected, insert placeholder
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

        // Trigger onChange with actual HTML content
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    }, [onChange]);

    // Execute formatting command
    const handleFormat = useCallback((format: string) => {
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
            default:
                break;
        }

        // Update state after formatting
        if (editorRef.current) {
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
        document.execCommand("insertText", false, text);
    };

    return (
        <div className="space-y-2">
            {/* Formatting Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/50 rounded-t-sm border border-border border-b-0">
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
                className={`min-h-[120px] p-3 border rounded-b-sm bg-background text-foreground prose prose-sm max-w-none focus:outline-none ${isFocused ? "border-primary ring-1 ring-primary" : "border-border"
                    }`}
                dangerouslySetInnerHTML={{ __html: value || "" }}
                data-placeholder={placeholder}
                style={{
                    wordBreak: "break-word",
                }}
            />

            {/* Placeholder styling */}
            <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: hsl(var(--muted-foreground));
          pointer-events: none;
          display: block;
        }
      `}</style>
        </div>
    );
};

export default RichTextEditor;
