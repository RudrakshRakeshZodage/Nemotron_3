import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: "NemoCore AI – Agentic AI Platform powered by NVIDIA Nemotron 3",
  description:
    "Build smarter AI agents with NemoCore AI, powered by NVIDIA Nemotron 3. Multi-token prediction, GPU-accelerated inference, agentic workflows, and more.",
  keywords: ["NVIDIA Nemotron", "AI Platform", "Agentic AI", "NemoCore", "GPU AI"],
  openGraph: {
    title: "NemoCore AI",
    description: "Agentic AI Platform powered by NVIDIA Nemotron 3",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
