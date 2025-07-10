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
    <div>
      <h1>Well Come To Student Dashboard</h1>
      <StudentDashboard />
    </div>
  );
}
