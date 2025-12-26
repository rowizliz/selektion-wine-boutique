import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CalendarDays,
  MapPin,
  ExternalLink,
  Lock,
  Loader2,
  CheckCircle2,
  Shirt,
  Sparkles,
  Clock,
  ListOrdered,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSubmitRSVP } from "@/hooks/useInvitations";
import logo2 from "@/assets/logo2.png";

interface InvitationData {
  id: string;
  title: string;
  event_date: string;
  location: string;
  location_url: string | null;
  dress_code: string | null;
  message: string | null;
  agenda: string | null;
  cover_image_url: string | null;
  url_slug: string;
}

const pinSchema = z.object({
  pin: z.string().min(4, "Vui lòng nhập mã PIN"),
});

const rsvpSchema = z.object({
  guest_name: z.string().min(1, "Vui lòng nhập họ tên"),
  phone: z.string().optional(),
  attending: z.enum(["yes", "no"]),
  guest_count: z.number().min(1).max(10),
  note: z.string().optional(),
});

type PINFormValues = z.infer<typeof pinSchema>;
type RSVPFormValues = z.infer<typeof rsvpSchema>;

// Decorative corner component
const DecorativeCorner = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="60"
    height="60"
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 58V30C2 14.536 14.536 2 30 2H58"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M8 58V36C8 20.536 20.536 8 36 8H58"
      stroke="currentColor"
      strokeWidth="0.5"
      strokeLinecap="round"
      opacity="0.5"
    />
  </svg>
);

// Ornamental divider
const OrnamentalDivider = () => (
  <div className="flex items-center justify-center gap-3 my-6">
    <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/50" />
    <Sparkles className="h-4 w-4 text-gold" />
    <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/50" />
  </div>
);

