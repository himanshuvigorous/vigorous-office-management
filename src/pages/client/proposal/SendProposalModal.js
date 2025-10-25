import React, { useState, useEffect, memo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import styles
import { FaRegFile, FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fileUploadFunc } from '../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers';
import moment from 'moment';
import {
    domainName,
} from "../../../constents/global";
import { Modal } from 'antd';

const SendProposalModal = ({ isOpen, onClose, onSubmit, proposalData, setProposalId }) => {

    const [formData, setFormData] = useState({
        to: '',
        cc: [],
        subject: 'Regarding Proposal',
        employeeName: '',
        jobTitle: '',
        companyName: '',
        joiningDate: '',
        joiningTime: '',
        officeAddress: '',
        salary: '',
        salaryDuration: 'year',
        confirmationDeadline: '',
        hrContact: '',
        senderName: '',
        senderTitle: '',
        portalURL: '',
        portalUsername: '',
        portalPassword: '',
        attachments: []
    });
    const [isPreview, setIsPreview] = useState(false);
    const [editorValue, setEditorValue] = useState(``);
    const dispatch = useDispatch();


    useEffect(() => {
        setFormData({
            to: '',
            cc: [],
            subject: 'Regarding Proposal',
            employeeName: '',
            jobTitle: '',
            companyName: '',
            joiningDate: '',
            joiningTime: '',
            officeAddress: '',
            salary: '',
            salaryDuration: 'year',
            confirmationDeadline: '',
            hrContact: '',
            senderName: '',
            senderTitle: '',
            portalURL: '',
            portalUsername: '',
            portalPassword: '',
            attachments: []
        });
        if (proposalData) {

            setFormData((formData) => {
                return {
                    ...formData,
                    to: proposalData?.email
                }
            })
            const fetchedData = `<div class="space-y-4 ${'text-gray-600'}">
         <div style="width: 80%; margin: 0 auto; padding: 20px; background-color: #ffffff; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        <h1 style="font-size: 24px; color: #0073e6;">Welcome to ${proposalData.companyData?.fullName}!</h1>
        <p style="font-size: 16px; line-height: 1.5;">We are excited to have you join our team and begin this new chapter together.</p>

        <p style="font-size: 16px; line-height: 1.5;">As part of your onboarding process, we would like to ensure that you have access to all the necessary tools and resources. Below are the details to get started:</p>

        <h3 style="font-size: 18px; color: #0073e6;">Your First Day Information:</h3>
        <ul style="font-size: 16px; line-height: 1.5;">
            <li><span style="font-weight: bold;">Date:</span> ${moment(proposalData?.dateOfJoining).format('YYYY-MM-DD')}</li>
            <li><span style="font-weight: bold;">Reporting Time:</span> ${moment(proposalData?.dateOfJoining).format('HH:MM')}</li>
            <li><span style="font-weight: bold;">Location:</span> [Office Address / Virtual Meeting Link]</li>
            <li><span style="font-weight: bold;">Reporting To:</span> [Name and Designation of Reporting Manager/HR Contact]</li>
        </ul>

        <h3 style="font-size: 18px; color: #0073e6;">Login Credentials:</h3>
        <p style="font-size: 16px; line-height: 1.5;">To facilitate a smooth onboarding process, we have set up your account in our HRMS (Human Resource Management System). Please use the credentials below to log in:</p>
        <ul style="font-size: 16px; line-height: 1.5;">
            <li><span style="font-weight: bold;">HRMS Portal Link:</span> [Insert HRMS URL]</li>
            <li><span style="font-weight: bold;">Username:</span> [Candidate's Email ID or Assigned Username]</li>
            <li><span style="font-weight: bold;">Temporary Password:</span> [Insert Temporary Password]</li>
        </ul>
        <p style="font-size: 16px; line-height: 1.5;"><span style="font-weight: bold;">Note:</span> For security purposes, please log in at your earliest convenience and update your password upon first login.</p>

        <h3 style="font-size: 18px; color: #0073e6;">Next Steps:</h3>
        <ul style="font-size: 16px; line-height: 1.5;">
            <li><span style="font-weight: bold;">Complete Your Profile:</span> Update your details (e.g., contact information, bank details, and personal information) in the HRMS portal.</li>
            <li><span style="font-weight: bold;">Access Onboarding Materials:</span> You will find important documents, policies, and onboarding checklists available in the system.</li>
            <li><span style="font-weight: bold;">Attend Orientation:</span> [Provide timing/details if applicable].</li>
        </ul>

        <p style="font-size: 16px; line-height: 1.5;">If you face any issues accessing the portal or require assistance, please do not hesitate to reach out to me.</p>

        <p style="font-size: 16px; line-height: 1.5;">We are thrilled to have you on board and are confident you will have a wonderful journey with [Company Name]. Wishing you a fantastic start!</p>

        <p style="font-size: 16px; line-height: 1.5;">Once again, welcome aboard!</p>

        <p style="font-size: 16px; line-height: 1.5;">Best Regards,</p>
        <p style="font-size: 16px; line-height: 1.5;">${JSON.parse(localStorage.getItem(`user_info_${domainName}`))?.fullName}</p>
        <p style="font-size: 16px; line-height: 1.5;">[Your Designation]</p>
        <p style="font-size: 16px; line-height: 1.5;">${proposalData.companyData?.fullName}</p>
        <p style="font-size: 16px; line-height: 1.5;">[Contact Number]</p>
        <p style="font-size: 16px; line-height: 1.5;">${JSON.parse(localStorage.getItem(`user_info_${domainName}`))?.email}</p>
        <p style="font-size: 16px; line-height: 1.5;">[Company Website]</p>`
            setEditorValue(fetchedData)
        }
    }, [proposalData])



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reqData = {
            filePath: file,
            isVideo: false,
            isMultiple: false,
        };
        dispatch(fileUploadFunc(reqData)).then((res) => {
            if (res?.payload?.data) {
                setFormData(prev => ({
                    ...prev,
                    attachments: [...prev.attachments, res.payload?.data]
                }));
            }
        });
    };

    const handleRemoveFile = (index) => {
        setFormData(prev => {
            const updatedAttachments = prev.attachments.filter((_, i) => i !== index);
            return { ...prev, attachments: updatedAttachments };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            content: editorValue,
            to: formData?.to,
            cc: typeof formData?.cc === 'string' ? formData.cc.split(',').map(v => v.trim()) : [],
            subject: formData?.subject,
            attachments: formData?.attachments
        });

    };

    const handleClose = () => {
        setFormData({
            to: '',
            cc: [],
            subject: '',
            employeeName: '',
            jobTitle: '',
            companyName: '',
            joiningDate: '',
            joiningTime: '',
            officeAddress: '',
            salary: '',
            salaryDuration: 'year',
            confirmationDeadline: '',
            hrContact: '',
            senderName: '',
            senderTitle: '',
            portalURL: '',
            portalUsername: '',
            portalPassword: '',
            attachments: []
        });
        setIsPreview(false);
        setEditorValue('');
        setProposalId([])
        onClose();
    };

    const handleEditorChange = (value) => {
        setEditorValue(value);
    };

    if (!isOpen) return null;

    return (
        // <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1501]">
        //     <div className="bg-white rounded-lg px-6 pt-6 pb-3 w-[800px] max-h-[70vh] overflow-y-hidden">
        //         <div className="flex justify-between items-center mb-4">
        //             <h2 className="text-sm font-semibold text-gray-800">{isPreview ? 'Email Preview' : 'Proposal Email Template'}</h2>
        //             <button onClick={handleClose} className="text-gray-500 hover:text-gray-700"><FaTimes/></button>
        //         </div>

        <Modal
            open={true}
            onCancel={handleClose}
            footer={null}
            closable={true}
            width={800}
            bodyStyle={{ maxHeight: '70vh' }}
            centered
            zIndex={1501}
        >
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-semibold text-gray-800">
                    {isPreview ? 'Email Preview' : 'Proposal Email Template'}
                </h2>
            </div>

            <form autoComplete="off" onSubmit={handleSubmit} className="space-y-4 ">
                <div className="bg-white p-6 rounded-lg border border-gray-200 h-[50vh] overflow-y-auto">
                    <div className="space-y-4">
                        {/* Email Header */}
                        <div className="font-semibold text-sm">To:
                            <input
                                name="to"
                                value={formData.to}
                                onChange={handleChange}
                                placeholder="Recipient Email"
                                className="border p-2 w-full"
                            />
                        </div>
                        <div className="font-semibold text-sm">CC:
                            <input
                                name="cc"
                                value={formData.cc}
                                onChange={handleChange}
                                placeholder="CC Emails"
                                className="border p-2 w-full"
                            />
                        </div>
                        <div className="font-semibold text-sm">Subject:
                            <input
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="Email Subject"
                                className="border p-2 w-full"
                            />
                        </div>
                    </div>

                    {/* Email Body with React Quill */}
                    <div className="mt-4">
                        <ReactQuill
                            value={editorValue}
                            onChange={handleEditorChange}
                            placeholder="Write the email body here"
                            modules={{
                                toolbar: [
                                    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                    ['bold', 'italic', 'underline', 'strike'],
                                    [{ 'align': [] }],
                                    ['link', 'image', 'video'],
                                    ['blockquote', 'code-block'],
                                    ['clean']
                                ],
                            }}
                            formats={['header', 'font', 'list', 'bold', 'italic', 'underline', 'link', 'align', 'clean']}
                        />
                    </div>


                    <div className="border-t pt-4 mt-6">
                        <div className="font-medium mb-2">Attachments:</div>
                        {!isPreview ? (
                            <div className="space-y-4">
                                <input type="file" onChange={handleFileChange} className="hidden" id="file-upload" />
                                <label htmlFor="file-upload" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white cursor-pointer">
                                    <FaRegFile className="mr-2" /> Add Attachments
                                </label>

                                <div className="space-y-2">
                                    {formData.attachments.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                            <a
                                                href={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${file}`}
                                                className="flex items-center space-x-2"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <FaRegFile className="text-gray-500" />
                                                <span className="text-sm text-gray-600">{file}</span>
                                            </a>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveFile(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {/* Attachments preview logic */}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    {/* <button
                            type="button"
                            onClick={() => setIsPreview(!isPreview)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            {isPreview ? 'Edit Template' : 'Preview'}
                        </button> */}
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                    >
                        Generate Email
                    </button>
                </div>
            </form>
        </Modal>
        // </div>
        // </div>
    );
};

export default SendProposalModal;
