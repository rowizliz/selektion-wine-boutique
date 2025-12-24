import { Wine } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StepContactProps {
  data: {
    customer_name: string;
    phone: string;
  };
  onChange: (field: string, value: string) => void;
}

const StepContact = ({ data, onChange }: StepContactProps) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto rounded-full bg-foreground/5 flex items-center justify-center">
          <Wine className="w-10 h-10 text-foreground" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-serif">
            Chào mừng bạn!
          </h2>
          <p className="text-muted-foreground mt-2">
            Hãy cho chúng tôi biết thêm về bạn để tư vấn chai rượu phù hợp nhất
          </p>
        </div>
      </div>

      {/* Form fields */}
      <div className="max-w-md mx-auto space-y-6">
        <div className="space-y-2">
          <Label htmlFor="customer_name" className="text-sm font-sans">
            Họ và tên <span className="text-destructive">*</span>
          </Label>
          <Input
            id="customer_name"
            type="text"
            placeholder="Nhập họ và tên của bạn"
            value={data.customer_name}
            onChange={(e) => onChange("customer_name", e.target.value)}
            className="h-12 text-base"
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-sans">
            Số điện thoại <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Ví dụ: 0912 345 678"
            value={data.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            className="h-12 text-base"
          />
          <p className="text-xs text-muted-foreground">
            Chúng tôi sẽ liên hệ qua số này để tư vấn
          </p>
        </div>
      </div>
    </div>
  );
};

export default StepContact;
