import { useForm } from "react-hook-form";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { inputClassName, inputLabelClassName } from "../../../../constents/global";
import Loader from "../../../../global_layouts/Loader";
import { CreateTodoListAction, updateTodoList } from "./TodoTypeFeatures/_TodoType_reducers";
import { Modal } from "antd";
import { useEffect } from "react";


const UpdateTodoList = ({isOpen,parentData, handleClose ,fetchList }) => {
  const { loading: AssetTypeloading } = useSelector(
    (state) => state.AssetType
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset
  } = useForm();
  const dispatch = useDispatch();


  useEffect(()=>{
if(parentData){
  setValue("title",parentData?.title)
  setValue("message",parentData?.message)
}
  },[parentData])

  

  const onSubmit = (data) => {
    const finalPayload = {
      _id:parentData?._id,
      "title": data?.title,
      "message": data?.message,
    };
    dispatch(updateTodoList(finalPayload)).then((data) => {
      if (!data.error) {
        fetchList()
        reset()
        handleClose()
      }
    });
  };


  return (
    <Modal
      visible={isOpen}
      onCancel={() => {
        handleClose()
        reset()
      }}
      footer={null}
      title="Create To Do"
      width={600}
      height={400}
      className="antmodalclassName"
    >


      <form autoComplete="off" className="mt-2 md:px-1" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">


          {/* Leave Type Name */}
          <div className="">
            <label className={`${inputLabelClassName}`}>Title <span className="text-red-600">*</span></label>
            <input
              type="text"
              {...register("title", {
                required: "Title  is required",
              })}
              className={`${inputClassName} ${errors.title ? "border-[1px] " : "border-gray-300"}`}
              placeholder="Enter Title "
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>
          <div className="">
            <label className={`${inputLabelClassName}`}>Message <span className="text-red-600">*</span></label>
            <input
              type="text"
              {...register("message", {
                required: "Message is required",
              })}
              className={`${inputClassName} ${errors.message ? "border-[1px] " : "border-gray-300"}`}
              placeholder="Enter Message"
            />
            {errors.message && (
              <p className="text-red-500 text-sm">{errors.message.message}</p>
            )}
          </div>

        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={AssetTypeloading}
            className={`${AssetTypeloading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 mt-3 rounded`}
          >
            {AssetTypeloading ? <Loader /> : 'Submit'}
          </button>
        </div>
      </form>
    </Modal>

  );
};

export default UpdateTodoList;
