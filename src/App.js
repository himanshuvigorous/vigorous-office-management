import "./App.css";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import PrivateRoute from "./routers/privateRoute";
import Login from "./pages/login/Login";
import JobPostApplication from "./pages/applicationManagement/JobPostApplication";
import { useEffect } from "react";
import PrivacyPolicy from "./pages/privacypolicy/PrivacyPolicy";
import TerminationsAndConditions from "./pages/termsandconditions/TerminationsAndConditions";
import { LoadScript } from "@react-google-maps/api";
import 'react-quill/dist/quill.snow.css';
import { SocketProvider } from "./GlobalContext/SocketContext";
import PayslipViewr from "./pages/hr/employeeSalary/employeePayrollModule/PayslipViewr";
import AboutUs from "./pages/landingPage/AboutUsPage";
import Contact from "./pages/landingPage/ContactUsPage";
import '@fortawesome/fontawesome-free/css/all.min.css';
function App() {


  useEffect(() => {
    const handleWheel = (e) => {
      const target = e.target;
      if (target.tagName === 'INPUT' && target.type === 'number') {
        target.blur();
      }
    };

    document.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      document.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <SocketProvider >
      <div className="wrapper">
        <BrowserRouter>
          <LoadScript
            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
            libraries={['places']}
            loadingElement={<div style={{ height: '100vh' }} />}
            id="google-maps-script">
            <Routes>
              <Route path="/" element={<Navigate to="/admin/dashboard" />} />
              <Route path="/login/:token?" element={<Login />} />
              <Route path="/viewPayslip" element={<PayslipViewr />} />
              <Route path="/applicationonjobpost/:jobPostIdEnc?" element={<JobPostApplication />} />
              <Route path="/landingpage" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route path="Terms-Conditions" element={<TerminationsAndConditions />} />
              <Route path="/admin/*" element={<PrivateRoute element={<Layout />} />} />
            </Routes>
          </LoadScript>
        </BrowserRouter>
      </div>
    </SocketProvider>
  );
}

export default App;
