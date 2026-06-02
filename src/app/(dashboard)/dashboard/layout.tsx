import UserLayout from "@/components/layouts/UserLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserLayout>{children}</UserLayout>;
}
