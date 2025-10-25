import { useForm } from "react-hook-form";
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { inputClassName, usertypelist } from "../../constents/global";
import { createUserFunc } from "./userFeatures/_user_reducers";

const CreateUser = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onSubmit = (data) => {
    const finalPayload = {
      firstName: data.firstName,
      lastName: data.lastName,
      fullName: data.fullName,
      email: data.email,
      mobileCode: data.mobileCode,
      mobileNumber: data.mobileNumber,
      password: data.password,
      file: data.file[0],
      userType: data.usertype,
    };

    dispatch(createUserFunc(finalPayload)).then((data) => {
      !data.error && reset();
    });
  };

  return (
    <GlobalLayout>
      <div className="gap-4">
        <h2 className="text-2xl font-bold mb-4 col-span-2">Create User</h2>
        <form autoComplete="off" className="mt-5 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
            {/* First Name */}
            <div>
              <label className="block text-sm font-normal">First Name</label>
              <input
                type="text"
                {...register("firstName", {
                  required: "First name is required",
                })}
                className={`${inputClassName} ${
                  errors.firstName ? "border-[1px] " : "border-gray-300"
                }`}
                placeholder="Enter First Name"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-normal">Last Name</label>
              <input
                type="text"
                {...register("lastName", {
                  required: "Last name is required",
                })}
                className={`${inputClassName} ${
                  errors.lastName ? "border-[1px] " : "border-gray-300"
                }`}
                placeholder="Enter Last Name"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-normal">Full Name</label>
              <input
                type="text"
                {...register("fullName", {
                  required: "Full name is required",
                })}
                className={`${inputClassName} ${
                  errors.fullName ? "border-[1px] " : "border-gray-300"
                }`}
                placeholder="Enter Full Name"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-normal">Email</label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Enter a valid email",
                  },
                })}
                className={`${inputClassName} ${
                  errors.email ? "border-[1px] " : "border-gray-300"
                }`}
                placeholder="Enter Email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Mobile Code */}
            <div>
              <label className="block text-sm font-normal">Mobile Code</label>
              <input
                type="text"
                {...register("mobileCode", {
                  required: "Mobile code is required",
                })}
                className={`${inputClassName} ${
                  errors.mobileCode ? "border-[1px] " : "border-gray-300"
                }`}
                placeholder="Enter Mobile Code"
              />
              {errors.mobileCode && (
                <p className="text-red-500 text-sm">
                  {errors.mobileCode.message}
                </p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-normal">Mobile Number</label>
              <input
                type="tel"
                {...register("mobileNumber", {
                  required: "Mobile number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Enter a valid 10-digit mobile number",
                  },
                })}
                className={`${inputClassName} ${
                  errors.mobileNumber ? "border-[1px] " : "border-gray-300"
                }`}
                placeholder="Enter Mobile Number"
              />
              {errors.mobileNumber && (
                <p className="text-red-500 text-sm">
                  {errors.mobileNumber.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-normal">Password</label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password should be at least 6 characters",
                  },
                })}
                className={`${inputClassName} ${
                  errors.password ? "border-[1px] " : "border-gray-300"
                }`}
                placeholder="Enter Password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="">
              <label className="block text-sm font-medium">User Type</label>
              <select
                {...register("usertype", {
                  required: "User Type is required",
                })}
                className={`${inputClassName} ${
                  errors.userType ? "border-[1px] " : "border-gray-300"
                }`}
              >
                {usertypelist.map((type) => (
                  <option value={type}>{type}</option>
                ))}
              </select>
              {errors.userType && (
                <p className="text-red-500 text-sm">
                  {errors.userType.message}
                </p>
              )}
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-normal">File</label>
              <input
                type="file"
                accept="image/*, application/pdf"
                {...register("file", {
                  required: "File is required",
                })}
                className={`${inputClassName} ${
                  errors.file ? "border-[1px] " : "border-gray-300"
                }`}
 
              />
              {errors.file && (
                <p className="text-red-500 text-sm">{errors.file.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-header text-white p-2 px-4 rounded mt-4"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
};

export default CreateUser;
