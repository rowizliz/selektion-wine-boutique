import { useState } from "react";
import { Check, ChevronsUpDown, Plus, Calendar, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  InventoryProfile,
  useInventoryProfiles,
  useCreateProfile,
  useSetActiveProfile,
  useUpdateProfile,
  useDeleteProfile,
} from "@/hooks/useInventoryProfiles";

interface ProfileSelectorProps {
  selectedProfileId: string | null;
  onSelectProfile: (profile: InventoryProfile) => void;
}

export default function ProfileSelector({
  selectedProfileId,
  onSelectProfile,
}: ProfileSelectorProps) {
  const [open, setOpen] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingProfile, setEditingProfile] = useState<InventoryProfile | null>(null);

  const { data: profiles, isLoading } = useInventoryProfiles();
  const createProfile = useCreateProfile();
  const setActiveProfile = useSetActiveProfile();
  const updateProfile = useUpdateProfile();
  const deleteProfile = useDeleteProfile();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const selectedProfile = profiles?.find((p) => p.id === selectedProfileId);

  const handleCreate = async () => {
    if (!formData.name.trim()) return;

    const result = await createProfile.mutateAsync({
      name: formData.name,
      description: formData.description || undefined,
    });

    // Activate the new profile
    await setActiveProfile.mutateAsync(result.id);
    onSelectProfile(result);

    setFormData({ name: "", description: "" });
    setShowCreateDialog(false);
  };

  const handleEdit = async () => {
    if (!editingProfile || !formData.name.trim()) return;

    const result = await updateProfile.mutateAsync({
      id: editingProfile.id,
      name: formData.name,
      description: formData.description || undefined,
    });

    if (selectedProfileId === editingProfile.id) {
      onSelectProfile({ ...editingProfile, ...result });
    }

    setFormData({ name: "", description: "" });
    setEditingProfile(null);
    setShowEditDialog(false);
  };

  const handleDelete = async () => {
    if (!editingProfile) return;

    await deleteProfile.mutateAsync(editingProfile.id);

    // If we deleted the selected profile, select first remaining
    if (selectedProfileId === editingProfile.id && profiles && profiles.length > 1) {
      const remaining = profiles.find((p) => p.id !== editingProfile.id);
      if (remaining) {
        await setActiveProfile.mutateAsync(remaining.id);
        onSelectProfile(remaining);
      }
    }

    setEditingProfile(null);
    setShowDeleteDialog(false);
  };

  const handleSelectProfile = async (profile: InventoryProfile) => {
    await setActiveProfile.mutateAsync(profile.id);
    onSelectProfile(profile);
    setOpen(false);
  };

  const openEditDialog = (profile: InventoryProfile, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProfile(profile);
    setFormData({
      name: profile.name,
      description: profile.description || "",
    });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (profile: InventoryProfile, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProfile(profile);
    setShowDeleteDialog(true);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[280px] justify-between"
          >
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {isLoading ? (
                "Đang tải..."
              ) : selectedProfile ? (
                <span className="truncate">{selectedProfile.name}</span>
              ) : (
                "Chọn kỳ kho hàng..."
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0">
          <Command>
            <CommandInput placeholder="Tìm kỳ kho hàng..." />
            <CommandList>
              <CommandEmpty>Không tìm thấy.</CommandEmpty>
              <CommandGroup heading="Kỳ kho hàng">
                {profiles?.map((profile) => (
                  <CommandItem
                    key={profile.id}
                    value={profile.name}
                    onSelect={() => handleSelectProfile(profile)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Check
                        className={cn(
                          "h-4 w-4",
                          selectedProfileId === profile.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col">
                        <span>{profile.name}</span>
                        {profile.description && (
                          <span className="text-xs text-muted-foreground">
                            {profile.description}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => openEditDialog(profile, e)}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      {profiles.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive"
                          onClick={(e) => openDeleteDialog(profile, e)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setFormData({ name: "", description: "" });
                    setShowCreateDialog(true);
                    setOpen(false);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Tạo kỳ kho hàng mới
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo Kỳ Kho Hàng Mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên kỳ kho hàng</Label>
              <Input
                id="name"
                placeholder="VD: Quý 2 - 2025"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả (tùy chọn)</Label>
              <Textarea
                id="description"
                placeholder="Mô tả ngắn về kỳ kho hàng này..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreate} disabled={!formData.name.trim() || createProfile.isPending}>
              {createProfile.isPending ? "Đang tạo..." : "Tạo mới"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sửa Kỳ Kho Hàng</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Tên kỳ kho hàng</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Mô tả (tùy chọn)</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleEdit} disabled={!formData.name.trim() || updateProfile.isPending}>
              {updateProfile.isPending ? "Đang lưu..." : "Lưu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa kỳ kho hàng?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa "{editingProfile?.name}"? Dữ liệu kho hàng và đơn hàng liên quan sẽ không bị xóa
              nhưng sẽ không còn được gắn với kỳ này.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteProfile.isPending ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
