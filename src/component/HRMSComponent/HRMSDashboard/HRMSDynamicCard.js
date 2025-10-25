import { ImArrowUpRight2 } from "react-icons/im";

function HRMSDynamicCard({
  totalData,
  totalDataIndex,
  todayData,
  todayDataIndex,
}) {
  return (
    <div class="w-full h-full relative bg-[#f3f4f6] rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-0 overflow-hidden">
      <div class="w-full 3xl:p-[19px] p-[13px] border-0 cardOuter !bg-header">
        <div class="3xl:text-[30px] lg:text-[28px] text-[21px] font-[500] text-white leading-none">
          {totalData}
        </div>
        <div class="text-[#D8D8D8] 3xl:text-[16px] xl:text-[13px]">
          {totalDataIndex}
        </div>
        <div class="3xl:text-[30px] lg:text-[28px] text-[21px] font-[500] text-white leading-none mt-[13px]">
          {todayData}
        </div>
        <div class="text-[#D8D8D8] 3xl:text-[16px] xl:text-[13px]">
          {todayDataIndex}
        </div>
      </div>
      <div className="absolute bottom-0 right-0 lg:w-[3.7rem] w-[3rem] lg:h-[3.7rem] h-[3rem] bg-[#f3f4f6] flex items-center justify-center rounded-tl-xl before:absolute before:block lg:before:size-4 before:size-[0.6rem] before:[background-image:radial-gradient(ellipse_farthest-corner_at_left_top,transparent_67%,#f3f4f6_70%)] lg:before:top-[-0.9rem] before:top-[-0.6rem] before:right-0 after:absolute after:block lg:after:size-4 after:size-[0.6rem] after:[background-image:radial-gradient(ellipse_farthest-corner_at_left_top,transparent_67%,#f3f4f6_70%)] after:bottom-0 lg:after:left-[-0.9rem] after:left-[-0.6rem] border-b-0">
        <div class="flex items-center justify-center lg:w-12 lg:h-12 w-[36px] h-[36px] bg-[#ADEE68] rounded-full">
          <ImArrowUpRight2 className="lg:text-[20px] text:[18px]" />
        </div>
      </div>
    </div>
  );
}

export default HRMSDynamicCard;
