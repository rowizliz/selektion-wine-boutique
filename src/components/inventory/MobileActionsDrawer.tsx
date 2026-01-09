import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Plus, Upload, FileSpreadsheet, Menu, Package, ShoppingCart } from "lucide-react";

interface MobileActionsDrawerProps {
  onAddInventory: () => void;
  onImportInventory: () => void;
  onImportOrders: () => void;
  onCreateOrder: () => void;
}

const MobileActionsDrawer = ({
  onAddInventory,
  onImportInventory,
  onImportOrders,
  onCreateOrder,
}: MobileActionsDrawerProps) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button size="icon" variant="outline" className="fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full shadow-lg md:hidden">
          <Plus className="h-6 w-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Thao Tác Nhanh</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 pb-8 grid grid-cols-2 gap-3">
          <DrawerClose asChild>
            <Button 
              variant="outline" 
              className="h-auto flex-col py-4 gap-2"
              onClick={onAddInventory}
            >
              <Package className="h-6 w-6" />
              <span className="text-sm">Thêm Tồn Kho</span>
            </Button>
          </DrawerClose>
          
          <DrawerClose asChild>
            <Button 
              variant="outline" 
              className="h-auto flex-col py-4 gap-2"
              onClick={onCreateOrder}
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="text-sm">Tạo Đơn Hàng</span>
            </Button>
          </DrawerClose>

          <DrawerClose asChild>
            <Button 
              variant="outline" 
              className="h-auto flex-col py-4 gap-2"
              onClick={onImportInventory}
            >
              <FileSpreadsheet className="h-6 w-6" />
              <span className="text-sm">Import Kho</span>
            </Button>
          </DrawerClose>

          <DrawerClose asChild>
            <Button 
              variant="outline" 
              className="h-auto flex-col py-4 gap-2"
              onClick={onImportOrders}
            >
              <Upload className="h-6 w-6" />
              <span className="text-sm">Import Đơn</span>
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileActionsDrawer;
