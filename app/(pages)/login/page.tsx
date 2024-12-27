"use client";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/auth.context";
import { LoginForm, LoginResponse } from "../../interfaces/auth.interfaces";
import { redirect, useRouter } from "next/navigation";
import { Typography, Card, Form, Input, Button, message } from "antd";

const { Title, Paragraph } = Typography;

export default function Login() {
  const { login, isAuthenticated } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    setIsLoading(true);
    if (isAuthenticated) {
      redirect('/country-data');
    }
    setIsLoading(false);
  }, [isAuthenticated, router]);
  
  const [err, setErr] = useState<string | null>(null);
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    const response: LoginResponse = await login(formData);

    if ("error" in response) {
      setErr(response.message);
      message.error(response.message);
    } else {
      setFormData({
        email: "",
        password: "",
      });
      setErr(null);
      router.push("/country-data");
    }
  };

  const linkClass = 'ml-1 font-medium text-indigo-900 hover:text-indigo-700 focus:outline-none focus:underline focus:underline-indigo-500'

  if (isLoading) {
    return <></>;
  }

  return (
    <Card style={{margin: "auto", marginTop: 50, padding: 20 }}>
      <div className="text-center md:w-80 w-64">
        <Title level={2}>Welcome Back!</Title>
        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
            <Input 
              type="email" 
              value={formData.email} 
              onChange={(e) => setFormData((prev) => ({ ...prev, "email": e.target.value }))} 
            />
          </Form.Item>

          <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password 
            onChange={(e) => setFormData((prev) => ({ ...prev, "password": e.target.value }))} 
            />
          </Form.Item>

          {err && (
            <Paragraph type="danger">{err}</Paragraph>
          )}

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
            >
              Log In
            </Button>
          </Form.Item>

          <Paragraph className="text-center">
            Forgot your password? <a href="#" className={linkClass}>Click here</a>
          </Paragraph>
        </Form>
      </div>
    </Card>
  );
}