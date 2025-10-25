

const MetricCard = ({ name , size , greentext , text,borderColor }) => {

  return (
    <div className={`flex items-center justify-between bg-white  border-t-4 ${borderColor} p-6 rounded-lg`}>
   
      <div className="">
        <p className="text-[16px]">{name}</p>
        <p className="text-3xl font-bold">{size}</p>
        
      </div>
      <div>

     <div className="w-16 h-16">



               </div>
           </div>
    </div>
  );
};

export default MetricCard;
