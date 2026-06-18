import VerifyPage from "@/components/sections/auth/Verify";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function SingUpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyPage />
    </Suspense>
  );
}
