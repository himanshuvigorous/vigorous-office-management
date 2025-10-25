import { AutoComplete, Input } from 'antd';
import React from 'react'
import { Controller, useWatch } from 'react-hook-form';
import { inputClassName, inputerrorClassNameAutoComplete, inputLabelClassName, sortByPropertyAlphabetically } from '../../constents/global';
import { countrySearch } from '../../pages/global/address/country/CountryFeatures/_country_reducers';
import { stateSearch } from '../../pages/global/address/state/featureStates/_state_reducers';
import { citySearch } from '../../pages/global/address/city/CityFeatures/_city_reducers';
import ListLoader from '../../global_layouts/ListLoader';
import { useDispatch, useSelector } from 'react-redux';

const AddressComponent = ({control,countryName,stateName,pinCodeName,cityName,primartyAddressName,register,errors,label, isRequired = false,}) => {
     const { countryListData, secCountryList } = useSelector((state) => state.country);
     const { stateListData, secStateList } = useSelector((state) => state.states);
     const { cityListData, secCityList } = useSelector((state) => state.city);
       const PrintState = useWatch({
         control,
         name: "PDState",
         defaultValue: "",
       });
       const PrintCountry = useWatch({
         control,
         name: "PDCountry",
         defaultValue: "",
       });
    const dispatch = useDispatch()
  return (
    <div>  <div className="mt-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">
                        <div className="col-span-2">
                          <label className={`${inputLabelClassName}`}>
                            {label}<span className={`${isRequired ?"text-red-600" :'hidden'}`}>*</span>
                          </label>
                          <input
                            type="text"
                            {...register(`${primartyAddressName}`, {
                                ...(isRequired ? { required: `primary Address is required` } : {}),
                            })}
                            className={`${inputClassName} ${errors?.[primartyAddressName] ? "border-[1px] " : "border-gray-300"}`}
                            placeholder="Enter  Address"
                          />
                          {errors?.[primartyAddressName] && (
                            <p className="text-red-500 text-sm">
                              {errors?.[primartyAddressName].message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 md:gap-8 gap-3 md:my-1 px-3">
                        <div>
                          <div className={`${inputLabelClassName}`}>
                            Country <span className={`${isRequired ?"text-red-600" :'hidden'}`}>*</span>
                          </div>
                          <Controller
                            control={control}
                            name={`${countryName}`}
                            rules={isRequired ? { required: "Country is required" }:{}}
                            render={({ field }) => (
                              <AutoComplete
                                className="w-full"
                                {...field}
                                onChange={(value) => {
      
                                  field.onChange(value);
                                }}
                                options={sortByPropertyAlphabetically(countryListData?.docs)?.map((type) => ({
                                  value: type?.name,
                                }))}
                                notFoundContent={<ListLoader/>}
                              >
                                <input
                                  placeholder="Enter Country"
    
                                  onFocus={() => {
                                    dispatch(
                                      countrySearch({
                                        isPagination: false,
                                        text: "",
                                        sort: true,
                                        status: true,
                                      })
                                    );
                                  }}
                                  className={`${inputClassName} ${errors?.[countryName]
                                    ? "border-[1px] "
                                    : "border-gray-300"
                                    }`}
                                />
                              </AutoComplete>
                            )}
                          />
                          {isRequired && (errors?.[countryName] && (
                            <p className={`${inputerrorClassNameAutoComplete}`}>
                              {errors?.[countryName].message}
                            </p>
                          )) }
                        </div>
                        <div>
                          <div className={`${inputLabelClassName}`}>
                            State <span className={`${isRequired ?"text-red-600" :'hidden'}`}>*</span>
                          </div>
                          <Controller
                            control={control}
                            name={`${stateName}`}
                            rules={isRequired ? { required: "State is required" }:{}}
                            render={({ field }) => (
                              <AutoComplete
                                className="w-full"
                                {...field}
                                onChange={(value) => field.onChange(value)} // Directly handle state change using React Hook Form's field.onChange
                                options={sortByPropertyAlphabetically(stateListData?.docs)?.map((type) => ({
                                  value: type?.name,
                                }))}
                                notFoundContent={<ListLoader/>}
                              >
                                <input
                                  placeholder="Enter State"
                                  onFocus={() => {
                                    dispatch(
                                      stateSearch({
                                        isPagination: false,
                                        text: "",
                                        countryName: PrintCountry,
                                        sort: true,
                                        status: true,
                                      })
                                    );
                                  }}
                                  className={`${inputClassName} ${errors?.[stateName]
                                    ? "border-[1px] "
                                    : "border-gray-300"
                                    }`}
                                />
                              </AutoComplete>
                            )}
                          />
                          {isRequired && (errors?.[stateName] && (
                            <p className={`${inputerrorClassNameAutoComplete}`}>
                              {errors?.[stateName].message}
                            </p>
                          ))}
                        </div>
    
    
                        <div>
                          <div className={`${inputLabelClassName}`}>
                            City <span className={`${isRequired ?"text-red-600" :'hidden'}`}>*</span>
                          </div>
                          <Controller
                            control={control}
                            name={`${cityName}`}
                            rules={isRequired ? { required: "City is required" }:{}}
                            render={({ field }) => (
                              <AutoComplete
                                className="w-full"
                                {...field}
                                onChange={(value) => field.onChange(value)} // Directly handle city change using React Hook Form's field.onChange
                                options={sortByPropertyAlphabetically(cityListData?.docs)?.map((type) => ({
                                  value: type?.name,
                                }))}
                                notFoundContent={<ListLoader/>}
                              >
                                <input
                                  onFocus={() => {
                                    dispatch(
                                      citySearch({
                                        isPagination: false,
                                        text: "",
                                        sort: true,
                                        status: true,
                                        "stateName": PrintState
    
                                      })
                                    );
                                  }}
                                  placeholder="Enter City"
                                  className={`${inputClassName} ${errors?.[cityName]
                                    ? "border-[1px] "
                                    : "border-gray-300"
                                    }`}
                                />
                              </AutoComplete>
                            )}
                          />
                          {isRequired && (errors?.[cityName] && (
                            <p className={`${inputerrorClassNameAutoComplete}`}>
                              {errors?.[cityName].message}
                            </p>
                          ))}
                        </div>
    
    
                        <div>
                          <label className={`${inputLabelClassName}`}>
                            Pin Code <span className={`${isRequired ?"text-red-600" :'hidden'}`}>*</span>
                          </label>
                          <Controller
                            control={control}
                            name={`${pinCodeName}`}
                            rules={isRequired ? { required: "Pin Code is required" }:{}}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="number"
                                placeholder="Enter Pin Code"
                                maxLength={6}
                                onInput={(e) => {
                                  if (e.target.value.length > 6) {
                                    e.target.value = e.target.value.slice(0, 6);
                                  }
                                }}
                                className={`${inputClassName} ${errors?.[pinCodeName]
                                  ? "border-[1px] "
                                  : "border-gray-300"
                                  }`}
                              />
                            )}
                          />
                          {isRequired && (errors?.[pinCodeName] && (
                            <p className="text-red-500 text-sm">
                              {errors?.[pinCodeName].message}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div></div>
  )
}

export default AddressComponent