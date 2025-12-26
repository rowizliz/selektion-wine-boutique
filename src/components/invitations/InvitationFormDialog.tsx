import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useCreateInvitation,
  useUpdateInvitation,
  generateSlug,
  generatePIN,
  Invitation,
} from "@/hooks/useInvitations";

const formSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tên sự kiện"),
  event_date: z.date({ required_error: "Vui lòng chọn ngày" }),
  event_time: z.string().min(1, "Vui lòng nhập giờ"),
  location: z.string().min(1, "Vui lòng nhập địa điểm"),
  location_url: z.string().optional(),
  dress_code: z.string().optional(),
  message: z.string().optional(),
  agenda: z.string().optional(),
  cover_image_url: z.string().optional(),
  pin_code: z.string().min(4, "PIN phải có ít nhất 4 ký tự"),
  url_slug: z.string().min(1, "Vui lòng nhập slug URL"),
});

type FormValues = z.infer<typeof formSchema>;

interface InvitationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invitation?: Invitation | null;
}

const InvitationFormDialog = ({
  open,
  onOpenChange,
  invitation,
}: InvitationFormDialogProps) => {
  const createInvitation = useCreateInvitation();
  const updateInvitation = useUpdateInvitation();
  const isEditing = !!invitation;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      event_date: new Date(),
      event_time: "18:00",
      location: "",
      location_url: "",
      dress_code: "",
      message: "",
      agenda: "",
      cover_image_url: "",
      pin_code: generatePIN(),
      url_slug: "",
    },
  });

  useEffect(() => {
    if (invitation) {
      const eventDate = new Date(invitation.event_date);
      form.reset({
        title: invitation.title,
        event_date: eventDate,
        event_time: format(eventDate, "HH:mm"),
        location: invitation.location,
        location_url: invitation.location_url || "",
        dress_code: invitation.dress_code || "",
        message: invitation.message || "",
        agenda: invitation.agenda || "",
        cover_image_url: invitation.cover_image_url || "",
        pin_code: invitation.pin_code,
        url_slug: invitation.url_slug,
      });
    } else {
      form.reset({
        title: "",
        event_date: new Date(),
        event_time: "18:00",
        location: "",
        location_url: "",
        dress_code: "",
        message: "",
        agenda: "",
        cover_image_url: "",
        pin_code: generatePIN(),
        url_slug: "",
      });
    }
  }, [invitation, form]);

  // Auto-generate slug from title
  const watchTitle = form.watch("title");
  useEffect(() => {
    if (!isEditing && watchTitle) {
      form.setValue("url_slug", generateSlug(watchTitle));
    }
  }, [watchTitle, isEditing, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      // Combine date and time
      const [hours, minutes] = values.event_time.split(":").map(Number);
      const eventDateTime = new Date(values.event_date);
      eventDateTime.setHours(hours, minutes, 0, 0);

      const payload = {
        title: values.title,
        event_date: eventDateTime.toISOString(),
        location: values.location,
        location_url: values.location_url || undefined,
        dress_code: values.dress_code || undefined,
        message: values.message || undefined,
        agenda: values.agenda || undefined,
        cover_image_url: values.cover_image_url || undefined,
        pin_code: values.pin_code,
        url_slug: values.url_slug,
      };

      if (isEditing && invitation) {
        await updateInvitation.mutateAsync({ id: invitation.id, ...payload });
        toast.success("Đã cập nhật thiệp mời");
      } else {
        await createInvitation.mutateAsync(payload);
        toast.success("Đã tạo thiệp mời mới");
      }

      onOpenChange(false);
    } catch (error: any) {
      if (error.message?.includes("duplicate")) {
        toast.error("URL slug đã tồn tại, vui lòng chọn slug khác");
      } else {
        toast.error("Có lỗi xảy ra");
      }
    }
  };

  const isPending = createInvitation.isPending || updateInvitation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Chỉnh sửa thiệp mời" : "Tạo thiệp mời mới"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên sự kiện *</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Tiệc Khai Trương Sélection" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="event_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ngày *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Chọn ngày</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="event_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giờ *</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa điểm *</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: 123 Nguyễn Huệ, Q.1, TP.HCM" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link Google Maps (tùy chọn)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://maps.google.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dress_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dress Code (tùy chọn)</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Smart Casual, Formal..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lời nhắn (tùy chọn)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Lời mời, thông tin thêm về sự kiện..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agenda"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nội dung sự kiện (tùy chọn)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="VD:
16:00 - Đón khách
16:30 - Khai mạc
17:00 - Thưởng thức rượu vang
18:00 - Tiệc nhẹ
19:00 - Kết thúc"
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cover_image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL ảnh cover (tùy chọn)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="url_slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Slug *</FormLabel>
                    <FormControl>
                      <Input placeholder="tiec-khai-truong" {...field} />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Link: /thiep/{field.value || "..."}
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pin_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã PIN *</FormLabel>
                    <FormControl>
                      <Input placeholder="1234" {...field} />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Khách cần nhập PIN để xem thiệp
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {isEditing ? "Cập nhật" : "Tạo thiệp"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InvitationFormDialog;
