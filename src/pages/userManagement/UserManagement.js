import React, { useEffect, useState } from "react";
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaPenToSquare } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { encrypt } from "../../config/Encryption";
import { FaPlus } from "react-icons/fa6";
import { FaAngleUp, FaAngleDown, FaSearch } from "react-icons/fa";
import {
  getUserList,
  deleteUser,
  userSearch,
} from "./userFeatures/_user_reducers";
import { HiOutlineFilter } from "react-icons/hi";
import { useForm } from "react-hook-form";
import PageHeader from "../../global_layouts/pageHeader/PageHeader";

function UserManagement() {
  const { register, setValue } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userList } = useSelector((state) => state.user);
  useEffect(() => {
    const reqData = {
      currentPage: 1,
      pageSize: 10,
    };
    dispatch(getUserList(reqData));
  }, [dispatch]);

  const handleDelete = (id) => {
    let reqData = {
      id: id,
    };
    const listData = {
      isClient: false,
      size: 10,
      pageNo: 1,
    };
    Swal.fire({
      title: "Warning",
      text: "Are you sure you want to delete!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteUser(reqData)).then((data) => {
          dispatch(getUserList(listData));
        });
      }
    });
  };

  const handleOnChange = async (event) => {
    const searchValue = event.target.value;
    setValue("search", searchValue);

    let reqData = {
      searchValue: searchValue,
      size: 3,
      pageNo: 1,
    };

    if (searchValue.length >= 3) {

      dispatch(userSearch(reqData));
    }
  };

  const [sortName, setSortName] = useState("");
  const [sortPrice, setSortPrice] = useState("");
  const [sortDuration, setSortDuration] = useState("");

  const sortData = (data) => {
    if (!data) return;

    let sortedData = [...data];
    if (sortName === "A-Z") {
      sortedData.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortName === "Z-A") {
      sortedData.sort((a, b) => b.title.localeCompare(a.title));
    }
    if (sortPrice === "High to Low") {
      sortedData.sort((a, b) => b.price - a.price);
    } else if (sortPrice === "Low to High") {
      sortedData.sort((a, b) => a.price - b.price);
    }
    if (sortDuration === "Newest to Oldest") {
      sortedData.sort((a, b) => b.days - a.days);
    } else if (sortDuration === "Oldest to Newest") {
      sortedData.sort((a, b) => a.days - b.days);
    }
    return sortedData;
  };
  const handleSortName = (e) => {
    setSortName(e.target.value);
  };
  const handleSortPrice = (e) => {
    setSortPrice(e.target.value);
  };
  const handleSortDuration = (e) => {
    setSortDuration(e.target.value);
  };
  // const sortedData = sortData(planListData);

