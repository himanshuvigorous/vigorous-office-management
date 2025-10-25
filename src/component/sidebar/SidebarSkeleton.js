import { Skeleton } from 'antd';

export const SidebarSkeleton = () => {
  return (
 
            <>
            {[...Array(8)].map((_, i) => (
              <li key={i} className="sidebar-item border-b">
                <div className="flex justify-between items-center w-full py-2 px-4">
                  <div className="flex items-center">
                    <Skeleton.Avatar active size="small" shape="square" className="mr-2" />
                    <Skeleton.Input active size="small" style={{ width: 120 }} />
                  </div>
                  <Skeleton.Button active size="small" shape="circle" style={{ width: 16 }} />
                </div>
              </li>
            ))}
            </>
        
  );
};