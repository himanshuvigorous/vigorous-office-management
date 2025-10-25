import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { decrypt } from '../../../../config/Encryption';
import { useDispatch, useSelector } from 'react-redux';
import { getCompanyPageById } from './CompanyPageFeatures/_companyPage_reducers';
import GlobalLayout from '../../../../global_layouts/GlobalLayout/GlobalLayout';

const DynamicPage = () => {
  const {pageIdEnc } = useParams();
const pageId = decrypt(pageIdEnc)
const {companyPageByIdData} = useSelector(state=>state.page)
const dispatch = useDispatch();

useEffect(() => {
    let reqData = {
      _id: pageId,
    };

    dispatch(getCompanyPageById(reqData));
  }, []);

  return (
    <GlobalLayout>
       <h1>{companyPageByIdData?.data?.slug}</h1> 
       <div
        dangerouslySetInnerHTML={{
          __html: companyPageByIdData?.data?.content,
        }}
      />
    </GlobalLayout>
  );
};

export default DynamicPage;
