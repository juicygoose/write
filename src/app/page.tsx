import { WritingEditor } from "@/components/writing-editor";
import { AuthWrapper } from "@/components/auth-wrapper";

export default function Home() {
  return (
    <AuthWrapper>
      <WritingEditor />
    </AuthWrapper>
  );
}
