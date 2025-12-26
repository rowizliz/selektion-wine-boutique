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
  Users,
  Loader2,
  CheckCircle2,
  Shirt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface InvitationData {
  id: string;
  title: string;
  event_date: string;
  location: string;
  location_url: string | null;
  dress_code: string | null;
  message: string | null;
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

  // PIN Entry Screen
  if (!isVerified) {
    return (
      <>
        <Helmet>
          <title>Thiệp Mời | Sélection</title>
        </Helmet>

        <main className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-6">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl font-serif">Nhập mã PIN</CardTitle>
              <p className="text-muted-foreground text-sm">
                Vui lòng nhập mã PIN đã được gửi để xem thiệp mời
              </p>
            </CardHeader>
            <CardContent>
              <Form {...pinForm}>
                <form onSubmit={pinForm.handleSubmit(onPINSubmit)} className="space-y-4">
                  <FormField
                    control={pinForm.control}
                    name="pin"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Nhập mã PIN"
                            className="text-center text-2xl tracking-widest"
                            maxLength={6}
                            autoFocus
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isVerifying}>
                    {isVerifying ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Xác nhận
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  // RSVP Success Screen
  if (rsvpSubmitted) {
    return (
      <>
        <Helmet>
          <title>{invitation?.title || "Thiệp Mời"} | Sélection</title>
        </Helmet>

        <main className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-6">
          <Card className="w-full max-w-md text-center">
            <CardContent className="pt-8 pb-8">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-serif mb-2">Cảm ơn bạn!</h2>
              <p className="text-muted-foreground">
                Phản hồi của bạn đã được ghi nhận.
                <br />
                Hẹn gặp bạn tại sự kiện!
              </p>
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  // Invitation View
  return (
    <>
      <Helmet>
        <title>{invitation?.title || "Thiệp Mời"} | Sélection</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <main className="min-h-screen bg-gradient-to-b from-background to-muted">
        {/* Cover Image */}
        {invitation?.cover_image_url && (
          <div className="w-full h-64 md:h-80 overflow-hidden">
            <img
              src={invitation.cover_image_url}
              alt={invitation.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="max-w-2xl mx-auto p-6 space-y-8">
          {/* Event Info */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-serif">{invitation?.title}</h1>

            {invitation?.message && (
              <p className="text-muted-foreground whitespace-pre-wrap">
                {invitation.message}
              </p>
            )}
          </div>

          {/* Details Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date & Time */}
            <Card>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <CalendarDays className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Thời gian</p>
                  <p className="font-medium">
                    {invitation?.event_date &&
                      format(new Date(invitation.event_date), "EEEE, dd/MM/yyyy", {
                        locale: vi,
                      })}
                  </p>
                  <p className="text-lg font-bold">
                    {invitation?.event_date &&
                      format(new Date(invitation.event_date), "HH:mm")}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground">Địa điểm</p>
                  <p className="font-medium">{invitation?.location}</p>
                  {invitation?.location_url && (
                    <a
                      href={invitation.location_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary text-sm flex items-center gap-1 hover:underline"
                    >
                      Xem bản đồ <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dress Code */}
          {invitation?.dress_code && (
            <Card>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shirt className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dress Code</p>
                  <p className="font-medium">{invitation.dress_code}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* RSVP Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Xác nhận tham dự
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...rsvpForm}>
                <form onSubmit={rsvpForm.handleSubmit(onRSVPSubmit)} className="space-y-4">
                  <FormField
                    control={rsvpForm.control}
                    name="guest_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ và tên *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nguyễn Văn A" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={rsvpForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại</FormLabel>
                        <FormControl>
                          <Input placeholder="0912 345 678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={rsvpForm.control}
                    name="attending"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bạn sẽ tham dự? *</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="yes" />
                              <Label htmlFor="yes">Có, tôi sẽ đến</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="no" />
                              <Label htmlFor="no">Rất tiếc, tôi không thể đến</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watchAttending === "yes" && (
                    <FormField
                      control={rsvpForm.control}
                      name="guest_count"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số người tham dự</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              max={10}
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={rsvpForm.control}
                    name="note"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ghi chú (tùy chọn)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Dị ứng thực phẩm, yêu cầu đặc biệt..."
                            rows={2}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={submitRSVP.isPending}
                  >
                    {submitRSVP.isPending && (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    )}
                    Gửi phản hồi
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
};

export default PublicInvitation;
