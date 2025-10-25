import React, { useState } from 'react';
import GlobalLayout from '../../../global_layouts/GlobalLayout/GlobalLayout';
import EmployeLedgerList from './VendorEmployeLedger';
import Employeepayment from '../payment/Employeepayment';
import { useSearchParams } from 'react-router-dom';

const EmployeeLedgerAndAdvance = () => {
   
         const [searchParams, setSearchParams] = useSearchParams();
    const pageFilter = searchParams.get("paging") || 'approval';
     const [activeView, setActiveView] = useState(pageFilter);
    const [searchText, setSearchText] = useState("");
    const onChange = (e) => {
        setSearchText(e);
    };
    const handleToggle = (view) => {
        setActiveView(view);
    };
    return (
        <GlobalLayout onChange={onChange}>
            <div className="flex justify-start items-center my-1">
                <button
                    className={`px-3 py-2 border flex justify-center items-center space-x-2 rounded-l-md ${activeView === "approval"
                        ? "bg-header border-header text-white"
                        : "bg-white border-gray-300 text-black"
                        }`}
                    onClick={() => handleToggle("approval")}
                >
                    <span className="text-[12px]">Advance List</span>
                </button>

                <button
                    className={`px-3 py-2 border flex justify-center items-center space-x-2 rounded-r-md ${activeView === "employee"
                        ? "bg-header border-header text-white"
                        : "bg-white border-gray-300 text-black"
                        }`}
                    onClick={() => handleToggle("employee")}
                >
                    <span className="text-[12px]">Employee Settlement</span>
                </button>
            </div>
            {activeView === 'approval' && <EmployeLedgerList searchText={searchText} setSearchText={setSearchText} />}
            {activeView === 'employee' && <Employeepayment searchText={searchText} setSearchText={setSearchText} />}

        </GlobalLayout>
    );
};

export default EmployeeLedgerAndAdvance;