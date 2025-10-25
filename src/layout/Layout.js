import { lazy, Suspense, useRef, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Header from "../component/header/Header";
import Sidebar from "../component/sidebar/Sidebar";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getPageRole } from "../pages/global/RolesAccess/RolesPermission/rolePermissiomnFeatures/_rolePermission_reducers";
import { domainName } from "../constents/global";
import { Spin } from 'antd';
import FinanceProfitandLossReport from '../pages/reportsManager/finance_report/finance_Profit_loss_report/FinanceProfitandLossReport';
import { io } from 'socket.io-client';
import ViewInvoice from '../pages/financeManagement/invoice/ViewInvoice';
import ViewLeads from '../pages/PreSalesManagement/LeadsManagement/ViewLeads';
import ServerList from '../pages/ServerManagement/ServerList';

import UpdateServerList from '../pages/ServerManagement/UpdateServerList';
import CreateServer from '../pages/ServerManagement/CreateServer';
import CreateAccountant from '../pages/Project management/accountantmanagement/CreateAccountant';
import AccountantList from '../pages/Project management/accountantmanagement/AccountantList';
import EditAccountant from '../pages/Project management/accountantmanagement/EditAccountant';


// Lazy-loaded components

const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const EditCompany = lazy(() => import("../pages/company/companyManagement/EditCompany"));
const CompanyManagement = lazy(() => import("../pages/company/companyManagement/CompanyManagement"));
const CreateCompany = lazy(() => import("../pages/company/companyManagement/CreateCompany"));
const MyCompanyDetails = lazy(() => import("../pages/company/companyManagement/MyCompanyDetails"));
const BranchManagement = lazy(() => import("../pages/branch/branchManagement/BranchManagement"));
const CreateBranch = lazy(() => import("../pages/branch/branchManagement/CreateBranch"));
const EditBranch = lazy(() => import("../pages/branch/branchManagement/EditBranch"));
const MyBranchDetails = lazy(() => import("../pages/branch/branchManagement/MyBranchDetails"));
const DirectorManagement = lazy(() => import("../pages/Director/director/DirectorManagement"));
const CreateDirector = lazy(() => import("../pages/Director/director/CreateDirector"));
const EditDirector = lazy(() => import("../pages/Director/director/EditDirector"));
const MyDirectorDetails = lazy(() => import("../pages/Director/director/MyDirectorDetails"));
const CreatePlan = lazy(() => import("../pages/global/other/Plan/CreatePlan"));
const EditPlan = lazy(() => import("../pages/global/other/Plan/EditPlan"));
const CreateCountry = lazy(() => import("../pages/global/address/country/CreateCountry"));
const EditCountry = lazy(() => import("../pages/global/address/country/EditCountry"));
const StateList = lazy(() => import("../pages/global/address/state/StateList"));
const CreateState = lazy(() => import("../pages/global/address/state/CreateState"));
const BalanceSheetReport = lazy(() => import('../pages/reportsManager/finance_report/finance_Profit_loss_report/BalanceSheetReport'))
const UpdateState = lazy(() => import("../pages/global/address/state/UpdateState"));
const CityList = lazy(() => import("../pages/global/address/city/CityList"));
const CreateCity = lazy(() => import("../pages/global/address/city/CreateCity"));
const UpdateCity = lazy(() => import("../pages/global/address/city/UpdateCity"));
const CompanyPage = lazy(() => import("../pages/global/other/companyPage/CompanyPage"));
const CreateCompanyPage = lazy(() => import("../pages/global/other/companyPage/CreateCompanyPage"));
const EditCompanyPage = lazy(() => import("../pages/global/other/companyPage/EditCompanyPage"));
const Industry = lazy(() => import("../pages/global/other/Industry/Industry"));
const CreateIndustry = lazy(() => import("../pages/global/other/Industry/CreateIndustry"));
const EditIndustry = lazy(() => import("../pages/global/other/Industry/EditIndustry"));
const EmployeeDocumentList = lazy(() => import("../pages/global/other/employeeDocument/EmployeeDocumentList"));
const CreateEmployeeDocuments = lazy(() => import("../pages/global/other/employeeDocument/CreateEmployeeDocuments"));
const UpdateEmployeeDocuments = lazy(() => import("../pages/global/other/employeeDocument/UpdateEmployeeDocuments"));
const DyanmicSidebar = lazy(() => import("../pages/DyanmicSidebar/DyanmicSidebar"));
const CreateDynamicSidebar = lazy(() => import("../pages/DyanmicSidebar/CreateDynamicSidebar"));
const EditDynamicSidebar = lazy(() => import("../pages/DyanmicSidebar/EditDynamicSidebar"));
const Plan = lazy(() => import("../pages/global/other/Plan/Plan"));
const Country = lazy(() => import("../pages/global/address/country/Country"));
const UpdateOrganizationType = lazy(() => import("../pages/organizationType/UpdateOrganizationType"));
const OrganizationType = lazy(() => import("../pages/organizationType/OrganizationTypeList"));
const CreateOrganizationType = lazy(() => import("../pages/organizationType/CreateOrganizationType"));
const CreateDepartment = lazy(() => import("../pages/department/CreateDepartment"));
const DepartmentList = lazy(() => import("../pages/department/DepartmentList"));
const UpdateDepartment = lazy(() => import("../pages/department/EditDepartment"));
const DesignationList = lazy(() => import("../pages/designation/DesignationList"));
const CreateDesignation = lazy(() => import("../pages/designation/CreateDesignation"));
const UpdateDesignation = lazy(() => import("../pages/designation/UpdateDesignation"));
const DynamicPageList = lazy(() => import("../pages/global/other/dynamicPage/DynamicPageList"));
const CreateDynamicPage = lazy(() => import("../pages/global/other/dynamicPage/CreateDynamicPage"));
const EditDynamicPage = lazy(() => import("../pages/global/other/dynamicPage/EditDynamicPage"));
const RolesPermissions = lazy(() => import("../pages/global/RolesAccess/RolesPermission/RolesPermissions"));
const DynamicPage = lazy(() => import("../pages/global/other/companyPage/DynamicPage"));
const OnBoardingManagment = lazy(() => import("../pages/hr/onBoarding/OnBoardingManagment"));
const CreateOnBoarding = lazy(() => import("../pages/hr/onBoarding/CreateOnBoarding"));
const EditOnBoarding = lazy(() => import("../pages/hr/onBoarding/EditOnBoarding"));
const EmployeManagement = lazy(() => import("../pages/employeManagement/EmployeManagement"));
const CreateEmploye = lazy(() => import("../pages/employeManagement/CreateEmploye"));
const EditEmploye = lazy(() => import("../pages/employeManagement/EditEmploye"));
const LeavetypeList = lazy(() => import("../pages/global/other/leavetypeManagment/LeaveTypeList"));
const CreateLeaveType = lazy(() => import("../pages/global/other/leavetypeManagment/CreateLeaveType"));
const EditLeaveType = lazy(() => import("../pages/global/other/leavetypeManagment/EditLeaveType"));
const LeaveRequestList = lazy(() => import("../pages/hr/leaveRequestManagment/LeaveRequestModule/LeaveRequestList"));
const HolidayCalanderList = lazy(() => import("../pages/hr/holidayCalanderManagement/HolidayCalanderList"));
const CreateHolidayCalander = lazy(() => import("../pages/hr/holidayCalanderManagement/CreateHolidayCalander"));
const EditHolidayCalander = lazy(() => import("../pages/hr/holidayCalanderManagement/EditHolidayCalander"));
const JobPostList = lazy(() => import("../pages/hr/RecruitmentProcess/JobPost/JobPostList"));
const CreateJobPostList = lazy(() => import("../pages/hr/RecruitmentProcess/JobPost/CreateJobPostList"));
const EditJobPostList = lazy(() => import("../pages/hr/RecruitmentProcess/JobPost/EditJobPostList"));
const EventCalanderList = lazy(() => import("../pages/hr/EventCalanderManagement/EventCalanderList"));
const CreateEventCalander = lazy(() => import("../pages/hr/EventCalanderManagement/CreateEventCalander"));
const EditEventCalander = lazy(() => import("../pages/hr/EventCalanderManagement/EditEventCalander"));
const ApplicationManagement = lazy(() => import("../pages/applicationManagement/ApplicationManagement"));
const ReadyToOnboardList = lazy(() => import("../pages/applicationManagement/ReadyToOnboardList"));
const CreateApplication = lazy(() => import("../pages/applicationManagement/CreateApplication"));
const EditApplication = lazy(() => import("../pages/applicationManagement/EditApplication"));
const InterviewList = lazy(() => import("../pages/hr/RecruitmentProcess/Interview/InterviewList"));
const CreateInterview = lazy(() => import("../pages/hr/RecruitmentProcess/Interview/CreateInterview"));
const EditInterview = lazy(() => import("../pages/hr/RecruitmentProcess/Interview/EditInterview"));
const AttendanceManagment = lazy(() => import("../pages/hr/attendance/AttendanceManagment"));
const HrAttendanceManagment = lazy(() => import("../pages/hr/attendance/HrAttendanceManagment"));
const ManualAttendanceModal = lazy(() => import("../pages/hr/attendance/ManualAttendanceModal"));
const UpdateAttendance = lazy(() => import("../pages/hr/attendance/UpdateAttendance"));
const MyEmployeDetails = lazy(() => import("../pages/employeManagement/MyEmployeDetails"));
const AllEmployeeAttendanceRecord = lazy(() => import("../pages/hr/attendance/AllEmployeeAttendanceRecord"));
const EmployeeLeaveRequestList = lazy(() => import("../pages/hr/leaveRequestManagment/LeaveRequestModule/EmployeeLeaveRequestList"));
const CompensatoryEmployeeLeaveRequestList = lazy(() => import("../pages/hr/leaveRequestManagment/CompensatoryLeaveModule/CompensatoryEmployeeLeaveRequestList"));
const HrCompensatoryEmployeeLeaveRequestList = lazy(() => import("../pages/hr/leaveRequestManagment/CompensatoryLeaveModule/HrCompensatoryEmployeeLeaveRequestList"));
const TimeSlotList = lazy(() => import("../pages/timeSlot/TimeSlotsList"));
const CreateTimeSlots = lazy(() => import("../pages/timeSlot/CreateTimeSlots"));
const UpdateTimeSlots = lazy(() => import("../pages/timeSlot/UpdateTimeSlots"));
const HrEmployeeSalaryList = lazy(() => import("../pages/hr/employeeSalary/employeeSalaryModule/HrEmployeeSalaryList"));
const CreateSalaryModule = lazy(() => import("../pages/hr/employeeSalary/employeeSalaryModule/CreateSalaryModule"));
const AllowanceList = lazy(() => import("../pages/hr/employeeSalary/Allowance/AllowanceList"));
const CreateAllowance = lazy(() => import("../pages/hr/employeeSalary/Allowance/CreateAllowance"));
const UpdateAllowance = lazy(() => import("../pages/hr/employeeSalary/Allowance/UpdateAllowance"));
const DeductionsList = lazy(() => import("../pages/hr/employeeSalary/Deductions/DeductionsList"));
const CreateDeductions = lazy(() => import("../pages/hr/employeeSalary/Deductions/CreateDeductions"));
const UpdateDeductions = lazy(() => import("../pages/hr/employeeSalary/Deductions/UpdateDeductions"));
const WorkTypeList = lazy(() => import("../pages/global/other/workType/WorkTypeList"));
const CreateWorkType = lazy(() => import("../pages/global/other/workType/CreateWorkType"));
const EditWorkType = lazy(() => import("../pages/global/other/workType/EditWorkType"));
const EditSalaryDetailsModule = lazy(() => import("../pages/hr/employeeSalary/employeeSalaryModule/EditSalaryDetailsModule"));
const HrmsSettings = lazy(() => import("../pages/hr/hrmsSettings/HrmsSettings"));
const Payslip = lazy(() => import("../pages/hr/employeeSalary/employeePayrollModule/Payslip"));
const EmployeePayrollList = lazy(() => import("../pages/hr/employeeSalary/employeePayrollModule/EmployeePayrollList"));
const ClientManagement = lazy(() => import("../pages/client/clientManagement/ClientManagement"));
const CreateClient = lazy(() => import("../pages/client/clientManagement/CreateClient"));
const EditClient = lazy(() => import("../pages/client/clientManagement/EditClient"));
const ClientGroupList = lazy(() => import("../pages/client/clientGroup/ClientGroupList"));
const CreateClientGroup = lazy(() => import("../pages/client/clientGroup/CreateClientGroup"));
const UpdateClientGroup = lazy(() => import("../pages/client/clientGroup/UpdateClientGroup"));
const ProposalList = lazy(() => import("../pages/client/proposal/ProposalList"));
const CreateProposal = lazy(() => import("../pages/client/proposal/CreateProposal"));
const UpdateProposal = lazy(() => import("../pages/client/proposal/UpdateProposal"));
const ClientServiceList = lazy(() => import("../pages/client/clientService/ClientServiceList"));
const CreateClientService = lazy(() => import("../pages/client/clientService/CreateClientService"));
const UpdateClientService = lazy(() => import("../pages/client/clientService/UpdateClientService"));
const ClientNewsList = lazy(() => import("../pages/client/clientNews/ClientNewsList"));
const CreateClientNews = lazy(() => import("../pages/client/clientNews/CreateClientNews"));
const UpdateClientNews = lazy(() => import("../pages/client/clientNews/UpdateClientNews"));
const EventList = lazy(() => import("../pages/client/event/EventList"));
const CreateEvent = lazy(() => import("../pages/client/event/CreateEvent"));
const UpdateEvent = lazy(() => import("../pages/client/event/UpdateEvent"));
const DigitalSignList = lazy(() => import("../pages/client/digitalSignature/DigitalSignList"));
const CreateDigitalSign = lazy(() => import("../pages/client/digitalSignature/CreateDigitalSign"));
const UpdateDigitalSign = lazy(() => import("../pages/client/digitalSignature/UpdateDigitalSign"));
const TaskList = lazy(() => import("../pages/taskManagement/addTask/TaskList"));
const ManagerTaskList = lazy(() => import("../pages/taskManagement/addTask/ManagerTaskList"));
const CreateTask = lazy(() => import("../pages/taskManagement/addTask/CreateTask"));
const EditTask = lazy(() => import("../pages/taskManagement/addTask/EditTask"));
const UpdateTaskType = lazy(() => import("../pages/taskManagement/taskType/UpdateTaskType"));
const CreateTaskType = lazy(() => import("../pages/taskManagement/taskType/CreateTaskType"));
const TaskTypeList = lazy(() => import("../pages/taskManagement/taskType/TaskTypeList"));
const EmployeeTaskList = lazy(() => import("../pages/taskManagement/employeeAddTask/EmployeeTaskList"));
const CommonEmailTemplateList = lazy(() => import("../pages/global/other/commonEmailTemplate/CommonEmailList"));
const CreateCommonEmail = lazy(() => import("../pages/global/other/commonEmailTemplate/CreateCommonEmail"));
const EditCommonEmail = lazy(() => import("../pages/global/other/commonEmailTemplate/EditCommonEmail"));
const GstType = lazy(() => import("../pages/global/other/GstType/GstType"));
const CreateGstType = lazy(() => import("../pages/global/other/GstType/CreateGstType"));
const EditGstType = lazy(() => import("../pages/global/other/GstType/EditGstType"));
const ExpenseHead = lazy(() => import("../pages/global/other/ExpenseHead/ExpenseHead"));
const CreateExpenseHead = lazy(() => import("../pages/global/other/ExpenseHead/CreateExpenseHead"));
const EditExpenseHead = lazy(() => import("../pages/global/other/ExpenseHead/EditExpenseHead"));
const OfficeAddressList = lazy(() => import("../pages/global/other/officeAddressManagement/OfficeAddressList"));
const CreateOfficeAddress = lazy(() => import("../pages/global/other/officeAddressManagement/CreateOfficeAddress"));
const EditOfficeAddress = lazy(() => import("../pages/global/other/officeAddressManagement/EditOfficeAddress"));
const BankAccountList = lazy(() => import("../pages/global/other/bankAccounts/BankAccountList"));
const CreateBankAccount = lazy(() => import("../pages/global/other/bankAccounts/CreateBankAccount"));
const EditBankAccount = lazy(() => import("../pages/global/other/bankAccounts/EditBankAccount"));
const CashbookList = lazy(() => import("../pages/financeManagement/cashbook/CashbookList"));
const CreateCashbook = lazy(() => import("../pages/financeManagement/cashbook/CreateCashbook"));
const Editcashbook = lazy(() => import("../pages/financeManagement/cashbook/Editcashbook"));
const ContraList = lazy(() => import("../pages/financeManagement/contra/ContraList"));
const CreateContra = lazy(() => import("../pages/financeManagement/contra/CreateContra"));
const EditContra = lazy(() => import("../pages/financeManagement/contra/EditContra"));
const VisitorCategoriesList = lazy(() => import("../pages/visitorManagement/visitorCategories/VisitorCategoriesList"));
const CreateVisitorCategories = lazy(() => import("../pages/visitorManagement/visitorCategories/CreateVisitorCategories"));
const UpdateVisitorCategories = lazy(() => import("../pages/visitorManagement/visitorCategories/UpdateVisitorCategories"));
const VisitorList = lazy(() => import("../pages/visitorManagement/visitor/VisitorList"));
const CreateVisitor = lazy(() => import("../pages/visitorManagement/visitor/CreateVisitor"));
const UpdateVisitor = lazy(() => import("../pages/visitorManagement/visitor/UpdateVisitor"));
const AdvanceList = lazy(() => import("../pages/financeManagement/advance/AdvanceList"));
const CreateAdvance = lazy(() => import("../pages/financeManagement/advance/CreateAdvance"));
const EditAdvance = lazy(() => import("../pages/financeManagement/advance/EditAdvance"));
const ViewCompanyDetail = lazy(() => import("../pages/company/companyManagement/ViewCompanyDetail"));
const ViewBranchDetail = lazy(() => import("../pages/branch/branchManagement/ViewBranchDetail"));
const ViewDirectorDetails = lazy(() => import("../pages/Director/director/ViewDirectorDetails"));
const ViewClientDetail = lazy(() => import("../pages/client/clientManagement/ViewClientDetail"));
const InvoiceList = lazy(() => import("../pages/financeManagement/invoice/InvoiceList"));
const EditInvoice = lazy(() => import("../pages/financeManagement/invoice/EditInvoice"));
const Createinvoice = lazy(() => import("../pages/financeManagement/invoice/Createinvoice"));
const ViewOnBoardingDetail = lazy(() => import("../pages/hr/onBoarding/ViewOnBoardingDetail"));
const ReceiptList = lazy(() => import("../pages/financeManagement/reciept/ReceiptList"));
const CreateReceipt = lazy(() => import("../pages/financeManagement/reciept/CreateReceipt"));
const EditReceipt = lazy(() => import("../pages/financeManagement/reciept/EditReceipt"));
const NotificationList = lazy(() => import("../pages/clientNotification/NotificationList"));
const CreateNotification = lazy(() => import("../pages/clientNotification/CreateNotification"));
const EditNotification = lazy(() => import("../pages/dashboard/EditNotification"));
const ExpenseList = lazy(() => import("../pages/financeManagement/expense/ExpenseList"));
const CreateExpense = lazy(() => import("../pages/financeManagement/expense/CreateExpense"));
const EditExpense = lazy(() => import("../pages/financeManagement/expense/EditExpense"));
const ViewTaskDetails = lazy(() => import("../pages/taskManagement/addTask/ViewTaskDetails"));
const VendorList = lazy(() => import("../pages/financeManagement/vendor/VendorList"));
const CreateVendor = lazy(() => import("../pages/financeManagement/vendor/CreateVendor"));
const UpdateVendor = lazy(() => import("../pages/financeManagement/vendor/UpdateVendor"));
const ClientExpenceList = lazy(() => import("../pages/financeManagement/clientExpence/ClientExpenceList"));
const CreateClientExpence = lazy(() => import("../pages/financeManagement/clientExpence/CreateClientExpence"));
const EditClientExpence = lazy(() => import("../pages/financeManagement/clientExpence/EditClientExpence"));
const PurchaseandexpenceList = lazy(() => import("../pages/financeManagement/purchaseandexpence/PurchaseandexpenceList"));
const Createpurchaseandexpence = lazy(() => import("../pages/financeManagement/purchaseandexpence/Createpurchaseandexpence"));
const Editpurchaseandexpence = lazy(() => import("../pages/financeManagement/purchaseandexpence/Editpurchaseandexpence"));
const VendoremployeeAdvanceList = lazy(() => import("../pages/financeManagement/vendoremployeeAdvance/VendoremployeeAdvanceList"));
const CreateVendorAdvance = lazy(() => import("../pages/financeManagement/vendoremployeeAdvance/CreateVendorAdvance"));
// const EditVendorAdvance = lazy(() => import("../pages/financeManagement/vendoremployeeAdvance/EditVendorAdvance"));
const PaymentList = lazy(() => import("../pages/financeManagement/payment/PaymentList"));
const EditPayment = lazy(() => import("../pages/financeManagement/payment/EditPayment"));
const EmployeeInterviewList = lazy(() => import("../pages/hr/RecruitmentProcess/Interview/EmployeeInterviewList"));
const InterviewRoundList = lazy(() => import("../pages/global/other/interviewRoundName/InterviewRoundList"));
const CreateInterviewRound = lazy(() => import("../pages/global/other/interviewRoundName/CreateInterviewRound"));
const EditInterviewRound = lazy(() => import("../pages/global/other/interviewRoundName/EditInterviewRound"));
const BankNameList = lazy(() => import("../pages/global/other/bankname/BankNameList"));
const CreateBankName = lazy(() => import("../pages/global/other/bankname/CreateBankName"));
const EditBankName = lazy(() => import("../pages/global/other/bankname/EditBankName"));
const PolicyList = lazy(() => import("../pages/global/other/policy/PolicyList"));
const CreatePolicy = lazy(() => import("../pages/global/other/policy/CreatePolicy"));
const EditPolicy = lazy(() => import("../pages/global/other/policy/EditPolicy"));
const PenaltyList = lazy(() => import("../pages/global/other/interviewRoundName copy/PenaltyList"));
const CreatePenalty = lazy(() => import("../pages/global/other/interviewRoundName copy/CreatePenalty"));
const EditPenalty = lazy(() => import("../pages/global/other/interviewRoundName copy/EditPenalty"));
const ResignationList = lazy(() => import("../pages/global/other/resignation/ResignationList"));
const CreateResignation = lazy(() => import("../pages/global/other/resignation/CreateResignation"));
const EditResignation = lazy(() => import("../pages/global/other/resignation/EditResignation"));
const EmployeePenaltie = lazy(() => import("../pages/EmployeePenaltie/EmployeePenaltie"));
const CreateEmployeePenaltie = lazy(() => import("../pages/EmployeePenaltie/CreateEmployeePenaltie"));
const EditEmployeePenaltie = lazy(() => import("../pages/EmployeePenaltie/EditEmployeePenaltie"));
const EmployeeAttendanceReport = lazy(() => import("../pages/reportsManager/hrmsReports/attendanceReport/EmployeeAttendanceReport"));
const LeaveRequestReport = lazy(() => import("../pages/reportsManager/hrmsReports/leaveRequestReports/LeaveRequestReport"));
const EmployePenaltyReport = lazy(() => import("../pages/reportsManager/hrmsReports/penaltyReports/EmployePenaltyReport"));
const StandardPayrollList = lazy(() => import("../pages/hr/employeeSalary/StandardPayroll/StandardPayrollList"));
const CreateStandardPayroll = lazy(() => import("../pages/hr/employeeSalary/StandardPayroll/CreateStandardPayroll"));
const UpdateStandardPayroll = lazy(() => import("../pages/hr/employeeSalary/StandardPayroll/UpdateStandardPayroll"));
const ViewStandardpayroll = lazy(() => import('../pages/hr/employeeSalary/StandardPayroll/ViewStandardpayroll'))
const ClientReport = lazy(() => import("../pages/reportsManager/clientReports/clientReports/ClientReport"));
const EmployeReport = lazy(() => import("../pages/reportsManager/hrmsReports/employeReports/EmployeReport"));
const EmployeEPBXReports = lazy(() => import("../pages/reportsManager/hrmsReports/employeEPBXReports/EmployeEPBXReports"));
const EmployePerformanceReport = lazy(() => import("../pages/reportsManager/hrmsReports/employePerformanceReports/EmployePerformanceReport"));
const DigitalSignatureReport = lazy(() => import("../pages/reportsManager/clientReports/digitalSignReports/DigitalSignatureReport"));
const TaskStatusReport = lazy(() => import("../pages/reportsManager/taskReports/taskStatusReports/TaskStatusReport"));
const PendingInvoiceReport = lazy(() => import("../pages/reportsManager/taskReports/pendingInvoiceReports/PendingInvoiceReport"));
const RunningTaskReport = lazy(() => import("../pages/reportsManager/taskReports/runningTaskReports/RunningTaskReport"));
const ClientLedger = lazy(() => import("../pages/reportsManager/clientReports/clientLedger/ClientLedger"));
const CreatePermissions = lazy(() => import("../pages/global/RolesAccess/RolesPermission/CreatePermissions"));
const UpdatePermission = lazy(() => import("../pages/global/RolesAccess/RolesPermission/UpdatePermission"));
const DigitalSignatureTypeList = lazy(() => import("../pages/clientService/DigitalSignatureTypeList"));
const CreateDigitalSignatureType = lazy(() => import("../pages/clientService/CreateDigitalSignatureType"));
const UpdateDigitalSignatureType = lazy(() => import("../pages/clientService/UpdateDigitalSignatureType"));
const HrDashBoard = lazy(() => import("../pages/dashboard/HrDashBoard"));
const EmployeeResignationList = lazy(() => import("../pages/global/other/resignation/EmployeeResignationList"));
const CreateEmployeeResignation = lazy(() => import("../pages/global/other/resignation/CreateEmployeeResignation"));
const EmployeePenalty = lazy(() => import("../pages/EmployeePenaltie/EmployeePenalty"));
const PayrollList = lazy(() => import("../pages/hr/employeeSalary/employeePayrollModule/PayrollList"));
const EmployeePayslip = lazy(() => import("../pages/hr/employeeSalary/employeePayrollModule/EmployeePayslip"));
const ErrorPage = lazy(() => import("../pages/Error/Error"));

