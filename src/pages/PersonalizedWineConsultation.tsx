import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import WizardProgress from "@/components/personalized-wine/WizardProgress";
import StepContact from "@/components/personalized-wine/StepContact";
import StepWinePreference from "@/components/personalized-wine/StepWinePreference";
import StepCuisine from "@/components/personalized-wine/StepCuisine";
import StepLifestyle from "@/components/personalized-wine/StepLifestyle";
import StepBudget from "@/components/personalized-wine/StepBudget";
import StepNotes from "@/components/personalized-wine/StepNotes";
import SuccessScreen from "@/components/personalized-wine/SuccessScreen";

import { useCreatePersonalizedWineRequest } from "@/hooks/usePersonalizedWineRequests";

const TOTAL_STEPS = 6;
const STEP_LABELS = ["Rượu vang", "Ẩm thực", "Sở thích", "Ngân sách", "Ghi chú", "Thông tin"];

interface FormData {
  customer_name: string;
  phone: string;
  wine_types: string[];
  wine_styles: string[];
  cuisine_types: string[];
  taste_sweet_level: number;
  taste_spicy_level: number;
  music_genres: string[];
  hobbies: string[];
  budget_range: string;
  occasions: string[];
  additional_notes: string;
}

const initialFormData: FormData = {
  customer_name: "",
  phone: "",
  wine_types: [],
  wine_styles: [],
  cuisine_types: [],
  taste_sweet_level: 3,
  taste_spicy_level: 3,
  music_genres: [],
  hobbies: [],
  budget_range: "1 - 2 Triệu",
  occasions: [],
  additional_notes: "",
};

const PersonalizedWineConsultation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const stepContentRef = useRef<HTMLDivElement>(null);
  
  const createRequest = useCreatePersonalizedWineRequest();

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  const updateFormData = (field: string, value: string | string[] | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = () => {
    // Validation for step 5 (Thông tin - Contact info, now the last step)
    if (currentStep === 5) {
      if (!formData.customer_name.trim()) {
        toast.error("Vui lòng nhập họ và tên");
        return false;
      }
      if (!formData.phone.trim()) {
        toast.error("Vui lòng nhập số điện thoại");
        return false;
      }
      // Basic phone validation
      const phoneRegex = /^[0-9]{10,11}$/;
      const cleanPhone = formData.phone.replace(/\s/g, "");
      if (!phoneRegex.test(cleanPhone)) {
        toast.error("Số điện thoại không hợp lệ");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      await createRequest.mutateAsync({
        customer_name: formData.customer_name.trim(),
        phone: formData.phone.replace(/\s/g, ""),
        wine_types: formData.wine_types.length > 0 ? formData.wine_types : undefined,
        wine_styles: formData.wine_styles.length > 0 ? formData.wine_styles : undefined,
        cuisine_types: formData.cuisine_types.length > 0 ? formData.cuisine_types : undefined,
        taste_sweet_level: formData.taste_sweet_level,
        taste_spicy_level: formData.taste_spicy_level,
        music_genres: formData.music_genres.length > 0 ? formData.music_genres : undefined,
        hobbies: formData.hobbies.length > 0 ? formData.hobbies : undefined,
        budget_range: formData.budget_range,
        occasions: formData.occasions.length > 0 ? formData.occasions : undefined,
        additional_notes: formData.additional_notes.trim() || undefined,
      });
      
      setIsSubmitted(true);
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepWinePreference
            data={{ wine_types: formData.wine_types, wine_styles: formData.wine_styles }}
            onChange={(field, value) => updateFormData(field, value)}
          />
        );
      case 1:
        return (
          <StepCuisine
            data={{
              cuisine_types: formData.cuisine_types,
              taste_sweet_level: formData.taste_sweet_level,
              taste_spicy_level: formData.taste_spicy_level,
            }}
            onChange={updateFormData}
          />
        );
      case 2:
        return (
          <StepLifestyle
            data={{ music_genres: formData.music_genres, hobbies: formData.hobbies }}
            onChange={(field, value) => updateFormData(field, value)}
          />
        );
      case 3:
        return (
          <StepBudget
            data={{ budget_range: formData.budget_range, occasions: formData.occasions }}
            onChange={updateFormData}
          />
        );
      case 4:
        return (
          <StepNotes
            data={{ additional_notes: formData.additional_notes }}
            onChange={updateFormData}
          />
        );
      case 5:
        return (
          <StepContact
            data={{ customer_name: formData.customer_name, phone: formData.phone }}
            onChange={updateFormData}
          />
        );
      default:
        return null;
    }
  };

  // If submitted successfully, show success screen
  if (isSubmitted) {
    return (
      <>
        <Helmet>
          <title>Gửi yêu cầu thành công | SÉLECTION</title>
        </Helmet>
        <Header />
        <main className="pt-20 md:pt-24 min-h-screen bg-background">
          <SuccessScreen />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Tư Vấn Rượu Vang Cá Nhân Hoá | SÉLECTION</title>
        <meta
          name="description"
          content="Điền thông tin sở thích để nhận gợi ý rượu vang phù hợp với gu của bạn từ SÉLECTION"
        />
      </Helmet>

      <Header />
      <main className="pt-20 md:pt-24 min-h-screen bg-background">
        <div className="container max-w-4xl py-5 md:py-12 px-4">
          {/* Progress */}
          <div className="mb-6 md:mb-10">
            <WizardProgress
              currentStep={currentStep}
              totalSteps={TOTAL_STEPS}
              labels={STEP_LABELS}
            />
          </div>

          {/* Step Content */}
          <div ref={stepContentRef} className="min-h-[280px] md:min-h-[400px] py-2 md:py-4">
            {renderStep()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 md:pt-8 border-t gap-2">
            <Button
              variant="ghost"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="gap-1 md:gap-2 px-3 md:px-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Quay lại</span>
            </Button>

            <div className="text-xs md:text-sm text-muted-foreground">
              {currentStep + 1} / {TOTAL_STEPS}
            </div>

            <Button
              onClick={handleNext}
              disabled={createRequest.isPending}
              className="gap-1 md:gap-2 px-3 md:px-4"
            >
              {createRequest.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Đang gửi...</span>
                </>
              ) : currentStep === TOTAL_STEPS - 1 ? (
                "Gửi yêu cầu"
              ) : (
                <>
                  <span className="hidden sm:inline">Tiếp tục</span>
                  <span className="sm:hidden">Tiếp</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PersonalizedWineConsultation;