const newData = userList.map(data =>data.fullName)

  return (
    <GlobalLayout>
      <div className="bg-grey-100 w-full p-1">
        <div className="w-full">
          <PageHeader>
            <div className="relative flex items-center">
              <FaSearch className="absolute left-3 text-gray-400" size={14} />
              <input
                type="text"
                {...register("search")}
                onChange={handleOnChange}
                className="pl-10 pr-4 py-2 text-left rounded-md text-[12px] border border-gray-300 bg-white"
                placeholder="Search Anything.."
              />
            </div>
          </PageHeader>
          <div className="sm:flex justify-between items-center md:space-y-0 space-y-2 py-1">
            <div className="md:flex justify-start items-center md:space-x-4 space-x-0 md:space-y-0 space-y-2">
              <div className="sm:flex justify-start items-center sm:space-x-2 space-x-0 sm:space-y-0 space-y-2">
                <div className="flex justify-center items-center space-x-2 bg-white p-2 text-[14px] rounded-md">
                  <HiOutlineFilter />

                  <select
                    onChange={handleSortName}
                    value={sortName}
                    className="ml-2 p-1 rounded-md outline-none border-none"
                  >
                    <option value="">Title</option>
                    <option value="A-Z">A-Z</option>
                    <option value="Z-A">Z-A</option>
                  </select>
                </div>

                <div className="flex justify-center items-center space-x-2 bg-white p-2 text-[14px] rounded-md">
                  <HiOutlineFilter />
                  <select
                    onChange={handleSortPrice}
                    value={sortPrice}
                    className="ml-2 p-1 rounded-md outline-none border-none"
                  >
                    <option value="">Price</option>
                    <option value="High to Low">High to Low</option>
                    <option value="Low to High">Low to High</option>
                  </select>
                </div>

                <div className="flex justify-center items-center space-x-2 bg-white p-2 text-[14px] rounded-md">
                  <HiOutlineFilter />
                  <select
                    onChange={handleSortDuration}
                    value={sortDuration}
                    className="ml-2 p-1 rounded-md outline-none border-none"
                  >
                    <option value="">Duration</option>
                    <option value="Newest to Oldest">Newest to Oldest</option>
                    <option value="Oldest to Newest">Oldest to Newest</option>
                  </select>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                navigate("/admin/create-user");
              }}
              className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
            >
              <FaPlus />
              <span className="text-[12px]">Add New User</span>
            </button>
          </div>
        </div>
        <div className="bg-[#ffffff]  w-full overflow-x-auto mt-1 rounded-xl">
          <table className="w-full max-w-full rounded-xl overflow-x-auto">
            <thead className="">
              <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]">
                <th className="border-none p-2 whitespace-nowrap w-[5%]">
                  S.No.
                </th>
                <th className="border-none p-2 whitespace-nowrap w-[10%]">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Full Name</span>
                    <div className="flex flex-col -space-y-1.5 cursor-pointer">
                      <FaAngleUp />
                      <FaAngleDown />
                    </div>
                  </div>
                </th>
                <th className="border-none p-2 whitespace-nowrap">
                  <div className="flex justify-start items-center space-x-1">
                    <span>User Name</span>
                    <div className="flex flex-col -space-y-1.5 cursor-pointer">
                      <FaAngleUp />
                      <FaAngleDown />
                    </div>
                  </div>
                </th>
                <th className="border-none p-2 whitespace-nowrap">
                  <div className="flex justify-start items-center space-x-1">
                    <span>E-mail</span>
                    <div className="flex flex-col -space-y-1.5 cursor-pointer">
                      <FaAngleUp />
                      <FaAngleDown />
                    </div>
                  </div>{" "}
                </th>
                <th className="border-none p-2 whitespace-nowrap">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Mobile</span>
                    <div className="flex flex-col -space-y-1.5 cursor-pointer">
                      <FaAngleUp />
                      <FaAngleDown />
                    </div>
                  </div>{" "}
                </th>
                <th className="border-none p-2 whitespace-nowrap">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Role</span>
                    <div className="flex flex-col -space-y-1.5 cursor-pointer">
                      <FaAngleUp />
                      <FaAngleDown />
                    </div>
                  </div>
                </th>
                <th className="border-none p-2 whitespace-nowrap">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Status</span>
                    <div className="flex flex-col -space-y-1.5 cursor-pointer">
                      <FaAngleUp />
                      <FaAngleDown />
                    </div>
                  </div>
                </th>
                <th className="border-none p-2 whitespace-nowrap">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Last Login</span>
                    <div className="flex flex-col -space-y-1.5 cursor-pointer">
                      <FaAngleUp />
                      <FaAngleDown />
                    </div>
                  </div>
                </th>
                <th className="border-none p-2 whitespace-nowrap w-[5%]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {userList && userList.length > 0 ? (
               userList.map((element, index) => (
                  <tr
                    className={`border-b-[1px] ${
                      index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                    } border-[#DDDDDD] text-[#374151] text-[14px]`}
                  >
                   
                   <td className="whitespace-nowrap border-none p-2">
                      {index + 1}
                    </td>
                    <td className="whitespace-nowrap border-none p-2">
                      {element?.fullName}
                    </td>
                   {/*   <td className="whitespace-nowrap border-none p-2 ">
                      {element?.username}
                    </td>
                    <td className="whitespace-nowrap border-none p-2 ">
                      {element?.email}
                    </td>
                    <td className="whitespace-nowrap border-none p-2 ">
                      {element?.mobile}
                    </td>
                    <td className="whitespace-nowrap border-none p-2 ">
                      {element?.userType}
                    </td>
                    <td className="whitespace-nowrap border-none p-2 ">
                      <span
                        className={`${
                          element?.status
                            ? "bg-[#E0FFBE] border-green-500"
                            : "bg-red-200 "
                        } border-[1px] px-2 py-1.5 rounded-lg text-black text-[12px]`}
                      >
                        {element?.status ? "Active" : "Inactive" ?? "-"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap border-none p-2">
                      {element?.lastLogin}
                    </td>
                    <td className="whitespace-nowrap border-none p-2">
                      <span className="py-1.5 flex justify-start items-center space-x-2">
                        <button
                          onClick={() => {
                            navigate(
                              `/admin/companyEdit/${encrypt(element?._id)}`
                            );
                          }}
                          className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                          type="button"
                        >
                          <FaPenToSquare
                            className=" hover:text-[#337ab7] text-[#3c8dbc]"
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
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr className="bg-white bg-opacity-5 ">
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
    </GlobalLayout>
  );
}
export default UserManagement;
