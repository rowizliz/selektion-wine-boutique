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
  guest_count: z.number().min(1).max(2, "Tối đa 2 người"),
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

// Ornamental divider - dark text for light theme
const OrnamentalDivider = () => (
  <div className="flex items-center justify-center gap-3 my-6">
    <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold-dark/50" />
    <Sparkles className="h-4 w-4 text-gold-dark" />
    <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold-dark/50" />
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

  // PIN Entry Screen - Light Cream Theme
  if (!isVerified) {
    return (
      <>
        <Helmet>
          <title>Thiệp Mời | Sélection</title>
        </Helmet>

        <main className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6 relative overflow-hidden">
          {/* Subtle texture/pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent" />
          </div>

          <div className="w-full max-w-md relative animate-fade-in">
            {/* Card with gold border */}
            <div className="relative bg-white/80 backdrop-blur-sm border border-gold-dark/30 p-8 md:p-12 shadow-xl">
              {/* Corner decorations */}
              <DecorativeCorner className="absolute top-2 left-2 text-gold-dark/50" />
              <DecorativeCorner className="absolute top-2 right-2 text-gold-dark/50 rotate-90" />
              <DecorativeCorner className="absolute bottom-2 left-2 text-gold-dark/50 -rotate-90" />
              <DecorativeCorner className="absolute bottom-2 right-2 text-gold-dark/50 rotate-180" />

              <div className="text-center space-y-6">
                {/* Large Logo */}
                <div className="relative mx-auto w-32 h-32 md:w-40 md:h-40">
                  <img 
                    src={logo2} 
                    alt="Sélection" 
                    className="relative w-full h-full object-contain drop-shadow-lg"
                  />
                </div>

                <div className="space-y-2">
                  <h1 className="text-2xl md:text-3xl font-serif text-foreground tracking-wide">
                    Thiệp Mời Riêng Tư
                  </h1>
                  <p className="text-muted-foreground text-sm tracking-wider uppercase">
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
                              className="text-center text-2xl tracking-[0.5em] bg-white border-gold-dark/30 text-foreground placeholder:text-muted-foreground/50 focus:border-gold-dark h-14"
                              maxLength={6}
                              autoFocus
                            />
                          </FormControl>
                          <FormMessage className="text-wine" />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={isVerifying}
                      className="w-full bg-gold-dark hover:bg-gold text-white border-0 tracking-widest uppercase text-sm h-12 transition-all duration-300 shadow-md"
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

  // RSVP Success Screen - Light Theme
  if (rsvpSubmitted) {
    return (
      <>
        <Helmet>
          <title>{invitation?.title || "Thiệp Mời"} | Sélection</title>
        </Helmet>

        <main className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent" />
          </div>

          <div className="w-full max-w-md relative animate-fade-in">
            <div className="relative bg-white/80 backdrop-blur-sm border border-gold-dark/30 p-8 md:p-12 text-center shadow-xl">
              <DecorativeCorner className="absolute top-2 left-2 text-gold-dark/50" />
              <DecorativeCorner className="absolute top-2 right-2 text-gold-dark/50 rotate-90" />
              <DecorativeCorner className="absolute bottom-2 left-2 text-gold-dark/50 -rotate-90" />
              <DecorativeCorner className="absolute bottom-2 right-2 text-gold-dark/50 rotate-180" />

              <div className="relative mx-auto w-24 h-24 mb-6">
                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
                <div className="relative w-full h-full border-2 border-green-500/50 rounded-full flex items-center justify-center bg-white">
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>
              </div>

              <h2 className="text-3xl font-serif text-foreground mb-3">Cảm Ơn Quý Khách</h2>
              <OrnamentalDivider />
              <p className="text-muted-foreground leading-relaxed">
                Phản hồi của quý khách đã được ghi nhận.
                <br />
                <span className="text-gold-dark font-medium">Hẹn gặp quý khách tại sự kiện!</span>
              </p>
            </div>
          </div>
        </main>
      </>
    );
  }

  // Main Invitation View - Light Cream Theme
  return (
    <>
      <Helmet>
        <title>{invitation?.title || "Thiệp Mời"} | Sélection</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <main className="min-h-screen bg-[#FAF7F2] relative">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent pointer-events-none" />

        {/* Cover Image with overlay */}
        {invitation?.cover_image_url && (
          <div className="relative w-full h-72 md:h-96 overflow-hidden">
            <img
              src={invitation.cover_image_url}
              alt={invitation.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#FAF7F2]" />
          </div>
        )}

        <div className="relative max-w-3xl mx-auto px-6 py-12 space-y-10">
          {/* Event Title Section - Minimalist Luxury with Rich Animations */}
          <div className="text-center pt-8 pb-6 relative">
            {/* Floating particles background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-10 left-1/4 w-1 h-1 bg-gold/40 rounded-full animate-float-particle" style={{ animationDelay: '0s' }} />
              <div className="absolute top-20 right-1/4 w-1.5 h-1.5 bg-gold/30 rounded-full animate-float-particle" style={{ animationDelay: '1s' }} />
              <div className="absolute top-32 left-1/3 w-0.5 h-0.5 bg-gold-dark/50 rounded-full animate-float-particle" style={{ animationDelay: '2s' }} />
              <div className="absolute top-16 right-1/3 w-1 h-1 bg-gold/35 rounded-full animate-float-particle" style={{ animationDelay: '0.5s' }} />
              <div className="absolute top-40 left-1/5 w-0.5 h-0.5 bg-gold-dark/40 rounded-full animate-float-particle" style={{ animationDelay: '1.5s' }} />
            </div>

            {/* Logo with enhanced glow and scale animation - LARGER */}
            <div className="relative mx-auto w-32 h-32 md:w-40 md:h-40 lg:w-44 lg:h-44 mb-10">
              {/* Pulsing glow ring behind logo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full bg-gold/10 animate-glow-ring" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full bg-gold/15 animate-glow-ring" style={{ animationDelay: '1s' }} />
              </div>
              <img 
                src={logo2} 
                alt="Sélection" 
                className="relative w-full h-full object-contain animate-glow-breathe animate-[scaleIn_0.8s_ease-out_forwards]"
              />
            </div>

            {/* Animated top ornament with staggered reveal */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-4">
                <div 
                  className="h-px w-12 md:w-24 bg-gradient-to-r from-transparent to-gold-dark/60 origin-right"
                  style={{ animation: 'expandWidth 0.8s ease-out 0.4s forwards', transform: 'scaleX(0)' }}
                />
                <div 
                  className="w-2 h-2 bg-gold-dark/70 rotate-45 animate-[spinIn_0.5s_ease-out_0.8s_forwards] opacity-0"
                />
                <div 
                  className="h-px w-12 md:w-24 bg-gradient-to-l from-transparent to-gold-dark/60 origin-left"
                  style={{ animation: 'expandWidth 0.8s ease-out 0.4s forwards', transform: 'scaleX(0)' }}
                />
              </div>
            </div>

            {/* Main Title with shimmer effect - NO OVERFLOW HIDDEN to prevent clipping */}
            <div className="relative px-4">
              <h1 
                className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-[0.15em] md:tracking-[0.2em] leading-normal text-foreground/90 relative pb-2"
                style={{ 
                  fontWeight: 300,
                  animation: 'slideUp 0.8s ease-out 0.3s forwards, letterSpacing 1.2s ease-out 0.3s forwards',
                  opacity: 0
                }}
              >
                {invitation?.title}
                {/* Shimmer overlay */}
                <span 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/20 to-transparent animate-shimmer pointer-events-none"
                  style={{ animationDelay: '1.5s' }}
                />
              </h1>
            </div>

            {/* Animated bottom ornament */}
            <div className="mt-8" style={{ animation: 'fadeIn 0.6s ease-out 0.9s forwards', opacity: 0 }}>
              <div className="flex items-center justify-center gap-4">
                <div 
                  className="h-px w-16 md:w-28 bg-gradient-to-r from-transparent via-gold-dark/30 to-gold-dark/60 origin-right"
                  style={{ animation: 'expandWidth 0.6s ease-out 1s forwards', transform: 'scaleX(0)' }}
                />
                <div className="relative">
                  <div 
                    className="w-2.5 h-2.5 bg-gold-dark/50 rotate-45 animate-pulse-slow"
                  />
                  <div 
                    className="absolute inset-0 w-2.5 h-2.5 bg-gold/30 rotate-45 animate-ping"
                    style={{ animationDuration: '2s' }}
                  />
                </div>
                <div 
                  className="h-px w-16 md:w-28 bg-gradient-to-l from-transparent via-gold-dark/30 to-gold-dark/60 origin-left"
                  style={{ animation: 'expandWidth 0.6s ease-out 1s forwards', transform: 'scaleX(0)' }}
                />
              </div>
            </div>

            {/* Message with typewriter-like reveal */}
            {invitation?.message && (
              <div 
                className="mt-10"
                style={{ animation: 'fadeIn 0.8s ease-out 1.2s forwards, slideUp 0.8s ease-out 1.2s forwards', opacity: 0 }}
              >
                <p className="text-muted-foreground max-w-md mx-auto leading-relaxed text-base md:text-lg whitespace-pre-wrap font-serif italic tracking-wide">
                  {invitation.message}
                </p>
              </div>
            )}
          </div>

          {/* Event Details Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            {/* Date & Time Card */}
            <div className="relative bg-white/80 backdrop-blur-sm border border-gold-dark/20 p-6 group hover:border-gold-dark/40 hover:shadow-lg transition-all duration-500 shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 border border-gold-dark/30 rounded-full flex items-center justify-center group-hover:bg-gold/10 transition-colors duration-300 bg-white">
                  <CalendarDays className="h-6 w-6 text-gold-dark" />
                </div>
                <div className="space-y-1">
                  <p className="text-gold-dark text-xs tracking-widest uppercase font-medium">Thời Gian</p>
                  <p className="text-foreground font-serif text-lg capitalize">
                    {invitation?.event_date &&
                      format(new Date(invitation.event_date), "EEEE", { locale: vi })}
                  </p>
                  <p className="text-muted-foreground">
                    {invitation?.event_date &&
                      format(new Date(invitation.event_date), "dd/MM/yyyy")}
                  </p>
                  <div className="flex items-center gap-2 text-gold-dark text-xl font-serif font-medium">
                    <Clock className="h-4 w-4" />
                    {invitation?.event_date &&
                      format(new Date(invitation.event_date), "HH:mm")}
                  </div>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="relative bg-white/80 backdrop-blur-sm border border-gold-dark/20 p-6 group hover:border-gold-dark/40 hover:shadow-lg transition-all duration-500 shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 border border-gold-dark/30 rounded-full flex items-center justify-center group-hover:bg-gold/10 transition-colors duration-300 bg-white">
                  <MapPin className="h-6 w-6 text-gold-dark" />
                </div>
                <div className="space-y-1 flex-1">
                  <p className="text-gold-dark text-xs tracking-widest uppercase font-medium">Địa Điểm</p>
                  <p className="text-foreground font-serif text-lg leading-snug">
                    {invitation?.location}
                  </p>
                  {invitation?.location_url && (
                    <a
                      href={invitation.location_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-gold-dark text-sm hover:text-gold transition-colors group/link font-medium"
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
              <div className="relative bg-white/80 backdrop-blur-sm border border-gold-dark/20 p-8 shadow-md">
                {/* Corner decorations */}
                <DecorativeCorner className="absolute top-2 left-2 text-gold-dark/40 w-10 h-10" />
                <DecorativeCorner className="absolute top-2 right-2 text-gold-dark/40 rotate-90 w-10 h-10" />
                <DecorativeCorner className="absolute bottom-2 left-2 text-gold-dark/40 -rotate-90 w-10 h-10" />
                <DecorativeCorner className="absolute bottom-2 right-2 text-gold-dark/40 rotate-180 w-10 h-10" />

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 border border-gold-dark/30 rounded-full flex items-center justify-center bg-white">
                    <ListOrdered className="h-5 w-5 text-gold-dark" />
                  </div>
                  <div>
                    <p className="text-gold-dark text-xs tracking-widest uppercase font-medium">Chương Trình</p>
                    <h3 className="text-foreground font-serif text-xl">Nội Dung Sự Kiện</h3>
                  </div>
                </div>

                <div className="pl-4 border-l-2 border-gold-dark/30 space-y-4">
                  {invitation.agenda.split('\n').filter(line => line.trim()).map((line, index) => (
                    <div key={index} className="relative flex items-start gap-4 group">
                      <div className="absolute -left-[1.4rem] top-2 w-3 h-3 rounded-full bg-white border-2 border-gold-dark group-hover:bg-gold-dark transition-colors" />
                      <p className="text-foreground/90 leading-relaxed font-serif">{line}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Dress Code */}
          {invitation?.dress_code && (
            <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <div className="relative bg-white/80 backdrop-blur-sm border border-gold-dark/20 p-6 text-center shadow-md">
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 border border-gold-dark/30 rounded-full flex items-center justify-center bg-white">
                    <Shirt className="h-5 w-5 text-gold-dark" />
                  </div>
                  <div className="text-left">
                    <p className="text-gold-dark text-xs tracking-widest uppercase font-medium">Dress Code</p>
                    <p className="text-foreground font-serif text-lg">{invitation.dress_code}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* RSVP Form */}
          <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <div className="relative bg-white/80 backdrop-blur-sm border border-gold-dark/20 p-8 shadow-md">
              {/* Corner decorations */}
              <DecorativeCorner className="absolute top-2 left-2 text-gold-dark/40 w-10 h-10" />
              <DecorativeCorner className="absolute top-2 right-2 text-gold-dark/40 rotate-90 w-10 h-10" />
              <DecorativeCorner className="absolute bottom-2 left-2 text-gold-dark/40 -rotate-90 w-10 h-10" />
              <DecorativeCorner className="absolute bottom-2 right-2 text-gold-dark/40 rotate-180 w-10 h-10" />

              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-serif text-foreground">
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
                        <FormLabel className="text-foreground/80 text-sm tracking-wider uppercase">
                          Họ và tên <span className="text-gold-dark">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nguyễn Văn A"
                            {...field}
                            className="bg-white border-gold-dark/30 text-foreground placeholder:text-muted-foreground/50 focus:border-gold-dark h-12"
                          />
                        </FormControl>
                        <FormMessage className="text-wine" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={rsvpForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground/80 text-sm tracking-wider uppercase">
                          Số điện thoại
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="0912 345 678"
                            {...field}
                            className="bg-white border-gold-dark/30 text-foreground placeholder:text-muted-foreground/50 focus:border-gold-dark h-12"
                          />
                        </FormControl>
                        <FormMessage className="text-wine" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={rsvpForm.control}
                    name="attending"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground/80 text-sm tracking-wider uppercase">
                          Bạn sẽ tham dự? <span className="text-gold-dark">*</span>
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col sm:flex-row gap-4"
                          >
                            <div className="flex items-center space-x-3 bg-white border border-gold-dark/20 px-4 py-3 hover:border-gold-dark/40 transition-colors cursor-pointer shadow-sm">
                              <RadioGroupItem
                                value="yes"
                                id="yes"
                                className="border-gold-dark text-gold-dark"
                              />
                              <Label
                                htmlFor="yes"
                                className="text-foreground cursor-pointer"
                              >
                                Có, tôi sẽ đến
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3 bg-white border border-gold-dark/20 px-4 py-3 hover:border-gold-dark/40 transition-colors cursor-pointer shadow-sm">
                              <RadioGroupItem
                                value="no"
                                id="no"
                                className="border-gold-dark text-gold-dark"
                              />
                              <Label
                                htmlFor="no"
                                className="text-foreground cursor-pointer"
                              >
                                Rất tiếc, tôi không thể đến
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage className="text-wine" />
                      </FormItem>
                    )}
                  />

                  {watchAttending === "yes" && (
                    <FormField
                      control={rsvpForm.control}
                      name="guest_count"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/80 text-sm tracking-wider uppercase">
                            Số người tham dự
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              max={10}
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                              className="bg-white border-gold-dark/30 text-foreground focus:border-gold-dark h-12 w-24"
                            />
                          </FormControl>
                          <FormMessage className="text-wine" />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={rsvpForm.control}
                    name="note"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground/80 text-sm tracking-wider uppercase">
                          Ghi chú (tùy chọn)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Dị ứng thực phẩm, yêu cầu đặc biệt..."
                            rows={3}
                            {...field}
                            className="bg-white border-gold-dark/30 text-foreground placeholder:text-muted-foreground/50 focus:border-gold-dark resize-none"
                          />
                        </FormControl>
                        <FormMessage className="text-wine" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={submitRSVP.isPending}
                    className="w-full bg-gold-dark hover:bg-gold text-white border-0 tracking-widest uppercase text-sm h-14 transition-all duration-300 shadow-md"
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
              className="h-12 mx-auto opacity-60"
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default PublicInvitation;