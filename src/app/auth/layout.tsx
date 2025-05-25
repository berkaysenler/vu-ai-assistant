import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - VU Assistant",
  description: "Sign in or create an account for Victoria University Assistant",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
