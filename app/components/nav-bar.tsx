'use client'

import React, { useEffect, useState } from "react";
import { Tabs, Row, Button } from "antd";
import type { TabsProps } from "antd";
import { useAuthContext } from "../context/auth.context";
import { useRouter, usePathname } from "next/navigation";

export const NavBar: React.FC = () => {
  const { logout, isAuthenticated } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname(); // Get the current path
  const [activeKey, setActiveKey] = useState<string>("1");

  // Map URLs to tab keys
  const urlToKeyMap: { [key: string]: string } = {
    "/country-data": "1",
    "/metrics": "2",
    "/categories": "3",
  };

  // Set the active tab key based on the current URL
  useEffect(() => {
    const key = urlToKeyMap[pathname] || "1"; // Default to "1" if no match
    setActiveKey(key);
  }, [pathname]);

  const handleTabChange = (key: string) => {
    // Navigate to the appropriate route based on the tab key
    const keyToUrlMap: { [key: string]: string } = {
      "1": "/country-data",
      "2": "/metrics",
      "3": "/categories",
    };

    const url = keyToUrlMap[key];
    if (url) {
      router.push(url);
    }
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Country Data",
    },
    {
      key: "2",
      label: "Metrics",
    },
    {
      key: "3",
      label: "Categories",
    },
  ];

  return (
    <Row className="w-full h-[100px] bg-zinc-400 justify-between items-center pl-[20px] pr-[20px] mb-8">
      <div className="text-[25px]">Admin Portal</div>
      {isAuthenticated?<Tabs
        activeKey={activeKey}
        items={items}
        size="large"
        onChange={handleTabChange}
        centered
        animated={{ inkBar: true, tabPane: false }}
      />:null}
      {isAuthenticated?<Button className="text-[15px] px-5 py-4 ml-20" onClick={logout}>
        Logout
      </Button>:null}
      
    </Row>
  );
};

