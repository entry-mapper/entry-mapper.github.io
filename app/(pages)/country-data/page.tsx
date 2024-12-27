"use client";

import { useAuthContext } from "../../context/auth.context";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CountryDataTable from "@/app/components/country-data/country-data-table";
import CountrySelect from "@/app/components/country-data/country-select.component";
import { Row, Button } from "antd";
import { CountryData } from "@/app/interfaces/country.interfaces";
import { getCountryDataApi } from "@/app/api/country-data.api";
import {Typography} from "antd";
import { GetCategoriesService } from "@/app/service/categories-get.service";

export default function Home() {
  const { isAuthenticated, logout } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null); // State to hold selected country
  const router = useRouter();
  const [countryData, setCountryData] = useState<CountryData[]>();

  useEffect(() => {
    setIsLoading(true);
    if (!isAuthenticated) {
      redirect("/login");
    }
    setIsLoading(false);
  }, [isAuthenticated, router]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (selectedCountry && token) {
      const fetchCountryData = async () => {
        const countryDataResponse: CountryData[] = await getCountryDataApi(
          token,
          selectedCountry
        );
        setCountryData(countryDataResponse);
      };
      fetchCountryData();
    }
  }, [selectedCountry]);

  if (!isLoading) {
    return (
      <div className="space-y-3 w-full flex flex-col items-center">                 
        <Typography.Text className="text-[20px] underline underline-offset-2">
            Country Data
          </Typography.Text>
        <CountrySelect
          setSelectedCountry={setSelectedCountry}
          selectedCountry={selectedCountry}
        />

        <CountryDataTable countryData={countryData} selectedCountry={selectedCountry}/>
      </div>
    );
  }
  return <></>;
}
