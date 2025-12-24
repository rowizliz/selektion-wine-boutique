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
    <div className="space-y-5 md:space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 md:space-y-4">
        <div className="w-14 h-14 md:w-20 md:h-20 mx-auto rounded-full bg-foreground/5 flex items-center justify-center">
          <Wine className="w-7 h-7 md:w-10 md:h-10 text-foreground" />
        </div>
        <div>
          <h2 className="text-xl md:text-3xl font-serif">
            Thông tin liên hệ
          </h2>
          <p className="text-muted-foreground text-sm md:text-base mt-1 md:mt-2">
            Để chúng tôi liên hệ tư vấn chi tiết
          </p>
        </div>
      </div>

      {/* Form fields */}
      <div className="max-w-md mx-auto space-y-4 md:space-y-6">
        <div className="space-y-2">
          <Label htmlFor="customer_name" className="text-xs md:text-sm font-sans">
            Họ và tên <span className="text-destructive">*</span>
          </Label>
          <Input
            id="customer_name"
            type="text"
            placeholder="Nhập họ và tên của bạn"
            value={data.customer_name}
            onChange={(e) => onChange("customer_name", e.target.value)}
            className="h-11 md:h-12 text-sm md:text-base"
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-xs md:text-sm font-sans">
            Số điện thoại <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Ví dụ: 0912 345 678"
            value={data.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            className="h-11 md:h-12 text-sm md:text-base"
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
