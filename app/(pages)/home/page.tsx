"use client";

import { useAuthContext } from "../../context/auth.context";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CountryDataTable from "@/app/components/country-data/country-data-table";
import CountrySelect from "@/app/components/country-data/country-select.component";
import { Row, Button } from "antd";

export default function Home() {
  const { isAuthenticated, logout } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null); // State to hold selected country
  const router = useRouter();
  const [countryData, setCountryData] = useState()

  useEffect(() => {
    setIsLoading(true);
    if (!isAuthenticated) {
      redirect("/login");
    }
    setIsLoading(false);
  }, [isAuthenticated, router]);

  // useEffect(()=>{
  //   if(selectedCountry){
  //     const countryDataResponse = 
  //   }

  // }, [selectedCountry])

  if (!isLoading) {
    return (
      <div className="space-y-6 w-full flex flex-col items-center">
        <Row className="w-full h-[100px] bg-zinc-600 justify-between items-center pl-[20px] pr-[20px]">
          <div className="text-[30px] font-['Inter']">Admin Portal</div>
          <Button
            className="text-[15px] font-['Inter'] text-white bg-black hover:!bg-zinc-600 hover:!text-white"
            onClick={logout}
          >
            Logout
          </Button>
        </Row>
        <CountrySelect setSelectedCountry={setSelectedCountry} selectedCountry={selectedCountry}/>
        <CountryDataTable />
      </div>
    );
  }
  return <></>;
}
