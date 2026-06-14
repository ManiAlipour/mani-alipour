import SignUp from "@/components/sections/auth/SignUp";
import VerifyPage from "@/components/sections/auth/Verify";
import { Suspense } from "react";

export default function SingUpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyPage />
    </Suspense>
  );
}
