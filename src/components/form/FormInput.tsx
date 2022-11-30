import React from "react";
import { ControlledInput } from "./ControlledInput";

export const FormInput = ({ onUpdate, defaultValue, labelName, type = 'text', disable = false }) => {
  return (
    <div className="flex flex-column">
      <label className="py-2 text-base font-bold">{labelName}</label>

      <ControlledInput placeholder={''} onUpdate={onUpdate} defaultValue={defaultValue} disable={disable} type={type}/>
    </div>
  );
};