const PublicInvitation = () => {
  const { slug } = useParams<{ slug: string }>();
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const submitRSVP = useSubmitRSVP();

  const pinForm = useForm<PINFormValues>({
    resolver: zodResolver(pinSchema),
    defaultValues: { pin: "" },
  });

  const rsvpForm = useForm<RSVPFormValues>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      guest_name: "",
      phone: "",
      attending: "yes",
      guest_count: 1,
      note: "",
    },
  });

  // Check localStorage for previously verified PIN
  useEffect(() => {
    if (slug) {
      const savedPin = localStorage.getItem(`invitation_pin_${slug}`);
      if (savedPin) {
        setEnteredPin(savedPin);
        verifyPIN(savedPin);
      }
    }
  }, [slug]);

  const verifyPIN = async (pin: string) => {
    if (!slug) return;
    setIsVerifying(true);

    try {
      const { data, error } = await supabase.rpc("get_invitation_by_slug_with_pin", {
        p_url_slug: slug,
        p_pin_code: pin,
      });

      if (error) throw error;

      if (data && data.length > 0) {
        setInvitation(data[0] as InvitationData);
        setIsVerified(true);
        setEnteredPin(pin);
        localStorage.setItem(`invitation_pin_${slug}`, pin);
      } else {
        toast.error("Mã PIN không đúng");
        localStorage.removeItem(`invitation_pin_${slug}`);
      }
    } catch (error) {
      console.error("Error verifying PIN:", error);
      toast.error("Có lỗi xảy ra");
    } finally {
      setIsVerifying(false);
    }
  };

  const onPINSubmit = (values: PINFormValues) => {
    verifyPIN(values.pin);
  };

  const onRSVPSubmit = async (values: RSVPFormValues) => {
    if (!invitation) return;

    try {
      await submitRSVP.mutateAsync({
        invitation_id: invitation.id,
        guest_name: values.guest_name,
        phone: values.phone || undefined,
        attending: values.attending === "yes",
        guest_count: values.attending === "yes" ? values.guest_count : 1,
        note: values.note || undefined,
      });

      setRsvpSubmitted(true);
      toast.success("Cảm ơn bạn đã phản hồi!");
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  const watchAttending = rsvpForm.watch("attending");

  // PIN Entry Screen - Luxury Style
  if (!isVerified) {
    return (
      <>
        <Helmet>
          <title>Thiệp Mời | Sélection</title>
        </Helmet>

        <main className="min-h-screen bg-foreground flex items-center justify-center p-6 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/20 via-transparent to-transparent" />
          </div>

          <div className="w-full max-w-md relative animate-fade-in">
            {/* Card with gold border effect */}
            <div className="relative bg-background/5 backdrop-blur-sm border border-gold/30 p-8 md:p-12">
              {/* Corner decorations */}
              <DecorativeCorner className="absolute top-2 left-2 text-gold/40" />
              <DecorativeCorner className="absolute top-2 right-2 text-gold/40 rotate-90" />
              <DecorativeCorner className="absolute bottom-2 left-2 text-gold/40 -rotate-90" />
              <DecorativeCorner className="absolute bottom-2 right-2 text-gold/40 rotate-180" />

              <div className="text-center space-y-6">
                {/* Logo with glow */}
                <div className="relative mx-auto w-24 h-24">
                  <div className="absolute inset-0 bg-gold/20 rounded-full blur-xl animate-pulse" />
                  <img 
                    src={logo2} 
                    alt="Sélection" 
                    className="relative w-full h-full object-contain animate-glow-breathe"
                  />
                </div>

                <div className="space-y-2">
                  <h1 className="text-2xl md:text-3xl font-serif text-background tracking-wide">
                    Thiệp Mời Riêng Tư
                  </h1>
                  <p className="text-background/60 text-sm tracking-wider uppercase">
                    Vui lòng nhập mã PIN để xem
                  </p>
                </div>

                <OrnamentalDivider />

                <Form {...pinForm}>
                  <form onSubmit={pinForm.handleSubmit(onPINSubmit)} className="space-y-6">
                    <FormField
                      control={pinForm.control}
                      name="pin"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="• • • • • •"
                              className="text-center text-2xl tracking-[0.5em] bg-transparent border-gold/30 text-background placeholder:text-background/30 focus:border-gold h-14"
                              maxLength={6}
                              autoFocus
                            />
                          </FormControl>
                          <FormMessage className="text-gold/80" />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={isVerifying}
                      className="w-full bg-gold hover:bg-gold-dark text-gold-foreground border-0 tracking-widest uppercase text-sm h-12 transition-all duration-300"
                    >
                      {isVerifying ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Xác Nhận
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  // RSVP Success Screen - Luxury Style
  if (rsvpSubmitted) {
    return (
      <>
        <Helmet>
          <title>{invitation?.title || "Thiệp Mời"} | Sélection</title>
        </Helmet>

        <main className="min-h-screen bg-foreground flex items-center justify-center p-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/20 via-transparent to-transparent" />
          </div>

          <div className="w-full max-w-md relative animate-fade-in">
            <div className="relative bg-background/5 backdrop-blur-sm border border-gold/30 p-8 md:p-12 text-center">
              <DecorativeCorner className="absolute top-2 left-2 text-gold/40" />
              <DecorativeCorner className="absolute top-2 right-2 text-gold/40 rotate-90" />
              <DecorativeCorner className="absolute bottom-2 left-2 text-gold/40 -rotate-90" />
              <DecorativeCorner className="absolute bottom-2 right-2 text-gold/40 rotate-180" />

              <div className="relative mx-auto w-24 h-24 mb-6">
                <div className="absolute inset-0 bg-gold/20 rounded-full blur-xl animate-pulse" />
                <div className="relative w-full h-full border border-gold/50 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-12 w-12 text-gold" />
                </div>
              </div>

              <h2 className="text-3xl font-serif text-background mb-3">Cảm Ơn Quý Khách</h2>
              <OrnamentalDivider />
              <p className="text-background/70 leading-relaxed">
                Phản hồi của quý khách đã được ghi nhận.
                <br />
                <span className="text-gold">Hẹn gặp quý khách tại sự kiện!</span>
              </p>
            </div>
          </div>
        </main>
      </>
    );
  }

  // Main Invitation View - Luxury Style
  return (
    <>
      <Helmet>
        <title>{invitation?.title || "Thiệp Mời"} | Sélection</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <main className="min-h-screen bg-foreground relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent pointer-events-none" />

        {/* Cover Image with overlay */}
        {invitation?.cover_image_url && (
          <div className="relative w-full h-72 md:h-96 overflow-hidden">
            <img
              src={invitation.cover_image_url}
              alt={invitation.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-transparent to-foreground" />
          </div>
        )}

        <div className="relative max-w-3xl mx-auto px-6 py-12 space-y-12">
          {/* Event Title Section */}
          <div className="text-center space-y-6 animate-slide-up">
            {/* Logo gold */}
            <div className="relative mx-auto w-20 h-20">
              <div className="absolute inset-0 bg-gold/20 rounded-full blur-xl animate-pulse" />
              <img 
                src={logo2} 
                alt="Sélection" 
                className="relative w-full h-full object-contain animate-glow-breathe"
              />
            </div>

            <h1 className="text-4xl md:text-6xl font-serif text-background tracking-wide leading-tight">
              {invitation?.title}
            </h1>

            <OrnamentalDivider />

            {invitation?.message && (
              <p className="text-background/70 max-w-lg mx-auto leading-relaxed text-lg whitespace-pre-wrap font-serif italic">
                {invitation.message}
              </p>
            )}
          </div>

          {/* Event Details Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            {/* Date & Time Card */}
            <div className="relative bg-background/5 backdrop-blur-sm border border-gold/20 p-6 group hover:border-gold/40 transition-all duration-500">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 border border-gold/30 rounded-full flex items-center justify-center group-hover:bg-gold/10 transition-colors duration-300">
                  <CalendarDays className="h-6 w-6 text-gold" />
                </div>
                <div className="space-y-1">
                  <p className="text-gold/70 text-xs tracking-widest uppercase">Thời Gian</p>
                  <p className="text-background font-serif text-lg">
                    {invitation?.event_date &&
                      format(new Date(invitation.event_date), "EEEE", { locale: vi })}
                  </p>
                  <p className="text-background/80">
                    {invitation?.event_date &&
                      format(new Date(invitation.event_date), "dd/MM/yyyy")}
                  </p>
                  <div className="flex items-center gap-2 text-gold text-xl font-serif">
                    <Clock className="h-4 w-4" />
                    {invitation?.event_date &&
                      format(new Date(invitation.event_date), "HH:mm")}
                  </div>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="relative bg-background/5 backdrop-blur-sm border border-gold/20 p-6 group hover:border-gold/40 transition-all duration-500">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 border border-gold/30 rounded-full flex items-center justify-center group-hover:bg-gold/10 transition-colors duration-300">
                  <MapPin className="h-6 w-6 text-gold" />
                </div>
                <div className="space-y-1 flex-1">
                  <p className="text-gold/70 text-xs tracking-widest uppercase">Địa Điểm</p>
                  <p className="text-background font-serif text-lg leading-snug">
                    {invitation?.location}
                  </p>
                  {invitation?.location_url && (
                    <a
                      href={invitation.location_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-gold text-sm hover:text-gold-light transition-colors group/link"
                    >
                      Xem bản đồ
                      <ExternalLink className="h-3.5 w-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Event Agenda / Program */}
          {invitation?.agenda && (
            <div className="animate-slide-up" style={{ animationDelay: "0.25s" }}>
              <div className="relative bg-background/5 backdrop-blur-sm border border-gold/20 p-8">
                {/* Corner decorations */}
                <DecorativeCorner className="absolute top-2 left-2 text-gold/30 w-10 h-10" />
                <DecorativeCorner className="absolute top-2 right-2 text-gold/30 rotate-90 w-10 h-10" />
                <DecorativeCorner className="absolute bottom-2 left-2 text-gold/30 -rotate-90 w-10 h-10" />
                <DecorativeCorner className="absolute bottom-2 right-2 text-gold/30 rotate-180 w-10 h-10" />

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 border border-gold/30 rounded-full flex items-center justify-center">
                    <ListOrdered className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-gold/70 text-xs tracking-widest uppercase">Chương Trình</p>
                    <h3 className="text-background font-serif text-xl">Nội Dung Sự Kiện</h3>
                  </div>
                </div>

                <div className="pl-4 border-l-2 border-gold/30 space-y-4">
                  {invitation.agenda.split('\n').filter(line => line.trim()).map((line, index) => (
                    <div key={index} className="relative flex items-start gap-4 group">
                      <div className="absolute -left-[1.4rem] top-2 w-3 h-3 rounded-full bg-foreground border-2 border-gold group-hover:bg-gold transition-colors" />
                      <p className="text-background/90 leading-relaxed font-serif">{line}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Dress Code */}
          {invitation?.dress_code && (
            <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <div className="relative bg-background/5 backdrop-blur-sm border border-gold/20 p-6 text-center">
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 border border-gold/30 rounded-full flex items-center justify-center">
                    <Shirt className="h-5 w-5 text-gold" />
                  </div>
                  <div className="text-left">
                    <p className="text-gold/70 text-xs tracking-widest uppercase">Dress Code</p>
                    <p className="text-background font-serif text-lg">{invitation.dress_code}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* RSVP Form */}
          <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <div className="relative bg-background/5 backdrop-blur-sm border border-gold/20 p-8">
              {/* Corner decorations */}
              <DecorativeCorner className="absolute top-2 left-2 text-gold/30 w-10 h-10" />
              <DecorativeCorner className="absolute top-2 right-2 text-gold/30 rotate-90 w-10 h-10" />
              <DecorativeCorner className="absolute bottom-2 left-2 text-gold/30 -rotate-90 w-10 h-10" />
              <DecorativeCorner className="absolute bottom-2 right-2 text-gold/30 rotate-180 w-10 h-10" />

              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-serif text-background">
                  Xác Nhận Tham Dự
                </h2>
                <OrnamentalDivider />
              </div>

              <Form {...rsvpForm}>
                <form onSubmit={rsvpForm.handleSubmit(onRSVPSubmit)} className="space-y-6">
                  <FormField
                    control={rsvpForm.control}
                    name="guest_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-background/80 text-sm tracking-wider uppercase">
                          Họ và tên <span className="text-gold">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nguyễn Văn A"
                            {...field}
                            className="bg-transparent border-gold/30 text-background placeholder:text-background/30 focus:border-gold h-12"
                          />
                        </FormControl>
                        <FormMessage className="text-gold/80" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={rsvpForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-background/80 text-sm tracking-wider uppercase">
                          Số điện thoại
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="0912 345 678"
                            {...field}
                            className="bg-transparent border-gold/30 text-background placeholder:text-background/30 focus:border-gold h-12"
                          />
                        </FormControl>
                        <FormMessage className="text-gold/80" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={rsvpForm.control}
                    name="attending"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-background/80 text-sm tracking-wider uppercase">
                          Bạn sẽ tham dự? <span className="text-gold">*</span>
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col sm:flex-row gap-4"
                          >
                            <div className="flex items-center space-x-3 bg-background/5 border border-gold/20 px-4 py-3 hover:border-gold/40 transition-colors cursor-pointer">
                              <RadioGroupItem
                                value="yes"
                                id="yes"
                                className="border-gold text-gold"
                              />
                              <Label
                                htmlFor="yes"
                                className="text-background cursor-pointer"
                              >
                                Có, tôi sẽ đến
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3 bg-background/5 border border-gold/20 px-4 py-3 hover:border-gold/40 transition-colors cursor-pointer">
                              <RadioGroupItem
                                value="no"
                                id="no"
                                className="border-gold text-gold"
                              />
                              <Label
                                htmlFor="no"
                                className="text-background cursor-pointer"
                              >
                                Rất tiếc, tôi không thể đến
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage className="text-gold/80" />
                      </FormItem>
                    )}
                  />

                  {watchAttending === "yes" && (
                    <FormField
                      control={rsvpForm.control}
                      name="guest_count"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-background/80 text-sm tracking-wider uppercase">
                            Số người tham dự
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              max={10}
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                              className="bg-transparent border-gold/30 text-background focus:border-gold h-12 w-24"
                            />
                          </FormControl>
                          <FormMessage className="text-gold/80" />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={rsvpForm.control}
                    name="note"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-background/80 text-sm tracking-wider uppercase">
                          Ghi chú (tùy chọn)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Dị ứng thực phẩm, yêu cầu đặc biệt..."
                            rows={3}
                            {...field}
                            className="bg-transparent border-gold/30 text-background placeholder:text-background/30 focus:border-gold resize-none"
                          />
                        </FormControl>
                        <FormMessage className="text-gold/80" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={submitRSVP.isPending}
                    className="w-full bg-gold hover:bg-gold-dark text-gold-foreground border-0 tracking-widest uppercase text-sm h-14 transition-all duration-300"
                  >
                    {submitRSVP.isPending && (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    )}
                    Gửi Phản Hồi
                  </Button>
                </form>
              </Form>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pb-8 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <img 
              src={logo2} 
              alt="Sélection Wine" 
              className="h-10 mx-auto opacity-40"
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default PublicInvitation;