const TerminationList = lazy(() => import("../pages/global/other/termination/TerminationList"));
const CreateTermination = lazy(() => import("../pages/global/other/termination/CreateTermination"));
const EditTermination = lazy(() => import("../pages/global/other/termination/EditTermination"));
const CompanyPrefixSetting = lazy(() => import("../pages/hr/companyprefixsetting/CompanyPrefixSetting"));
const AdminPrefixSetting = lazy(() => import("../pages/hr/adminprefixsetting/AdminPrefixSetting"));
const ClientDocument = lazy(() => import("../pages/client/client_document/ClientDocument"));
const VisitReasonList = lazy(() => import("../pages/visitorManagement/visitreason/VisitReasonList"));
const CreateVisitReason = lazy(() => import("../pages/visitorManagement/visitreason/CreateVisitReason"));
const EditVisitReason = lazy(() => import("../pages/visitorManagement/visitreason/EditVisitReason"));
const SupportModalList = lazy(() => import("../pages/supportModal/SupportModalList"));
const PlanApprovalSidebarModal = lazy(() => import("../pages/global/other/Plan/PlanApprovalSidebarModal"));
const PlanHistory = lazy(() => import("../pages/company/companyManagement/planhistorylist/PlanHistory"));
const EmployeeTerminationList = lazy(() => import("../pages/global/other/termination/EmployeeTerminationList"));
const PrivacyPolicy = lazy(() => import("../pages/privacypolicy/PrivacyPolicy"));
const TerminationsAndConditions = lazy(() => import("../pages/termsandconditions/TerminationsAndConditions"));
const CreateEmployeeTask = lazy(() => import("../pages/taskManagement/employeeAddTask/CreateEmployeeTask"));
const EmployeeCashbookList = lazy(() => import("../pages/financeManagement/cashbook/EmployeeCashbookList"));
const EmployeeCashbookCreate = lazy(() => import("../pages/financeManagement/cashbook/EmployeeCashbookCreate"));
const EmployeecashbookEdit = lazy(() => import("../pages/financeManagement/cashbook/EmployeecashbookEdit"));
const ViewPayment = lazy(() => import("../pages/financeManagement/payment/ViewPayment"));
const GeneralVisitorList = lazy(() => import("../pages/visitorManagement/general_client_visitor/GeneralVisitorList"));
const GeneralCreateVisitor = lazy(() => import("../pages/visitorManagement/general_client_visitor/GeneralCreateVisitor"));
const UpdateGeneralVisitor = lazy(() => import("../pages/visitorManagement/general_client_visitor/UpdateGeneralVisitor"));
const ClientVisitorList = lazy(() => import("../pages/visitorManagement/client_visit/ClientVisitorList"));
const CreateClientVisitor = lazy(() => import("../pages/visitorManagement/client_visit/CreateClientVisitor"));
const UpdateClientVisitor = lazy(() => import("../pages/visitorManagement/client_visit/UpdateClientVisitor"));
const EmployeeVisitorList = lazy(() => import("../pages/visitorManagement/employee_visitor_list/EmployeeVisitorList"));
const AllTaskReport = lazy(() => import("../pages/reportsManager/taskReports/AllTaskReport/AllTaskReport"));
const LastTaskUpdationReport = lazy(() => import("../pages/reportsManager/taskReports/lastTaskUpdationReport/LastTaskUpdationReport"));
const TaskRatingReport = lazy(() => import("../pages/reportsManager/taskReports/task_rating_report/TaskRatingReport"));
const WorkingHourTaskReport = lazy(() => import("../pages/reportsManager/taskReports/working_hour_taskReport/WorkingHourTaskReport"));
const OverDueTaskReport = lazy(() => import("../pages/reportsManager/taskReports/overdue_task_report/OverDueTaskReport"));
const StoppedTaskReport = lazy(() => import("../pages/reportsManager/taskReports/stopped_task_report/StoppedTaskReport"));
const FinancialTaskReport = lazy(() => import("../pages/reportsManager/taskReports/financial_task_report/FinancialTaskReport"));
const ClientServiceReport = lazy(() => import("../pages/reportsManager/clientReports/client_service_report/ClientServiceReport"));
const ClientIndexReport = lazy(() => import("../pages/reportsManager/clientReports/client_index_report/ClientIndexReport"));
const ClientDigitalSignationReport = lazy(() => import("../pages/reportsManager/clientReports/client_digital_signature_report/ClientDigitalSignationReport"));
const ClientOwnerDetailsReport = lazy(() => import("../pages/reportsManager/clientReports/client_ownerdetail_report/ClientOwnerDetailsReport"));
const AllClientReport = lazy(() => import("../pages/reportsManager/clientReports/all_client_report/AllClientReport"));
const RecruitmentOnboardingReport = lazy(() => import("../pages/reportsManager/hrmsReports/recruitmentOnboardingreport/RecruitmentOnboardingReport"));
const EmployeeSalaryReport = lazy(() => import("../pages/reportsManager/hrmsReports/salaryReport/EmployeeSalaryReport"));
const EmployeeAppraisalReport = lazy(() => import("../pages/reportsManager/hrmsReports/appraisalReport/EmployeeAppraisalReport"));
const EmployeeAttendenceSummaryReport = lazy(() => import("../pages/reportsManager/hrmsReports/employeeattendance_summary_report/EmployeeAttendenceSummaryReport"));
const ClientLedgerReport = lazy(() => import("../pages/reportsManager/clientReports/client_ledger_report/ClientLedgerReport"));
const ClientStatementReport = lazy(() => import("../pages/reportsManager/clientReports/client_statement_report/ClientStatementReport"));
const ClientGroupStatementReport = lazy(() => import("../pages/reportsManager/clientReports/client_groupstatement_report/ClientGroupStatementReport"));
const ClientGroupLedgerReport = lazy(() => import("../pages/reportsManager/clientReports/client_group_ledger_report/ClientGroupLedgerReport"));
const ClientGrowthRevenueReport = lazy(() => import("../pages/reportsManager/clientReports/client_growthrevenue_report/ClientGrowthRevenueReport"));
const FinanceInvoiceGstReturnSalesReport = lazy(() => import("../pages/reportsManager/finance_report/finance_sales_report/FinanceInvoiceGstReturnSalesReport"));
const FinanceInvoiceGstReturnPurchaseReport = lazy(() => import("../pages/reportsManager/finance_report/finance_purchase_report/FinanceInvoiceGstReturnPurchaseReport"));
const EmployeeMonthlySummaryReport = lazy(() => import("../pages/reportsManager/taskReports/EmployeeMonthlySummaryReport/EmployeeMonthlySummaryReport"));
const FinanceRecieptReport = lazy(() => import("../pages/reportsManager/finance_report/finance_receipt_report/FinanceRecieptReport"));
const CashbookDetailsReport = lazy(() => import("../pages/reportsManager/finance_report/cashbook_details_report/CashbookDetailsReport"));
const ClientInvoiceReport = lazy(() => import("../pages/reportsManager/finance_report/client_invoice_report/ClientInvoiceReport"));
const VendorAdvanceReport = lazy(() => import("../pages/reportsManager/finance_report/vendor_advance_report/VendorAdvanceReport"));
const ClientBillingPaymentTracking = lazy(() => import("../pages/reportsManager/clientReports/client_billing_payment_tracking/ClientBillingPaymentTracking"));
const FinancePaymentReport = lazy(() => import("../pages/reportsManager/finance_report/finance_payment_report/FinancePaymentReport"));
const FinanceAdvanceReport = lazy(() => import("../pages/reportsManager/clientReports/finance_advance_report/FinanceAdvanceReport"));
const FinanceAdvanceSummaryReport = lazy(() => import("../pages/reportsManager/finance_report/finance_advance_summary-report/FinanceAdvanceSummaryReport"));
const VendorInvoiceReport = lazy(() => import("../pages/reportsManager/finance_report/vendor_invoice_report/VendorInvoiceReport"));
const EmployeeClientVisitorList = lazy(() => import("../pages/visitorManagement/client_visit/EmployeeClientVisitorList"));
const BankStatementSummayReport = lazy(() => import('../pages/reportsManager/finance_report/bankStatementReport/BankStatementSummayReport'));
const BankStatementReport = lazy(() => import('../pages/reportsManager/finance_report/bankStatementReport/BankStatementReport'));
const AssetTypeList = lazy(() => import('../pages/global/other/AssetTypeManagement/AssetTypeList'));
const CreateAssettype = lazy(() => import('../pages/global/other/AssetTypeManagement/CreateAssetType'));
const CreateTodoList = lazy(() => import('../pages/global/other/todolistManagement/CreateTodoList'));
const AssetsTypeUpdate = lazy(() => import('../pages/global/other/AssetTypeManagement/EditAssetType'));
const AssetInventryList = lazy(() => import('../pages/global/other/AssetTypeManagement/AssetInventryList'));
const EmployeecashbookDetailsList = lazy(() => import('../pages/financeManagement/cashbook/EmployeecashbookDetailsList'));
const EmployeeListViewCashbook = lazy(() => import('../pages/financeManagement/cashbook/EmployeeListViewCashbook'));
const AllCompletedTaskList = lazy(() => import("../pages/taskManagement/addTask/AllCompletedTaskList"));
const AllTaskRejectedTaskList = lazy(() => import("../pages/taskManagement/addTask/AllTaskRejectedTaskList"));

