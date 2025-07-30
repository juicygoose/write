'use client'

import { useUser } from "@stackframe/stack";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { useState } from "react";

export function UserMenu() {
  const user = useUser();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <User className="h-4 w-4" />
        {user.displayName || user.primaryEmail || 'User'}
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-48 bg-background border rounded-lg shadow-lg z-50">
          <div className="p-2">
            <div className="px-2 py-1 text-sm text-muted-foreground border-b mb-2">
              {user.primaryEmail}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                user.signOut();
                setIsOpen(false);
              }}
              className="w-full justify-start text-sm"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}