import { useNavigate } from "react-router-dom";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { encrypt } from "../../../../config/Encryption";
import { FaPenToSquare, FaPlus } from "react-icons/fa6";
import Loader from "../../../../global_layouts/Loader/Loader";
import { FaAngleDown, FaEye } from "react-icons/fa";
import { HiOutlineFilter } from "react-icons/hi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { deleteDynamicPage, getDynamicPageList } from "./DynamicPageFeatures/dynamic_page_reducers";

function DynamicPageList() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pageListData, loading } = useSelector((state) => state.dynamicPage);

  useEffect(() => {
    getPageList();
  }, []);

  const getPageList = () => {
    const reqData = {
      limit: 20,
      page: 1,
      reqPayload: {
        "text": "",
        "sort": true,
        "status": true
      }
    };
    dispatch(getDynamicPageList(reqData));
  }

  const handleDelete = (id) => {
    let reqData = {
      _id: id,
    };
    Swal.fire({
      title: "Warning",
      text: "Are you sure you want to delete!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteDynamicPage(reqData)).then((data) => {
          getPageList();
        });
      }
    });
  };

  return (
    <GlobalLayout>
      {loading ? (
        <Loader />
      ) : (
        <section>
          <div className="sm:flex justify-between items-center md:space-y-0 space-y-2 py-1">
            <div className="sm:flex justify-start items-center sm:space-x-2 space-x-0 sm:space-y-0 space-y-2">
              <div className="flex justify-center items-center space-x-2 bg-white p-2 text-[14px] rounded-md">
                <HiOutlineFilter />
                <span>Page</span>
                <FaAngleDown />
              </div>
              <div className="flex justify-center items-center space-x-2 bg-white p-2 text-[14px] rounded-md">
                <HiOutlineFilter />
                <span>slug</span>
                <FaAngleDown />
              </div>
            </div>
            <button
              onClick={() => {
                navigate("/admin/dynamic-page/create");
              }}
              className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
            >
              <FaPlus />
              <span className="text-[12px]">Add Dynamic Page</span>
            </button>
          </div>
          <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
            <table className="w-full max-w-full rounded-xl overflow-x-auto ">
              <thead className="">
                <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]">
                  <th className="border-none p-2 whitespace-nowrap w-[10%]">
                    S.No.
                  </th>
                  <th className="border-none p-2 whitespace-nowrap ">slug</th>
                  <th className="border-none p-2 whitespace-nowrap">title</th>

                  <th className="border-none p-2 whitespace-nowrap">Status</th>
                  <th className="border-none p-2 whitespace-nowrap w-[10%]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageListData &&
                  pageListData?.docs &&
                  pageListData?.docs?.length > 0 ? (
                  pageListData?.docs?.map((element, index) => (
                    <tr key={element?._id}
                      className={`border-b-[1px] border-[#DDDDDD] text-[#374151] text-[14px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        }`}>
                      <td className="whitespace-nowrap border-none p-2">
                        {index + 1}
                      </td>
                      <td className="whitespace-nowrap border-none p-2">
                        {`${element?.slug}` ?? "-"}
                      </td>
                      <td className="whitespace-nowrap border-none p-2">{`${element?.name}`}</td>
                      <td className='whitespace-nowrap border-none p-2 '>
                        <span
                          className={`${element?.status ? 'bg-[#E0FFBE] border-green-500' : 'bg-red-200 border-red-500'
                            } border-[1px] px-2 py-1.5 rounded-lg text-black text-[12px]`}>
                          {element?.status ? 'Active' : 'Inactive' ?? "-"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap border-none p-2">
                        <span className="py-1.5 flex justify-start items-center space-x-2">
                          <button
                            onClick={() =>
                              navigate(
                                `/admin/view-page/${encrypt(
                                  element?._id
                                )}`
                              )
                            }
                            className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                            type="button"
                          >
                            <FaEye
                              className="hover:text-[#28a745] text-[#3c8dbc]"
                              size={16}
                            />
                          </button>
                          <button
                            onClick={() => {
                              navigate(
                                `/admin/dynamic-page/edit/${encrypt(element?._id)}`
                              );
                            }}
                            className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                            type="button"
                          >
                            <FaPenToSquare
                              className="hover:text-[#337ab7] text-[#3c8dbc]"
                              size={16}
                            />
                          </button>
                          <button
                            onClick={() => handleDelete(element?._id)}
                            className="px-2 py-1.5 rounded-md bg-transparent border border-muted"
                            type="button"
                          >
                            <RiDeleteBin5Line
                              className="text-red-600 hover:text-red-500"
                              size={16}
                            />
                          </button>
                        </span>
                      </td>
                    </tr>))) :
                  (<tr className="bg-white bg-opacity-5">
                    <td colSpan={6} className="px-6 py-2 whitespace-nowrap font-[600] text-center text-sm text-gray-500" >
                      Record Not Found
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </GlobalLayout>
  );
}
export default DynamicPageList;
