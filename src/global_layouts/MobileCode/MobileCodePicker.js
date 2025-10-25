import { Select, Flex, Input } from 'antd';
import { inputAntdSelectClassName } from '../../constents/global';
import { countrycodeSearch } from '../../pages/global/address/country/CountryFeatures/_country_reducers';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useMemo } from 'react';

function CustomMobileCodePicker({ field, errors, defaultValue }) {
    const dispatch = useDispatch();
    const { countrycodeListData } = useSelector((state) => state.country);
    const [searchTerm, setSearchTerm] = useState('');
    const [allOptions, setAllOptions] = useState([]);

    // Load all data initially
    useEffect(() => {
        if (!countrycodeListData?.docs?.length) {
            dispatch(
                countrycodeSearch({
                    isPagination: false,
                    text: '',
                    sort: true,
                    status: true,
                })
            );
        }
         if ( !field.value) {
                field.onChange('+91');
            }
    }, []);

    // Process and store all options when data is loaded
    useEffect(() => {
        if (Array.isArray(countrycodeListData?.docs)) {
            // Remove duplicates by using a map with countryMobileNumberCode as key
            const uniqueOptionsMap = new Map();
            
            countrycodeListData.docs.forEach(item => {
                if (!uniqueOptionsMap.has(item.countryMobileNumberCode)) {
                    uniqueOptionsMap.set(item.countryMobileNumberCode, {
                        value: item.countryMobileNumberCode,
                        label: (
                            <Flex align="center" gap={8}>
                                <img alt='' className='w-[20px] h-[20px] rounded-full' src={item.flag} />
                                <span>{item.countryCode}</span>
                                {item.countryMobileNumberCode}
                            </Flex>
                        ),
                        flag: item.flag,
                        countryCode: item.countryCode,
                        countryName: item.name,
                        mobileCode: item.countryMobileNumberCode
                    });
                }
            });

            const uniqueOptions = Array.from(uniqueOptionsMap.values());
            setAllOptions(uniqueOptions);

            // // Set +91 as default if it exists and no defaultValue is provided
            // const indiaOption = uniqueOptions.find(option => option.value === '+91');
           
        }
    }, [countrycodeListData]);

       const filteredOptions = useMemo(() => {
        if (!searchTerm.trim()) return allOptions;
        
        const searchText = searchTerm.toLowerCase();
        return allOptions.filter(option => {
            // Check if search term is a number (for country codes)
            const isNumberSearch = !isNaN(searchTerm);
            
            return (
                // Search in country code (e.g., "US")
                option.countryCode?.toLowerCase().includes(searchText) ||
                // Search in country name (e.g., "United States")
                option.countryName?.toLowerCase().includes(searchText)) ||
                // Search in full mobile code (e.g., "+1")
                option.mobileCode?.toLowerCase().includes(searchText) ||
                // If searching with numbers, also check without the '+' prefix
                (isNumberSearch && option.mobileCode?.replace('+', '').includes(searchTerm))
        
        });
    }, [searchTerm, allOptions]);

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    return (
        <Select
            {...field}
            showSearch
            optionFilterProp="children"
            onChange={(value) => {
                field.onChange(value);
            }}
            onSearch={handleSearch}
            filterOption={false} // Disable built-in filtering
            options={filteredOptions}
            defaultValue={defaultValue}
            value={field.value}
            popupClassName='w-[250px]'
            popupMatchSelectWidth={false}
            className={`${inputAntdSelectClassName} ${errors.PDState ? 'border-red-500' : 'border-gray-300'}`}
            dropdownRender={(menu) => (
                <>
                    <div style={{ padding: '8px' }}>
                        <input
                            placeholder="Search country code or name"
                            allowClear
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                    {menu}
                </>
            )}
        />
    );
}

export default CustomMobileCodePicker;

































// import React, { useMemo, useEffect, useCallback } from 'react';
// import { Select, Flex, Input } from 'antd';
// import { useDispatch, useSelector } from 'react-redux';
// import { FaAngleDown } from 'react-icons/fa';
// import { inputAntdSelectClassName } from '../../constents/global';
// import { countrycodeSearch } from '../../pages/global/address/country/CountryFeatures/_country_reducers';

// const CustomMobileCodePicker = React.memo(({ field, errors, defaultValue }) => {
//   const dispatch = useDispatch();
//   const { countrycodeListData, loadingCodes } = useSelector((state) => state.country);
  
