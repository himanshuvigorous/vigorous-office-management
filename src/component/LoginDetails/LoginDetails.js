import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { domainName, inputClassName, inputLabelClassName } from '../../constents/global';
import { changePasswordFunc, logoutUser } from '../../redux/_reducers/_auth_reducers';
import SupportModal from '../../pages/supportModal/SupportModal';
import { Avatar, Button, Dropdown, Menu, message, Modal, Spin, Tooltip } from 'antd';
import ImageUploader from '../../global_layouts/ImageUploader/ImageUploader';
import { FaRegCopy } from 'react-icons/fa';

import {
  UserOutlined,
  LockOutlined,
  CustomerServiceOutlined,
  IdcardFilled,
} from '@ant-design/icons'

import { useNavigate } from 'react-router-dom';
import { getOnBoardingDetails } from '../../pages/hr/onBoarding/onBoardingFeatures/_onBoarding_reducers';
import getUserIds from '../../constents/getUserIds';
import { encrypt } from '../../config/Encryption';
import moment from 'moment';
import html2canvas from 'html2canvas';
import IDcard from './IDcard';
import { BiLogOut } from 'react-icons/bi';
import { htmlTemplateGenerator } from '../../pages/financeManagement/invoice/invoiceFeature/_invoice_reducers';
export const LoginDetails = () => {
  const {
    setValue,
    control,
  } = useForm({})
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [myProfile, setMyProfile] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [idCardModal, setIcardModal] = useState(false);
  const [openSelect, setOpenSelect] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.authentication);
  const userDetails = user?.userinfo?.data?.rowData || JSON.parse(localStorage.getItem(`user_Profile`));
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const { onBoardingDetailsData, laoding: OnBoardingLoading } = useSelector((state) => state.onBoarding);
  const { changePasswordFunc_loading } = useSelector((state => state.authentication))
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const handleChangePassword = () => setPasswordModalOpen(prev => !prev);
  const handleMyProfile = () => setMyProfile(prev => !prev);
  const handleSupport = () => setSupportModalOpen(prev => !prev);
  const handleIdCard = () => {
    setIcardModal(prev => !prev)
     dispatch(htmlTemplateGenerator({ _id:userInfoglobal?._id , type :"idCard" }));
    dispatch(getOnBoardingDetails({
      _id: userInfoglobal?.onboardingId || ""
    }))
  };

  const handeleLogout = () => {
    localStorage.clear();
    navigate('/login');
    dispatch(logoutUser()).then(() => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'LOGOUT' }));
      }

    })

  }

  const newPassword = watch('newPassword');
  const dropdownRef = useRef(null);
  const onSubmit = (details) => {
    dispatch(changePasswordFunc({
      "_id": userDetails?._id,
      "password": details?.currenPassword,
      "newPassword": details?.confirmPassword
    })).then((data) => {
      if (!data?.error) { setPasswordModalOpen(false); reset() }
    });
  };
  useEffect(() => {
    setValue("ProfileImage", userDetails?.profileImage)
  }, [userDetails])

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    message.success('Copied to clipboard!');
  };



  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenSelect(false);
      }
    };

    if (openSelect) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openSelect]);
  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />} onClick={handleMyProfile}>
        My Profile
      </Menu.Item>
      {userInfoglobal?.userType === 'employee' && (
        <Menu.Item key="2" icon={<IdcardFilled />} onClick={handleIdCard}>
          My I-Card
        </Menu.Item>
      )}
      <Menu.Item key="3" icon={<LockOutlined />} onClick={handleChangePassword}>
        Change Password
      </Menu.Item>
      {userInfoglobal?.userType === 'company' && (
        <Menu.Item key="4" icon={<CustomerServiceOutlined />} onClick={handleSupport}>
          Admin Support
        </Menu.Item>
      )}

      <Menu.Item key="5" icon={<BiLogOut />} onClick={() => {
        handeleLogout()
      }}>
        Logout
      </Menu.Item>
    </Menu>

  );
  const navigate = useNavigate()

  const handleViewPage = () => {
    if (userInfoglobal?.userType == 'company') {
      navigate('/admin/my-company');
      handleMyProfile()
    }
    if (userInfoglobal?.userType == 'companyBranch') {
      navigate('/admin/my-branch');
      handleMyProfile()
    }
    if (userInfoglobal?.userType == 'companyDirector') {
      navigate('/admin/my-director');
      handleMyProfile()
    }
    if (userInfoglobal?.userType == 'employee') {
      navigate(`/admin/onBoarding/onBoardingView/${encrypt(getUserIds()?.useronboardingId)}`);
      handleMyProfile()
    }
  }
  return (
    <>
      <div className="flex items-center lg:space-x-3 space-x-1">
        <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
          <div className="flex items-center space-x-2 bg-white p-1.5 rounded-xl cursor-pointer">
            <div className="lg:h-[28px] lg:w-[28px] w-[28px] h-[28px]">
              <img
                src={userDetails?.profileImage
                  ? `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public${userDetails?.profileImage}`
                  : '/images/images/p1.jpeg'}
                alt="Profile"
                className="w-full h-full object-cover rounded-full lg:rounded"
              />
            </div>

            <div className="">
              <div className=" text-gray-700 lg:text-sm text-[12px] font-medium cursor-pointer">
                {userDetails?.fullName}
              </div>
            </div>
          </div>
        </Dropdown>
      </div>
      <Modal
        className="antmodalclassName"
        title="Change Password"
        open={passwordModalOpen}
        onCancel={() => setPasswordModalOpen(false)}
        footer={null}
      >
        <form autoComplete="off" className="space-y-4 text-black" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="current-password" className={`${inputLabelClassName}`}>
              Current Password
            </label>
            <input
              type="text"
              id="current-password"
              className={`${inputClassName}`}
              placeholder="Enter your current password"
              {...register('currenPassword', { required: true })}
            />
            {errors.currenPassword && (
              <p className="text-red-500">Please enter your current password</p>
            )}
          </div>
          <div>
            <label htmlFor="new-password" className={`${inputLabelClassName}`}>
              New Password
            </label>
            <input
              type="password"
              id="new-password"
              className={`${inputClassName}`}
              placeholder="Enter your new password"
              {...register('newPassword', { required: true })}
            />
            {errors.newPassword && (
              <p className="text-red-500">Please enter your new password</p>
            )}
          </div>
          <div>
            <label htmlFor="confirm-password" className={`${inputLabelClassName}`}>
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              className={`${inputClassName}`}
              placeholder="Confirm your new password"
              {...register('confirmPassword', {
                required: 'Enter Confirm Password',
                validate: (value) =>
                  value === newPassword || 'Passwords do not match',
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={changePasswordFunc_loading}
            className="w-full bg-header text-white py-2 px-4 rounded-lg  focus:outline-none focus:ring-2">
            {changePasswordFunc_loading ? "Changing..." : 'Change Password'}
          </button>
        </form>
      </Modal>
      {supportModalOpen && (
        <SupportModal setSupportModalOpen={setSupportModalOpen} supportModalOpen={supportModalOpen} />
      )}
      <IDcard idCardModal={idCardModal} setIcardModal={setIcardModal} onBoardingDetailsData={onBoardingDetailsData} OnBoardingLoading={OnBoardingLoading} />
      <Modal
        className="antmodalclassName"
        title="My Profile"
        open={myProfile}
        onCancel={handleMyProfile}
        footer={[

          <Button key="button" className={`${(userInfoglobal?.userType == 'admin') ? 'hidden' : ""}`} type="primary" onClick={() => { handleViewPage() }}>
            View Profile
          </Button>,
        ]}
      >
        <div className="flex w-full justify-center items-center p-2">
          <Controller
            name="ProfileImage"
            control={control}
            render={({ field }) => (
              <ImageUploader
                setValue={setValue}
                name="image"
                field={field}
                userId={userInfoglobal?._id}
                updateProfilePicture={true}
              />
            )}
          />
        </div>
        {/* <div className='w-full  px-2 flex flex-col justify-center items-end'>
    <span className='text-[13px]  text-[#90D1CA]'>click on Icon to view profile</span>
     <CgProfile className='cursor-pointer' onClick={()=>{handleViewPage()}} size={20} />     
  </div> */}

        <div className="space-y-3 mt-4">
          {[
            { label: 'Email', value: userInfoglobal?.email },
            { label: 'Full Name', value: userInfoglobal?.fullName },
            { label: 'Username', value: userInfoglobal?.userName },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between bg-gray-100 p-2 rounded-md"
            >
              <div className="font-medium">
                {label}: <span className="text-gray-700">{value}</span>
              </div>
              <Tooltip placement="topLeft" title={`Copy ${label}`}>
                <Button
                  icon={<FaRegCopy />}
                  type="text"
                  onClick={() => copyToClipboard(value)}
                />
              </Tooltip>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};
