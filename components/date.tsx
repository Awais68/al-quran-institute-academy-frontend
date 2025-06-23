"use client"; // if using app router

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DOBPicker() {
  const [dob, setDob] = useState(null);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Date of Birth</label>
      <DatePicker
        selected={dob}
        onChange={(date: any) => setDob(date)}
        dateFormat="dd/MM/yyyy"
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={100}
        maxDate={new Date()}
        placeholderText="Select your birth date"
        className="p-2 border border-gray-300 rounded-md"
      />
    </div>
  );
}
