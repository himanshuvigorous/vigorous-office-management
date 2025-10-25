import { useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { decrypt } from "../../../config/Encryption";
import { inputClassName, inputLabelClassName } from "../../../constents/global";
import { getVisitorCatDetails, updateVisitorCat } from "./visitorCategoryFeatures/_visitor_categories_reducers";
import Loader from "../../../global_layouts/Loader/Loader";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";

function UpdateVisitorCategories() {

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [pageLoading, setPageLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { visitorCatIdEnc } = useParams();
  const visitorCatId = decrypt(visitorCatIdEnc);
  const { visitorCatDetails } = useSelector((state) => state.visitorCategory);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reqData = {
          _id: visitorCatId,
        };
        await dispatch(getVisitorCatDetails(reqData)).then((data) => {
          setPageLoading(false);
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (visitorCatDetails) {
      setValue("companyId", visitorCatDetails?.companyId);
      setValue("branchId", visitorCatDetails?.branchId);
      setValue("visitorCatName", visitorCatDetails?.name);
      setValue("status", visitorCatDetails?.status);
    }
  }, [visitorCatDetails]);

  const onSubmit = (data) => {
    const finalPayload = {
      _id: visitorCatId,
      companyId: visitorCatDetails?.companyId,
      directorId: '',
      branchId: visitorCatDetails?.branchId,
      name: data?.visitorCatName,
      status: data?.status,
    };

    dispatch(updateVisitorCat(finalPayload)).then((data) => {
      if (!data.error) navigate("/admin/visitor-category");
    });
  };

  return (
    <GlobalLayout>
      {!pageLoading ? (
        <div className="gap-4">
          <form autoComplete="off" className="mt-0" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Visitor Category Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  {...register("visitorCatName", {
                    required: "Visitor Category Name is required",
                  })}
                  className={`placeholder: ${inputClassName} ${errors.visitorCatName
                    ? "border-[1px] "
                    : "border-gray-300"
                    }`}
                  placeholder="Enter Visitor Category Name"
                />
                {errors.visitorCatName && (
                  <p className="text-red-500 text-sm">
                    {errors.visitorCatName.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end ">
              <button
                type="submit"
                className="bg-header text-white p-2 px-4 rounded mt-4"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      ) : (
        <Loader />
      )}
    </GlobalLayout>
  );
}

export default UpdateVisitorCategories;