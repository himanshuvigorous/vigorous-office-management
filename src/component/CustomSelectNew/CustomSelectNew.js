import React, { useState } from "react";
import { useController } from "react-hook-form";

import { inputClassName, inputDisabledClassName, inputLabelClassName } from "../../constents/global";

// Custom Select Component
const CustomSelectNew = ({
  name,
  control,
  options = ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"],
  disabled = false,
  label,
  defaultValue = "",
  rules,
}) => {
  const { field, fieldState } = useController({
    name,
    control,
    defaultValue,
    rules,
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(field.value || defaultValue);

  const handleInputClick = () => {
    if (!disabled) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const handleOptionClick = (option) => {
    setSelectedValue(option);
    field.onChange(option); // Update React Hook Form value
    setIsDropdownOpen(false);
  };

  const handleBlur = () => {
    field.onBlur(); // Trigger blur for validation
    setIsDropdownOpen(false);
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {label && <label className={inputLabelClassName}>{label}</label>}
      
      <input
        type="text"
        {...field}
        value={selectedValue} // Display the selected value in the input
        placeholder="Select an option"
        onClick={handleInputClick}
        onChange={(e) => setSelectedValue(e.target.value)} // Update the input text
        onBlur={handleBlur}
        disabled={disabled}
        className={disabled ? inputDisabledClassName : inputClassName}
      />

      {isDropdownOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            maxHeight: "150px",
            overflowY: "auto",
            border: "1px solid #ccc",
            backgroundColor: "#fff",
            zIndex: 1000,
          }}
        >
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleOptionClick(option)}
              style={{
                padding: "8px",
                cursor: "pointer",
                borderBottom: "1px solid #f0f0f0",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#f5f5f5")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#fff")}
            >
              {option}
            </div>
          ))}
        </div>
      )}

      {fieldState?.error && (
        <div style={{ color: "red", fontSize: "12px" }}>
          {fieldState?.error.message || "This field is required."}
        </div>
      )}
    </div>
  );
};

export default CustomSelectNew;
