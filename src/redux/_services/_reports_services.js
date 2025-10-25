import { apiCall } from "../../config/Http";


async function downloadExcelFunc(data) {
  if (data) {


    try {
      const response = await apiCall("POST", `download`, data);
      return response;
    } catch (error) {
      console.error("excelList:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `download`, data);
      return response;
    } catch (error) {
      console.error("excelList:", error);
      return Promise.reject(error);
    }
  }
}



async function employeeAttendanceReportFunc(data) {
  if (data) {
    const { currentPage, pageSize, reqPayload } = data;
    try {
      const response = await apiCall(
        "POST",
        `employe/attendance/report?page=${currentPage}&limit=${pageSize}`,
        reqPayload
      );
      return response;
    } catch (error) {
      console.error("attendancelist:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `employe/attendance/report`);
      return response;
    } catch (error) {
      console.error("attendancelist:", error);
      return Promise.reject(error);
    }
  }
}

async function recruitmentOnboardingReportFunc(data) {
  if (data) {
    const { currentPage, pageSize, reqPayload } = data;
    try {
      const response = await apiCall(
        "POST",
        `employe/recruitment/application/onboardingReport?page=${currentPage}&limit=${pageSize}`,
        reqPayload
      );
      return response;
    } catch (error) {
      console.error("attendancelist:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `employe/recruitment/application/onboardingReport`);
      return response;
    } catch (error) {
      console.error("attendancelist:", error);
      return Promise.reject(error);
    }
  }
}

async function employeeSalaryReportFunc(data) {
  if (data) {
    const { currentPage, pageSize, reqPayload } = data;
    try {
      const response = await apiCall(
        "POST",
        `employe/payroll/report?page=${currentPage}&limit=${pageSize}`,
        reqPayload
      );
      return response;
    } catch (error) {
      console.error("attendancelist:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `employe/salaryReport`);
      return response;
    } catch (error) {
      console.error("attendancelist:", error);
      return Promise.reject(error);
    }
  }
}

async function employeeAppraisalReportFunc(data) {
  if (data) {
    const { currentPage, pageSize, reqPayload } = data;
    try {
      const response = await apiCall(
        "POST",
        `employe/appraisalReport?page=${currentPage}&limit=${pageSize}`,
        reqPayload
      );
      return response;
    } catch (error) {
      console.error("attendancelist:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `employe/appraisalReport`);
      return response;
    } catch (error) {
      console.error("attendancelist:", error);
      return Promise.reject(error);
    }
  }
}

async function employeeAttendanceSummaryFunc(data) {
  if (data) {
    const { currentPage, pageSize, reqPayload } = data;
    try {
      const response = await apiCall(
        "POST",
        `employe/attendanceSummary?page=${currentPage}&limit=${pageSize}`,
        reqPayload
      );
      return response;
    } catch (error) {
      console.error("attendancelist:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `employe/attendanceSummary`);
      return response;
    } catch (error) {
      console.error("attendancelist:", error);
      return Promise.reject(error);
    }
  }
}

async function leaveRequestReportFunc(data) {
  if (data) {
    const { currentPage, pageSize, reqPayload } = data;
    try {
      const response = await apiCall(
        "POST",
        `employe/leaveRequest/report?page=${currentPage}&limit=${pageSize}`,
        reqPayload
      );
      return response;
    } catch (error) {
      console.error("leaveRequestlist:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `employe/leaveRequest/report`);
      return response;
    } catch (error) {
      console.error("leaveRequestlist:", error);
      return Promise.reject(error);
    }
  }

}



async function financePaymentReportFunc(data) {
  if (data) {
    const { currentPage, pageSize, reqPayload } = data;
    try {
      const response = await apiCall(
        "POST",
        `finance/payment/paymentReport?page=${currentPage}&limit=${pageSize}`,
        reqPayload
      );
      return response;
    } catch (error) {
      console.error("leaveRequestlist:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `employe/leaveRequest/report`);
      return response;
    } catch (error) {
      console.error("leaveRequestlist:", error);
      return Promise.reject(error);
    }
  }

}



// async function financeAdvanceReportFunc(data) {
//   if (data) {
//     const { currentPage, pageSize, reqPayload } = data;
//     try {
//       const response = await apiCall(
//         "POST",
//         `finance/advance/reportList?page=${currentPage}&limit=${pageSize}`,
//         reqPayload
//       );
//       return response;
//     } catch (error) {
//       console.error("leaveRequestlist:", error);
//       return Promise.reject(error);
//     }
//   } else {
//     try {
//       const response = await apiCall("POST", `employe/leaveRequest/report`);
//       return response;
//     } catch (error) {
//       console.error("leaveRequestlist:", error);
//       return Promise.reject(error);
//     }
//   }

// }
async function financeSummaryWiseFunc(data) {
  if (data) {
    const { currentPage, pageSize, reqPayload } = data;
    try {
      const response = await apiCall(
        "POST",
        `finance/invoice/summeryReport?page=${currentPage}&limit=${pageSize}`,
        reqPayload
      );
      return response;
    } catch (error) {
      console.error("leaveRequestlist:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `finance/invoice/summeryReport`);
      return response;
    } catch (error) {
      console.error("leaveRequestlist:", error);
      return Promise.reject(error);
    }
  }

}
async function financeAdvanceReportFunc(data) {
  if (data) {
    const { currentPage, pageSize, reqPayload } = data;
    try {
      const response = await apiCall(
        "POST",
        `finance/advance/reportList?page=${currentPage}&limit=${pageSize}`,
        reqPayload
      );
      return response;
    } catch (error) {
      console.error("leaveRequestlist:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `employe/leaveRequest/report`);
      return response;
    } catch (error) {
      console.error("leaveRequestlist:", error);
      return Promise.reject(error);
    }
  }

}





async function employeReportFunc(data) {
  if (data) {
    const { currentPage, pageSize, reqPayload } = data;
    try {
      const response = await apiCall(
        "POST",
        `employe/report?page=${currentPage}&limit=${pageSize}`,
        reqPayload
      );
      return response;
    } catch (error) {
      console.error("employeList:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `employe/report`);
      return response;
    } catch (error) {
      console.error("employeList:", error);
      return Promise.reject(error);
    }
  }
}

async function employePenaltyReportFunc(data) {
  if (data) {
    const { currentPage, pageSize, reqPayload } = data;
    try {
      const response = await apiCall(
        "POST",
        `employe/penalty/report?page=${currentPage}&limit=${pageSize}`,
        reqPayload
      );
      return response;
    } catch (error) {
      console.error("employeList:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `employe/penalty/report`);
      return response;
    } catch (error) {
      console.error("employeList:", error);
      return Promise.reject(error);
    }
  }

}

async function employeePerformanceFunc(data) {
  if (data) {
    const { currentPage, pageSize, reqPayload } = data;
    try {
      const response = await apiCall(
        "POST",
        `employe/workPerformanceReport?page=${currentPage}&limit=${pageSize}`,
        reqPayload
      );
      return response;
    } catch (error) {
      console.error("employeList:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `employe/workPerformanceReport`);
      return response;
    } catch (error) {
      console.error("employeList:", error);
      return Promise.reject(error);
    }
  }

}


async function clientReportFunc(data) {
  if (data) {
    const { currentPage, pageSize, reqPayload } = data;
    try {
      const response = await apiCall(
        "POST",
        `client/report?page=${currentPage}&limit=${pageSize}`,
        reqPayload
      );
      return response;
    } catch (error) {
      console.error("employeList:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `client/report`);
      return response;
    } catch (error) {
      console.error("employeList:", error);
      return Promise.reject(error);
    }
  }

}

async function clientLedgerFunc(data) {
  if (data) {
    const { currentPage, pageSize, reqPayload } = data;
    try {
      const response = await apiCall(
        "POST",
        `client/clientLedger?page=${currentPage}&limit=${pageSize}`,
        reqPayload
      );
      return response;
    } catch (error) {
      console.error("employeList:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `client/clientLedger`);
      return response;
    } catch (error) {
      console.error("employeList:", error);
      return Promise.reject(error);
    }
  }

}



async function clientServiceReportFunc(data) {

  const { currentPage, pageSize, reqPayload } = data;
  try {
    const response = await apiCall(
      "POST",
      `client/clientService?page=${currentPage}&limit=${pageSize}`,
      reqPayload
    );
    return response;
  } catch (error) {
    console.error("employeList:", error);
    return Promise.reject(error);
  }

}



async function digitalSignReportFunc(data) {
  if (data) {
    const { currentPage, pageSize, reqPayload } = data;
    try {
      const response = await apiCall(
        "POST",
        `client/signature/report?page=${currentPage}&limit=${pageSize}`,
        reqPayload
      );
      return response;
    } catch (error) {
      console.error("employeList:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `client/signature/report`);
      return response;
    } catch (error) {
      console.error("employeList:", error);
      return Promise.reject(error);
    }
  }

}


async function taskStatusReportFunc(data) {
  if (data) {
    const { currentPage, pageSize, reqPayload } = data;
    try {
      const response = await apiCall(
        "POST",
        `task/report?page=${currentPage}&limit=${pageSize}`,
        reqPayload
      );
      return response;
    } catch (error) {
      console.error("employeList:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `task/report`);
      return response;
    } catch (error) {
      console.error("employeList:", error);
      return Promise.reject(error);
    }
  }
}
async function overAllTaskReportFunc(data) {

  const { currentPage, pageSize, reqPayload } = data;
  try {
    const response = await apiCall(
      "POST",
      `task/report?page=${currentPage}&limit=${pageSize}`,
      reqPayload
    );
    return response;
  } catch (error) {
    console.error("employeList:", error);
    return Promise.reject(error);
  }

}


async function taskRatingReportFunc(data) {

  const { currentPage, pageSize, reqPayload } = data;
  try {
    const response = await apiCall(
      "POST",
      `task/ratingReport?page=${currentPage}&limit=${pageSize}`,
      reqPayload
    );
    return response;
  } catch (error) {
    console.error("employeList:", error);
    return Promise.reject(error);
  }

}


async function lastUpdateTaskReportFunc(data) {

  const { currentPage, pageSize, reqPayload } = data;
  try {
    const response = await apiCall(
      "POST",
      `task/lastUpdate?page=${currentPage}&limit=${pageSize}`,
      reqPayload
    );
    return response;
  } catch (error) {
    console.error("employeList:", error);
    return Promise.reject(error);
  }

}


async function workingHourTaskReportFunc(data) {

  const { currentPage, pageSize, reqPayload } = data;
  try {
    const response = await apiCall(
      "POST",
      `task/workingHours?page=${currentPage}&limit=${pageSize}`,
      reqPayload
    );
    return response;
  } catch (error) {
    console.error("employeList:", error);
    return Promise.reject(error);
  }

}


async function overDueTaskReportFunc(data) {

  const { currentPage, pageSize, reqPayload } = data;
  try {
    const response = await apiCall(
      "POST",
      `task/overdueTask?page=${currentPage}&limit=${pageSize}`,
      reqPayload
    );
    return response;
  } catch (error) {
    console.error("employeList:", error);
    return Promise.reject(error);
  }

}



async function stoppedTaskReportFunc(data) {

  const { currentPage, pageSize, reqPayload } = data;
  try {
    const response = await apiCall(
      "POST",
      `task/stoppedTask?page=${currentPage}&limit=${pageSize}`,
      reqPayload
    );
    return response;
  } catch (error) {
    console.error("employeList:", error);
    return Promise.reject(error);
  }

}


async function employeSummaryReportFunc(data) {

  const { currentPage, pageSize, reqPayload } = data;
  try {
    const response = await apiCall(
      "POST",
      `employe/taskSummary?page=${currentPage}&limit=${pageSize}`,
      reqPayload
    );
    return response;
  } catch (error) {
    console.error("employeList:", error);
    return Promise.reject(error);
  }

}

async function clientLedgerReportFunc(data) {

  const { currentPage, pageSize, reqPayload } = data;
  try {
    const response = await apiCall(
      "POST",
      `client/ledger?page=${currentPage}&limit=${pageSize}`,
      reqPayload
    );
    return response;
  } catch (error) {
    console.error("employeList:", error);
    return Promise.reject(error);
  }

}



async function clientGroupLedgerFunc(data) {

  const { currentPage, pageSize, reqPayload } = data;
  try {
    const response = await apiCall(
      "POST",
      `master/client/groupType/ledger?page=${currentPage}&limit=${pageSize}`,
      reqPayload
    );
    return response;
  } catch (error) {
    console.error("employeList:", error);
    return Promise.reject(error);
  }

}


async function clientGrowthRevenueReportFunc(data) {

  const { currentPage, pageSize, reqPayload } = data;
  try {
    const response = await apiCall(
      "POST",
      `client/revenue?page=${currentPage}&limit=${pageSize}`,
      reqPayload
    );
    return response;
  } catch (error) {
    console.error("employeList:", error);
    return Promise.reject(error);
  }

}



async function clientStatementReportFunc(data) {

  // const {reqPayload } = data;
  try {
    const response = await apiCall(
      "POST",
      `client/statement`,
      data
    );
    return response;
  } catch (error) {
    console.error("employeList:", error);
    return Promise.reject(error);
  }

}


async function clientGroupStatementReportFunc(data) {

  // const {reqPayload } = data;
  try {
    const response = await apiCall(
      "POST",
      `master/client/groupType/statement`,
      data
    );
    return response;
  } catch (error) {
    console.error("employeList:", error);
    return Promise.reject(error);
  }
}


async function balanceSheetReport(data) {

  // const {reqPayload } = data;
  try {
    const response = await apiCall(
      "POST",
      `finance/payment/balanceSheetReport`,
      data
    );
    return response;
  } catch (error) {
    console.error("balanceSheetReport:", error);
    return Promise.reject(error);
  }
}







async function financialTaskReportFunc(data) {

  const { currentPage, pageSize, reqPayload } = data;
  try {
    const response = await apiCall(
      "POST",
      `task/pendingInvoice?page=${currentPage}&limit=${pageSize}`,
      reqPayload
    );
    return response;
  } catch (error) {
    console.error("employeList:", error);
    return Promise.reject(error);
  }

}


async function clientIndexReportFunc(data) {

  const { currentPage, pageSize, reqPayload } = data;
  try {
    const response = await apiCall(
      "POST",
      `client/clientIndex?page=${currentPage}&limit=${pageSize}`,
      reqPayload
    );
    return response;
  } catch (error) {
    console.error("employeList:", error);
    return Promise.reject(error);
  }

}

async function clientDigitalSignatureReportFunc(data) {

  const { currentPage, pageSize, reqPayload } = data;
  try {
    const response = await apiCall(
      "POST",
      `client/signature/report?page=${currentPage}&limit=${pageSize}`,
      reqPayload
    );
    return response;
  } catch (error) {
    console.error("employeList:", error);
    return Promise.reject(error);
  }

}








async function invoiceGstReturnSalesReportFunc(data) {

  const { currentPage, pageSize, reqPayload } = data;
  try {
    const response = await apiCall(
      "POST",
      `finance/invoice/gstReturn?page=${currentPage}&limit=${pageSize}`,
      reqPayload
    );
    return response;
  } catch (error) {
    console.error("employeList:", error);
    return Promise.reject(error);
  }

}


async function invoiceGstReturnPurchaseReportFunc(data) {

  const { currentPage, pageSize, reqPayload } = data;
  try {
    const response = await apiCall(
      "POST",
      `finance/purchase/gstReturn?page=${currentPage}&limit=${pageSize}`,
      reqPayload
    );
    return response;
  } catch (error) {
    console.error("employeList:", error);
    return Promise.reject(error);
  }

}



async function cashbookDetailsReportFunc(data) {

  const { currentPage, pageSize, reqPayload } = data;
  try {
    const response = await apiCall(
      "POST",
      `employe/cashbookReport?page=${currentPage}&limit=${pageSize}`,
      reqPayload
    );
    return response;
  } catch (error) {
    console.error("employeList:", error);
    return Promise.reject(error);
  }

}



async function clientInvoiceReportFunc(data) {

  const { currentPage, pageSize, reqPayload } = data;
  try {
    const response = await apiCall(
      "POST",
      `client/invoiceReport?page=${currentPage}&limit=${pageSize}`,
      reqPayload
    );
    return response;
  } catch (error) {
    console.error("employeList:", error);
    return Promise.reject(error);
  }

}



async function vendorInvoiceReport(data) {

  const { currentPage, pageSize, reqPayload } = data;
  try {
    const response = await apiCall(
      "POST",
      `finance/purchase/vendorInvoiceReport?page=${currentPage}&limit=${pageSize}`,
      reqPayload
    );
    return response;
  } catch (error) {
    console.error("employeList:", error);
    return Promise.reject(error);
  }

}



async function vendorAdvanceReportFunc(data) {
  

  const { currentPage, pageSize, reqPayload } = data;
  try {
    const response = await apiCall(
      "POST",
      `vendor/advanceReport?page=${currentPage}&limit=${pageSize}`,
      reqPayload
    );
    return response;
  } catch (error) {
    console.error("employeList:", error);
    return Promise.reject(error);
  }

}






async function clientOwnerDetailsReportFunc(data) {

  const { currentPage, pageSize, reqPayload } = data;
  try {
    const response = await apiCall(
      "POST",
      `client/clientBranchOwner?page=${currentPage}&limit=${pageSize}`,
      data
    );
    return response;
  } catch (error) {
    console.error("employeList:", error);
    return Promise.reject(error);
  }

}






async function recieptReportFunc(data) {

 const { currentPage, pageSize, reqPayload } = data;
  try {
    const response = await apiCall(
      "POST",
      `finance/receipt/report?page=${currentPage}&limit=${pageSize}`,
      reqPayload
    );
    return response;
  } catch (error) {
    console.error("employeList:", error);
    return Promise.reject(error);
  }

}


async function bankStatementReportFunc(data) {

 const { currentPage, pageSize, reqPayload } = data;
  try {
    const response = await apiCall(
      "POST",
      `finance/payment/bankStatementReport?page=${currentPage}&limit=${pageSize}`,
      reqPayload
    );
    return response;
  } catch (error) {
    console.error("employeList:", error);
    return Promise.reject(error);
  }

}



async function financeBankListReportFunc(data) {

 const { currentPage, pageSize, reqPayload } = data;
  try {
    const response = await apiCall(
      "POST",
      `finance/payment/banlList?page=${currentPage}&limit=${pageSize}`,
      reqPayload
    );
    return response;
  } catch (error) {
    console.error("employeList:", error);
    return Promise.reject(error);
  }

}






async function AllClientReportFunc(data) {

  const { currentPage, pageSize, reqPayload } = data;
  try {
    const response = await apiCall(
      "POST",
      `client/report?page=${currentPage}&limit=${pageSize}`,
      reqPayload
    );
    return response;
  } catch (error) {
    console.error("employeList:", error);
    return Promise.reject(error);
  }

}



async function clientBillingPaymentTrackingReportFunc(data) {

  const { currentPage, pageSize, reqPayload } = data;
  try {
    const response = await apiCall(
      "POST",
      `client/billingPayment?page=${currentPage}&limit=${pageSize}`,
      reqPayload
    );
    return response;
  } catch (error) {
    console.error("employeList:", error);
    return Promise.reject(error);
  }

}




async function financeAdvanceSummaryReportFunc(data) {

  const { currentPage, pageSize, reqPayload } = data;
  try {
    const response = await apiCall(
      "POST",
      `finance/advance/reportSummery?page=${currentPage}&limit=${pageSize}`,
      reqPayload
    );
    return response;
  } catch (error) {
    console.error("employeList:", error);
    return Promise.reject(error);
  }

}















async function pendingInvoiceReportFunc(data) {
  if (data) {
    const { currentPage, pageSize, reqPayload } = data;
    try {
      const response = await apiCall(
        "POST",
        `task/pendingInvoice?page=${currentPage}&limit=${pageSize}`,
        reqPayload
      );
      return response;
    } catch (error) {
      console.error("employeList:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `task/pendingInvoice`);
      return response;
    } catch (error) {
      console.error("employeList:", error);
      return Promise.reject(error);
    }
  }

}



async function runningTaskReportFunc(data) {
  if (data) {
    const { currentPage, pageSize, reqPayload } = data;
    try {
      const response = await apiCall(
        "POST",
        `task/runningTask?page=${currentPage}&limit=${pageSize}`,
        reqPayload
      );
      return response;
    } catch (error) {
      console.error("employeList:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `task/runningTask`);
      return response;
    } catch (error) {
      console.error("employeList:", error);
      return Promise.reject(error);
    }
  }

}
async function employeeleaveCountReport(data) {
  if (data) {
    const { currentPage, pageSize, reqPayload } = data;
    try {
      const response = await apiCall(
        "POST",
        `employe/leaveRequest/employeLeaveReport?page=${currentPage}&limit=${pageSize}`,
        reqPayload
      );
      return response;
    } catch (error) {
      console.error("employeList:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `employe/leaveRequest/employeLeaveReport`);
      return response;
    } catch (error) {
      console.error("employeList:", error);
      return Promise.reject(error);
    }
  }

}

async function employeEPBXReport(data) {
  if (data) {
    const { currentPage, pageSize, reqPayload } = data;
    try {
      const response = await apiCall(
        "POST",
        `employe/seatOrEpbxReport?page=${currentPage}&limit=${pageSize}`,
        reqPayload
      );
      return response;
    } catch (error) {
      console.error("employeList:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `employe/seatOrEpbxReport`);
      return response;
    } catch (error) {
      console.error("employeList:", error);
      return Promise.reject(error);
    }
  }

}


export const reportsServices = {
  clientBillingPaymentTrackingReportFunc,
  employeeAttendanceReportFunc,
  recruitmentOnboardingReportFunc,
  employeeSalaryReportFunc,
  employeeAppraisalReportFunc,
  employeeAttendanceSummaryFunc,

  leaveRequestReportFunc,
  employeReportFunc,
  employePenaltyReportFunc,
  employeePerformanceFunc,
  clientReportFunc,
  clientLedgerFunc,
  digitalSignReportFunc,
  taskStatusReportFunc,
  pendingInvoiceReportFunc,
  runningTaskReportFunc,
  downloadExcelFunc,
  overAllTaskReportFunc,
  lastUpdateTaskReportFunc,
  taskRatingReportFunc,
  workingHourTaskReportFunc,
  overDueTaskReportFunc,
  stoppedTaskReportFunc,
  financialTaskReportFunc,
  clientServiceReportFunc,
  clientIndexReportFunc,
  clientDigitalSignatureReportFunc,
  clientOwnerDetailsReportFunc,
  AllClientReportFunc,
  employeSummaryReportFunc,
  clientLedgerReportFunc,
  clientStatementReportFunc,
  clientGroupLedgerFunc,
  clientGroupStatementReportFunc,
  clientGrowthRevenueReportFunc,
  invoiceGstReturnSalesReportFunc,
  invoiceGstReturnPurchaseReportFunc,
  recieptReportFunc,
  cashbookDetailsReportFunc,
  clientInvoiceReportFunc,
  vendorAdvanceReportFunc,
financePaymentReportFunc,
financeAdvanceReportFunc,
financeAdvanceSummaryReportFunc,
vendorInvoiceReport,
bankStatementReportFunc,
financeBankListReportFunc,
balanceSheetReport,
financeSummaryWiseFunc,
employeeleaveCountReport,
employeEPBXReport

};