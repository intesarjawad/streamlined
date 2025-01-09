import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RootProvider } from '@/components/providers/root-provider';
import { cn } from "@/lib/utils";
import { NavHeader } from "@/components/layout/nav-header";
import { AuthProvider } from '@/components/providers/auth-provider';
import { AuthGuard } from '@/components/providers/auth-guard';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Streamlined",
  description: "A modern, immersive UI experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body suppressHydrationWarning className={cn(
        geistSans.variable,
        geistMono.variable,
      )}>
        <AuthProvider>
          <AuthGuard>
            <RootProvider>
              <NavHeader />
              {children}
            </RootProvider>
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
