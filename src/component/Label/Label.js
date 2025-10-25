import React from "react";

export default function Label(props) {

  let { title, isImp } = props;

  return (
    <label className="md:text-[14px] text-[12px] text-[#676a6c] font-[500] capitalize">
      {title}&nbsp;
      {isImp ?
        <span className="text-red-500">*</span> : null}
    </label>
  );
}
