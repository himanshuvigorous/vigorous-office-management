import { combineReducers } from '@reduxjs/toolkit';
import authenticationReducer from './_reducers/_auth_reducers';
import userReducer from '../pages/userManagement/userFeatures/_user_reducers';
import planReducer from '../pages/global/other/Plan/PlanFeatures/_plan_reducers';
import countryReducer from '../pages/global/address/country/CountryFeatures/_country_reducers';
import stateReducer from '../pages/global/address/state/featureStates/_state_reducers';
import cityReducer from '../pages/global/address/city/CityFeatures/_city_reducers';
import compnayReducer from '../pages/company/companyManagement/companyFeatures/_company_reducers';
import directorReducer from '../pages/Director/director/DirectorFeatures/_director_reducers';
import pageReducer from '../pages/global/other/companyPage/CompanyPageFeatures/_companyPage_reducers';
import industryReducer from '../pages/global/other/Industry/IndustryFeature/_industry_reducers';
import employeeDocumentReducer from '../pages/global/other/employeeDocument/EmployeeDocumentFeatures/_emp_document_reducers';
import branchReducer from '../pages/branch/branchManagement/branchFeatures/_branch_reducers';
import dynamicSidebarReducer from '../pages/DyanmicSidebar/DyanmicSidebarFeatures/_dyanmicSidebar_reducers';
import orgTypeReducer from "../pages/organizationType/organizationTypeFeatures/_org_type_reducers";
import departmentReducer from "../pages/department/departmentFeatures/_department_reducers";
import designationReducer from '../pages/designation/designationFeatures/_designation_reducers';
import dynamicPageReducer from '../pages/global/other/dynamicPage/DynamicPageFeatures/dynamic_page_reducers';
import rolePermissionReducer from '../pages/global/RolesAccess/RolesPermission/rolePermissiomnFeatures/_rolePermission_reducers';
import fileUploadReducer from '../pages/global/other/fileManagement/FileManagementFeatures/_file_management_reducers';
import onBoardingReducer from '../pages/hr/onBoarding/onBoardingFeatures/_onBoarding_reducers';
import employeReducer from "../pages/employeManagement/employeFeatures/_employe_reducers";
import leaveTypeReducer from "../pages/global/other/leavetypeManagment/LeaveTypeFeatures/_leave_type_reducers";
import leaveRequestReducer from "../pages/hr/leaveRequestManagment/LeaveRequestModule/LeaveRequestFeatures/_leave_request_reducers";
import compensatoryleaveRequestReducer from "../pages/hr/leaveRequestManagment/CompensatoryLeaveModule/CompensatoryLeaveFeature/_compensatory_request_reducers";
import holidayCalanderReducer from "../pages/hr/holidayCalanderManagement/holidayCalanderFeatures/_holiday_calander_reducers";
import jobPostReducer from "../pages/hr/RecruitmentProcess/JobPost/JobPostFeatures/_job_post_reducers";
import eventCalanderReducer from "../pages/hr/EventCalanderManagement/EventCalanderFeatures/_event_calander_reducers";
import applicationReducer from "../pages/applicationManagement/applicationFeatures/_application_reducers";
import interviewReducer from "../pages/hr/RecruitmentProcess/Interview/InterviewFeatures/_interview_reducers";
import attendanceReducer from "../pages/hr/attendance/AttendanceFeatures/_attendance_reducers";
import timeSlotsReducer from "../pages/timeSlot/timeSlotsFeatures/_timeSlots_reducers";
import assignLeaveReducer from "../pages/hr/leaveRequestManagment/AssignLeaves/AssignLeaveFeatures/_assign_leave_reducers";
import allowanceReducer from "../pages/hr/employeeSalary/Allowance/allowancefeature/_allowanceList_reducers";
import deductionsReducer from "../pages/hr/employeeSalary/Deductions/deductionsfeature/_deductionsList_reducers";
import salaryDetailsReducer from "../pages/hr/employeeSalary/employeeSalaryModule/employeeSalaryFeatures/_employee_salary_reducers";
import workTypeReducer from "../pages/global/other/workType/WorkTypeFeatures/_work_type_reducers";
import hrmsSettingReducer from "../pages/hr/hrmsSettings/hrmsSettingsFeatures/_hrms_settings_reducers";
import payrollReducer from "../pages/hr/employeeSalary/employeePayrollModule/employeePayRollFeatures/_payroll_reducers";
import clientGroupReducer from "../pages/client/clientGroup/clientGroupFeatures/_client_group_reducers";
import proposalReducer from "../pages/client/proposal/proposalFeatures/_proposal_reducers";
import clientServiceReducer from "../pages/client/clientService/clientServiceFeatures/_client_service_reducers";
import clientReducer from "../pages/client/clientManagement/clientFeatures/_client_reducers"
import clientNewsReducer from "../pages/client/clientNews/clientNewsFeatures/_client_news_reducers";
import eventReducer from "../pages/client/event/eventFeatures/_event_reducers";
import digitalSignReducer from "../pages/client/digitalSignature/digitalSignatureFeatures/_digital_sign_reducers";
import taskTypeReducer from "../pages/taskManagement/taskType/taskFeatures/_task_reducers";
import addTaskReducer from "../pages/taskManagement/addTask/addTaskFeatures/_addTask_reducers";
import addEmployeeTaskReducer from "../pages/taskManagement/employeeAddTask/addTaskFeatures/_addTask_reducers";
import emailTemplateReducer from "../pages/global/other/commonEmailTemplate/commonEmailFeatures/_common_email_reducers";
import gstTypeReducer from '../pages/global/other/GstType/GstTypeFeatures/_gstType_reducers'
import expenceHeadReducer from "../pages/global/other/ExpenseHead/expenseTypeFeature/_expenseType_reducers"
import bankAccountReducer from "../pages/global/other/bankAccounts/bankAccountFeature/_bank_account_reducers"
import officeAddressReducer from "../pages/global/other/officeAddressManagement/officeAddressFeature/_office_address_reducers"
import cashbookReducer from "../pages/financeManagement/cashbook/cashbookFeature/_cashbook_reducers"
import contraReducer from "../pages/financeManagement/contra/contraFeature/_contra_reducers"
import visitorCatReducer from "../pages/visitorManagement/visitorCategories/visitorCategoryFeatures/_visitor_categories_reducers";
import visitorReducer from "../pages/visitorManagement/visitor/visitorFeatures/_visitor_reducers";
import advanceReducer from "../pages/financeManagement/advance/advanceFeature/_advance_reducers"
import invoiceReducer from "../pages/financeManagement/invoice/invoiceFeature/_invoice_reducers"
import receiptReducer from "../pages/financeManagement/reciept/receiptFeature/_receipt_reducers"
import notificationReducer from "../pages/clientNotification/notificationFeatures/_notification_reducers";
import expenseReducer from "../pages/financeManagement/expense/expenseFeature/_expense_reducers";
import vendorReducer from "../pages/financeManagement/vendor/vendorFeatures/_vendor_reducers";
import clientExpenceReducer from "../pages/financeManagement/clientExpence/clientExpenceFeature/_clientExpence_reducers";
import purchaseExpenceReducer from "../pages/financeManagement/purchaseandexpence/purchaseandexpenceFeature/_purchaseandexpence_reducers"
import vendoremployeeAdvanceReducer from "../pages/financeManagement/vendoremployeeAdvance/vendoremployeeAdvanceFeature/_vendoremployeeAdvance_reducers"
import paymentReducer from "../pages/financeManagement/payment/paymentFeature/_payment_reducers"
import interviewRoundReducer from "../pages/global/other/interviewRoundName/InterviewRoundFeatures/_interviewRound_type_reducers"
import bankNameReducer from "../pages/global/other/bankname/bankNameFeatures/_bankName_reducers"
import policyReducer from "../pages/global/other/policy/policyFeatures/policy_reducers";
import penaltyReducer from "../pages/global/other/interviewRoundName copy/penaltyFeatures/_penalty_reducers";
import resignReducer from "../pages/global/other/resignation/resignationFeatures/resignation_reducers";
import employeePenaltyReducer from "../pages/EmployeePenaltie/employeePenaltyFeatures/_employeePenalty_reducers"
import todoListReducer from "../pages/global/other/todolistManagement/TodoTypeFeatures/_TodoType_reducers"
import dashbaordReducer from "./_reducers/_dashboard_reducers"
import reportReducer from "./_reducers/_reports_reducers"
import standardPayrollReducer from "../pages/hr/employeeSalary/StandardPayroll/standardPayrollfeature/_standardPayroll_reducers"
import digitalSignatureTypeReducer from "../pages/clientService/sigantureServiceFeatures/_digital_signature_type_reducers"
import noticeBoardReducer from "../redux/_reducers/_noticeBoard_reducers"
import TerminationReducer from '../pages/global/other/termination/terminationFeatures/termination_reducers'
import companyPrefixReducer  from '../pages/hr/companyprefixsetting/companyPrefixSettingsFeatures/_company_prefix_setting_reducer'
import adminPrefixReducer from '../pages/hr/adminprefixsetting/companyPrefixSettingsFeatures/_admin_prefix_setting_reducer'
import clientDocumentReducer from '../pages/client/client_document/clientGroupFeatures/_client_document_reducers'
import visitReasonReducer from '../pages/visitorManagement/visitreason/visitReasonFeatures/_visitReason_type_reducers'
import SupportReducer from '../pages/supportModal/supportFeatures/_supportmodal_reducer'
import reportReducer2 from '../redux/_reducers/_reports_reducers2'
import AssetTypeReducer from './../pages/global/other/AssetTypeManagement/AssetTypeFeatures/_AssetType_reducers'
import leadCategoryReducer from "./../pages/PreSalesManagement/LeadsManagementCategory/LeadCategoryFeatures/_LeadCategory_reducers"
import  LeadmanagementFeatureReducer from "./../pages/PreSalesManagement/LeadsManagement/LeadmanagementFeature/_LeadmanagementFeature_reducers"
import serverManagementReducer from "./../pages/ServerManagement/serverManagementFeatures/_server-management_reducers"
import projectservice from '../pages/Project management/ProjectServices/projectserviceFeatures/_projectservice_reducers';
import projectCategory from '../pages/Project management/ProjectCategory/projectCategoryFeatures/_projectCategory_reducers';
import projectmanagement from '../pages/Project management/ProjectManagement/ProjectManagementFeatures/_ProjectManagement_reducers';
import accountManagement from '../pages/Project management/accountantmanagement/accountManagentFeatures/_accountManagement_reducers';
import projectInvoice from '../pages/Project management/ProjectInvoiceList/ProjectInvoiceFeatures/_ProjectInvoice_reducers';
import fundTransfer from '../pages/Project management/fundTransfer/fundTransferFeatures/_fundTransfer_reducers';
import projectpurchaseExpence from '../pages/Project management/projectpurchse/projectpurchseFeature/_projectpurchseFeature_reducers';
import projectTask from '../pages/Project management/ProjecttaskMagement/ProjecttaskFeatures/_project_task_reducers';
import EmployeLedger from '../pages/financeManagement/EmployeeAdvanceListandLedger/employeLedgerFeature/_employeLedger_reducers';
import wfhManager from '../pages/global/other/wfhManager/wfhManagerfeature/_wfhManager_reducers'
import wfhRequest from '../pages/hr/leaveRequestManagment/LeaveRequestModule/WFHRequestFeatures/_wfh_request_reducers'