//   // Memoized flag for whether we need to fetch data
//   const shouldFetchData = useMemo(
//     () => !countrycodeListData?.docs?.length && !loadingCodes,
//     [countrycodeListData, loadingCodes]
//   );

//   // Fetch country codes
//   useEffect(() => {
//     if (shouldFetchData) {
//       dispatch(
//         countrycodeSearch({
//           isPagination: false,
//           text: '',
//           sort: true,
//           status: true,
//         })
//       );
//     }
//   }, [dispatch, shouldFetchData]);

//   // Transform country data into options
//   const codeData = useMemo(() => {
//     if (!Array.isArray(countrycodeListData?.docs) || !countrycodeListData.docs.length) {
//       return [];
//     }

//     const options = countrycodeListData.docs.map((item) => ({
//       value: item?.countryMobileNumberCode,
//       label: (
//         <Flex align="center" gap={8}>
//           <img 
//             alt={item.countryCode} 
//             className='w-[20px] h-[20px] rounded-full' 
//             src={item.flag} 
//             loading="lazy"
//           />
//           <span>{item.countryCode}</span>
//           {item.countryMobileNumberCode}
//         </Flex>
//       ),
//       flag: item.flag,
//       countryCode: item.countryCode
//     }));

//     // Set +91 as default if it exists and no defaultValue is provided
//     if (!defaultValue && !field.value) {
//       const indiaOption = options.find(option => option.value === '+91');
//       if (indiaOption) {
//         field.onChange('+91');
//       }
//     }

//     return options;
//   }, [countrycodeListData, defaultValue, field]);

//   // Handle search with debounce would be even better here
//   const handleSearch = useCallback((value) => {
//     dispatch(
//       countrycodeSearch({
//         isPagination: false,
//         text: value.startsWith('+') ? value : `+${value}`,
//         sort: true,
//         status: true,
//       })
//     );
//   }, [dispatch]);

//   // Find the currently selected option
//   const selectedOption = useMemo(
//     () => codeData.find(option => option.value === field?.value),
//     [codeData, field?.value]
//   );

//   return (
//     <Select
//       {...field}
//       showSearch
//       optionFilterProp="children"
//       onChange={field.onChange}
//       onSearch={handleSearch}
//       filterOption={(input, option) =>
//         (option?.countryCode?.toLowerCase() ?? '').includes(input.toLowerCase()) ||
//         (option?.value?.toLowerCase() ?? '').includes(input.toLowerCase())
//       }
//       options={codeData}
//       defaultValue={defaultValue}
//       value={field.value}
//       popupClassName='w-[250px]'
//       popupMatchSelectWidth={false}
//       suffixIcon={<FaAngleDown className='text-gray-500' />}
//       className={`${inputAntdSelectClassName} ${errors?.PDState ? 'border-red-500' : 'border-gray-300'}`}
//       dropdownRender={(menu) => (
//         <>
//           <div style={{ padding: '8px' }}>
//             <input
//               placeholder="Search country code"
//               allowClear
//               onChange={(e) => handleSearch(e.target.value)}
//             />
//           </div>
//           {menu}
//         </>
//       )}
//     >
//       {selectedOption && (
//         <Select.Option value={selectedOption.value}>
//           <Flex align="center" gap={8}>
//             {selectedOption.flag && (
//               <img 
//                 alt={selectedOption.countryCode} 
//                 className='w-[18px] h-[12px]' 
//                 src={selectedOption.flag} 
//                 loading="lazy"
//               />
//             )}
//             <span>{selectedOption.value}</span>
//           </Flex>
//         </Select.Option>
//       )}
//     </Select>
//   );
// });

// export default CustomMobileCodePicker;

























// import { Select, Flex, Input } from 'antd';
// import { inputAntdSelectClassName, inputClassName } from '../../constents/global';
// import { countrycodeSearch } from '../../pages/global/address/country/CountryFeatures/_country_reducers';
// import { useDispatch, useSelector } from 'react-redux';
// import { useEffect, useState } from 'react';
// import { FaAngleDown } from 'react-icons/fa';

// function CustomMobileCodePicker({ field, errors, defaultValue }) {
//     const dispatch = useDispatch();
//     const { countrycodeListData ,loadingCodes } = useSelector((state) => state.country);
//     const [codeData, setCodeData] = useState([]);

