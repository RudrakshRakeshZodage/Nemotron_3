import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
