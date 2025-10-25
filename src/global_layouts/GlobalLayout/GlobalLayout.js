import React, { useState, useEffect } from 'react';
import { FaSearch } from "react-icons/fa";
import { BiMenuAltLeft } from 'react-icons/bi';
import { Spin } from 'antd';
import PageHeader from "../pageHeader/PageHeader";
import BreadCrumpLayout from './BreadCrumpLayout';
import { dynamicSidebarSearch } from '../../pages/DyanmicSidebar/DyanmicSidebarFeatures/_dyanmicSidebar_reducers';
import { useDispatch, useSelector } from 'react-redux';

function GlobalLayout({ icons, title, children, onChange, value ,isBreadCrump =false}) {
  const [searchQuery, setSearchQuery] = useState(value => value || '');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!onChange) return;

    searchQuery && setLoading(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [searchQuery, onChange]);

  useEffect(() => {
    if (onChange) {
      onChange(debouncedQuery);
    }
  }, [debouncedQuery, onChange]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };



  return (
    <div className="content-wrapper">
      <section className="content pt-2">
        <PageHeader>
          <div className="flex items-center gap-2">
            <div
              data-widget="pushmenu"
              className="block mdlg:hidden rounded-xl cursor-pointer"
            >
              <BiMenuAltLeft className='text-header w-[30px] h-[30px]' />
            </div>

            {onChange && (
              <div className="relative flex items-center">
                <FaSearch className="absolute left-3 text-gray-400" size={14} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 pr-10 py-2 text-left rounded-md text-[12px] shadow-sm sm:w-[300px] w-[150px] bg-white"
                  placeholder="Search .."
                />
                {loading && (
                  <div className="absolute right-3">
                    <Spin size="small" />
                  </div>
                )}
              </div>
            )}
          </div>

        </PageHeader>
       <div>
         <BreadCrumpLayout isBreadCrump={isBreadCrump} children={children} />
        
       </div>
      </section>
    </div>
  );
}

export default GlobalLayout;
