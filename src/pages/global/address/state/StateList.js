import { useNavigate } from "react-router-dom"
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { encrypt } from "../../../../config/Encryption"
import { FaPenToSquare, FaPlus } from "react-icons/fa6"
import { RiDeleteBin5Line } from "react-icons/ri";
import { Controller, useForm, useWatch } from "react-hook-form";
import { FaAngleDown } from "react-icons/fa";
import { HiOutlineFilter } from "react-icons/hi";
import { countrySearch, getCountryListFunc } from "../country/CountryFeatures/_country_reducers"
import { deleteStateFunc, getStateList, stateSearch } from "./featureStates/_state_reducers"
import Loader from "../../../../global_layouts/Loader/Loader"
import CustomPagination from "../../../../component/CustomPagination/CustomPagination"
import { Select, Tooltip } from "antd"
import { inputAntdSelectClassNameFilter, inputClassName, sortByPropertyAlphabetically } from "../../../../constents/global"
import usePermissions from "../../../../config/usePermissions"
import Loader2 from "../../../../global_layouts/Loader/Loader2"
import dayjs from "dayjs"
import ListLoader from "../../../../global_layouts/ListLoader"

function StateList() {
    const { register, setValue, control, formState: { errors } } = useForm();

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { stateListData, totalStateCount, loading } = useSelector(state => state.states)
    // const [status, setStatus] = useState("");
    const { countryListData, loading: countrySearchLoading } = useSelector(state => state.country)
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const CountryId = useWatch({
        control,
        name: "PDCountryId",
        defaultValue: "",
    });

    const status = useWatch({
        control,
        name: "status",
        defaultValue: "",
    });

    const onPaginationChange = (page) => {
        setCurrentPage(page);
    };

    const limit = 10;


    const filters = [CountryId, status, searchText].join("-");
    const [isFirstRender ,setisFirstRender] = useState(false)
    
    useEffect(() => {
        if (!isFirstRender) {
          setisFirstRender(state=>true);
          return;
        }
        if (currentPage === 1) {
          fetchStateList();
        } else {
          setCurrentPage(1);
        }
      }, [filters]);

    
    useEffect(() => {
        fetchStateList();
    }, [currentPage]);

    const fetchStateList = () => {
        const reqData = {
            page: currentPage,
            limit: limit,
            reqPayload: {
                text: searchText,
                sort: true,
                status: status,
                isPagination: true,
                countryId: CountryId
            }
        };
        dispatch(getStateList(reqData));
    };


    const handleDelete = (id) => {
        let reqData = {
            _id: id
        }
        Swal.fire({
            title: "Warning",
            text: "Are you sure you want to delete!",
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "No",
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteStateFunc(reqData)).then((data) => {
                    if (!data?.error) {
                        // fetchStateList();
                        if (currentPage > 1 && stateListData?.docs?.length == 1) {
                            setCurrentPage(Number(currentPage - 1));

                        } else {
                            fetchStateList();
                        }

                    }
                })
            }
        });

    };

    const handleFocusCountry = () => {
        if (!countryListData?.docs?.length) {
            dispatch(
                countrySearch({
                    isPagination: false,
                    text: "",
                    sort: true,
                    status: true,
                })
            );
        }
    };

    const onChange = (e) => {
        // 
        setSearchText(e);
    };
    const { canCreate, canRead, canUpdate, canDelete } = usePermissions();
    return (
        <GlobalLayout onChange={onChange}>
           
            <div className="w-full">
                <div className='xl:flex justify-between items-center lg:space-y-0 space-y-2 py-1'>
                    <div className="grid grid-cols-1 sm:grid-cols-3 md:flex md:gap-3 gap-1.5">
                        <div className="">
                            <Controller
                                name="PDCountryId"
                                control={control}
                                rules={{ required: "Country is required" }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        className={` ${inputAntdSelectClassNameFilter} `}
                                        showSearch
                                        filterOption={(input, option) =>
                                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                                        }
                                        placeholder="Country Name"
                                        onFocus={handleFocusCountry}
                                    >
                                        <Select.Option value="">Select Country</Select.Option>
                                        {countrySearchLoading ? (
                                            <Select.Option disabled>
                                                <ListLoader />
                                            </Select.Option>
                                        ) : (
                                            sortByPropertyAlphabetically(countryListData?.docs)?.map((type) => (
                                                <Select.Option key={type?._id} value={type?._id}>
                                                    {type?.name}
                                                </Select.Option>
                                            ))
                                        )}
                                    </Select>
                                )}
                            />
                        </div>
                        {/* <Select
                                className={` ${inputAntdSelectClassNameFilter} `}
                                value={status}
                                onChange={(e) => {
                                    setStatus(e);
                                }}
                                placeholder="Select Status"
                                showSearch
                                filterOption={(input, option) =>
                                    String(option?.children).toLowerCase().includes(input.toLowerCase())
                                }                            >
                                <Select.Option value="">Select Status</Select.Option>
                                <Select.Option value={true}>{"Active"}</Select.Option>
                                <Select.Option value={false}>{"InActive"}</Select.Option>
                            </Select> */}
                        <div className="">
                            <Controller
                                name="status"
                                control={control}
                                rules={{}}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        className={` w-32 ${inputAntdSelectClassNameFilter} ${errors.status
                                            ? "border-[1px] "
                                            : "border-gray-300"
                                            }`}
                                        placeholder="Select Status"
                                        showSearch
                                        filterOption={(input, option) =>
                                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                                        }
                                    >
                                        <Select.Option value="">Select Status</Select.Option>
                                        <Select.Option value={true}> Active </Select.Option>
                                        <Select.Option value={false}> InActive </Select.Option>
                                    </Select>
                                )}
                            />
                        </div>
                        <button
                            onClick={() => {
                                setValue("PDCountryId", "");
                                setValue("status", "");
                            }}
                            className="bg-header  py-1 w-24 mt-1 rounded-md md:flex hidden justify-center items-center  text-white"
                        >
                            <span className="text-[12px]">Reset</span>
                        </button>
                    </div>
                    <div className="flex justify-end items-center gap-2">
                        <button
                            onClick={() => {
                                setValue("PDCountryId", "");
                                setValue("status", "");
                            }}
                            className="bg-header  py-1.5 rounded-md md:hidden flex px-10 justify-center items-center  text-white"
                        >
                            <span className="text-[12px]">Reset</span>
                        </button>
                        {(canCreate && canRead) &&
                            <Tooltip placement="topLeft"  title='Add State'>
                                <button onClick={() => { navigate("/admin/state/create") }} className='bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white'>
                                    <FaPlus />
                                    <span className='text-[12px]'>Add State</span>
                                </button>
                            </Tooltip>}
                    </div>
                </div>
            </div>
            <div className="w-full">
                <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
                    {canRead && <table className="w-full max-w-full  overflow-x-auto ">
                        <thead className=''>
                            <tr className='border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-[#074173] text-white font-[500] h-[40px]'>
                                <th className='border-none p-2 whitespace-nowrap w-[10%]'>  S.no. </th>
                                <th className='border-none p-2 whitespace-nowrap'>Country </th>
                                <th className='border-none p-2 whitespace-nowrap'>State</th>
                                <th className='border-none p-2 whitespace-nowrap'>State Code </th>
                                <th className='border-none p-2 whitespace-nowrap'>createdAt </th>
                                <th className='border-none p-2 whitespace-nowrap'>createdBy </th>
                                <th className='border-none p-2 whitespace-nowrap'>Status</th>
                                {(canDelete || canUpdate) && <th className='border-none p-2 whitespace-nowrap w-[10%]'> Action</th>}
                            </tr>
                        </thead>

                        {loading ? <tr className="bg-white bg-opacity-5 ">
                            <td
                                colSpan={10}
                                className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                            >
                                <Loader2 />
                            </td>
                        </tr> :
                            <tbody>
                                {stateListData && stateListData?.docs && stateListData?.docs.length > 0 ?
                                    stateListData?.docs.map((element, index) => (
                                        <tr key={index} className={`${index % 2 === 0 ? 'bg-[#e9ecef]/80' : 'bg-white'}  border-b-[1px] border-[#DDDDDD] text-[#374151] text-[14px]`}>
                                            <td className='whitespace-nowrap border-none p-2 '>
                                                {index + 1 + ((currentPage - 1) * limit)}
                                            </td>
                                            <td className='whitespace-nowrap border-none p-2 '>{element?.countryName ?? "-"}</td>
                                            <td className='whitespace-nowrap border-none p-2 '>{`${element?.name} ` ?? "-"}</td>
                                            <td className='whitespace-nowrap border-none p-2 '>{`${element?.stateCode} ` ?? "-"}</td>
                                            <td className='whitespace-nowrap border-none p-2 '>{`${dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a')} ` ?? "-"}</td>
                                            <td className='whitespace-nowrap border-none p-2 '>{`${element?.createdBy} ` ?? "-"}</td>

                                            <td className='whitespace-nowrap border-none p-2 '>
                                                <span
                                                    className={`${element?.status ? 'bg-[#E0FFBE] border-green-500' : 'bg-red-200 border-red-500 '
                                                        } border-[1px] px-2 py-1.5 rounded-lg text-black text-[12px]`}>
                                                    {element?.status ? 'Active' : 'Inactive' ?? "-"}
                                                </span>
                                            </td>
                                            {(canDelete || canUpdate) && <td className='whitespace-nowrap border-none p-2'>
                                                <span className="py-1.5 flex justify-start items-center space-x-2">
                                                    {canUpdate && <Tooltip placement="topLeft"  title='Edit'>
                                                        <button onClick={() => { navigate(`/admin/state/edit/${encrypt(element?._id)}`) }} className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted" type="button">
                                                            <FaPenToSquare className=' hover:text-[#337ab7] text-[#3c8dbc]' size={16} />
                                                        </button>
                                                    </Tooltip>}
                                                    {canDelete && <Tooltip placement="topLeft"  title='Delete'>
                                                        <button onClick={() => handleDelete(element?._id)} className="px-2 py-1.5 rounded-md bg-transparent border border-muted" type="button">
                                                            <RiDeleteBin5Line className='text-red-600 hover:text-red-500' size={16} />
                                                        </button>
                                                    </Tooltip>}
                                                </span>
                                            </td>}
                                        </tr>
                                    ))
                                    : (<tr className="bg-white bg-opacity-5 " >
                                        <td colSpan={8} className="px-6 py-2.5 whitespace-nowrap text-center font-[600] text-sm text-gray-500">Record Not Found</td>
                                    </tr>)}
                            </tbody>}

                    </table>}
                </div>
                {totalStateCount > limit && (
                    <CustomPagination
                        totalCount={totalStateCount}
                        pageSize={limit}
                        currentPage={currentPage}
                        onChange={onPaginationChange}
                    />)}
            </div>
        </GlobalLayout>
    )
}

export default StateList
