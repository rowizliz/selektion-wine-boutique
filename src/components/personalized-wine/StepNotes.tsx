import { MessageSquare } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface StepNotesProps {
  data: {
    additional_notes: string;
  };
  onChange: (field: string, value: string) => void;
}

const StepNotes = ({ data, onChange }: StepNotesProps) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto rounded-full bg-foreground/5 flex items-center justify-center">
          <MessageSquare className="w-10 h-10 text-foreground" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-serif">
            Còn điều gì khác?
          </h2>
          <p className="text-muted-foreground mt-2">
            Chia sẻ thêm để chúng tôi hiểu bạn hơn
          </p>
        </div>
      </div>

      {/* Notes textarea */}
      <div className="max-w-lg mx-auto space-y-4">
        <Label htmlFor="notes" className="text-sm font-sans">
          Ghi chú thêm (tùy chọn)
        </Label>
        <Textarea
          id="notes"
          placeholder="Ví dụ:
• Tôi thích rượu có hương gỗ sồi
• Chai rượu để tặng sinh nhật bạn thân
• Tôi mới bắt đầu tìm hiểu về rượu vang..."
          value={data.additional_notes}
          onChange={(e) => onChange("additional_notes", e.target.value)}
          className="min-h-[200px] text-base resize-none"
        />
        <p className="text-xs text-muted-foreground text-center">
          Bước này không bắt buộc, bạn có thể bỏ qua
        </p>
      </div>
    </div>
  );
};

export default StepNotes;
