import React, { useState } from "react";

import "./floatInput.css";

interface FloatLabelProps {
    children: React.ReactNode;
    label: string;
    value?: any;
    [key: string]: any;
}

const FloatLabel: React.FC<FloatLabelProps> = (props) => {
    const [focus, setFocus] = useState(false);
    const { children, label, value, ...restProps } = props;

    const labelClass =
        focus || (value && value.length !== 0) ? "label label-float" : "label";

    return (
        <div
            className="float-label"
            onBlur={() => setFocus(false)}
            onFocus={() => setFocus(true)}
        >
            {React.cloneElement(children as React.ReactElement<any>, {
                value: value,
                ...restProps
            })}
            <label className={labelClass}>{label}</label>
        </div>
    );
};

export default FloatLabel;
