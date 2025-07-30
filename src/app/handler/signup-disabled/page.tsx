import Link from "next/link";

export default function SignupDisabled() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Sign Up Not Available</h1>
        <p className="text-muted-foreground mb-6">
          New user registration is currently disabled. Please contact an administrator for access.
        </p>
        <Link 
          href="/handler/sign-in"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}