const rootReducer = combineReducers({
  authentication: authenticationReducer,
  user: userReducer,
  plan: planReducer,
  country: countryReducer,
  company: compnayReducer,
  branch: branchReducer,
  director: directorReducer,
  department: departmentReducer,
  designation: designationReducer,
  states: stateReducer,
  city: cityReducer,
  page: pageReducer,
  dynamicPage: dynamicPageReducer,
  industry: industryReducer,
  orgType: orgTypeReducer,
  employeeDocument: employeeDocumentReducer,
  todoList: todoListReducer,
  dynamicSidebar: dynamicSidebarReducer,
  rolePermission: rolePermissionReducer,
  fileUpload: fileUploadReducer,
  onBoarding: onBoardingReducer,
  AssetType:AssetTypeReducer,
  // fileUpload: fileUploadReducer,
  employe: employeReducer,
  leaveType: leaveTypeReducer,
  leaveRequest: leaveRequestReducer,
  assignLeave: assignLeaveReducer,
  compensatoryleaveRequest: compensatoryleaveRequestReducer,
  holidayCalander: holidayCalanderReducer,
  jobPost: jobPostReducer,
  eventCalander: eventCalanderReducer,
  application: applicationReducer,
  interview: interviewReducer,
  attendance: attendanceReducer,
  timeSlots: timeSlotsReducer,
  allowance: allowanceReducer,
  deductions: deductionsReducer,
  salaryDetails: salaryDetailsReducer,
  workType: workTypeReducer,
  payrollReducer: payrollReducer,
  hrmsSetting: hrmsSettingReducer,
  clientGroup: clientGroupReducer,
  proposal: proposalReducer,
  clientService: clientServiceReducer,
  client: clientReducer,
  clientNews: clientNewsReducer,
  event: eventReducer,
  digitalSign: digitalSignReducer,
  taskType: taskTypeReducer,
  addTask: addTaskReducer,
  employeeTask: addEmployeeTaskReducer,
  emailTemplate: emailTemplateReducer,
  gstType: gstTypeReducer,
  expenceHead: expenceHeadReducer,
  bankAccount: bankAccountReducer,
  officeAddress: officeAddressReducer,
  cashbook: cashbookReducer,
  contra: contraReducer,
  advance: advanceReducer,
  invoice: invoiceReducer,
  receipt: receiptReducer,
  visitorCategory: visitorCatReducer,
  visitor: visitorReducer,
  notification: notificationReducer,
  expense: expenseReducer,
  vendor: vendorReducer,
  clientExpence: clientExpenceReducer,
  purchaseExpence : purchaseExpenceReducer,
  vendoremployeeAdvance : vendoremployeeAdvanceReducer,
  payment : paymentReducer,
  interviewRound: interviewRoundReducer,
  bankname: bankNameReducer,
  penalty:penaltyReducer,
  employeePenalty : employeePenaltyReducer,
  policy: policyReducer,
  resignation: resignReducer,
  dashboard : dashbaordReducer,
  reports : reportReducer,
  standardPayroll: standardPayrollReducer,
  digitalSignatureType: digitalSignatureTypeReducer,
  noticeBoard : noticeBoardReducer,
  Termination : TerminationReducer,
  companyPrefix : companyPrefixReducer,
  adminprefix:adminPrefixReducer,
  clientDocument:clientDocumentReducer,
  visitReason:visitReasonReducer,
  supportModal : SupportReducer,
  report2 : reportReducer2,
  leadCategory : leadCategoryReducer,
  LeadmanagementFeature:LeadmanagementFeatureReducer,
  serverManagement : serverManagementReducer,
  projectservice:projectservice,
  projectCategory:projectCategory,
  projectManagement:projectmanagement,
  accountManagement:accountManagement,
  projectInvoice:projectInvoice,
  fundTransfer:fundTransfer,
  projectpurchaseExpence:projectpurchaseExpence,
  projectTask:projectTask,
  EmployeLedger:EmployeLedger,
  wfhManager:wfhManager,
  wfhRequest:wfhRequest,
});

export default rootReducer;