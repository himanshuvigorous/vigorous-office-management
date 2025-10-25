import React from "react";

const HRMSDynamicTable = ({ data, columns, rowClassName, headerClassName,evenRowClassname ="bg-[#e9ecef]/80", oddRowClassname="bg-white" }) => {
  return (
    <div className="container mx-auto p-2">
      <div className="max-w-full overflow-auto">
        <table className="w-full max-w-full rounded-xl overflow-hidden">
          <thead>
            <tr
              className={
                headerClassName ||
                "border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]"
              }
            >
              {columns.map((column, idx) => (
                <th key={idx} className="border-none p-2 whitespace-nowrap">
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr
                  className={`${
                    rowClassName || "border-b-[1px] border-[#DDDDDD] text-[#374151] text-[14px]"
                  } ${rowIndex % 2 === 0 ? evenRowClassname : oddRowClassname}`}
                  key={rowIndex}
                >
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="whitespace-nowrap border-none p-2">
                      {column.render
                        ? column.render(row, rowIndex)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr className="bg-white bg-opacity-5">
                <td
                  colSpan={columns.length}
                  className="px-6 py-2 text-sm font-semibold text-gray-500 text-center"
                >
                  Record Not Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HRMSDynamicTable;
