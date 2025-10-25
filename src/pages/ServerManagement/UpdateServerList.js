import { useEffect } from "react";
import { useForm, Controller, useWatch, useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import getUserIds from "../../constents/getUserIds";
import {
  customDayjs,
  domainName,
  inputAntdSelectClassName,
  inputAntdSelectClassNameDisabled,
  inputClassName,
  inputLabelClassName,
} from "../../constents/global";
import { companySearch } from "../company/companyManagement/companyFeatures/_company_reducers";
import { branchSearch } from "../branch/branchManagement/branchFeatures/_branch_reducers";
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout";
import { Select } from "antd";
import Loader from "../../global_layouts/Loader";
import ListLoader from "../../global_layouts/ListLoader";
import CustomDatePicker from "../../global_layouts/DatePicker/CustomDatePicker";
import {
  getServerManagementDetails,
  updateServerManagement,
} from "./serverManagementFeatures/_server-management_reducers";
import { decrypt } from "../../config/Encryption";
import dayjs from "dayjs";

function UpdateServerList() {
  const { ServerManagementDetails, loading, updateLoading } = useSelector(
    (state) => state.serverManagement
  );

  

  const { id } = useParams();
  const serverID = decrypt(id);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fieldArray",
    defaultValue: [
      {
        type: "",
        capacity: null,
        used: null,
        mountPoint: "",
      },
    ],
  });

  const {
    fields: portFields,
    append: appendPort,
    remove: removePort,
  } = useFieldArray({
    control,
    name: "ports",
  });

  const {
    fields: servicesFields,
    append: appendServices,
    remove: removeServices,
  } = useFieldArray({
    control,
    name: "services",
  });

  const { userCompanyId, userBranchId } = getUserIds();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );

 
  const { branchList, branchListloading } = useSelector(
    (state) => state.branch
  );

  const companyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: userCompanyId,
  });

  const branchId = useWatch({
    control,
    name: "PDBranchId",
    defaultValue: userBranchId,
  });

  useEffect(() => {
    if (ServerManagementDetails) {
      setValue("PDBranchId", ServerManagementDetails?.branchId);
      setValue("serverName", ServerManagementDetails?.serverName);
      setValue("description", ServerManagementDetails?.description);
      setValue("environment", ServerManagementDetails?.environment);
      setValue("operatingSystem", ServerManagementDetails?.operatingSystem);
      setValue("cpu", ServerManagementDetails?.cpu);
      setValue("memory", ServerManagementDetails?.memory);
      setValue("fieldArray", ServerManagementDetails?.storage);
      setValue("network", ServerManagementDetails?.network);
      setValue("ports", ServerManagementDetails?.network?.ports);
      setValue("serverStatus", ServerManagementDetails?.status);
      setValue("credentials", ServerManagementDetails?.credentials);
      setValue("hostingProvider", ServerManagementDetails?.hostingProvider);
      setValue("services", ServerManagementDetails?.services);
      setValue("acquisitionCost", ServerManagementDetails?.acquisitionCost);
      setValue("status", ServerManagementDetails?.status);
      setValue(
        "serverCreateDate",
        dayjs(ServerManagementDetails?.serverCreateDate)
      );
    }
  }, [ServerManagementDetails]);

  useEffect(() => {
    dispatch(getServerManagementDetails({ _id: serverID }));
  }, [serverID]);

  useEffect(() => {
    if (userInfoglobal?.userType === "admin") {
      dispatch(
        companySearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
        })
      );
    }
  }, []);

  useEffect(() => {
    if (
      companyId ||
      userInfoglobal?.userType === "company" ||
      userInfoglobal?.userType === "companyDirector"
    ) {
      dispatch(
        branchSearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
          companyId:
            userInfoglobal?.userType === "admin"
              ? companyId
              : userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        })
      );
    }
  }, [companyId]);

  const onSubmit = (data) => {
   
     const reqData = {
         _id: serverID,
          companyId:
            userInfoglobal?.userType === "admin"
              ? companyId
              : userInfoglobal?.userType === "company"
                ? userInfoglobal?._id
                : userInfoglobal?.companyId,
    
          directorId: "",
          branchId:
            userInfoglobal?.userType === "company" ||
              userInfoglobal?.userType === "admin" ||
              userInfoglobal?.userType === "companyDirector"
              ? branchId
              : userInfoglobal?.userType === "companyBranch"
                ? userInfoglobal?._id
                : userInfoglobal?.branchId,
    
          serverName: data?.serverName,
          description: data?.description,
          environment: data?.environment,
    
          "operatingSystem": {
            "name":  data?.operatingSystem?.name || "",
            "version": data?.operatingSystem?.version || "",
            "architecture": data?.operatingSystem?.architecture || ""
          },
    
          "cpu": {
            "cores": data?.cpu?.cores ? + data?.cpu?.cores : null,
            "threads": data?.cpu?.threads ? + data?.cpu?.threads : null,
            "speed":  data?.cpu?.speed || "",
            "model":  data?.cpu?.model || ""
          },
    
          "memory": {
            "total": data?.memory?.total ? + data?.memory?.total : null,
            "allocated": data?.memory?.allocated ? + data?.memory?.allocated : null
          },
    
          "storage": data?.fieldArray?.map((item) => ({
            "type": item?.type || "",
            "capacity": item?.capacity ? + item?.capacity : null,
            "used": item?.used ? + item?.used : null,
            "mountPoint": item?.mountPoint || ""
          })) || [],
    
          "network": {
             ipAddress: data?.network?.ipAddress,
            publicIp: data?.network?.publicIp,
            "ports": data?.ports?.map((item) => ({
              "number": item?.number ? + item?.number : null,
              "protocol": item?.protocol || "",
              "service": item?.service || "",
              "isOpen": item?.isOpen || false
            })) || []
          },
    
          "credentials": {
            "username": data?.credentials?.username || "",
            "password": data?.credentials?.password || "",
            "sshKey": data?.credentials?.sshKey || ""
          },
    
          "hostingProvider": {
            "provider": data?.hostingProvider?.provider || "",
            "instanceType": data?.hostingProvider?.instanceType || "",
          },
    
          "services": data?.services?.map((item) => ({
            "name": item?.name || "",
            "type": item?.type || "",
            "version": item?.version || "",
            "port": item?.port ? + item?.port : null,
            "status": item?.status || "",
            "description": item?.description || ""
          })) || [],
            acquisitionCost: data?.acquisitionCost,
            status: data?.status,
          serverCreateDate: customDayjs(data?.serverCreateDate),
        }
    dispatch(updateServerManagement(reqData)).then((data) => {
      if (!data.error) {
        navigate(-1);
      }
    });
  };

  return (
    <GlobalLayout>
      {loading ? <div className="w-full bg-white p-3"><ListLoader /></div> : <div className="gap-4">
        <form
          autoComplete="off"
          className="mt-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
            

            <div className="">
              <label className={`${inputLabelClassName}`}>
                Server Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("serverName", {
                  required: "Server Name is required",
                })}
                className={`placeholder: ${inputClassName} ${errors.serverName ? "border-[1px] " : "border-gray-300"
                  }`}
                placeholder="Enter Server Name"
              />
              {errors.serverName && (
                <p className="text-red-500 text-sm">
                  {errors.serverName.message}
                </p>
              )}
            </div>
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Description <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("description", {
                  required: "Description is required",
                })}
                className={`placeholder: ${inputClassName} ${errors.description ? "border-[1px] " : "border-gray-300"
                  }`}
                placeholder="Enter Description"
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Environment <span className="text-red-600">*</span>
              </label>

              <Controller
                name={`environment`}
                control={control}
                rules={{ required: "Environment is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${inputAntdSelectClassName} ${errors.environment ? "border-[1px] " : "border-gray-300"
                      }`}
                    placeholder="Select Environment"
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children)
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value="">Select Environment</Select.Option>
                    {[
                      "Production",
                      "Staging",
                      "Development",
                      "Testing",
                      "DisasterRecovery",
                    ].map((type) => (
                      <Select.Option key={type} value={type}>
                        {type}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
              {errors.environment && (
                <p className="text-red-500 text-sm">
                  {errors.environment.message}
                </p>
              )}
            </div>
          </div>

          <div className="font-bold text-lg text-header py-2">
            Operating System Details
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Operating System Name 
              </label>
              <input
                type="text"
                {...register("operatingSystem.name")}
                className={`placeholder: ${inputClassName} ${errors.operatingSystem?.name
                    ? "border-[1px] "
                    : "border-gray-300"
                  }`}
                placeholder="Enter Operating System Name"
              />
              {errors.operatingSystem?.name && (
                <p className="text-red-500 text-sm">
                  {errors.operatingSystem?.name?.message}
                </p>
              )}
            </div>
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Operating System Version 
              </label>
              <input
                type="text"
                {...register("operatingSystem.version", )}
                className={`placeholder: ${inputClassName} ${errors.operatingSystem?.version
                    ? "border-[1px] "
                    : "border-gray-300"
                  }`}
                placeholder="Enter Operating System Version"
              />
              {errors.operatingSystem?.version && (
                <p className="text-red-500 text-sm">
                  {errors.operatingSystem?.version?.message}
                </p>
              )}
            </div>
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Operating System Architecture
              </label>
              <input
                type="text"
                {...register("operatingSystem.architecture", {
                })}
                className={`placeholder: ${inputClassName} ${errors.operatingSystem?.architecture
                    ? "border-[1px] "
                    : "border-gray-300"
                  }`}
                placeholder="Enter Operating System Architecture"
              />
              {errors.operatingSystem?.architecture && (
                <p className="text-red-500 text-sm">
                  {errors.operatingSystem?.architecture?.message}
                </p>
              )}
            </div>
          </div>
          <div className="font-bold text-lg text-header py-2">CPU Details</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
            <div className="">
              <label className={`${inputLabelClassName}`}>
                cores 
              </label>
              <input
                type="number"
                step="any"
                {...register("cpu.cores",)}
                className={`placeholder: ${inputClassName} ${errors.cpu?.cores ? "border-[1px] " : "border-gray-300"
                  }`}
                placeholder="Enter cores"
              />
              {errors.cpu?.cores && (
                <p className="text-red-500 text-sm">
                  {errors.cpu?.cores?.message}
                </p>
              )}
            </div>
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Threads 
              </label>
              <input
                type="number"
                step="any"
                {...register("cpu.threads",)}
                className={`placeholder: ${inputClassName} ${errors.cpu?.threads ? "border-[1px] " : "border-gray-300"
                  }`}
                placeholder="Enter CPU threads"
              />
              {errors.cpu?.threads && (
                <p className="text-red-500 text-sm">
                  {errors.cpu?.threads?.message}
                </p>
              )}
            </div>
            <div className="">
              <label className={`${inputLabelClassName}`}>
                speed 
              </label>
              <input
                type="text"
                {...register("cpu.speed",)}
                className={`placeholder: ${inputClassName} ${errors.cpu?.speed ? "border-[1px] " : "border-gray-300"
                  }`}
                placeholder="Enter speed"
              />
              {errors.cpu?.speed && (
                <p className="text-red-500 text-sm">
                  {errors.cpu?.speed?.message}
                </p>
              )}
            </div>

            <div className="">
              <label className={`${inputLabelClassName}`}>
                model 
              </label>
              <input
                type="text"
                {...register("cpu.model",)}
                className={`placeholder: ${inputClassName} ${errors.cpu?.model ? "border-[1px] " : "border-gray-300"
                  }`}
                placeholder="Enter speed"
              />
              {errors.cpu?.model && (
                <p className="text-red-500 text-sm">
                  {errors.cpu?.model?.message}
                </p>
              )}
            </div>
          </div>
          <div className="font-bold text-lg text-header py-2">
            Memory Details
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Total 
              </label>
              <input
                type="number"
                {...register("memory.total",)}
                className={`placeholder: ${inputClassName} ${errors.memory?.total ? "border-[1px] " : "border-gray-300"
                  }`}
                placeholder="Enter Total Memory"
              />
              {errors.memory?.total && (
                <p className="text-red-500 text-sm">
                  {errors.memory?.total?.message}
                </p>
              )}
            </div>
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Allocated 
              </label>
              <input
                type="number"
                {...register("memory.allocated",)}
                className={`placeholder: ${inputClassName} ${errors.memory?.allocated ? "border-[1px] " : "border-gray-300"
                  }`}
                placeholder="Enter Allocated Memory"
              />
              {errors.memory?.allocated && (
                <p className="text-red-500 text-sm">
                  {errors.memory?.allocated?.message}
                </p>
              )}
            </div>
          </div>

          <div className="font-bold text-lg text-header py-2 flex justify-between items-center">
            <span>Storage Details</span>{" "}
            <button
              type="button"
              onClick={() =>
                append({
                  type: "",
                  capacity: null,
                  used: null,
                  mountPoint: "",
                })
              }
              className="bg-header text-[14px] text-white px-2 py-0.5 rounded my-2"
            >
              + Add Storage
            </button>
          </div>
          <div className=" border-[1px] border-header rounded-md p-2">
            {fields?.map((item, index) => {
              return (
                <div key={item?.id} className="">
                  <div className="flex font-semibold text-header justify-between items-center">
                    Storage Details {index + 1}
                    <div className="flex justify-end">
                      <button
                        type="button"

                        onClick={() => remove(index)}
                        className={` w-20 text-white px-2 py-1 rounded my-2 ${(index === 0 && fields?.length === 1) ? "invisible" : "bg-red-500"
                          }`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
                    <div className="">
                      <label className={`${inputLabelClassName}`}>
                        Type 
                      </label>
                      <Controller
                        name={`fieldArray.${index}.type`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            className={`${inputAntdSelectClassName} ${errors.fieldArray?.[index]?.type
                                ? "border-[1px] "
                                : "border-gray-300"
                              }`}
                            placeholder="Select Type"
                            showSearch
                            filterOption={(input, option) =>
                              String(option?.children)
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                          >
                            <Select.Option value="">Select Type</Select.Option>
                            {["SSD", "HDD", "NVMe", "SAN", "NAS", "Other"].map(
                              (item) => (
                                <Select.Option key={item} value={item}>
                                  {item}
                                </Select.Option>
                              )
                            )}
                          </Select>
                        )}
                      />
                      {errors.fieldArray?.[index]?.type && (
                        <p className="text-red-500 text-sm">
                          {errors.fieldArray?.[index]?.type?.message}
                        </p>
                      )}
                    </div>
                    <div className="">
                      <label className={`${inputLabelClassName}`}>
                        Capacity 
                      </label>
                      <input
                        type="number"
                        {...register(`fieldArray.${index}.capacity`)}
                        className={`placeholder: ${inputClassName} ${errors.fieldArray?.capacity
                            ? "border-[1px] "
                            : "border-gray-300"
                          }`}
                        placeholder="Enter Capacity"
                      />
                      {errors.fieldArray?.[index]?.capacity && (
                        <p className="text-red-500 text-sm">
                          {errors.fieldArray?.[index]?.capacity?.message}
                        </p>
                      )}
                    </div>

                    <div className="">
                      <label className={`${inputLabelClassName}`}>
                        used 
                      </label>
                      <input
                        type="number"
                        step="any"
                        {...register(`fieldArray.${index}.used`)}
                        className={`placeholder: ${inputClassName} ${errors.fieldArray?.used
                            ? "border-[1px] "
                            : "border-gray-300"
                          }`}
                        placeholder="Enter used"
                      />
                      {errors.fieldArray?.[index]?.used && (
                        <p className="text-red-500 text-sm">
                          {errors.fieldArray?.[index]?.used?.message}
                        </p>
                      )}
                    </div>

                    <div className="">
                      <label className={`${inputLabelClassName}`}>
                        Mount Point 
                      </label>
                      <input
                        type="text"
                        {...register(`fieldArray.${index}.mountPoint`)}
                        className={`placeholder: ${inputClassName} ${errors.fieldArray?.mountPoint
                            ? "border-[1px] "
                            : "border-gray-300"
                          }`}
                        placeholder="Enter mountPoint"
                      />
                      {errors.fieldArray?.[index]?.mountPoint && (
                        <p className="text-red-500 text-sm">
                          {errors.fieldArray?.[index]?.mountPoint?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="font-bold text-lg text-header py-2">
            Network Details
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Ip Address <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("network.ipAddress", {
                  required: "ipAddress is required",
                })}
                className={`placeholder: ${inputClassName} ${errors.network?.ipAddress
                    ? "border-[1px] "
                    : "border-gray-300"
                  }`}
                placeholder="Enter ipAddress"
              />
              {errors.network?.ipAddress && (
                <p className="text-red-500 text-sm">
                  {errors.network?.ipAddress?.message}
                </p>
              )}
            </div>
            <div className="">
              <label className={`${inputLabelClassName}`}>
                public Ip <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("network.publicIp", {
                  required: "publicIp is required",
                })}
                className={`placeholder: ${inputClassName} ${errors.network?.publicIp ? "border-[1px] " : "border-gray-300"
                  }`}
                placeholder="Enter publicIp"
              />
              {errors.network?.publicIp && (
                <p className="text-red-500 text-sm">
                  {errors.network?.publicIp?.message}
                </p>
              )}
            </div>
          </div>
          <div className="">
            <div className=" flex justify-between items-center">
              <label className={`${inputLabelClassName}`}>
                ports 
              </label>
              <button
                type="button"
                onClick={() => appendPort()}
                className="bg-header text-white px-2 py-1 rounded my-2"
              >
                + Add Port
              </button>
            </div>
            <div className=" border-[1px] border-header rounded-md p-2">
              {portFields?.map((ports, index) => {
                return (
                  <div key={ports?.id} className="">
                    <div className="flex font-semibold text-header justify-between items-center">
                      Port Details {index + 1}
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => removePort(index)}
                          className={` w-20 text-white px-2 py-1 rounded my-2 ${(index === 0 && portFields?.length === 1) ? "invisible" : "bg-red-500"
                            }`}
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
                      <div className="">
                        <label className={`${inputLabelClassName}`}>
                          Number 
                        </label>
                        <input
                          type="number"
                          {...register(`ports.${index}.number`, {
                          })}
                          className={`placeholder: ${inputClassName} ${errors.ports?.[index]?.number
                              ? "border-[1px] "
                              : "border-gray-300"
                            }`}
                          placeholder="Enter Number"
                        />
                        {errors.ports?.[index]?.number && (
                          <p className="text-red-500 text-sm">
                            {errors.ports?.[index]?.number?.message}
                          </p>
                        )}
                      </div>
                      <div className="">
                        <label className={`${inputLabelClassName}`}>
                          protocol 
                        </label>

                        <Controller
                          name={`ports.${index}.protocol`}
                          control={control}
                       
                          render={({ field }) => (
                            <Select
                              {...field}
                              className={`${inputAntdSelectClassName} ${errors.ports?.[index]?.protocol
                                  ? "border-[1px] "
                                  : "border-gray-300"
                                }`}
                              placeholder="Select protocol"
                              showSearch
                              filterOption={(input, option) =>
                                String(option?.children)
                                  .toLowerCase()
                                  .includes(input.toLowerCase())
                              }
                            >
                              <Select.Option value="">
                                Select protocol
                              </Select.Option>
                              {[
                                "TCP",
                                "UDP",
                                "HTTP",
                                "HTTPS",
                                "SSH",
                                "RDP",
                                "FTP",
                                "Other",
                              ]?.map((item, index) => (
                                <Select.Option key={index} value={item}>
                                  {item}
                                </Select.Option>
                              ))}
                            </Select>
                          )}
                        />
                        {errors.ports?.[index]?.protocol && (
                          <p className="text-red-500 text-sm">
                            {errors.ports?.[index]?.protocol?.message}
                          </p>
                        )}
                      </div>

                      <div className="">
                        <label className={`${inputLabelClassName}`}>
                          service 
                        </label>
                        <input
                          type="text"
                          {...register(`ports.${index}.service`, {
                          })}
                          className={`placeholder: ${inputClassName} ${errors.ports?.[index]?.service
                              ? "border-[1px] "
                              : "border-gray-300"
                            }`}
                          placeholder="Enter service"
                        />
                        {errors.ports?.[index]?.service && (
                          <p className="text-red-500 text-sm">
                            {errors.ports?.[index]?.service?.message}
                          </p>
                        )}
                      </div>

                      <div className="">
                        <label className={`${inputLabelClassName}`}>
                          isOpen 
                        </label>
                        <Controller
                          name={`ports.${index}.isOpen`}
                          control={control}
                          
                          render={({ field }) => (
                            <Select
                              {...field}
                              onChange={(value) => field.onChange(value)}
                              className={`${inputAntdSelectClassName} ${errors.isOpen
                                  ? "border-[1px] "
                                  : "border-gray-300"
                                }`}
                              placeholder="Select isOpen"
                              showSearch
                              filterOption={(input, option) =>
                                String(option?.children)
                                  .toLowerCase()
                                  .includes(input.toLowerCase())
                              }
                            >
                              <Select.Option value="">
                                Select isOpen
                              </Select.Option>
                              <Select.Option value={true}>Yes</Select.Option>
                              <Select.Option value={false}>No</Select.Option>
                            </Select>
                          )}
                        />
                        {errors.ports?.[index]?.isOpen && (
                          <p className="text-red-500 text-sm">
                            {errors.ports?.[index]?.isOpen?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="font-bold text-lg text-header py-2">
            Credentials Details
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
            <div className="">
              <label className={`${inputLabelClassName}`}>
                username 
              </label>
              <input
                type="text"
                {...register("credentials.username")}
                className={`placeholder: ${inputClassName} ${errors.credentials?.username
                    ? "border-[1px] "
                    : "border-gray-300"
                  }`}
                placeholder="Enter username"
              />
              {errors.credentials?.username && (
                <p className="text-red-500 text-sm">
                  {errors.credentials?.username?.message}
                </p>
              )}
            </div>
            <div className="">
              <label className={`${inputLabelClassName}`}>
                password 
              </label>
              <input
                type="text"
                {...register("credentials.password")}
                className={`placeholder: ${inputClassName} ${errors.credentials?.password
                    ? "border-[1px] "
                    : "border-gray-300"
                  }`}
                placeholder="Enter password"
              />
              {errors.credentials?.password && (
                <p className="text-red-500 text-sm">
                  {errors.credentials?.password?.message}
                </p>
              )}
            </div>
            <div className="">
              <label className={`${inputLabelClassName}`}>
                sshKey 
              </label>
              <input
                type="text"
                {...register("credentials.sshKey")}
                className={`placeholder: ${inputClassName} ${errors.credentials?.sshKey
                    ? "border-[1px] "
                    : "border-gray-300"
                  }`}
                placeholder="Enter sshKey"
              />
              {errors.credentials?.sshKey && (
                <p className="text-red-500 text-sm">
                  {errors.credentials?.sshKey?.message}
                </p>
              )}
            </div>
          </div>

          <div className="font-bold text-lg text-header py-2">
            HostingProvider Details
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Hosting Provider 
              </label>
              <Controller
                name={`hostingProvider.provider`}
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${inputAntdSelectClassName} ${errors.hostingProvider?.provider
                        ? "border-[1px] "
                        : "border-gray-300"
                      }`}
                    placeholder="Select provider"
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children)
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value="">Select provider</Select.Option>
                    {[
                      "AWS",
                      "Azure",
                      "GCP",
                      "DigitalOcean",
                      "Linode",
                      "Other",
                    ]?.map((item) => (
                      <Select.Option key={item} value={item}>
                        {item}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
              {errors.hostingProvider?.provider && (
                <p className="text-red-500 text-sm">
                  {errors.hostingProvider?.provider?.message}
                </p>
              )}
            </div>
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Instance Type 
              </label>
              <input
                type="text"
                {...register("hostingProvider.instanceType")}
                className={`placeholder: ${inputClassName} ${errors.hostingProvider?.instanceType
                    ? "border-[1px] "
                    : "border-gray-300"
                  }`}
                placeholder="Enter instanceType"
              />
              {errors.hostingProvider?.instanceType && (
                <p className="text-red-500 text-sm">
                  {errors.hostingProvider?.instanceType?.message}
                </p>
              )}
            </div>
          </div>

          <div className="font-bold text-lg text-header py-2 flex justify-between items-center">
            <span>Services Details</span>{" "}
            <button
              type="button"
              onClick={() =>
                appendServices({
                  type: "",
                  capacity: null,
                  used: null,
                  mountPoint: "",
                })
              }
              className="bg-header text-[14px] text-white px-2 py-0.5 rounded my-2"
            >
              + Add Services
            </button>
          </div>
          <div className=" border-[1px] border-header rounded-md p-2">
            {servicesFields?.map((item, index) => {
              return (
                <div key={item?.id} className="">
                  <div className="flex font-semibold text-header justify-between items-center">
                    Services Details {index + 1}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeServices(index)}
                        className={` w-20 text-white px-2 py-1 rounded my-2 ${(index === 0 && servicesFields?.length === 1) ? "invisible" : "bg-red-500"
                          }`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
                    <div className="">
                      <label className={`${inputLabelClassName}`}>
                        Name 
                      </label>
                      <input
                        type="text"
                        {...register(`services.${index}.name`)}
                        className={`placeholder: ${inputClassName} ${errors.services?.name
                            ? "border-[1px] "
                            : "border-gray-300"
                          }`}
                        placeholder="Enter name"
                      />
                      {errors.services?.[index]?.name && (
                        <p className="text-red-500 text-sm">
                          {errors.services?.[index]?.name?.message}
                        </p>
                      )}
                    </div>
                    <div className="">
                      <label className={`${inputLabelClassName}`}>
                        Type 
                      </label>
                      <Controller
                        name={`services.${index}.type`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            className={`${inputAntdSelectClassName} ${errors.services?.[index]?.type
                                ? "border-[1px] "
                                : "border-gray-300"
                              }`}
                            placeholder="Select type"
                            showSearch
                            filterOption={(input, option) =>
                              String(option?.children)
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                          >
                            <Select.Option value="">Select Type</Select.Option>
                            {[
                              "Web",
                              "Database",
                              "API",
                              "Cache",
                              "Queue",
                              "Monitoring",
                              "Backup",
                              "Other",
                            ]?.map((item) => (
                              <Select.Option key={item} value={item}>
                                {item}
                              </Select.Option>
                            ))}
                          </Select>
                        )}
                      />
                      {errors.services?.[index]?.type && (
                        <p className="text-red-500 text-sm">
                          {errors.services?.[index]?.type?.message}
                        </p>
                      )}
                    </div>

                    <div className="">
                      <label className={`${inputLabelClassName}`}>
                        version 
                      </label>
                      <input
                        type="text"
                        {...register(`services.${index}.version`)}
                        className={`placeholder: ${inputClassName} ${errors.services?.version
                            ? "border-[1px] "
                            : "border-gray-300"
                          }`}
                        placeholder="Enter version"
                      />
                      {errors.services?.[index]?.version && (
                        <p className="text-red-500 text-sm">
                          {errors.services?.[index]?.version?.message}
                        </p>
                      )}
                    </div>

                    <div className="">
                      <label className={`${inputLabelClassName}`}>
                        Port 
                      </label>
                      <input
                        type="number"
                        step="any"
                        {...register(`services.${index}.port`)}
                        className={`placeholder: ${inputClassName} ${errors.services?.port
                            ? "border-[1px] "
                            : "border-gray-300"
                          }`}
                        placeholder="Enter port"
                      />
                      {errors.services?.[index]?.port && (
                        <p className="text-red-500 text-sm">
                          {errors.services?.[index]?.port?.message}
                        </p>
                      )}
                    </div>

                    <div className="">
                      <label className={`${inputLabelClassName}`}>
                        status 
                      </label>
                      <Controller
                        name={`services.${index}.status`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            className={`${inputAntdSelectClassName} ${errors.services?.[index]?.status
                                ? "border-[1px] "
                                : "border-gray-300"
                              }`}
                            placeholder="Select status"
                            showSearch
                            filterOption={(input, option) =>
                              String(option?.children)
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                          >
                            <Select.Option value="">
                              Select status
                            </Select.Option>
                            {[
                              "Running",
                              "Stopped",
                              "Failed",
                              "Restarting",
                            ]?.map((item) => (
                              <Select.Option key={item} value={item}>
                                {item}
                              </Select.Option>
                            ))}
                          </Select>
                        )}
                      />
                      {errors.services?.[index]?.status && (
                        <p className="text-red-500 text-sm">
                          {errors.services?.[index]?.status?.message}
                        </p>
                      )}
                    </div>

                    <div className="">
                      <label className={`${inputLabelClassName}`}>
                        description 
                      </label>
                      <input
                        type="text"
                        {...register(`services.${index}.description`)}
                        className={`placeholder: ${inputClassName} ${errors.services?.description
                            ? "border-[1px] "
                            : "border-gray-300"
                          }`}
                        placeholder="Enter description"
                      />
                      {errors.services?.[index]?.description && (
                        <p className="text-red-500 text-sm">
                          {errors.services?.[index]?.description?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid mt-2 grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
            <div className="">
              <label className={`${inputLabelClassName}`}>
                acquisitionCost <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                {...register("acquisitionCost", {
                  required: "acquisitionCost is required",
                })}
                className={`placeholder: ${inputClassName} ${errors.acquisitionCost ? "border-[1px] " : "border-gray-300"
                  }`}
                placeholder="Enter acquisitionCost"
              />
              {errors.acquisitionCost && (
                <p className="text-red-500 text-sm">
                  {errors.acquisitionCost?.message}
                </p>
              )}
            </div>
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Server Create Date <span className="text-red-600">*</span>
              </label>
              <Controller
                name="serverCreateDate"
                control={control}
                rules={{
                  required: "Date  is required",
                }}
                render={({ field }) => (
                  <CustomDatePicker field={field} errors={errors} />
                )}
              />
              {errors.serverCreateDate && (
                <p className="text-red-500 text-sm">
                  {errors.serverCreateDate?.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end mt-2 ">
            <button
              type="submit"
              disabled={loading}
              className={`${loading ? "bg-gray-400" : "bg-header"
                } text-white p-2 px-4 rounded`}
            >
              {loading ? <Loader /> : "Submit"}
            </button>
          </div>
        </form>
      </div>}
    </GlobalLayout>
  );
}

export default UpdateServerList;
