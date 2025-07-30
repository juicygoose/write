import { WritingEditor } from "@/components/writing-editor";
import { AuthWrapper } from "@/components/auth-wrapper";
import { isSignupEnabled } from "@/lib/config";

export default function Home() {
  return (
    <AuthWrapper isSignupEnabled={isSignupEnabled}>
      <WritingEditor />
    </AuthWrapper>
  );
}
