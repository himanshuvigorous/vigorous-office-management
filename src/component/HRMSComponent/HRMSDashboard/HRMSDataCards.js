import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";


function HRMSDataCards({
  IconComponent, 
  title,
  totalCount,
  percentageChange,
  isPercentagePositive,
}) {

  const ArrowIcon = isPercentagePositive ? AiOutlineArrowUp : AiOutlineArrowDown;

  return (
    <div className="bg-white p-6 my-1 mx-1 rounded-xl shadow-lg relative">
      <div className="flex items-center gap-4">
        <div className="border-2 bg-header/20 rounded-full w-14 h-14 flex justify-center items-center">
          {IconComponent}

        </div>
        <div>
          <h6 className="text-md mb-2.5 text-gray-500 capitalize font-semibold">
            {title}
          </h6>
          <div className="flex flex-wrap items-end gap-2.5">
            <h3 className="text-3xl font-semibold text-gray-800">{totalCount}</h3>
            <span className="text-sm text-gray-500">
              <span
                className={`${
                  isPercentagePositive ? "text-green-500" : "text-red-500"
                } flex flex-col`}
              >
                <span className="font-semibold flex gap-2">
                  <ArrowIcon /> {percentageChange}%
                </span>
              </span>{" "}
              Than Last Year
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HRMSDataCards;
