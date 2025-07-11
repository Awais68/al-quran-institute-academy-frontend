"use client";

import { StudentDashboard } from "@/components/student-dashboard";
import { DefaultTooltipContent } from "recharts";
import { useState, useCallback } from "react";

export default function Student() {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const handleCountryChange = useCallback((country: string) => {
    setSelectedCountry(country);
    setSelectedCity(""); // Reset city when country changes
  }, []);

  const handleCityChange = useCallback((city: string) => {
    setSelectedCity(city);
  }, []);

  return (
    <div className="bg-blue-50 mx-auto justify-center">
      <h1 className="bg-blue-300 border-gray-400 mx-2 p-6 text-white font-bold text-center text-4xl shadow-inner shadow-black ">
        Well Come To Student Portal
      </h1>
      <StudentDashboard />
    </div>
  );
}
