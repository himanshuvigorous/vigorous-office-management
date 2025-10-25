import { formButtonClassName, inputClassName, inputLabelClassName, organizationTypes, usertypelist } from "../../constents/global";

const InputField = ({ label, name, register, validation, errors, placeholder }) => (
  <div>
    <label className={`${inputLabelClassName}`}>
      {label} <span className="text-red-600">*</span>
    </label>
    <input
      type="text"
      {...register(name, validation)}
      className={`${inputClassName} ${errors[name] ? "border-[1px] " : "border-gray-300"
        }`}
      placeholder={placeholder}
    />
    {errors[name] && (
      <p className="text-red-500 text-sm">{errors[name].message}</p>
    )}
  </div>
);