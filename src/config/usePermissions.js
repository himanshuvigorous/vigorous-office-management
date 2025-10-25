import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { domainName } from '../constents/global';
import { decrypt } from './Encryption';

const usePermissions = (pageIdByParameter) => {

  
  const { pageId } = useParams();

  const decryptedPageId = pageIdByParameter ||  decrypt(pageId);

  const { PageRoleData } = useSelector((state) => state.rolePermission);
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  if (userInfoglobal?.userType !== 'employee' ) {
    return {
      canCreate: true,
      canRead: true,
      canUpdate: true,
      canDelete: true,
    };
  }
  const roles = PageRoleData?.permissions?.find(
    (permission) => permission?.pageId === decryptedPageId
  );
  const permissions = roles ? roles : {};

  return {
    canCreate: permissions?.canCreate || false,
    canRead: permissions?.canRead || false,
    canUpdate: permissions?.canUpdate || false,
    canDelete: permissions?.canDelete || false,
  };
};

export default usePermissions;
