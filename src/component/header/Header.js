import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { RxDoubleArrowLeft, RxDoubleArrowRight } from "react-icons/rx";
import { TbRefreshDot } from "react-icons/tb";
import { RiArrowLeftWideLine } from "react-icons/ri";
import { Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { reload } from "../../redux/_reducers/_auth_reducers";
const Header = () => {

  const dispatch = useDispatch();

  //   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // const [rotating, setRotating] = useState(false);
  const { reload_loading } = useSelector((state => state.authentication))
  const handleRefresh = async () => {
    // setRotating(true);
    // await new Promise(resolve => setTimeout(resolve, 1000)); 
    // window.location.reload();
    dispatch(reload()).then((res)=>{
      window.location.reload();
    })
  };

  const headingData = JSON.parse(localStorage.getItem('user_info_ca-admin'))




  //   useEffect(() => {
  //     const checkSidebarStatus = () => {
  //         setIsSidebarOpen(document.body.classList.contains('sidebar-collapse'));
  //     };

  //     // Initial check
  //     checkSidebarStatus();

  //     // Set up observer for class changes on the body
  //     const observer = new MutationObserver(checkSidebarStatus);
  //     observer.observe(document.body, { attributes: true });

  //     // Clean up observer on unmount
  //     return () => observer.disconnect();
  // }, []);
  // const handleToggle = () => {
  //     // Toggle the sidebar-open class on body
  //     document.body.classList.toggle('sidebar-collapse');
  // };
  return (
    <nav style={{ zIndex: 1550 }} className="main-header h-[38px] d-flex navbar navbar-expand bg-header">
    
      <span className="w-full relative flex justify-center items-center" role="button" >
        <marquee scrollamount="3">

          <div className="flex  gap-2 items-center">
            {/* {headingData?.logo ?
              <img
                src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${headingData?.logo}`}
                alt="Logo"
                className="h-7  "
              />
              : <span className="nav-sidebar flex justify-between items-center space-x-2 h-9 w-full text-[#3FA9F5] px-2 font-[600]">
                <span className="flex">
                  EASY &nbsp;
                  <p className="text-[#7AC943]">MY OFFICE</p>
                </span>

              </span>} */}
            <span className="text-white text-[15px] font-semibold">
              {headingData?.tagline || 'Welcome to OFFICE NEXUS'}
            </span>
          </div>
        </marquee>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[60%] z-20">
          
            <button
              onClick={handleRefresh}
              className={`flex items-center gap-2 text-sm font-semibold text-gray-800 bg-white 
                  border border-gray-200 px-2 py-2 shadow-xl rounded-tl-2xl rounded-bl-2xl 
                  transition-all duration-300 hover:bg-gray-100 hover:shadow-2xl active:scale-95`}
            >
              <TbRefreshDot
                size={20}
                className={`transition-transform duration-1000 ${reload_loading ? 'rotate-[360deg]' : ''
                  }`}
              />
              <span className="hidden md:inline-block w-6"></span>
            </button>
         
        </div>




      </span>
    </nav>
  );
};

export default Header;







