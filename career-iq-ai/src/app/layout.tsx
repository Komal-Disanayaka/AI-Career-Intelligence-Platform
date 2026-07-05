import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareerIQ AI - AI-Powered Career Intelligence Platform",
  description:
    "Find your perfect career path with AI. Get personalized job recommendations, salary predictions, and skill gap analysis powered by machine learning.",
  keywords: [
    "AI career",
    "job recommendation",
    "salary prediction",
    "skill gap analysis",
    "career intelligence",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1a1b25",
              color: "#f0f0f0",
              border: "1px solid #2a2b35",
              borderRadius: "12px",
            },
            success: {
              iconTheme: {
                primary: "#c8ff00",
                secondary: "#000",
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
