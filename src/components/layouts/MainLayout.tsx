import React from "react";
import RootProvider from "../providers";
import Header from "../sections/Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RootProvider>
      <div>
        <Header />
        {children}
      </div>
    </RootProvider>
  );
}
