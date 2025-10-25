import React from 'react'

const ViewInvoiceHeader = ({invoiceHeaderData}) => {
  console.log(invoiceHeaderData)
  return (
    <div className='w-full h-[150px]'> 
      
     
      {
      invoiceHeaderData.headerImage ?
      <img className='w-full h-full'  src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${invoiceHeaderData.headerImage}`} alt="" />
      : invoiceHeaderData?.address?.street
      }
        
    </div>
  )
}

export default ViewInvoiceHeader