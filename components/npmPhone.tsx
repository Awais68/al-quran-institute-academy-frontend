import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // Import styles for flags and dropdown

const PhoneNumberInput: React.FC = () => {
  const [phone, setPhone] = useState<string>("");

  return (
    <div className="flex flex-col mx-auto h-8 w-auto border-blue-500">
      <label htmlFor="phone" className="text-blue-900 font-medium">
        Phone Number
      </label>
      <PhoneInput
        country={"pk"} // Default country (Pakistan)
        value={phone}
        onChange={(value) => setPhone(value)}
        inputProps={{
          id: "phone",
          name: "phone",
          required: true,
          placeholder: "+92 335 220 4606",
        }}
        containerClass="flex w-full mx-auto"
        inputClass=" bg-blue-500" // Adjusted padding for flag
        // w-full mx-auto h-8 rounded  border-blue-100/50 md:max-w-[70%] rounded p-5 w-24
        buttonClass=""
        // border border-blue-200 rounded w-12
        dropdownClass=""
        // border border-blue-200 rounded w-full
      />
    </div>
  );
};

export default PhoneNumberInput;
