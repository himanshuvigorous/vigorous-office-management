import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaAngleLeft, FaAngleDown } from "react-icons/fa";
import { RxDoubleArrowRight, RxDoubleArrowLeft } from "react-icons/rx";
import { sidebarMenu } from "./sidebarMenu";
import { useDispatch, useSelector } from "react-redux";
import { domainName, transformData } from "../../constents/global";
import { getviewFinalsidebarList } from "../../pages/DyanmicSidebar/DyanmicSidebarFeatures/_dyanmicSidebar_reducers";
import { SidebarSkeleton } from "./SidebarSkeleton";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = () => {
  // Get active path from localStorage or initialize as empty array
  const [activePath, setActivePath] = useState(() => {
    const savedPath = localStorage.getItem(`sidebarActivePath_${domainName}`);
     return savedPath ? JSON.parse(savedPath) : [];
  });
  const [isMobile, setIsMobile] = useState(false);
  const [loadingSidebar, setLoadingSidebar] = useState(false);
  const [finalSidebarList, setFinalSidebarList] = useState([]);
  const [finalPageRoleData, setFinalPageRoledata] = useState([]);
  const { sidebarViewData, loading } = useSelector((state) => state.dynamicSidebar);
  const { PageRoleData } = useSelector((state) => state.rolePermission);
  const dispatch = useDispatch();
  const [sidebarDynamicData, setSidebarDynamicData] = useState([...sidebarMenu]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const subMenuVariants = {
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  // Save activePath to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`sidebarActivePath_${domainName}`, JSON.stringify(activePath));
  }, [activePath]);

  useEffect(() => {
    getDataList();
  }, []);

  const getDataList = () => {
    dispatch(
      getviewFinalsidebarList({
        text: "",
      })
    );
  };

  useEffect(() => {
    if (sidebarViewData) {
      setFinalSidebarList(sidebarViewData);
    }
  }, [sidebarViewData]);

  useEffect(() => {
    if (PageRoleData) {
      setFinalPageRoledata(PageRoleData);
    }
  }, [PageRoleData]);

  useEffect(() => {
    if (finalSidebarList) {
      setLoadingSidebar(true);
      const formattedData = transformData(finalSidebarList, PageRoleData);
      setSidebarDynamicData([...sidebarMenu, ...formattedData]);
      setLoadingSidebar(false);
    }
  }, [finalSidebarList, PageRoleData]);

  const userType = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  )?.userType;

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 992);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubMenuToggle = (title, path) => {
    setActivePath((prevPath) => {
      if (prevPath.includes(title)) {
        return prevPath.slice(0, prevPath.indexOf(title));
      } else {
        return [...path, title];
      }
    });
  };

  const closeSidebarOnMobile = () => {
    if (isMobile) {
      const sidebar = document.querySelector(".sidebar-mini");
      if (sidebar) {
        sidebar.classList.remove("sidebar-open");
        sidebar.classList.add("sidebar-closed");
        sidebar.classList.add("sidebar-collapse");
      }
    }
  };

  const sortedMenuItems = sidebarDynamicData
    ?.filter(
      (item) => item.visible && (!item.role || item.role.includes(userType)))
    .sort((a, b) => a.orderBy - b.orderBy);

  const navigate = useNavigate();

  const renderSubMenu = (submenuItems, path = [], level = 1) => {
    return (
      <motion.ul
        initial="closed"
        animate="open"
        exit="closed"
        variants={subMenuVariants}
        className="overflow-hidden"
      >
        {submenuItems.sort((a, b) => a.orderBy - b.orderBy).map((subItem, subIndex) => {
          const isActive = activePath.includes(subItem.title);
          const isLastChild = activePath[activePath.length - 1] === subItem.title;
          
          return (
            <li key={subIndex} className="border-b">
              <button
                onClick={() => {
                  if (subItem.submenu) {
                    handleSubMenuToggle(subItem.title, path);
                  } else {
                    closeSidebarOnMobile();
                    navigate(subItem.path);
                    setActivePath((prevPath) => {
                      if (prevPath.includes(subItem?.title)) {
                        return prevPath.slice(0, prevPath.indexOf(subItem?.title));
                      } else {
                        return [...path, subItem?.title];
                      }
                    });
                  }
                }}
                className={`flex justify-between items-center w-full py-2 px-4 text-sm hover:bg-[#c9eff2]`}
              >
                <div style={{ paddingLeft: `${level * 9}px` }} className="flex items-center">
                  <i
                    className={`${level !== 1 ? "fa-regular fa-circle" : "fa-solid fa-location-arrow"} ${
                      isLastChild ? '!text-header' : '!text-gray-500'
                    } ${level === 1 ? 'text-[17px]' : 'text-[12px]'} mr-2 flex justify-center items-center`}
                  />
                  <span
                    className={`!capitalize text-start ${
                      isLastChild ? '!text-header font-semibold' : '!text-gray-600'
                    } ${!isSidebarOpen ? 'opacity-100 block' : 'opacity-0 hidden'}`}
                  >
                    {subItem.title}
                  </span>
                </div>
                {subItem.submenu && (
                  <span className={`${!isSidebarOpen ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
                    {isActive ? <FaAngleDown /> : <FaAngleLeft />}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {subItem.submenu && isActive && renderSubMenu(subItem.submenu, [...path, subItem.title], level + 1)}
              </AnimatePresence>
            </li>
          );
        })}
      </motion.ul>
    );
  };

  useEffect(() => {
    const checkSidebarStatus = () => {
      setIsSidebarOpen(document.body.classList.contains("sidebar-collapse"));
    };
    checkSidebarStatus();
    const observer = new MutationObserver(checkSidebarStatus);
    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const handleToggle = () => {
    document.body.classList.toggle("sidebar-collapse");
  };

  const handleToggle2 = () => {
    document.body.classList.toggle("sidebar-collapse");
    document.body.classList.toggle("sidebar-closed");
    document.body.classList.toggle("sidebar-open");
  };


 
  return (
    <aside className={`main-sidebar !capitalize sidebar-no-expand ${
      isSidebarOpen ? 'sidebar-collapse' : ''
    } bg-[#FFFFFF]`}>
      <div className="brand-link cursor-pointer" onClick={handleToggle}>
        {!isSidebarOpen && (
          <span className="nav-sidebar hidden mdlg:flex justify-between items-center space-x-2 h-9 w-full text-header px-2 font-[600]">
            <span className="flex">
              OFFICE &nbsp;
              <p className="text-[#7AC943]">NEXUS</p>
            </span>
            <div>
              <RxDoubleArrowLeft className="" />
            </div>
          </span>
        )}
        {isSidebarOpen && (
          <span className="nav-sidebar flex justify-between items-center space-x-2 h-9 w-full text-header px-2 font-[600]">
            <div>
              <RxDoubleArrowRight className="" />
            </div>
          </span>
        )}
      </div>
      <div className="sidebar overflow-scrollbar-zero">
        <span className="nav-sidebar flex mdlg:hidden justify-between items-center space-x-2 h-9 w-full text-header px-[1rem] py-4 font-[600]">
          <span className="flex">
            OFFICE &nbsp;
            <p className="text-[#7AC943]">NEXUS</p>
          </span>
          <div onClick={handleToggle2}>
            <RxDoubleArrowLeft />
          </div>
        </span>
        <nav className={`navbar-expand  md:max-h-full ${isSidebarOpen ? 'pointer-events-none' : ''}`}>
          <ul className="max-h-[75vh] md:max-h-full overflow-auto overflow-scrollbar-zero">
            {(loading || loadingSidebar) ? (
              <SidebarSkeleton />
            ) : (
              sortedMenuItems?.map((item, index) => {
                const isActive = activePath.includes(item.title);
                
                return (
                  <li key={index} className="sidebar-item border-b">
                    <button
                      onClick={() => {
                        if (item.submenu) {
                          handleSubMenuToggle(item.title, []);
                        } else {
                          closeSidebarOnMobile();
                          navigate(item.path || '#');
                          setActivePath((prevPath) => {
                            return [item?.title];
                          });
                        }
                      }}
                      className={`flex justify-between items-center w-full py-2 px-4 text-sm ${
                        isActive ? 'text-header font-semibold bg-blue-200' : 'bg-white'
                      } hover:bg-[#c9eff2]`}
                    >
                      <div className="flex items-center">
                        <i
                          className={`${item.icon} w-6 h-6 text-[18px] mr-2 flex justify-center items-center ${
                            isActive ? '!text-header' : '!text-gray-500'
                          }`}
                        />
                        <span
                          className={`!capitalize text-start ${
                            isActive ? '!text-header font-semibold' : '!text-gray-600'
                          } ${!isSidebarOpen ? 'opacity-100 block' : 'opacity-0 hidden'}`}
                        >
                          {item.title}
                        </span>
                      </div>
                      {item.submenu && item.submenu.length > 0 && (
                        <span className={`${!isSidebarOpen ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
                          {isActive ? <FaAngleDown /> : <FaAngleLeft />}
                        </span>
                      )}
                    </button>
                    <AnimatePresence>
                      {item.submenu && isActive && renderSubMenu(item.submenu, [item.title], 1)}
                    </AnimatePresence>
                  </li>
                );
              })
            )}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;