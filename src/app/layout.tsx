import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sujal Gupta - Portfolio",
  description: "An immersive XR portfolio highlighting projects in AR/VR, Spatial Computing, and WebXR.",
  icons: {
    icon: "/Gemini_Generated_Image_7577lg7577lg7577-Photoroom.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

