import React, { useEffect, useState } from "react";

export function ControlledInput({ onUpdate, type,defaultValue,placeholder, disable = false }) {
  const [value, setState] = useState(defaultValue);
  const handleChange = (e) => {
    setState(e.target.value);
    onUpdate(e.target.value);
  };

  useEffect(()=>{
    setState(defaultValue)
  },[defaultValue])

  const inputType = !type ? "text" : type;

  return (
    <input
      id="search"
      type={inputType}
      value={value}
      disabled={disable}
      onChange={handleChange}
      placeholder={placeholder}
      className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none ml-4 focus:border-primary"
    />
  );
}