//     useEffect(() => {
//         if(!countrycodeListData && !countrycodeListData?.docs && !countrycodeListData?.docs.length > 0 && !loadingCodes){
//         dispatch(
//             countrycodeSearch({
//                 isPagination: false,
//                 text: '',
//                 sort: true,
//                 status: true,
//             })
//         );
//           }
//     }, []);

//     useEffect(() => {
//         if (Array.isArray(countrycodeListData?.docs) && countrycodeListData?.docs.length > 0) {
//             const countrycodeList = countrycodeListData?.docs?.map((item) => ({
//                 value: item?.countryMobileNumberCode,
//                 label: (
//                     <Flex align="center"  gap={8}>
//                         <img alt='' className='w-[20px] h-[20px] rounded-full' src={item.flag} />
//                         <span>{item?.countryCode}</span>
//                         {item?.countryMobileNumberCode}
//                     </Flex>
//                 ),
//                 flag: item.flag,
//                 countryCode: item.countryCode
//             }));
//             setCodeData(countrycodeList);

//             // Set +91 as default if it exists and no defaultValue is provided
//             if (!defaultValue) {
//                 const indiaOption = countrycodeList.find(option => option.value === '+91');
//                 if (indiaOption && !field.value) {
//                     field.onChange('+91');
//                 }
//             }
//         } else {
//             setCodeData([]);
//         }
//     }, [countrycodeListData]);

//     const handleSearch = (value) => {
//         dispatch(
//             countrycodeSearch({
//                 isPagination: false,
//                 text: value.startsWith('+') ? value : `+${value}`,
//                 sort: true,
//                 status: true,
//             })
//         );
//     };

//     const selectedOption = codeData.find(option => option.value === field?.value);

//     return (
//         <Select
//             {...field}
//             showSearch
//             optionFilterProp="children"
//             onChange={(value) => {
//                 field.onChange(value);
//             }}
//             onSearch={handleSearch}
//             filterOption={(input, option) =>
//                 (option?.countryCode?.toLowerCase() ?? '').includes(input.toLowerCase()) ||
//                 (option?.value?.toLowerCase() ?? '').includes(input.toLowerCase())
//             }
//             options={codeData}
//             defaultValue={defaultValue}
//             value={field.value}
//             popupClassName='w-[250px]'
//             popupMatchSelectWidth={false}
//             suffixIcon={<FaAngleDown className='text-gray-500' />}
//             className={`${inputAntdSelectClassName} ${errors.PDState ? 'border-red-500' : 'border-gray-300'}`}
//             dropdownRender={(menu) => (
//                 <>
//                     <div style={{ padding: '8px' }}>
//                         <input
//                             placeholder="Search country code"
//                             allowClear
//                             onChange={(e) => handleSearch(e.target.value)}
//                         />
//                     </div>
//                     {menu}
//                 </>
//             )}
//         >
//             {selectedOption && (
//                 <Select.Option value={selectedOption.value}>
//                     <Flex align="center" gap={8}>
//                         {selectedOption.flag && <img alt='' className='w-[18px] h-[12px]' src={selectedOption.flag} />}
//                         <span>{selectedOption.value}</span>
//                     </Flex>
//                 </Select.Option>
//             )}
//         </Select>
//     );
// }

// export default CustomMobileCodePicker;

























// import { AutoComplete, Flex, Input } from 'antd';
// import { inputClassName } from '../../constents/global';
// import { countrycodeSearch } from '../../pages/global/address/country/CountryFeatures/_country_reducers';
// import { useDispatch, useSelector } from 'react-redux';
// import { useEffect, useState } from 'react';
// import { IoIosArrowDropdownCircle } from 'react-icons/io';
// import { FaAngleDown } from 'react-icons/fa';

// function CustomMobileCodePicker({ field, errors, defaultValue }) {
//     const dispatch = useDispatch();
//     const { countrycodeListData } = useSelector((state) => state.country);
//     const [codeData, setCodeData] = useState([]);
//     useEffect(() => {
//         dispatch(
//             countrycodeSearch({
//                 isPagination: false,
//                 text: '',
//                 sort: true,
//                 status: true,
//             })
//         );
//     }, []);

