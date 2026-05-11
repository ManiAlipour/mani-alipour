import React from "react";

export default function RootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
