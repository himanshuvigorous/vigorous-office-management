import React from 'react';

// const headerStyle = {
//   backgroundColor: '#fffbe6',
//   color: '#614700',
//   fontWeight: 'bold',
//   border: '1px solid #d9d9d9',
//   padding: '8px',
// };

// const cellStyle = {
//   backgroundColor: '#fffae6',
//   color: '#7c5700',
//   border: '1px solid #d9d9d9',
//   padding: '8px',
// };

const BillingCycleTable = () => {
  const columns = [
    'Variant Type',
    'Interval Unit',
    'Billing Cycle',
    'Total Duration',
    'Charge Frequency',
    'Example Plan',
  ];

  const data = [
    {
      // variantType: 'Weekly',
      intervalUnit: 'weekly',
      billingCycle: '4 cycles',
      totalDuration: '28 days (7×4)',
      chargeFrequency: 'Every 7 days',
      example: '₹500/week for 4 weeks',
    },
    {
      // variantType: 'Monthly',
      intervalUnit: 'monthly',
      billingCycle: '6 cycles',
      totalDuration: '6 months',
      chargeFrequency: 'Every month',
      example: '₹700/month for 6 months',
    },
    {
      // variantType: 'Yearly',
      intervalUnit: 'yearly',
      billingCycle: '1 cycle',
      totalDuration: '1 year',
      chargeFrequency: 'Once per year',
      example: '₹5000/year for 1 year',
    },
    
  ];

  return (
    <div className="bg-[#ffffff] text-[13px] text-[#676a6c] w-full overflow-x-auto mt-1">
      <table className="w-full max-w-full rounded-xl overflow-hidden ">
        <thead >
          <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500]  h-[40px]" >
            {columns.map((col) => (
              <th className="border-none p-2 whitespace-nowrap w-[10%]" key={col} >{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr  key={idx}>
              <td className="whitespace-nowrap border-none p-2 " >{idx +1}</td>
              <td className="whitespace-nowrap border-none p-2 " >{row.intervalUnit}</td>
              <td className="whitespace-nowrap border-none p-2 " >{row.billingCycle}</td>
              <td className="whitespace-nowrap border-none p-2 " >{row.totalDuration}</td>
              <td className="whitespace-nowrap border-none p-2 " >{row.chargeFrequency}</td>
              <td className="whitespace-nowrap border-none p-2 " >{row.example}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BillingCycleTable;
