import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { updateClientFunc, updateService } from "./clientFeatures/_client_reducers";
import { deptSearch } from "../../department/departmentFeatures/_department_reducers";

function ServicesDetails({ clientData, fetchData }) {
    const dispatch = useDispatch();
    const [selectedEmployees, setSelectedEmployees] = useState([]); // State to track selected employees

    const {
        register,
        control,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            ServicesDetails: [{ serviceId: "", number: "" }],
        },
    });

    useEffect(() => {
 
        dispatch(deptSearch({
            companyId: clientData?.data?.companyId,
            branchId: clientData?.data?.branchId,
            directorId: "",
            text: "",
            sort: true,
            status: true,
            isPagination: false,
        }));
    }, [dispatch, clientData]);

    const { departmentListData } = useSelector((state) => state.department);

    const handleSelectEmployee = (employeeId) => {
        setSelectedEmployees((prevSelected) =>
            prevSelected.includes(employeeId)
                ? prevSelected.filter((id) => id !== employeeId)
                : [...prevSelected, employeeId]
        );
    };

    const onSubmit = () => {

        const finalPayload = {
            ...clientData?.data,
            departmentIds : selectedEmployees
        };

        dispatch(updateClientFunc(finalPayload)).then((res) => {
            if (!res?.error) {
                fetchData();
            }
        });
    };

    useEffect(() => {
        const selectedData = clientData?.data?.departmentIds || []; 
        setSelectedEmployees([...selectedData]); 
    }, [clientData]);
    return (
        <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex gap-2 justify-between items-center my-2">
                <div className="bg-white shadow-sm w-full overflow-x-auto mt-1 rounded-xl">
                    <table className="w-full max-w-full rounded-xl overflow-auto">
                        <thead>
                            <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]">
                                <th className="border-none p-2 whitespace-nowrap max-w-[5%]">
                                    <input
                                        type="checkbox"
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedEmployees(departmentListData.map((emp) => emp?._id));
                                            } else {
                                                setSelectedEmployees([]);
                                            }
                                        }}
                                    />
                                </th>
                                <th className="border-none p-2 whitespace-nowrap">Department Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departmentListData && departmentListData.length > 0 ? (
                                departmentListData.map((element, index) => (
                                    <tr
                                        key={element._id}
                                        className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                                            } border-[#DDDDDD] text-[#374151] text-[14px]`}
                                    >
                                        <td className="whitespace-nowrap border-none p-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedEmployees.includes(element._id)}
                                                onChange={() => handleSelectEmployee(element._id)}
                                            />
                                        </td>
                                        <td className="whitespace-nowrap border-none p-2">{element?.name}</td>

                                    </tr>
                                ))
                            ) : (
                                <tr className="bg-white bg-opacity-5">
                                    <td
                                        colSpan={9}
                                        className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                                    >
                                        Record Not Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
            <button type="submit" className="bg-header px-2 py-2 text-sm rounded-md text-white">
                Submit
            </button>
        </form>
    );
}

export default ServicesDetails;
