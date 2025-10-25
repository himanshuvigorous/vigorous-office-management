import { domainName } from '../../../constents/global';
import GlobalLayout from '../../../global_layouts/GlobalLayout/GlobalLayout';
import DirectorProjectdashboard from './DirectorProjectdashboard';
import EmployeeProjectTaskDasboard from './EmployeeProjectTaskDasboard';

const ProjectTaskDashboard = () => {
    const userInfoglobal = JSON.parse(
        localStorage.getItem(`user_info_${domainName}`)
    );
    return (

        <GlobalLayout isBreadCrump={false} >
            {userInfoglobal?.userType !== "employee"&&  <DirectorProjectdashboard userInfoglobal={userInfoglobal} />}
            {userInfoglobal?.userType === "employee" &&  <EmployeeProjectTaskDasboard  userInfoglobal={userInfoglobal}/>}

        </GlobalLayout>
    );
};

export default ProjectTaskDashboard;