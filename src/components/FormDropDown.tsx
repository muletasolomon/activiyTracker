
import React, { useEffect, useRef, useState } from "react";
import { Dropdown } from "primereact/dropdown";

import { Calendar } from "primereact/calendar";
// import * as dayjs from "dayjs";


export const FormDropDown = ({
                                 onUpdate,
                                 options,
                                 label,
                                 defaultValue,
                                 customClass
                             }) => {
    const [value, setState] = useState(defaultValue);
    const handleChange = (e) => {
        setState(e);
        onUpdate(e);
    };

    return (
        <div className="field">
            {/* <label for="districtStatus" className="text-sm">
        {label}
      </label> */}


                <Dropdown
                    id="districtStatus"
                    // size={"small"}
                    className="mx-2 my-2 ${customClass}"
                    value={value}
                    options={options}
                    placeholder={label}
                    onChange={(e) => handleChange(e.value)}
                />
        </div>
    );
};