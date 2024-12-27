'use client'
import type { Metadata } from "next";
import "./globals.css";
import { AuthContextProvider } from "./context/auth.context";
import { ConfigProvider, theme } from "antd";
import { Button, Row } from "antd";
import { Layout } from "antd";
import { NavBar } from "./components/nav-bar";

// export const metadata: Metadata = {
//   title: "Admin Portal",
//   description: "Entrymapper Admin Portal",
// };

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
          {/* <ConfigProvider
            theme={{
              token: {
                colorTextBase: "#262626",    // Default text
                colorBorder: "#a3a3a3",      // Border
                colorPrimary: "#1f1f1f",     // Accent (neutral tone)
                colorTextPlaceholder: "#595959", // Muted text
              },
            }}
          > */}
          <NavBar/>
            <Layout className="h-screen items-center bg-transparent">
              {children}
            </Layout>
          {/* </ConfigProvider> */}
        </AuthContextProvider>
      </body>
    </html>
  );
}
