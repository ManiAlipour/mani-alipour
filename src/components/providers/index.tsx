import ReduxProvider from "@/store";
import React from "react";

export default function RootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ReduxProvider>{children}</ReduxProvider>;
}
