"use client";

import { useState, useEffect, useCallback } from "react";
import { Country, City } from "country-state-city";
import { formatInTimeZone } from "date-fns-tz";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CountryData {
  name: string;
  cities: string[];
  code?: string; // Optional, as JSON doesn't have codes
  timezone?: string; // Optional, will be added dynamically
}

interface CountryCitySelectorProps {
  onCountryChange?: (country: string) => void;
  onCityChange?: (city: string) => void;
  initialCountry?: string;
  initialCity?: string;
}

export type { CountryData };

export default function CountryCitySelector({
  onCountryChange,
  onCityChange,
  initialCountry = "",
  initialCity = "",
}: CountryCitySelectorProps) {
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [selectedCountry, setSelectedCountry] =
    useState<string>(initialCountry);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>(initialCity);
  const [currentTime, setCurrentTime] = useState<string>("");
  // Hydration mismatch fix: Only render current time on client
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load JSON data and enhance with country codes and timezones
  useEffect(() => {
    fetch("/countries+cities.json")
      .then((res) => res.json())
      .then((jsonData) => {
        const enhancedCountries = jsonData.map((country: CountryData) => {
          const countryCode = Country.getAllCountries().find(
            (c) => c.name === country.name
          )?.isoCode;
          const timezone = countryCode
            ? Country.getCountryByCode(countryCode)?.timezones?.[0]?.zoneName ||
              "UTC"
            : "UTC";
          return { ...country, code: countryCode, timezone };
        });
        setCountries(enhancedCountries);
      })
      .catch((error) => {
        console.error("Error loading JSON:", error);
        // Fallback to country-state-city if JSON fails
        const fallbackCountries = Country.getAllCountries().map((c) => {
          const citiesArr = City.getCitiesOfCountry(c.isoCode);
          return {
            name: c.name,
            cities: Array.isArray(citiesArr)
              ? citiesArr.map((city) => city.name)
              : [],
            code: c.isoCode,
            timezone: c.timezones?.[0]?.zoneName || "UTC",
          };
        });
        setCountries(fallbackCountries);
      });
  }, []);

  // Update cities when country changes
  useEffect(() => {
    const country = countries.find((c) => c.name === selectedCountry);
    if (country) {
      // Defensive: limit cities to 200, fallback to [] if not array
      const safeCities = (country?.cities ?? []).slice(0, 200);
      setCities(safeCities);
      updateTime(country.timezone || "UTC");
      if (onCountryChange) onCountryChange(selectedCountry);
    } else {
      setCities([]);
    }
  }, [selectedCountry, countries]);

  // Update city selection
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value);
    if (onCityChange) onCityChange(e.target.value);
  };

  // Update current time
  const updateTime = (timezone: string) => {
    const time = formatInTimeZone(new Date(), timezone, "hh:mm:ss a zzzz");
    setCurrentTime(time);
  };

  // Update time every second
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (selectedCountry) {
      const country = countries.find((c) => c.name === selectedCountry);
      if (country && country.timezone) {
        updateTime(country.timezone ?? "UTC");
        interval = setInterval(
          () => updateTime(country.timezone ?? "UTC"),
          1000
        );
      }
    }
    return () => clearInterval(interval);
  }, [selectedCountry, countries]);

  // Handle country selection
  const handleCountryChange = useCallback((country: string) => {
    setSelectedCountry(country);
  }, []);

  return (
    <div className="p-0 w-full">
      {/* Country Dropdown */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Select Country
        </label>
        <select
          onChange={(e) => handleCountryChange(e.target.value)}
          className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedCountry}
        >
          <option value="">Select a country</option>
          {countries.map((country) => (
            <option key={country.name} value={country.name}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {/* City Dropdown */}
      {selectedCountry && (
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Select City
          </label>
          <select
            className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCity}
            onChange={handleCityChange}
          >
            <option value="">Select a city</option>
            {cities.length === 0 ? (
              <option value="">No cities found</option>
            ) : (
              cities.map((city, idx) => (
                <option key={city + "-" + idx} value={city}>
                  {city}
                </option>
              ))
            )}
          </select>
        </div>
      )}

      {/* Current Time */}
      {mounted && currentTime && (
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Current Time
          </label>
          <p className="text-gray-900">{currentTime}</p>
        </div>
      )}
    </div>
  );
}
