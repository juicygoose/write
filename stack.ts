import { StackServerApp } from "@stackframe/stack";
import { isSignupEnabled } from "@/lib/config";

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  urls: {
    signIn: "/handler/sign-in",
    signUp: isSignupEnabled ? "/handler/sign-up" : "/handler/signup-disabled",
    emailVerification: "/handler/email-verification",
    passwordReset: "/handler/password-reset",
    signOut: "/handler/sign-out",
    afterSignIn: "/",
    afterSignUp: "/",
    afterSignOut: "/handler/sign-in",
  },
});

