import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // Import styles for flags and dropdown

interface PhoneNumberInputProps {
  /** Digits-only phone number, e.g. "923352204606". Omit to keep the field uncontrolled. */
  value?: string;
  /** Receives the digits-only value (no "+", no spaces) so it can be posted as-is. */
  onChange?: (value: string) => void;
  name?: string;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  value,
  onChange,
  name = "phone",
}) => {
  // Fallback state for the uncontrolled usage.
  const [internalPhone, setInternalPhone] = useState<string>("");
  const phone = value !== undefined ? value : internalPhone;

  const handleChange = (nextValue: string) => {
    // react-phone-input-2 hands back digits only, but strip defensively:
    // the backend validates /^\d{10,15}$/ and rejects the formatted display value.
    const digits = nextValue.replace(/\D/g, "");
    if (value === undefined) setInternalPhone(digits);
    onChange?.(digits);
  };

  return (
    <div className="flex flex-col w-full">
      <PhoneInput
        country={"pk"} // Default country (Pakistan)
        value={phone}
        onChange={handleChange}
        inputProps={{
          id: name,
          name,
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