//     useEffect(() => {
//         if (Array.isArray(countrycodeListData?.docs) && countrycodeListData?.docs.length > 0) {
//             const countrycodeList = countrycodeListData?.docs?.map((item) => ({
//                 value: item?.countryMobileNumberCode,
//                 label: (
//                     <Flex align="center" gap={8}>
//                         <img alt='' className='w-[20px] h-[20px] rounded-full' src={item.flag} />
//                         <span>{item?.countryCode}</span>
//                         {item?.countryMobileNumberCode}
//                     </Flex>
//                 ),
//             }));
//             setCodeData(countrycodeList);
//         } else {
//             setCodeData([]);
//         }
//     }, [countrycodeListData]);
//     return (
//         <AutoComplete
//             {...field}
//             onChange={(value) => {
//                 field.onChange(value);
//             }}
//             onSearch={(value) => {
//                 dispatch(
//                     countrycodeSearch({
//                         isPagination: false,
//                         text: value.startsWith('+') ? value : `+${value}`,
//                         sort: true,
//                         status: true,
//                     })
//                 );
//             }}

//             options={codeData}
//             defaultValue={defaultValue}
//             popupClassName='w-[150px]'
//             popupMatchSelectWidth={false} >
//             <div className='flex items-center   mt-1 bg-white rounded-lg '>
//                 {countrycodeListData?.docs?.find((element) => element.countryMobileNumberCode == field?.value)?.flag ? <img alt='' className='w-[18px] h-[12px]  mx-1' src={countrycodeListData?.docs?.find((element) => element.countryMobileNumberCode == field?.value)?.flag} /> : <FaAngleDown className='mx-1 text-gray-500' size={20} />}


//                 <input
//                     placeholder='+91'
//                     value={field?.value}
//                     className={`  block w-full px-2 py-[12px]  rounded-lg  ${errors.PDState ? '' : 'border-gray-300'}`}
//                 />
//             </div>

//         </AutoComplete>
//     );
// }

// export default CustomMobileCodePicker;

















// import { AutoComplete, Input } from 'antd';
// import { inputClassName } from '../../constents/global';
// import { countrycodeSearch } from '../../pages/global/address/country/CountryFeatures/_country_reducers';
// import { useDispatch, useSelector } from 'react-redux';
// import { useEffect, useState } from 'react';
// import { Flex } from 'antd';

// function CustomMobileCodePicker({ field, errors, defaultValue = +91 }) {
//     const dispatch = useDispatch();
//     const { countrycodeListData } = useSelector((state) => state.country);
//     const [codeData, setCodeData] = useState([]);

//     useEffect(() => {
//         dispatch(
//             countrycodeSearch({
//                 isPagination: false,
//                 text: '',
//                 sort: true,
//                 status: true,
//             })
//         );
//     }, [dispatch]);

//     useEffect(() => {
//         if (Array.isArray(countrycodeListData?.docs) && countrycodeListData?.docs.length > 0) {
//             const countrycodeList = countrycodeListData?.docs?.map((item) => ({
//                 value: item?.countryMobileNumberCode,
//                 label: (
//                     <Flex align="center" gap={8}>
//                         <img alt="" className="w-[20px] h-[20px] rounded-full" src={item.flag} />
//                         <span>{item?.countryCode}</span>
//                         {item?.countryMobileNumberCode}
//                     </Flex>
//                 ),
//             }));
//             setCodeData(countrycodeList);
//         } else {
//             setCodeData([]);
//         }
//     }, [countrycodeListData]);

//     return (
//         <div className="flex items-center  !h-[44px] mt-1 pt-2.5   bg-white focus:outline-none shadow-sm rounded-xl ">



//             {/* Mobile Code Input */}
//             <AutoComplete
//                 {...field}
//                 onChange={(value) => field.onChange(value)}
//                 onSearch={(value) => {
//                     dispatch(
//                         countrycodeSearch({
//                             isPagination: false,
//                             text: value.startsWith('+') ? value : `+${value}`,
//                             sort: true,
//                             status: true,
//                         })
//                     );
//                 }}
//                 options={codeData}
//                 defaultValue={defaultValue}
//                 popupClassName="w-[150px]"
//                 popupMatchSelectWidth={false}
//             >

//                 <div className="flex  items-center justify-center gap-1.5 pl-2">
//                     {countrycodeListData?.docs?.find((element) => element.countryMobileNumberCode == field?.value)?.flag && <img
//                         alt=""
//                         className="w-[18px] h-[12px] "
//                         src={countrycodeListData?.docs?.find((element) => element.countryMobileNumberCode == field?.value)?.flag}
//                     />}
//                     <span className="ml-1 text-sm">
//                         {field?.value}
//                     </span>
//                 </div>
//             </AutoComplete>
//         </div>
//     );
// }

// export default CustomMobileCodePicker;
