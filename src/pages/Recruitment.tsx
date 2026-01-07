import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, CheckCircle, Loader2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCreateApplication, uploadCV } from "@/hooks/useCollaboratorApplications";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const applicationSchema = z.object({
  full_name: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  address: z.string().optional(),
  date_of_birth: z.string().optional(),
  occupation: z.string().optional(),
  experience: z.string().optional(),
  motivation: z.string().optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

const Recruitment = () => {
  const { toast } = useToast();
  const createApplication = useCreateApplication();
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File quá lớn",
        description: "Vui lòng chọn file nhỏ hơn 5MB",
        variant: "destructive",
      });
      return;
    }

    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      toast({
        title: "Định dạng không hỗ trợ",
        description: "Vui lòng chọn file PDF hoặc Word",
        variant: "destructive",
      });
      return;
    }

    setCvFile(file);
  };

  const onSubmit = async (data: ApplicationFormData) => {
    try {
      setIsUploading(true);

      let cvUrl: string | undefined;
      if (cvFile) {
        cvUrl = await uploadCV(cvFile);
      }

      await createApplication.mutateAsync({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        date_of_birth: data.date_of_birth,
        occupation: data.occupation,
        experience: data.experience,
        motivation: data.motivation,
        cv_url: cvUrl,
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Có lỗi xảy ra",
        description: "Vui lòng thử lại sau",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (isSubmitted) {
    return (
      <>
        <Helmet>
          <title>Đăng Ký Thành Công | SÉLECTION</title>
        </Helmet>
        <Header />
        <main className="min-h-screen pt-20 lg:pt-24 pb-16 bg-background">
          <div className="container max-w-lg mx-auto px-4">
            <div className="text-center py-16">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h1 className="text-2xl font-serif mb-4">Nộp Đơn Thành Công!</h1>
              <p className="text-muted-foreground mb-8">
                Cảm ơn bạn đã quan tâm đến vị trí Cộng Tác Viên tại SÉLECTION. Chúng tôi sẽ xem xét hồ sơ và liên hệ với
                bạn trong thời gian sớm nhất.
              </p>
              <Button onClick={() => (window.location.href = "/")}>Về Trang Chủ</Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Tuyển Dụng Cộng Tác Viên | SÉLECTION</title>
        <meta
          name="description"
          content="Gia nhập đội ngũ Cộng Tác Viên SÉLECTION - Cơ hội hợp tác kinh doanh rượu vang cao cấp"
        />
      </Helmet>
      <Header />

      <main className="min-h-screen pt-20 lg:pt-24 pb-16 bg-background">
        <div className="container max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-4xl font-serif mb-4">Tuyển Dụng Cộng Tác Viên</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Hãy gia nhập đội ngũ SÉLECTION và cùng chúng tôi mang đến những trải nghiệm rượu vang tuyệt vời cho khách
              hàng.
            </p>
          </div>

          {/* Benefits Section */}
          <div className="bg-secondary/50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-medium mb-4">Quyền lợi Cộng Tác Viên:</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Chiết khấu hấp dẫn từ 20% trở lên</li>
              <li>• Hoa hồng theo bậc thang doanh số</li>
              <li>• Đào tạo kiến thức về rượu vang</li>
              <li>• Hỗ trợ marketing và bán hàng</li>
              <li>• Thanh toán linh hoạt, minh bạch</li>
            </ul>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="full_name">Họ và tên *</Label>
                <Input id="full_name" {...register("full_name")} placeholder="Nguyễn Văn A" />
                {errors.full_name && <p className="text-sm text-destructive">{errors.full_name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" {...register("email")} placeholder="email@example.com" />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại *</Label>
                <Input id="phone" {...register("phone")} placeholder="0901234567" />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Ngày sinh</Label>
                <Input id="date_of_birth" type="date" {...register("date_of_birth")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Input id="address" {...register("address")} placeholder="Số nhà, đường, quận/huyện, thành phố" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="occupation">Nghề nghiệp hiện tại</Label>
              <Input
                id="occupation"
                {...register("occupation")}
                placeholder="VD: Nhân viên văn phòng, Kinh doanh tự do..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Kinh nghiệm bán hàng / bạn có thực sự yêu thích rượu vang </Label>
              <Textarea
                id="experience"
                {...register("experience")}
                placeholder="Mô tả ngắn gọn kinh nghiệm của bạn (nếu có)"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="motivation">Lý do muốn làm Cộng Tác Viên</Label>
              <Textarea
                id="motivation"
                {...register("motivation")}
                placeholder="Chia sẻ lý do bạn muốn gia nhập đội ngũ SÉLECTION"
                rows={3}
              />
            </div>

            {/* CV Upload */}
            <div className="space-y-2">
              <Label>CV / Hồ sơ (PDF, DOC, DOCX - tối đa 5MB)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input type="file" id="cv" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
                <label htmlFor="cv" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  {cvFile ? (
                    <span className="text-sm text-foreground">{cvFile.name}</span>
                  ) : (
                    <span className="text-sm text-muted-foreground">Nhấn để chọn file hoặc kéo thả vào đây</span>
                  )}
                </label>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting || isUploading}>
              {(isSubmitting || isUploading) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Nộp Đơn Ứng Tuyển
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Recruitment;
