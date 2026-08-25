import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // Import styles for flags and dropdown

const PhoneNumberInput: React.FC = () => {
  const [phone, setPhone] = useState<string>("");

  return (
    <div className="flex flex-col w-full">
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
        containerClass="flex w-full"
        inputClass="!w-full !h-10 sm:!h-11 !text-sm sm:!text-base !border-blue-200 !rounded-md"
        buttonClass="!border-blue-200 !rounded-l-md"
        dropdownClass="!w-[280px] sm:!w-[320px]"
      />
    </div>
  );
};

export default PhoneNumberInput;
