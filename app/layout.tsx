import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Carrot Market",
    default: "Carrot Marget",
  },
  description: "Sell and buy all the things.",
};

export default function RootLayout({
  children,
}: // Parallel Routes
// potato,
Readonly<{
  children: React.ReactNode;
  // potato?: React.ReactNode; // potato의 타입을 정의
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-neutral-900 text-white max-w-screen-sm mx-auto`}
      >
        {/* {potato} */}
        {children}
      </body>
    </html>
  );
}
