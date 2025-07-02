"use client";

import { useEffect } from "react";
import { Country, City } from "country-state-city";
import PhoneInput from "react-phone-number-input";
import ReactCountryFlag from "react-country-flag";

interface Props {
  country: string;
  setCountry: (val: string) => void;
  city: string;
  setCity: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
}

export default function CountryCitySelector({
  country,
  setCountry,
  city,
  setCity,
  phone,
  setPhone,
}: Props) {
  // Get all countries
  const countries = Country.getAllCountries();
  // Get cities for selected country
  const cities = country ? City.getCitiesOfCountry(country) : [];

  // Handle country selection
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCountry(e.target.value);
    setCity(""); // Reset city when country changes
  };

  // Handle city selection
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCity(e.target.value);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      {/* Country Dropdown */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Select Country
        </label>
        <select
          onChange={handleCountryChange}
          className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={country}
        >
          <option value="">Select a country</option>
          {countries.map((c) => (
            <option key={c.isoCode} value={c.isoCode}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {country && (
        <ReactCountryFlag
          countryCode={country}
          svg
          style={{ width: 16, height: 10 }}
        />
      )}

      {/* City Dropdown */}
      {country && (
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Select City
          </label>
          <select
            onChange={handleCityChange}
            className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={city}
          >
            <option value="">Select a city</option>
            {cities?.map((ct) => (
              <option key={ct.name} value={ct.name}>
                {ct.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Phone Input */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-green-200">
          Phone Number
        </label>
        <PhoneInput
          value={phone}
          onChange={(value) => setPhone(value || "")}
          defaultCountry={country as any}
          placeholder="Enter phone number"
          className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
