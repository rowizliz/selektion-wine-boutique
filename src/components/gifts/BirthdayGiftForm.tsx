import { useState } from "react";
import {
  Heart,
  User,
  Phone,
  Cake,
  Wine,
  UtensilsCrossed,
  Music,
  Palette,
  MessageCircle,
  DollarSign,
  FileText,
  Send,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface FormData {
  // Người đặt
  senderName: string;
  senderPhone: string;
  // Người nhận
  recipientName: string;
  recipientBirthday: string;
  recipientGender: string;
  relationship: string;
  // Gu rượu
  wineTypes: string[];
  wineStyle: string;
  // Gu ẩm thực
  cuisineTypes: string[];
  tastePreferences: string[];
  foodAllergies: string;
  // Gu âm nhạc & giải trí
  musicGenres: string[];
  hobbies: string[];
  // Phong cách
  favoriteColors: string[];
  stylePreferences: string[];
  // Lời chúc
  birthdayMessage: string;
  // Ngân sách
  budget: string;
  // Ghi chú
  additionalNotes: string;
}

const BirthdayGiftForm = () => {
  const [formData, setFormData] = useState<FormData>({
    senderName: "",
    senderPhone: "",
    recipientName: "",
    recipientBirthday: "",
    recipientGender: "",
    relationship: "",
    wineTypes: [],
    wineStyle: "",
    cuisineTypes: [],
    tastePreferences: [],
    foodAllergies: "",
    musicGenres: [],
    hobbies: [],
    favoriteColors: [],
    stylePreferences: [],
    birthdayMessage: "",
    budget: "",
    additionalNotes: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (
    field: keyof FormData,
    value: string,
    checked: boolean
  ) => {
    setFormData((prev) => {
      const currentValues = prev[field] as string[];
      if (checked) {
        return { ...prev, [field]: [...currentValues, value] };
      } else {
        return {
          ...prev,
          [field]: currentValues.filter((v) => v !== value),
        };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.senderName || !formData.senderPhone || !formData.recipientName) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    toast.success(
      "Đã ghi nhận thông tin! Vui lòng chụp màn hình form và gửi qua Zalo.",
      { duration: 5000 }
    );

    const message = `🎂 Xin chào! Em muốn đặt quà sinh nhật cho ${formData.recipientName}. Em đã điền form và sẽ gửi ảnh chụp màn hình.`;
    window.open(
      `https://zalo.me/0906777377?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  // Options data
  const wineTypeOptions = [
    "Vang đỏ",
    "Vang trắng",
    "Champagne / Sparkling",
    "Không biết / Để shop tư vấn",
  ];

  const wineStyleOptions = [
    "Ngọt nhẹ, dễ uống",
    "Đậm đà, mạnh mẽ",
    "Thanh lịch, tinh tế",
    "Chưa biết rõ",
  ];

  const cuisineOptions = [
    "Món Việt",
    "Món Âu",
    "Món Nhật/Hàn",
    "Món Trung",
    "Đồ ngọt / Tráng miệng",
    "Healthy / Ăn kiêng",
  ];

  const tasteOptions = ["Ngọt", "Mặn", "Cay", "Chua", "Béo ngậy"];

  const musicOptions = [
    "Nhạc trẻ Việt",
    "Bolero",
    "Pop/R&B quốc tế",
    "Nhạc cổ điển",
    "Jazz / Blues",
    "EDM / Dance",
    "Rock / Metal",
    "Indie / Acoustic",
  ];

  const hobbyOptions = [
    "Xem phim",
    "Đọc sách",
    "Du lịch",
    "Thể thao",
    "Nghệ thuật / Hội họa",
    "Nấu ăn",
    "Gaming",
    "Yoga / Thiền",
  ];

  const colorOptions = [
    "Đỏ / Hồng",
    "Xanh dương",
    "Xanh lá",
    "Đen / Trắng",
    "Vàng / Cam",
    "Tím",
    "Pastel nhẹ nhàng",
  ];

  const styleOptions = [
    "Sang trọng, cao cấp",
    "Đơn giản, tối giản",
    "Trẻ trung, năng động",
    "Cổ điển, vintage",
    "Dễ thương, đáng yêu",
  ];

  const budgetOptions = [
    "Dưới 1 triệu",
    "1 - 2 triệu",
    "2 - 3 triệu",
    "3 - 5 triệu",
    "Trên 5 triệu",
    "Liên hệ tư vấn",
  ];

  const relationshipOptions = [
    "Bạn bè",
    "Người yêu",
    "Gia đình",
    "Đồng nghiệp",
    "Khác",
  ];

  const genderOptions = [
    { value: "male", label: "Nam" },
    { value: "female", label: "Nữ" },
    { value: "other", label: "Khác" },
  ];

  const CheckboxGroup = ({
    options,
    field,
    columns = 2,
  }: {
    options: string[];
    field: keyof FormData;
    columns?: number;
  }) => (
    <div
      className={`grid gap-3 ${
        columns === 2
          ? "grid-cols-1 sm:grid-cols-2"
          : columns === 3
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
      }`}
    >
      {options.map((option) => (
        <label
          key={option}
          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
            (formData[field] as string[]).includes(option)
              ? "bg-primary/5 border-primary/30"
              : "bg-secondary/30 border-border/50 hover:border-primary/20"
          }`}
        >
          <Checkbox
            checked={(formData[field] as string[]).includes(option)}
            onCheckedChange={(checked) =>
              handleCheckboxChange(field, option, checked as boolean)
            }
          />
          <span className="text-sm">{option}</span>
        </label>
      ))}
    </div>
  );

  const SectionHeader = ({
    icon: Icon,
    title,
    description,
  }: {
    icon: React.ElementType;
    title: string;
    description?: string;
  }) => (
    <div className="flex items-start gap-3 mb-5">
      <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/10">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h3 className="font-serif text-lg lg:text-xl">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="py-12 lg:py-16">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-wine-light border border-wine/20 mb-6">
            <Cake className="w-4 h-4 text-wine" />
            <span className="text-xs font-medium tracking-wider uppercase text-wine">
              Quà tặng cá nhân hóa
            </span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-serif mb-4">
            Quà Tặng Sinh Nhật
            <span className="block text-primary/70 mt-2">Đặc Biệt</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Hãy cho chúng tôi biết về người bạn yêu thương. Chúng tôi sẽ chuẩn
            bị một món quà thật ý nghĩa cùng thiệp chúc mừng được thiết kế riêng.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Thông tin liên hệ */}
          <section className="p-6 lg:p-8 rounded-2xl bg-card border border-border/50">
            <SectionHeader
              icon={Phone}
              title="Thông tin liên hệ"
              description="Để chúng tôi có thể liên lạc với bạn"
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="senderName">
                  Họ tên người đặt <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="senderName"
                  name="senderName"
                  placeholder="Nguyễn Văn A"
                  value={formData.senderName}
                  onChange={handleInputChange}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senderPhone">
                  Số điện thoại <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="senderPhone"
                  name="senderPhone"
                  type="tel"
                  placeholder="0901 234 567"
                  value={formData.senderPhone}
                  onChange={handleInputChange}
                  className="h-12"
                />
              </div>
            </div>
          </section>

          {/* Thông tin người nhận */}
          <section className="p-6 lg:p-8 rounded-2xl bg-card border border-border/50">
            <SectionHeader
              icon={User}
              title="Thông tin người nhận"
              description="Về người sẽ nhận được món quà này"
            />
            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="recipientName">
                    Họ tên người nhận <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="recipientName"
                    name="recipientName"
                    placeholder="Trần Thị B"
                    value={formData.recipientName}
                    onChange={handleInputChange}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipientBirthday">Ngày sinh</Label>
                  <Input
                    id="recipientBirthday"
                    name="recipientBirthday"
                    type="date"
                    value={formData.recipientBirthday}
                    onChange={handleInputChange}
                    className="h-12"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Giới tính</Label>
                  <RadioGroup
                    value={formData.recipientGender}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, recipientGender: value }))
                    }
                    className="flex flex-wrap gap-3"
                  >
                    {genderOptions.map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer transition-all ${
                          formData.recipientGender === option.value
                            ? "bg-primary/5 border-primary/30"
                            : "bg-secondary/30 border-border/50 hover:border-primary/20"
                        }`}
                      >
                        <RadioGroupItem value={option.value} />
                        <span className="text-sm">{option.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>Mối quan hệ với bạn</Label>
                  <RadioGroup
                    value={formData.relationship}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, relationship: value }))
                    }
                    className="flex flex-wrap gap-2"
                  >
                    {relationshipOptions.map((option) => (
                      <label
                        key={option}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-all text-sm ${
                          formData.relationship === option
                            ? "bg-primary/5 border-primary/30"
                            : "bg-secondary/30 border-border/50 hover:border-primary/20"
                        }`}
                      >
                        <RadioGroupItem value={option} />
                        <span>{option}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </div>
          </section>

          {/* Gu Rượu Vang */}
          <section className="p-6 lg:p-8 rounded-2xl bg-card border border-border/50">
            <SectionHeader
              icon={Wine}
              title="Gu rượu vang"
              description="Người nhận thích loại rượu nào?"
            />
            <div className="space-y-6">
              <div>
                <Label className="mb-3 block">Loại rượu yêu thích</Label>
                <CheckboxGroup options={wineTypeOptions} field="wineTypes" />
              </div>
              <div>
                <Label className="mb-3 block">Phong cách thưởng thức</Label>
                <RadioGroup
                  value={formData.wineStyle}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, wineStyle: value }))
                  }
                  className="grid gap-3 sm:grid-cols-2"
                >
                  {wineStyleOptions.map((option) => (
                    <label
                      key={option}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        formData.wineStyle === option
                          ? "bg-primary/5 border-primary/30"
                          : "bg-secondary/30 border-border/50 hover:border-primary/20"
                      }`}
                    >
                      <RadioGroupItem value={option} />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </section>

          {/* Gu Ẩm thực */}
          <section className="p-6 lg:p-8 rounded-2xl bg-card border border-border/50">
            <SectionHeader
              icon={UtensilsCrossed}
              title="Gu ẩm thực"
              description="Người nhận thích ăn gì?"
            />
            <div className="space-y-6">
              <div>
                <Label className="mb-3 block">Gu ẩm thực yêu thích</Label>
                <CheckboxGroup options={cuisineOptions} field="cuisineTypes" columns={3} />
              </div>
              <div>
                <Label className="mb-3 block">Khẩu vị</Label>
                <CheckboxGroup options={tasteOptions} field="tastePreferences" columns={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="foodAllergies">
                  Thực phẩm dị ứng / không ăn được
                </Label>
                <Textarea
                  id="foodAllergies"
                  name="foodAllergies"
                  placeholder="VD: Không ăn hải sản, dị ứng đậu phộng..."
                  value={formData.foodAllergies}
                  onChange={handleInputChange}
                  className="min-h-[80px] resize-none"
                />
              </div>
            </div>
          </section>

          {/* Gu Âm nhạc & Giải trí */}
          <section className="p-6 lg:p-8 rounded-2xl bg-card border border-border/50">
            <SectionHeader
              icon={Music}
              title="Gu âm nhạc & giải trí"
              description="Người nhận thích nghe nhạc gì và có sở thích gì?"
            />
            <div className="space-y-6">
              <div>
                <Label className="mb-3 block">Thể loại nhạc yêu thích</Label>
                <CheckboxGroup options={musicOptions} field="musicGenres" columns={4} />
              </div>
              <div>
                <Label className="mb-3 block">Sở thích giải trí</Label>
                <CheckboxGroup options={hobbyOptions} field="hobbies" columns={4} />
              </div>
            </div>
          </section>

          {/* Phong cách & Thẩm mỹ */}
          <section className="p-6 lg:p-8 rounded-2xl bg-card border border-border/50">
            <SectionHeader
              icon={Palette}
              title="Phong cách & thẩm mỹ"
              description="Sở thích về màu sắc và phong cách của người nhận"
            />
            <div className="space-y-6">
              <div>
                <Label className="mb-3 block">Màu sắc yêu thích</Label>
                <CheckboxGroup options={colorOptions} field="favoriteColors" columns={4} />
              </div>
              <div>
                <Label className="mb-3 block">Phong cách phù hợp</Label>
                <CheckboxGroup options={styleOptions} field="stylePreferences" columns={3} />
              </div>
            </div>
          </section>

          {/* Lời chúc cho thiệp */}
          <section className="p-6 lg:p-8 rounded-2xl bg-card border border-border/50">
            <SectionHeader
              icon={MessageCircle}
              title="Lời chúc cho thiệp"
              description="Viết lời nhắn sinh nhật từ trái tim bạn"
            />
            <div className="space-y-2">
              <Textarea
                name="birthdayMessage"
                placeholder="Chúc mừng sinh nhật! Chúc bạn luôn vui vẻ, hạnh phúc và thành công trong cuộc sống. Mong rằng năm mới sẽ mang đến cho bạn thật nhiều điều tốt đẹp..."
                value={formData.birthdayMessage}
                onChange={handleInputChange}
                className="min-h-[140px] resize-none text-base"
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.birthdayMessage.length}/500 ký tự
              </p>
            </div>
          </section>

          {/* Ngân sách */}
          <section className="p-6 lg:p-8 rounded-2xl bg-card border border-border/50">
            <SectionHeader
              icon={DollarSign}
              title="Ngân sách dự kiến"
              description="Chúng tôi sẽ tư vấn set quà phù hợp"
            />
            <RadioGroup
              value={formData.budget}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, budget: value }))
              }
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
            >
              {budgetOptions.map((option) => (
                <label
                  key={option}
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    formData.budget === option
                      ? "bg-primary/5 border-primary/30"
                      : "bg-secondary/30 border-border/50 hover:border-primary/20"
                  }`}
                >
                  <RadioGroupItem value={option} />
                  <span className="text-sm font-medium">{option}</span>
                </label>
              ))}
            </RadioGroup>
          </section>

          {/* Ghi chú thêm */}
          <section className="p-6 lg:p-8 rounded-2xl bg-card border border-border/50">
            <SectionHeader
              icon={FileText}
              title="Ghi chú thêm"
              description="Bất kỳ yêu cầu đặc biệt nào"
            />
            <Textarea
              name="additionalNotes"
              placeholder="VD: Muốn giao vào buổi tối, đính kèm hoa tươi, yêu cầu đặc biệt..."
              value={formData.additionalNotes}
              onChange={handleInputChange}
              className="min-h-[100px] resize-none"
            />
          </section>

          {/* Submit Instructions */}
          <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 text-center">
            <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Sau khi điền form, hãy <strong>chụp màn hình</strong> toàn bộ
              thông tin và gửi cho chúng tôi qua Zalo nhé!
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-2xl text-base font-medium tracking-wider uppercase hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg shadow-primary/25"
          >
            <Send className="w-5 h-5" />
            Gửi yêu cầu qua Zalo
          </button>
        </form>
      </div>
    </div>
  );
};

export default BirthdayGiftForm;
