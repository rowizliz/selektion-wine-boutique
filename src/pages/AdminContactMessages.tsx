import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Trash2, Check, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useContactMessages, useUpdateContactMessage, useDeleteContactMessage } from "@/hooks/useContactMessages";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

const AdminContactMessages = () => {
  const { data: messages, isLoading } = useContactMessages();
  const updateMessage = useUpdateContactMessage();
  const deleteMessage = useDeleteContactMessage();
  const { toast } = useToast();
  const [selectedMessage, setSelectedMessage] = useState<typeof messages extends (infer T)[] ? T : never | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const handleMarkAsRead = (id: string) => {
    updateMessage.mutate(
      { id, updates: { status: 'read' } },
      {
        onSuccess: () => {
          toast({ title: "Đã đánh dấu đã đọc" });
        }
      }
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc muốn xóa tin nhắn này?")) {
      deleteMessage.mutate(id, {
        onSuccess: () => {
          toast({ title: "Đã xóa tin nhắn" });
        }
      });
    }
  };

  const handleSaveNotes = () => {
    if (!selectedMessage) return;
    updateMessage.mutate(
      { id: selectedMessage.id, updates: { admin_notes: adminNotes, status: 'read' } },
      {
        onSuccess: () => {
          toast({ title: "Đã lưu ghi chú" });
          setSelectedMessage(null);
        }
      }
    );
  };

  const openMessageDialog = (message: NonNullable<typeof selectedMessage>) => {
    setSelectedMessage(message);
    setAdminNotes(message.admin_notes || "");
    // Mark as read when opening
    if (message.status === 'unread') {
      updateMessage.mutate({ id: message.id, updates: { status: 'read' } });
    }
  };

  const unreadCount = messages?.filter(m => m.status === 'unread').length ?? 0;

  return (
    <>
      <Helmet>
        <title>Tin Nhắn Liên Hệ | Admin</title>
      </Helmet>

      <main className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <header className="flex items-center gap-4">
            <Link to="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-serif flex items-center gap-2">
                <Mail className="h-6 w-6" />
                Tin Nhắn Liên Hệ
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount} mới
                  </Badge>
                )}
              </h1>
              <p className="text-muted-foreground text-sm">
                Quản lý tin nhắn từ khách hàng
              </p>
            </div>
          </header>

          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              Đang tải...
            </div>
          ) : messages?.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Chưa có tin nhắn nào
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {messages?.map((message) => (
                <Card 
                  key={message.id} 
                  className={message.status === 'unread' ? 'border-primary/50 bg-primary/5' : ''}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {message.name}
                          {message.status === 'unread' && (
                            <Badge variant="default" className="text-xs">Mới</Badge>
                          )}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{message.email}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(message.created_at), "dd/MM/yyyy 'lúc' HH:mm", { locale: vi })}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openMessageDialog(message)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Xem
                        </Button>
                        {message.status === 'unread' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAsRead(message.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Đã đọc
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(message.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-2">{message.message}</p>
                    {message.admin_notes && (
                      <div className="mt-2 p-2 bg-muted rounded text-xs text-muted-foreground">
                        <strong>Ghi chú:</strong> {message.admin_notes}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Message Detail Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Chi tiết tin nhắn</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Họ tên</p>
                <p className="font-medium">{selectedMessage.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{selectedMessage.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Thời gian</p>
                <p className="font-medium">
                  {format(new Date(selectedMessage.created_at), "dd/MM/yyyy 'lúc' HH:mm", { locale: vi })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nội dung</p>
                <p className="whitespace-pre-wrap bg-muted p-3 rounded">{selectedMessage.message}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Ghi chú Admin</p>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Thêm ghi chú..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                  Đóng
                </Button>
                <Button onClick={handleSaveNotes}>
                  Lưu ghi chú
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminContactMessages;
