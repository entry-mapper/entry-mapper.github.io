"use client";
import "./globals.css";
import { Layout } from "antd";
import { NavBar } from "./components/nav-bar";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import AuthWrapper from "./components/AuthWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head></head>
      <body
        className="bg-cover bg-no-repeat"
        style={{
          backgroundImage: "url('/background.png')",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
        }}
      >
        <script>0</script>
        <Provider store={store}>
          <AuthWrapper>
            <NavBar />
            <Layout className="h-screen items-center bg-transparent">
              {children}
            </Layout>
          </AuthWrapper>
        </Provider>
      </body>
    </html>
  );
}
