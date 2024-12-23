import React, { useState, useEffect } from "react";
import { Select } from "antd";
import { getCountriesApi } from "@/app/api/countries.api"; 
import { Country } from "@/app/interfaces/country.interfaces"; 

interface Options {
  value: number;
  label: string;
}

interface CountrySelectProps{
    setSelectedCountry: React.Dispatch<React.SetStateAction<number | null>>;
    selectedCountry: number | null;
}

const CountrySelect: React.FC<CountrySelectProps> = ({setSelectedCountry, selectedCountry}) => {
  const [countries, setCountries] = useState<Options[]>([]); 

  useEffect(() => {
    const token: string | null = localStorage.getItem("token");
    const fetchCountries = async () => {
      if (token) {
        try {
          const countriesResponse: Country[] = await getCountriesApi(token);
          const options = countriesResponse.map((country) => ({
            value: country.id, 
            label: country.country_name, 
          }));
          setCountries(options); 
        } catch (error) {
          console.error("Error fetching countries:", error);
        }
      }
    };

    fetchCountries();
  }, []);

  const handleCountrySelect = (value: number) => {
    setSelectedCountry(value); 
  };

  return (
    <div>
      <Select
        showSearch
        placeholder="Select a Country"
        filterOption={(input, option) =>
          (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
        }
        style={{ width: 350}} 
        value={selectedCountry} 
        onChange={handleCountrySelect} 
        options={countries} 
      />
    </div>
  );
};

export default CountrySelect;
