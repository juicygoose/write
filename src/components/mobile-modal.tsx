'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface MobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function MobileModal({ isOpen, onClose, title, children }: MobileModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="lg:hidden fixed inset-x-0 bottom-0 top-auto translate-x-0 translate-y-0 rounded-t-xl rounded-b-none border-t max-h-[80vh] w-full max-w-none">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg font-semibold text-left">{title}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto -mx-6 -mb-6 px-6 pb-6">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}