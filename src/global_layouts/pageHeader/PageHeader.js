
import { LoginDetails } from "../../component/LoginDetails/LoginDetails";

function PageHeader({children}) {
  return (

      <div className={`flex  items-center ${children ? "justify-between" : "justify-end"}   lg:space-y-0 space-y-2 overflow-y-auto`} >
        {children }
        <LoginDetails />
      </div>

  );
}

export default PageHeader;
