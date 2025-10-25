import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { dynamicSidebarSearch } from "../../pages/DyanmicSidebar/DyanmicSidebarFeatures/_dyanmicSidebar_reducers";
import { Breadcrumb, Button, ConfigProvider } from "antd";

const BreadcrumbLayout = ({ isBreadCrump , children }) => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { sidebarListData } = useSelector((state) => state.dynamicSidebar);

    useEffect(() => {
        dispatch(
            dynamicSidebarSearch({
                isPagination: false,
            })
        );
    }, [dispatch]);

    const isEncodedString = (str) => {
        return /^[a-zA-Z0-9%]+$/.test(str) && str.length > 16;
    };

    const getParentHierarchy = (item, list) => {
        const hierarchy = [];
        let currentItem = item;

        while (currentItem) {
            if (currentItem.parentPageId) {
                const parent = list?.find(i => i._id === currentItem.parentPageId);
                if (parent) {
                    hierarchy.unshift(parent);
                    currentItem = parent;
                    continue;
                }
            }
            break;
        }

        return hierarchy;
    };

    const breadcrumbItems = useMemo(() => {
        if (!pathname || !sidebarListData || !Array.isArray(sidebarListData)) return [];

        const pathParts = pathname.split("/").filter(Boolean);
        if (pathParts.length === 0) return [];

        const items = [];

        // Add Home item for admin routes
        if (pathParts[0] === "admin") {
            items.push({
                title: "Home",
                onClick: () => {
                    localStorage.removeItem("sidebarActivePath_ca-admin");
                    navigate("/admin/dashboard");
                },
            });
        }

        const initialSlugIndex = pathParts[0] === "admin" ? 1 : 0;
        const initialSlug = pathParts[initialSlugIndex];
        const initialMatchedItem = sidebarListData.find(item => item.slug === initialSlug);

        if (!initialMatchedItem) return [];

        // Process each path part
        for (let i = initialSlugIndex; i < pathParts.length; i++) {
            if (isEncodedString(pathParts[i])) continue;

            const matchedItem = sidebarListData.find(item => item.slug === pathParts[i]);

            if (matchedItem) {
                const parentHierarchy = getParentHierarchy(matchedItem, sidebarListData);
                
                // Add parent hierarchy items
                parentHierarchy.forEach(parent => {
                    if (!items.some(item => item.title === parent.name)) {
                        items.push({
                            title: parent.name,
                            onClick: parent.path ? () => navigate(parent.path) : undefined,
                        });
                    }
                });

                // Add current item if not already present
                if (!items.some(item => item.title === matchedItem.name)) {
                    items.push({
                        title: matchedItem.name,
                        onClick: matchedItem.path ? () => navigate(matchedItem.path) : undefined,
                    });
                }
            } else if (i > initialSlugIndex) {
                // Only add non-matched parts after the initial slug
                items.push({
                    title: pathParts[i].charAt(0).toUpperCase() + pathParts[i].slice(1),
                });
            }
        }

        return items;
    }, [pathname, sidebarListData, navigate]);

    return (
        <div 
        // className="rounded-md !my-2"
        >
         
            {(breadcrumbItems.length > 0&& isBreadCrump &&
                <div className="flex justify-between items-center bg-header p-2 rounded-t my-2">
                    <ConfigProvider
                        theme={{
                            components: {
                                Breadcrumb: {
                                    separatorColor: "#ffffff",
                                    linkColor: "#f3f4f6",
                                    lastItemColor: "#f3f4f6",
                                },
                            },
                        }}
                    >
                        <Breadcrumb
                            separator=">"
                            items={breadcrumbItems.map(({ title, onClick }, index) => ({
                                key: index,
                                title: onClick ? (
                                    <span
                                        onClick={onClick}
                                        className="cursor-pointer hover:underline text-gray-100"
                                    >
                                        {title}
                                    </span>
                                ) : (
                                    <span className="text-gray-100">
                                        {title}
                                    </span>
                                ),
                            }))}
                        />
                    </ConfigProvider>
                    
                    <Button size="small" type="primary" onClick={() => navigate(-1)}>
                        Back
                    </Button>
                </div>
            )}
            <div className={breadcrumbItems.length > 0 ? "p-1" : ""}>
                {children}
            </div>
        </div>
    );
};

export default BreadcrumbLayout;