const AllTaskStopTaskList = lazy(() => import("../pages/taskManagement/addTask/AllTaskStopTaskList"));
const LeadManagement = lazy(() => import("../pages/PreSalesManagement/LeadsManagement/LeadManagement"));
const EmployeeLeadManagement = lazy(() => import("../pages/PreSalesManagement/LeadsManagement/EmployeeLeadManagement"));
const GenrateLeads = lazy(() => import("../pages/PreSalesManagement/LeadsManagement/GenrateLeads"));
const EditLeads = lazy(() => import("../pages/PreSalesManagement/LeadsManagement/EditLeads"));
const LeadsManagementCategory = lazy(() => import("../pages/PreSalesManagement/LeadsManagementCategory/LeadsManagementCategory"));
const CreateLeadsManagementCategory = lazy(() => import("../pages/PreSalesManagement/LeadsManagementCategory/CreateLeadsManagementCategory"));
const EditLeadsManagementCategory = lazy(() => import("../pages/PreSalesManagement/LeadsManagementCategory/EditLeadsManagementCategory"));
const LeadTransferList = lazy(() => import("../pages/PreSalesManagement/LeadsManagement/LeadTransferList"));
const LeadsReports = lazy(() => import("../pages/PreSalesManagement/LeadsManagement/LeadsReports"));
const VigoTaskManagement = lazy(() => import("../pages/VigotaskmanagementNew/VigoTaskMangement"));
const VigoTaskApproval = lazy(() => import("../pages/VigotaskmanagementNew/VigoTaskApproval"));
const ProjectServices = lazy(() => import("../pages/Project management/ProjectServices/Projectservice"));
const CreateProjectservice = lazy(() => import("../pages/Project management/ProjectServices/CreateProjectservice"));
const EditProjectservice = lazy(() => import("../pages/Project management/ProjectServices/EditProjectservice"));
const ProjectCategory = lazy(() => import("../pages/Project management/ProjectCategory/ProjectCategory"));
const CreateProjectCategory = lazy(() => import("../pages/Project management/ProjectCategory/CreateProjectCategory"));
const EditprojectCategory = lazy(() => import("../pages/Project management/ProjectCategory/EditprojectCategory"));
const Projectmanagement = lazy(() => import("../pages/Project management/ProjectManagement/Projectmanagement"));
const Createprojectmanagement = lazy(() => import("../pages/Project management/ProjectManagement/Createprojectmanagement"));
const Editprojectmanagement = lazy(() => import("../pages/Project management/ProjectManagement/Editprojectmanagement"));
const CreateInvoiceProject = lazy(() => import('../pages/Project management/ProjectInvoiceList/CreateProjectInvoice'))
const ProjectInvoicingList = lazy(() => import('../pages/Project management/ProjectInvoiceList/ProjectInvoicingList'))
const ProjectInvoiceView = lazy(() => import('../pages/Project management/ProjectInvoiceList/ProjectInvoiceView'))
const FundTransfer = lazy(() => import('../pages/Project management/fundTransfer/FundTransfer'))
const CreateFundTransfer = lazy(() => import('../pages/Project management/fundTransfer/CreateFundtransfer'))
const EditFundTransfer = lazy(() => import('../pages/Project management/fundTransfer/EditFundTransfer'))
const AccountentStatementReport = lazy(() => import('../pages/Project management/accountantmanagement/AccountentStatementReport'))
const ProjectPurchaseandexpenceList = lazy(() => import('../pages/Project management/projectpurchse/ProjectPurchaseandexpenceList'))
const CreateProjectPurchaseandexpence = lazy(() => import('../pages/Project management/projectpurchse/CreateProjectpurchaseandexpence'))
const ProjectDashboard = lazy(() => import('../pages/Project management/ProjectManagement/ProjectDashboard'))
const VigoVendorList = lazy(() => import('../pages/Project management/Vigovendor/VigoVendorList'))
const CreateVigoVendor = lazy(() => import('../pages/Project management/Vigovendor/CreateVigoVendor'))
const UpdateVigoVendor = lazy(() => import('../pages/Project management/Vigovendor/UpdateVigoVendor'))
const ProjectTaskList = lazy(() => import('../pages/Project management/ProjecttaskMagement/ProjectTaskList'))
const ManagerProjectTaskList = lazy(() => import('../pages/Project management/ProjecttaskMagement/ManagerProjectTaskList'))
const EmployeeProjectTaskList = lazy(() => import('../pages/Project management/ProjecttaskMagement/EmployeeProjectTaskList'))
const ProjectTaskDashboard = lazy(() => import('../pages/Project management/ProjecttaskMagement/ProjectTaskDashboard'))
const CreateEmployeLedger = lazy(() => import('../pages/financeManagement/EmployeeAdvanceListandLedger/CreateEmployeLedger'))
const EmployeeLedgerList = lazy(() => import('../pages/financeManagement/EmployeeAdvanceListandLedger/EmployeeLedgerAndAdvance'))
const WfhManagerList = lazy(() => import('../pages/global/other/wfhManager/WfhManagerList'))
const CreateWfhManager = lazy(() => import('../pages/global/other/wfhManager/CreatewfhManager'))
const EditWfhManager = lazy(() => import('../pages/global/other/wfhManager/UpdatewfhManager'))
const InvoiceStatusWiseSummary = lazy(() => import('../pages/reportsManager/finance_report/invoice_status_wise_summary/InvoiceStatusWiseSummary'))
const LeaveRequestSummaryReport = lazy(() => import('../pages/reportsManager/hrmsReports/leaveRequestSummaryReport/LeaveRequestSummaryReport'))
const WfhRequestList = lazy(() => import('../pages/hr/leaveRequestManagment/LeaveRequestModule/WfhRequestList'))
const WfhRequestListEmployee = lazy(() => import('../pages/hr/leaveRequestManagment/LeaveRequestModule/WfhRequestListEmployee'))
const ProposalListEmployee = lazy(() => import('../pages/client/proposal/ProposalListEmployee'))
const ManagerInvoiceList = lazy(() => import('../pages/financeManagement/invoice/ManagerInvoiceList'))
const ManagerofficeVisit = lazy(() => import('../pages/visitorManagement/visitor/ManagerofficeVisit'))
const ManagerClientVisit = lazy(() => import('../pages/visitorManagement/client_visit/ManagerClientVisit'))







