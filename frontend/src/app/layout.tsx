import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Web3ModalProvider from "@/context";
import { cookieToInitialState } from "wagmi";
import { headers } from "next/headers";
import { config } from "@/config";
import "./globals.css";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Beer Tap by Infinity",
  description: "Connecting traditions with cutting-edge technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));

  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3ModalProvider initialState={initialState}>
          <section className="p-4 space-y-4">
            <div className="flex items-center justify-center">
              <Image src="/infinity-block.png" alt="Logo" width={100} height={100} />
              <span>
                <p>Beer Tap</p>
                <small>by Infinity Web3</small>
              </span>
            </div>
            {children}
          </section>
        </Web3ModalProvider>
      </body>
    </html>
  );
}
