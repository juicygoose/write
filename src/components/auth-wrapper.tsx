"use client";

import { useUser } from "@stackframe/stack";
import { SignIn } from "@stackframe/stack";

interface AuthWrapperProps {
  children: React.ReactNode;
  isSignupEnabled?: boolean;
}

export function AuthWrapper({
  children,
  isSignupEnabled = true,
}: AuthWrapperProps) {
  const user = useUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome to Write</h1>
            <p className="text-muted-foreground">
              The last writing software {"you'll"} ever need
            </p>
          </div>
          <SignIn />
          {!isSignupEnabled && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                New user registration is currently disabled
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
