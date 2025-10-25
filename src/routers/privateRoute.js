import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
function PrivateRoute({ element }) {
  const navigate = useNavigate();
  useEffect(() => {
    let login = localStorage.getItem('token');
    if (!login) {
      localStorage.clear()
      navigate('/login');
        if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'LOGOUT' }));
      }
    }
   }, []);

  return <>{element}</>;
}
export default PrivateRoute;