import type { Metadata } from "next";
import "./globals.css";
import { AuthContextProvider } from "./context/auth.context";
import { Button, Row } from "antd";
import {Layout} from "antd";

export const metadata: Metadata = {
  title: "Admin Portal",
  description: "Entrymapper Admin Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/styles/globals.css" as="style" />
      </head>
      <body
        className="bg-cover bg-no-repeat"
        style={{
          backgroundImage: "url('/background.png')",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
        }}
      >
        <script>0</script>
        <AuthContextProvider>
        <Layout className='h-screen items-center bg-transparent'>
          {children}
          </Layout>
        </AuthContextProvider>
      </body>
    </html>
  );
}