function Layout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {

    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.clear();
      navigate("/login");
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'LOGOUT' }));
      }
    } else {

    }
    if (
      JSON.parse(localStorage.getItem(`user_info_${domainName}`))?.userType ===
      "employee"
    ) {
      dispatch(
        getPageRole({
          userId: JSON.parse(localStorage.getItem(`user_info_${domainName}`))?._id,
          designationId: null,
        })
      );
    }
  }, []);


  const socket = useRef(null);
  useEffect(() => {
    if (socket.current && socket.current.connected) {
      return;
    }

    socket.current = io(process.env.REACT_APP_BACKEND_DOMAIN_NAME + `?userId=${JSON.parse(localStorage.getItem(`user_info_${domainName}`))?._id}`, {
      transports: ["websocket"],
      reconnection: false,
    });
    socket.current.on("force_logout", (data) => {
      localStorage.clear();

      navigate("/login");
      socket.current.on("disconnect", () => {
      });
    })
  }, [])
  const [isMobile, setIsMobile] = useState(false);
  const menuButtonRef = useRef(null);
  const handleResize = () => {
    setIsMobile(window.innerWidth >= 768 && window.innerWidth <= 992);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    if (isMobile && menuButtonRef.current) {
      menuButtonRef.current.click();
      const sidebar = document.querySelector(".sidebar-mini");
      if (sidebar) {
        sidebar.classList.remove("sidebar-open");
        sidebar.classList.add("sidebar-closed");
        sidebar.classList.add("sidebar-collapse");
      }
    }
  }, [isMobile]);


  return (
    <>

      <Header />
      <div
        ref={menuButtonRef}
        data-widget="pushmenu"
        className="hidden rounded-xl cursor-pointer autoClcikbetween768to992"
      >
      </div>
      <Sidebar />
      <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="loading..." />
      </div>}>
        <Routes>
          <Route path="*" element={<ErrorPage />} />
          <Route path="/" element={<Navigate to="dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/company" element={<CompanyManagement />} />
          <Route path="/company/create" element={<CreateCompany />} />
          <Route path="/company/view/:companyIdEnc" element={<ViewCompanyDetail />} />
          <Route path="/company/edit/:companyIdEnc" element={<EditCompany />} />
          <Route path="/my-company" element={<MyCompanyDetails />} />
          <Route path="/branch" element={<BranchManagement />} />
          <Route path="/branch/create" element={<CreateBranch />} />
          <Route path="/branch/edit/:branchIdEnc" element={<EditBranch />} />
          <Route path="/branch/branchView/:branchIdEnc" element={<ViewBranchDetail />} />
          <Route path="/company/branchView/:branchIdEnc" element={<ViewBranchDetail />} />
          <Route path="/my-branch" element={<MyBranchDetails />} />
          <Route path="/view-page/:pageIdEnc" element={<DynamicPage />} />
          <Route path="/director" element={<DirectorManagement />} />
          <Route path="/director/create" element={<CreateDirector />} />
          <Route path="/director/edit/:directorIdEnc" element={<EditDirector />} />
          <Route path="/my-director" element={<MyDirectorDetails />} />
          <Route path="director/directorView/:directorIdEnc" element={<ViewDirectorDetails />} />
          <Route path="/plan/:pageId?" element={<Plan />} />
          <Route path="/plan/create" element={<CreatePlan />} />
          <Route path="/plan/edit/:planIdEnc" element={<EditPlan />} />
          <Route path="/plan-manager/:planManagerIdEnc" element={<PlanApprovalSidebarModal />} />
          <Route path="/country/:pageId?" element={<Country />} />
          <Route path="/country/create" element={<CreateCountry />} />
          <Route path="/country/edit/:countryIdEnc" element={<EditCountry />} />
          <Route path="/state/:pageId?" element={<StateList />} />
          <Route path="/state/create" element={<CreateState />} />
          <Route path="/state/edit/:stateEnc" element={<UpdateState />} />
          <Route path="/city/:pageId?" element={<CityList />} />
          <Route path="/city/create" element={<CreateCity />} />
          <Route path="/city/edit/:cityEnc" element={<UpdateCity />} />
          <Route path="/company-page/:pageId?" element={<CompanyPage />} />
          <Route path="/company-page/create" element={<CreateCompanyPage />} />
          <Route path="/company-page/edit/:pageIdEnc" element={<EditCompanyPage />} />
          <Route path="/dynamic-page/:pageId?" element={<DynamicPageList />} />
          <Route path="/dynamic-page/create" element={<CreateDynamicPage />} />
          <Route path="/dynamic-page/edit/:pageIdEnc" element={<EditDynamicPage />} />
          <Route path="/industry/:pageId?" element={<Industry />} />
          <Route path="/industry/create" element={<CreateIndustry />} />
          <Route path="/industry/edit/:industryIdEnc" element={<EditIndustry />} />
          <Route path="/department/:pageId?" element={<DepartmentList />} />
          <Route path="/department/create" element={<CreateDepartment />} />
          <Route path="/department/edit/:departmentIdEnc" element={<UpdateDepartment />} />
          <Route path="/designation/:pageId?" element={<DesignationList />} />
          <Route path="/designation/create" element={<CreateDesignation />} />
          <Route path="/designation/edit/:desigIdEnc" element={<UpdateDesignation />} />
          <Route path="/organization-type/:pageId?" element={<OrganizationType />} />
          <Route path="/organization-type/create" element={<CreateOrganizationType />} />
          <Route path="/organization-type/edit/:orgTypeIdEnc" element={<UpdateOrganizationType />} />
          <Route path="/document-type/:pageId?" element={<EmployeeDocumentList />} />
          <Route path="/document-type/create" element={<CreateEmployeeDocuments />} />
          <Route path="/document-type/edit/:empDocEnc" element={<UpdateEmployeeDocuments />} />
          <Route path="/dynamic-sidebar/:pageId?" element={<DyanmicSidebar />} />
          <Route path="/dynamic-sidebar/create/:SidebarIdEnc?" element={<CreateDynamicSidebar />} />
          <Route path="/dynamic-sidebar/edit/:SidebarIdEnc" element={<EditDynamicSidebar />} />
          <Route path="/roles-permission/:pageId?" element={<RolesPermissions />} />
          <Route path="/roles-permission/create" element={<CreatePermissions />} />
          <Route path="/roles-permission/edit/:permissionIdEnc" element={<UpdatePermission />} />
          <Route path="/onBoarding/:pageId?" element={<OnBoardingManagment />} />
          <Route path="/onBoarding/create" element={<CreateOnBoarding />} />
          <Route path="/onBoarding/onBoardingView/:onBoardingIdEnc" element={<ViewOnBoardingDetail />} />
          <Route path="/onBoarding/edit/:onBoardingIdEnc?" element={<EditOnBoarding />} />
          <Route path="/employe/:pageId?" element={<EmployeManagement />} />
          <Route path="/employe/create" element={<CreateEmploye />} />
          <Route path="/employe/edit/:empIdEnc" element={<EditEmploye />} />
          <Route path="/my-employe" element={<MyEmployeDetails />} />
          <Route path="/leave-type-list" element={<LeavetypeList />} />
          <Route path="/leave-type-list/:pageId?" element={<LeavetypeList />} />
          <Route path="/leave-type-list/create" element={<CreateLeaveType />} />
          <Route path="/leave-type-list/edit/:leaveTypeEnc" element={<EditLeaveType />} />
          <Route path="/wfh-request-list/:pageId?" element={<WfhRequestList />} />
          <Route path="/employee-wfh-request-list/:pageId?" element={<WfhRequestListEmployee />} />
          <Route path="/leave-request-list/:pageId?" element={<LeaveRequestList />} />
          <Route path="/employee-leave-request/:pageId?" element={<EmployeeLeaveRequestList />} />
          <Route path="/employee-compensatory-leave/:pageId?" element={<CompensatoryEmployeeLeaveRequestList />} />
          <Route path="/hr-compensatory-leave/:pageId?" element={<HrCompensatoryEmployeeLeaveRequestList />} />
          <Route path="/holiday-calander/:pageId?" element={<HolidayCalanderList />} />
          <Route path="/holiday-calander/create" element={<CreateHolidayCalander />} />
          <Route path="/holiday-calander/edit/:holidayCalanderIdEnc" element={<EditHolidayCalander />} />
          <Route path="/job-post/:pageId?" element={<JobPostList />} />
          <Route path="/job-post/create" element={<CreateJobPostList />} />
          <Route path="/job-post/edit/:jobpostEnc" element={<EditJobPostList />} />
          <Route path="/event-calander/:pageId?" element={<EventCalanderList />} />
          <Route path="/event-calander/create" element={<CreateEventCalander />} />
          <Route path="/event-calander/edit/:eventCalanderEnc" element={<EditEventCalander />} />
          <Route path="/application/:pageId?" element={<ApplicationManagement />} />
          <Route path="/ready-to-onboard/:pageId?" element={<ReadyToOnboardList />} />
          <Route path="/application/create" element={<CreateApplication />} />
          <Route path="/application/edit/:applicationIdEnc" element={<EditApplication />} />
          <Route path="/interview/:pageId?" element={<InterviewList />} />
          <Route path="/employee-interview/:pageId?" element={<EmployeeInterviewList />} />
          <Route path="/interview/create" element={<CreateInterview />} />
          <Route path="/interview/edit/:interviewIdEnc" element={<EditInterview />} />
          <Route path="/timeslots/:pageId?" element={<TimeSlotList />} />
          <Route path="/timeSlots/create" element={<CreateTimeSlots />} />
          <Route path="/timeSlots/edit/:timeSlotsIdEnc" element={<UpdateTimeSlots />} />
          <Route path="/employee-attendance/:pageId?" element={<AttendanceManagment />} />
          <Route path="/all-employee-attendance/:pageId?" element={<HrAttendanceManagment />} />
          <Route path="/all-employee-attendance/manual" element={<ManualAttendanceModal />} />
          <Route path="/all-employee-attendance/manual/:attendanceId" element={<UpdateAttendance />} />
          <Route path="/all-employee-attendance-record/:pageId?" element={<AllEmployeeAttendanceRecord />} />
          <Route path="/employee-salary-list/:pageId?" element={<HrEmployeeSalaryList />} />
          <Route path="/employee-salary-list/create" element={<CreateSalaryModule />} />
          <Route path="/employee-salary-list/edit/:employeeSalaryIdEnc" element={<EditSalaryDetailsModule />} />
          <Route path="/work-type-list/:pageId?" element={<WorkTypeList />} />
          <Route path="/work-type-list/create" element={<CreateWorkType />} />
          <Route path="/work-type-list/edit/:workTypeEnc" element={<EditWorkType />} />
          <Route path="/allowances/:pageId?" element={<AllowanceList />} />
          <Route path="/allowances/create" element={<CreateAllowance />} />
          <Route path="/allowances/edit/:allowanceIdEnc" element={<UpdateAllowance />} />
          <Route path="/deductions/:pageId?" element={<DeductionsList />} />
          <Route path="/deductions/create" element={<CreateDeductions />} />
          <Route path="/deductions/edit/:deductionIdEnc" element={<UpdateDeductions />} />
          <Route path="/hrms-Settings/:pageId?" element={<HrmsSettings />} />
          <Route path="/paySlipData/:payslipIdEnc?" element={<Payslip />} />
          <Route path="/employee-paySlipData/:payslipIdEnc?" element={<EmployeePayslip />} />
          <Route path="/payroll-list/:pageId?" element={<EmployeePayrollList />} />
          <Route path="/employee-payroll/:pageId?" element={<PayrollList />} />
          <Route path="/client/:pageId?" element={<ClientManagement />} />
          <Route path="/client/create" element={<CreateClient />} />
          <Route path="/client/edit/:clientIdEnc?" element={<EditClient />} />
          <Route path="/client/clientView/:clientIdEnc?" element={<ViewClientDetail />} />
          <Route path="/client-group/:pageId?" element={<ClientGroupList />} />
          <Route path="/client-group/create" element={<CreateClientGroup />} />
          <Route path="/client-group/edit/:clientGrpIdEnc?" element={<UpdateClientGroup />} />
          <Route path="/proposal-list/:pageId?" element={<ProposalList />} />
          <Route path="/employee-proposal-list/:pageId?" element={<ProposalListEmployee />} />
          <Route path="/proposal/create" element={<CreateProposal />} />
          <Route path="/proposal/edit/:proposalIdEnc?" element={<UpdateProposal />} />
          <Route path="/client-service/:pageId?" element={<ClientServiceList />} />
          <Route path="/client-service/create" element={<CreateClientService />} />
          <Route path="/client-service/edit/:clientServiceIdEnc?" element={<UpdateClientService />} />
          <Route path="/client-news/:pageId?" element={<ClientNewsList />} />
          <Route path="/client-news/create" element={<CreateClientNews />} />
          <Route path="/client-news/edit/:clientnewsIdEnc?" element={<UpdateClientNews />} />
          <Route path="/event-list/:pageId?" element={<EventList />} />
          <Route path="/event/create" element={<CreateEvent />} />
          <Route path="/event/edit/:eventIdEnc?" element={<UpdateEvent />} />
          <Route path="/digital-sign/:pageId?" element={<DigitalSignList />} />
          <Route path="/digital-sign/create" element={<CreateDigitalSign />} />
          <Route path="/digital-sign/edit/:digitalSignIdEnc?" element={<UpdateDigitalSign />} />
          <Route path="/task-type/:pageId?" element={<TaskTypeList />} />
          <Route path="/task-type/create" element={<CreateTaskType />} />
          <Route path="/task-type/employee-task" element={<CreateEmployeeTask />} />
          <Route path="/task-type/edit/:taskTypeIdEnc?" element={<UpdateTaskType />} />
          <Route path="/task-list/:pageId?" element={<TaskList />} />
          <Route path="/task-stop/task-list/:pageId?" element={<AllTaskStopTaskList />} />
          <Route path="/completd/task-list/:pageId?" element={<AllCompletedTaskList />} />
          <Route path="/rejected/task-list/:pageId?" element={<AllTaskRejectedTaskList />} />
          <Route path="/manager-task-list/:pageId?" element={<ManagerTaskList />} />
          <Route path="/task/create" element={<CreateTask />} />
          <Route path="/task/edit/:taskIdEnc?" element={<EditTask />} />
          <Route path="/task/view/:taskIdEnc?/:mainType?" element={<ViewTaskDetails />} />
          <Route path="/employee-task-list/:pageId?" element={<EmployeeTaskList />} />
          <Route path="/email-template/:pageId?" element={<CommonEmailTemplateList />} />
          <Route path="/email-template/create" element={<CreateCommonEmail />} />
          <Route path="/email-template/edit/:emailTemplateIdEnc?" element={<EditCommonEmail />} />
          <Route path="/gst-type/:pageId?" element={<GstType />} />
          <Route path="/gst-type/create" element={<CreateGstType />} />
          <Route path="/gst-type/edit/:gstTypeIdEnc?" element={<EditGstType />} />
          <Route path="/wfhManager/:pageId?" element={<WfhManagerList />} />
          <Route path="/wfhManager/create" element={<CreateWfhManager />} />
          <Route path="/wfhManager/edit/:wfhManagerIdEnc?" element={<EditWfhManager />} />

          <Route path="/expence-head/:pageId?" element={<ExpenseHead />} />
          <Route path="/expence-head/create" element={<CreateExpenseHead />} />
          <Route path="/expence-head/edit/:expenceIdEnc?" element={<EditExpenseHead />} />
          <Route path="/office-address/:pageId?" element={<OfficeAddressList />} />
          <Route path="/office-address/create" element={<CreateOfficeAddress />} />
          <Route path="/office-address/edit/:officeAddressIdEnc?" element={<EditOfficeAddress />} />
          <Route path="/bank-account/:pageId?" element={<BankAccountList />} />
          <Route path="/bank-account/create" element={<CreateBankAccount />} />
          <Route path="/bank-account/edit/:bankAccountIdEnc?" element={<EditBankAccount />} />
          <Route path="/cashbook/:pageId?" element={<CashbookList />} />
          <Route path="/cashbook/create" element={<CreateCashbook />} />
          <Route path="/cashbook/employee/:companyIdEnc?/:branchIdEnc?/:employeeIdEnc?" element={<EmployeecashbookDetailsList />} />
          <Route path="/cashbook/listView" element={<EmployeeListViewCashbook />} />
          <Route path="/cashbook/edit/:cashbookIdEnc?" element={<Editcashbook />} />
          <Route path="/employee/cashbook/:pageId?" element={<EmployeeCashbookList />} />
          <Route path="/employee/cashbook/create" element={<EmployeeCashbookCreate />} />
          <Route path="/employee/cashbook/edit/:cashbookIdEnc?" element={<EmployeecashbookEdit />} />
          <Route path="/contra/:pageId?" element={<ContraList />} />
          <Route path="/contra/create" element={<CreateContra />} />
          <Route path="/contra/edit/:contraIdEnc?" element={<EditContra />} />
          <Route path="/visitor-category/:pageId?" element={<VisitorCategoriesList />} />
          <Route path="/visitor-category/create" element={<CreateVisitorCategories />} />
          <Route path="/visitor-category/edit/:visitorCatIdEnc?" element={<UpdateVisitorCategories />} />
          <Route path="/visitor/:pageId?" element={<VisitorList />} />
          <Route path='/manager-visitor/:pageId?' element={<ManagerofficeVisit />} />
          <Route path="/employee-visitor-list/:pageId?" element={<EmployeeVisitorList />} />
          <Route path="/visitor/create" element={<CreateVisitor />} />
          <Route path="/visitor/edit/:visitorIdEnc?" element={<UpdateVisitor />} />

          <Route path="/employe/client-visitor/:pageId?" element={<EmployeeClientVisitorList />} />
          <Route path="/client-visitor/:pageId?" element={<ClientVisitorList />} />
          <Route path='/manager-client-visitor/:pageId?' element={<ManagerClientVisit />} />
          <Route path="/client-visitor/create" element={<CreateClientVisitor />} />
          <Route path="/client-visitor/edit/:visitorIdEnc?" element={<UpdateClientVisitor />} />

          <Route path="/asset-inventry/:assetNameIdEnc/:companyIdEnc?/:branchIdEnc?" element={<AssetInventryList />} />
          <Route path="/asset-type/:pageId?" element={<AssetTypeList />} />
          <Route path="/asset-type/create" element={<CreateAssettype />} />
          <Route path="/asset-type/edit/:AssetTypeIdEnc?" element={<AssetsTypeUpdate />} />

          <Route path="/todo-type/create" element={<CreateTodoList />} />


          <Route path="/general-client-visitor/:pageId?" element={<GeneralVisitorList />} />
          <Route path="/general-client-visitor/create" element={<GeneralCreateVisitor />} />
          <Route path="/general-client-visitor/edit/:visitorIdEnc?" element={<UpdateGeneralVisitor />} />
          <Route path="/advance/:pageId?" element={<AdvanceList />} />
          <Route path="/advance/create" element={<CreateAdvance />} />
          <Route path="/advance/edit/:advanceIdEnc?" element={<EditAdvance />} />
          <Route path="/invoice/:pageId?" element={<InvoiceList />} />
          <Route path="/manager-invoice/:pageId?" element={<ManagerInvoiceList />} />
          <Route path="/viewInvoice" element={<ViewInvoice />} />
          <Route path="/invoice/create" element={<Createinvoice />} />
          <Route path="/invoice/edit/:invoiceIdEnc?" element={<EditInvoice />} />
          <Route path="/receipt/:pageId?" element={<ReceiptList />} />
          <Route path="/receipt/create" element={<CreateReceipt />} />
          <Route path="/receipt/edit/:receiptIdEnc?" element={<EditReceipt />} />
          <Route path="/expense/:pageId?" element={<ExpenseList />} />
          <Route path="/expense/create" element={<CreateExpense />} />
          <Route path="/expense/edit/:expenseIdEnc?" element={<EditExpense />} />
          <Route path="/clientExpence/:pageId?" element={<ClientExpenceList />} />
          <Route path="/clientExpence/create" element={<CreateClientExpence />} />
          <Route path="/clientExpence/edit/:clientExpenceIdEnc?" element={<EditClientExpence />} />
          <Route path="/notification/:pageId?" element={<NotificationList />} />
          <Route path="/notification/create" element={<CreateNotification />} />
          <Route path="/notification/edit/:advanceIdEnc?" element={<EditNotification />} />
          <Route path="/vendor-list/:pageId?" element={<VendorList />} />
          <Route path="/vendor/create" element={<CreateVendor />} />
          <Route path="/vendor/edit/:vendorIdEnc?" element={<UpdateVendor />} />
          <Route path="/purchase-expence/:pageId?" element={<PurchaseandexpenceList />} />
          <Route path="/purchase-expence/create" element={<Createpurchaseandexpence />} />
          <Route path="/purchase-expence/edit/:purchaseexpenceIdEnc?" element={<Editpurchaseandexpence />} />
          <Route path="/vendoremployeeAdvance/:pageId?" element={<VendoremployeeAdvanceList />} />
          <Route path="/vendoremployeeAdvance/create" element={<CreateVendorAdvance />} />
          {/* <Route path="/vendoremployeeAdvance/edit/:vendoremployeeAdvanceIdEnc?" element={<EditVendorAdvance />} /> */}
          <Route path="/payment/:pageId?" element={<PaymentList />} />
          <Route path="/payment/edit/:paymentIdEnc?" element={<EditPayment />} />
          <Route path="/payment/view/:paymentIdEnc?" element={<ViewPayment />} />
          <Route path="/interview-round-list/:pageId?" element={<InterviewRoundList />} />
          <Route path="/interview-round-list/create" element={<CreateInterviewRound />} />
          <Route path="/interview-round-list/edit/:interviewroundnameIdEnc?" element={<EditInterviewRound />} />
          <Route path="/bankname/:pageId?" element={<BankNameList />} />
          <Route path="/bankname/create" element={<CreateBankName />} />
          <Route path="/bankname/edit/:banknameIdEnc" element={<EditBankName />} />
          <Route path="/policy/:pageId?" element={<PolicyList />} />
          <Route path="/policy/create" element={<CreatePolicy />} />
          <Route path="/policy/edit/:policyIdEnc" element={<EditPolicy />} />
          <Route path="/penalty/:pageId?" element={<PenaltyList />} />
          <Route path="/penalty/create" element={<CreatePenalty />} />
          <Route path="/penalty/edit/:penaltyIdEnc" element={<EditPenalty />} />
          <Route path="/resignation/:pageId?" element={<ResignationList />} />
          <Route path="/resignation/create" element={<CreateResignation />} />
          <Route path="/resignation/edit/:resignIdEnc" element={<EditResignation />} />
          <Route path="/termination/:pageId?" element={<TerminationList />} />
          <Route path="/termination/create" element={<CreateTermination />} />
          <Route path="/termination/edit/:terminationIdEnc" element={<EditTermination />} />
          <Route path="/employee-resignation/:pageId?" element={<EmployeeResignationList />} />
          <Route path="/employee-resignation/create" element={<CreateEmployeeResignation />} />
          <Route path="/employee-resignation/edit/:resignIdEnc" element={<EditResignation />} />
          <Route path="/employee-penalties/:pageId?" element={<EmployeePenalty />} />
          <Route path="/employee-penalty/:pageId?" element={<EmployeePenaltie />} />
          <Route path="/employee-penalty/create" element={<CreateEmployeePenaltie />} />
          <Route path="/employee-penalty/edit/:penaltyIdEnc" element={<EditEmployeePenaltie />} />
          <Route path="/employee-attendance-report/:pageId?" element={<EmployeeAttendanceReport />} />
          <Route path="/leave-request-report/:pageId?" element={<LeaveRequestReport />} />
          <Route path="/employe-report/:pageId?" element={<EmployeReport />} />
          <Route path="/employe-epbx-report/:pageId?" element={<EmployeEPBXReports />} />
          <Route path="/employe-penalty-report/:pageId?" element={<EmployePenaltyReport />} />
          <Route path="/employe-performance-report/:pageId?" element={<EmployePerformanceReport />} />
          <Route path="/recruitment-onboarding-report/:pageId?" element={<RecruitmentOnboardingReport />} />
          <Route path="/employe-salary-report/:pageId?" element={<EmployeeSalaryReport />} />
          <Route path="/employe-appraisal-report/:pageId?" element={<EmployeeAppraisalReport />} />
          {/* <Route path="/employe-attendance-summary-report/:pageId?" element={<EmployeeAttendanceSummaryReport />} /> */}
          <Route path="/standardPayroll/:pageId?" element={<StandardPayrollList />} />
          <Route path="/standardPayroll/create" element={<CreateStandardPayroll />} />
          <Route path="/standardPayroll/edit/:standardPayrollIdEnc" element={<UpdateStandardPayroll />} />
          <Route path="/standardPayroll/view/:standardPayrollIdEnc" element={<ViewStandardpayroll />} />
          <Route path="/client-report/:pageId?" element={<ClientReport />} />
          <Route path="/client-ledger/:pageId?" element={<ClientLedger />} />
          <Route path="/digital-signature-report/:pageId?" element={<DigitalSignatureReport />} />
          <Route path="/task-status-report/:pageId?" element={<TaskStatusReport />} />
          <Route path="/pending-invoice-report/:pageId?" element={<PendingInvoiceReport />} />
          <Route path="/running-task-report/:pageId?" element={<RunningTaskReport />} />
          <Route path="/digital-sign-type/:pageId?" element={<DigitalSignatureTypeList />} />
          <Route path="/digital-sign-type/create" element={<CreateDigitalSignatureType />} />
          <Route path="/digital-sign-type/edit/:digitalSignIdEnc?" element={<UpdateDigitalSignatureType />} />
          <Route path="/company-prefix/:pageId" element={<CompanyPrefixSetting />} />
          <Route path="/admin-prefix" element={<AdminPrefixSetting />} />
          <Route path="/client-document/:pageId" element={<ClientDocument />} />
          <Route path="/visit-reason/:pageId?" element={<VisitReasonList />} />
          <Route path="/visit-reason/create" element={<CreateVisitReason />} />
          <Route path="/visit-reason/edit/:visitReasonIdEnc?" element={<EditVisitReason />} />
          <Route path="/support-list/:pageId?" element={<SupportModalList />} />
          <Route path="/employee-termination/:pageId?" element={<EmployeeTerminationList />} />
          <Route path="/hrms-employeeattendence-summary-report/:pageId?" element={<EmployeeAttendenceSummaryReport />} />
          <Route path="/overall-task-report/:pageId?" element={<AllTaskReport />} />
          <Route path="/last-update-task-report/:pageId?" element={<LastTaskUpdationReport />} />
          <Route path="/task-rating-report/:pageId?" element={<TaskRatingReport />} />
          <Route path="/working-hour-taskreport/:pageId?" element={<WorkingHourTaskReport />} />
          <Route path="/overdue-task-report/:pageId?" element={<OverDueTaskReport />} />
          <Route path="/stop-task-report/:pageId?" element={<StoppedTaskReport />} />
          <Route path="/financial-task-report/:pageId?" element={<FinancialTaskReport />} />
          <Route path="/employee-monthly-summary-report/:pageId?" element={<EmployeeMonthlySummaryReport />} />
          <Route path="/client-service-report/:pageId?" element={<ClientServiceReport />} />
          <Route path="/client-index-report/:pageId?" element={<ClientIndexReport />} />
          <Route path="/client-digital-signature-report/:pageId?" element={<ClientDigitalSignationReport />} />
          <Route path="/client-ownerdetails-report/:pageId?" element={<ClientOwnerDetailsReport />} />
          <Route path="/client-allclient-report/:pageId?" element={<AllClientReport />} />
          <Route path="/client-ledger-report/:pageId?" element={<ClientLedgerReport />} />
          <Route path="/client-groupledger-report/:pageId?" element={<ClientGroupLedgerReport />} />
          <Route path="/client-statement-report/:ledgerId?" element={<ClientStatementReport />} />
          <Route path="/client-groupstatement-report/:ledgerId?/:openingBalance?" element={<ClientGroupStatementReport />} />
          <Route path="/client-growthrevenue-report/:pageId?" element={<ClientGrowthRevenueReport />} />
          <Route path="/client-billing-payment-report/:pageId?" element={<ClientBillingPaymentTracking />} />
          <Route path="/finance-gst-return-sales-report/:pageId?" element={<FinanceInvoiceGstReturnSalesReport />} />
          <Route path="/finance-gst-return-purchase-report/:pageId?" element={<FinanceInvoiceGstReturnPurchaseReport />} />
          <Route path="/finance-reciept-report/:pageId?" element={<FinanceRecieptReport />} />
          <Route path="/finance-cashbookDetails-report/:pageId?" element={<CashbookDetailsReport />} />
          <Route path="/finance-clientInvoice-report/:pageId?" element={<ClientInvoiceReport />} />
          <Route path="/finance-vendorInvoice-advance-report/:pageId?" element={<VendorAdvanceReport />} />
          <Route path="/finance-payment-report/:pageId?" element={<FinancePaymentReport />} />
          <Route path="/finance-advance-report/:pageId?" element={<FinanceAdvanceReport />} />
          <Route path="/finance-advance-summary-report/:id?" element={<FinanceAdvanceSummaryReport />} />
          <Route path="/finance-vendor-invoice-report/:id?" element={<VendorInvoiceReport />} />
          <Route path="/finance-bank-statement-report/:id?" element={<BankStatementReport />} />
          <Route path="/finance-bank-statement-Summary-report/:bankId?" element={<BankStatementSummayReport />} />
          <Route path="/finance-profit-loss-report/:pageId?/:EndDate?/:branchId?" element={<FinanceProfitandLossReport />} />
          <Route path="/finance-balance-sheet-report/:pageId?" element={<BalanceSheetReport />} />
          <Route path="/finance-employee-advance-ledger/:pageId?" element={<EmployeeLedgerList />} />
          <Route path="/finance-employee-advance-ledger/create" element={<CreateEmployeLedger />} />
          <Route path="/finance-invoice-summmary-statuswise/:pageId?" element={<InvoiceStatusWiseSummary />} />
          <Route path="/leave-request-summary-report/:pageId?" element={<LeaveRequestSummaryReport />} />








          {/* presales management  */}
          <Route path="/lead-management/:pageId?" element={<LeadManagement />} />
          <Route path="/employee-lead-management/:pageId?" element={<EmployeeLeadManagement />} />
          <Route path="/lead-management/create" element={<GenrateLeads />} />
          <Route path="/lead-management/edit/:leadIdEnc" element={<EditLeads />} />
          <Route path="/lead-management/view/:leadIdEnc" element={<ViewLeads />} />
          <Route path="/lead-category/:pageId?" element={<LeadsManagementCategory />} />
          <Route path="/lead-category/create" element={<CreateLeadsManagementCategory />} />
          <Route path="/lead-category/edit/:leadCategoryIdEnc" element={<EditLeadsManagementCategory />} />
          <Route path="/lead-transfer-list/:pageId?" element={<LeadTransferList />} />
          <Route path="/lead-Reports-data/:pageId?" element={<LeadsReports />} />



          {/* VigoTaskManagement */}
          <Route path="/task-mangement-system/:pageId?" element={<VigoTaskManagement />} />
          <Route path="/task-mangement-approval/:pageId?" element={<VigoTaskApproval />} />

          {/* Server Management */}

          <Route path="/server-management/:pageId?" element={<ServerList />} />
          <Route path="/server-management/create" element={<CreateServer />} />
          <Route path="/server-management/update/:id?" element={<UpdateServerList />} />



          {/* project management    */}

          <Route path="/projects-services/:pageId?" element={<ProjectServices />} />
          <Route path="/projects-services/create" element={<CreateProjectservice />} />
          <Route path="/projects-services/edit/:projectservicedEnc?" element={<EditProjectservice />} />

          <Route path="/projects-category/:pageId?" element={<ProjectCategory />} />
          <Route path="/projects-category/create" element={<CreateProjectCategory />} />
          <Route path="/projects-category/edit/:projectcategorydEnc?" element={<EditprojectCategory />} />

          <Route path="/project-management/:pageId?" element={<Projectmanagement />} />
          <Route path="/project-management/create" element={<Createprojectmanagement />} />
          <Route path="/project-management/edit/:projectIdEnc?" element={<Editprojectmanagement />} />
          <Route path="/project-management-dashboard/:projectIdEnc?" element={<ProjectDashboard />} />




          {/* account management */}
          <Route path="/accountant-management/:pageId?" element={<AccountantList />} />
          <Route path="/accountant-management/create" element={<CreateAccountant />} />
          <Route path="/accountant-management/edit/:accountantIdEnc" element={<EditAccountant />} />
          <Route path="/accountant-management/report/:accountantIdEnc" element={<AccountentStatementReport />} />
          <Route path="/project-invoicing/:element?" element={<ProjectInvoicingList />} />
          <Route path="/project-invoice/create" element={<CreateInvoiceProject />} />
          <Route path="/project-invoice/view/:projectInvoiceIdEnc" element={<ProjectInvoiceView />} />



          {/* fund transfer */}
          <Route path="/fund-transfer/:pageId?" element={<FundTransfer />} />
          <Route path="/fund-transfer/create" element={<CreateFundTransfer />} />
          <Route path="/fund-transfer/edit/:fundTransferIdEnc" element={<EditFundTransfer />} />

          {/* project purchase and expence */}
          <Route path="/project-purchase-and-expence/:pageId?" element={<ProjectPurchaseandexpenceList />} />
          <Route path="/project-purchase-and-expence/create" element={<CreateProjectPurchaseandexpence />} />


          {/* vigovendor */}
          <Route path="/project-vendor/:pageId?" element={<VigoVendorList />} />
          <Route path="/project-vendor/create" element={<CreateVigoVendor />} />
          <Route path="/project-vendor/edit/:vendorIdEnc" element={<UpdateVigoVendor />} />


          {/* project task */}
          <Route path="/project-task-Dashboard/:pageId?" element={<ProjectTaskDashboard />} />
          <Route path="/project-task/:pageId?" element={<ProjectTaskList />} />
          <Route path="/manager-project-task/:pageId?" element={<ManagerProjectTaskList />} />
          <Route path="/employee-project-task/:pageId?" element={<EmployeeProjectTaskList />} />






        </Routes>
      </Suspense>

    </>
  );
}
export default Layout;

