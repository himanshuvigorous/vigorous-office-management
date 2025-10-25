import { useNavigate } from "react-router-dom";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { encrypt } from "../../../../config/Encryption";
import { FaPenToSquare, FaPlus } from "react-icons/fa6";
import Loader from "../../../../global_layouts/Loader/Loader";
import { Controller, useForm, useWatch } from "react-hook-form";
import { RiDeleteBin5Line } from "react-icons/ri";
import { deleteCountryFunc, getCountryListFunc } from "./CountryFeatures/_country_reducers";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";
import { Select, Tooltip } from "antd";
import { inputAntdSelectClassNameFilter } from "../../../../constents/global";
import usePermissions from "../../../../config/usePermissions";
import Loader2 from "../../../../global_layouts/Loader/Loader2";
import dayjs from "dayjs";

function Country() {
  const { register, setValue, control, formState: { errors } } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { countryListData, totalCountryCount, loading } = useSelector((state) => state.country);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
 

  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };

  const status = useWatch({
    control,
    name: "status",
    defaultValue: "",
  });

  const limit = 10;

  const filters = [status, searchText].join("-");
  const [isFirstRender ,setisFirstRender] = useState(false)
  
    useEffect(() => {
      if (!isFirstRender) {
        setisFirstRender(state=>true);
        return;
      }
      if (currentPage === 1) {
        fetchCountryList();
      } else {
        setCurrentPage(1);
      }
    }, [filters]);

  useEffect(() => {
    fetchCountryList();
  }, [currentPage]);

  const fetchCountryList = () => {
    const countryReqData = {
      page: currentPage,
      limit: limit,
      reqPayload: {
        text: searchText,
        sort: true,
        status: status,
        isPagination: true,
      }
    };
    dispatch(getCountryListFunc(countryReqData));
  };

  const onChange = (e) => {
    
    setSearchText(e);
  };

  const handleDelete = (id) => {
    let reqData = {
      _id: id,
    };
    Swal.fire({
      title: "Warning",
      text: "Are you sure you want to delete! This will delete all states and cities as well",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteCountryFunc(reqData)).then((data) => {
          if (!data?.error) {
          
             if (currentPage > 1 && countryListData?.docs?.length==1) {
            setCurrentPage(Number(currentPage-1));  
             
          }else {
        fetchCountryList();    
          } 
          }
        });
      }
    });
  };
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();
  return (
    <GlobalLayout onChange={onChange}>

      <section>
        <div className='sm:flex justify-between items-center md:space-y-0 space-y-2 py-1'>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-3">
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
           
            <button
              onClick={() => {
                setValue("status", "");
              }}
              className="bg-header  py-1 w-24 mt-1 rounded-md sm:flex hidden justify-center items-center  text-white"
            >
              <span className="text-[12px]">Reset</span>
            </button>
          </div>
          <div className="flex justify-end items-center gap-2">
            <button
              onClick={() => {
                setValue("status", "");
              }}
              className="bg-header  py-1.5 rounded-md sm:hidden flex px-10 justify-center items-center  text-white"
            >
              <span className="text-[12px]">Reset</span>
            </button>
            {canCreate &&
              <Tooltip placement="topLeft"  title='Add Country'>
                <button onClick={() => { navigate("/admin/country/create") }}
                  className='bg-header px-2 py-1.5 rounded-md flex justify-center whitespace-nowrap items-center space-x-2 text-white'>
                  <FaPlus />
                  <span className='text-[12px]'>Add Country</span>
                </button>
              </Tooltip>}
          </div>
        </div>
        <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
          {canRead && <table className="w-full max-w-full rounded-xl overflow-x-auto ">
            <thead className="">
              <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-[#074173] text-white font-[500] h-[40px]">
                <th className="border-none p-2 whitespace-nowrap w-[10%]">S.No.</th>
                <th className="border-none p-2 whitespace-nowrap">Flag</th>
                <th className="border-none p-2 whitespace-nowrap">Country</th>
                <th className="border-none p-2 whitespace-nowrap">Country Code </th>
                <th className="border-none p-2 whitespace-nowrap">Country Mob. Code</th>
                <th className="border-none p-2 whitespace-nowrap">Created At</th>
              
                <th className="border-none p-2 whitespace-nowrap">Status</th>
                {(canUpdate || canDelete) && <th className="border-none p-2 whitespace-nowrap w-[10%]">Action</th>}
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
                {countryListData && countryListData?.docs && countryListData?.docs?.length > 0 ? (
                  countryListData?.docs?.map((element, index) => (
                    <tr key={index} className={`border-b-[1px] border-[#DDDDDD] capitalize text-[#374151] text-[14px] ${index % 2 === 0 ? 'bg-[#e9ecef]/80' : 'bg-white'}`}>
                      <td className="whitespace-nowrap border-none p-2 ">
                        {index + 1 + ((currentPage - 1) * limit)}
                      </td>
                      <td className="whitespace-nowrap border-none p-2 ">
                        <img alt="country flag"
                          src={element.flag}
                          className="rounded min-w-12 min-h-8 w-12 h-8 ring-1 ring-black-300"
                        />
                      </td>
                      <td className="whitespace-nowrap border-none p-2 ">{`${element?.name} ` ?? "-"}</td>
                      <td className="whitespace-nowrap border-none p-2 "> {`${element?.countryCode}`}</td>
                      <td className="whitespace-nowrap border-none p-2 ">{`${element?.countryMobileNumberCode}` ?? "-"}</td>
                      <td className="whitespace-nowrap border-none p-2 ">{`${dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a')} ` ?? "-"}</td>
                     
                      <td className='whitespace-nowrap border-none p-2 '>
                        <span
                          className={`${element?.status
                            ? "bg-[#E0FFBE] border-green-500"
                            : "bg-red-200 border-red-500"
                            } border-[1px] px-2 py-1.5 rounded-lg text-black text-[12px]`}
                        >
                          {element?.status ? "Active" : "Inactive" ?? "-"}
                        </span>
                      </td>
                      {(canUpdate || canDelete) && <td className="whitespace-nowrap border-none p-2">
                        <span className="py-1.5 flex justify-start items-center space-x-2">
                          {canUpdate && <Tooltip placement="topLeft"  title='Edit'>
                            <button onClick={() => { navigate(`/admin/country/edit/${encrypt(element?._id)}`); }}
                              className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted" type="button">
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
                ) : (
                  <tr className="bg-white bg-opacity-5 ">
                    <td colSpan={6} className="px-6 py-2 whitespace-nowrap font-[600] text-center text-sm text-gray-500">
                      Record Not Found
                    </td>
                  </tr>
                )}
              </tbody>}
          </table>}
        </div>
        {totalCountryCount > limit && (
          <CustomPagination
            totalCount={totalCountryCount}
            pageSize={limit}
            currentPage={currentPage}
            onChange={onPaginationChange}
          />)}
      </section>

    </GlobalLayout>
  );
}
export default Country;