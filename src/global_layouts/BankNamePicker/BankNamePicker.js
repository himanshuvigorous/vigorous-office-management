import { AutoComplete, Flex, Input } from 'antd';
import { inputClassName } from '../../constents/global';
import { countrycodeSearch } from '../../pages/global/address/country/CountryFeatures/_country_reducers';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { banknameSearch } from '../../pages/global/other/bankname/bankNameFeatures/_bankName_reducers';

function BankNamePicker({ onChange, errors , companyId }) {
    const dispatch = useDispatch();
    const { bankNameListData } = useSelector(
        (state) => state.bankname
    );

    useEffect(() => {
        dispatch(
            banknameSearch({
                isPagination: false,
                text: '',
                sort: true,
                status: true,
                companyId: companyId
            })
        );
    }, [dispatch]);


    return (
        <select
            onChange={onChange}
            className={`${inputClassName} ${errors?.documentType
                ? "border-[1px] "
                : ""
                }`}
        >
            <option value="">Select Bank Name</option>
            {bankNameListData?.map((bank) => (<option key={bank._id} value={bank.name}>{bank.name}</option>))}
        </select>
    );
}

export default BankNamePicker;

