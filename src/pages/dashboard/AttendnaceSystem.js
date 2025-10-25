// AttendanceModal.jsx
import React, { useEffect, useState, useRef } from "react";
import { Modal, Button, Typography, Space, Spin } from "antd";
import { FaMapMarkerAlt, FaCheckCircle, FaMap } from "react-icons/fa";
import { showNotification } from "../../global_layouts/CustomNotification/NotificationManager";
import moment from "moment";
import { useDispatch } from "react-redux";
import { attendancegCreate, updateattendanceg } from "../hr/attendance/AttendanceFeatures/_attendance_reducers";

const { Title, Text } = Typography;

const AttendanceModal = ({ 
  visible, 
  onClose, 
  actionType, 
  todayAttendanceData, 
  userInfoglobal,
  onSuccess 
}) => {
  const dispatch = useDispatch();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentAddress, setCurrentAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Getting location, 2: Show location, 3: Success
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const mapRef = useRef(null);
  const [mapLoading, setMapLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      setStep(1);
      getLocation();
    } else {
      // Reset state when modal closes
      setCurrentLocation(null);
      setCurrentAddress("");
      setMap(null);
      setMarker(null);
    }
  }, [visible, actionType]);

  // Load Google Maps script
  useEffect(() => {
    if (step === 2 && currentLocation && !window.google) {
      loadGoogleMapsScript();
    } else if (step === 2 && currentLocation && window.google) {
      initializeMap();
    }
  }, [step, currentLocation]);

  const loadGoogleMapsScript = () => {
    if (window.google) return;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      initializeMap();
    };
    script.onerror = () => {
      console.error("Failed to load Google Maps script");
      setMapLoading(false);
    };
    document.head.appendChild(script);
  };

  const initializeMap = () => {
    if (!currentLocation || !mapRef.current || !window.google) return;
    
    setMapLoading(true);
    
    try {
      const google = window.google;
      const mapOptions = {
        center: { lat: currentLocation.lat, lng: currentLocation.lng },
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      };
      
      const newMap = new google.maps.Map(mapRef.current, mapOptions);
      setMap(newMap);
      
      // Add marker for current location
      const newMarker = new google.maps.Marker({
        position: { lat: currentLocation.lat, lng: currentLocation.lng },
        map: newMap,
        title: 'Your current location',
        icon: {
          url: 'data:image/svg+xml;base64,' + btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
              <path fill="${actionType === 'checkIn' ? '#1890ff' : '#ff4d4f'}" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5a2.5 2.5 0 0 1 0 5z"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 32)
        }
      });
      
      setMarker(newMarker);
      
      // Add circle to show accuracy
      if (currentLocation.accuracy) {
        new google.maps.Circle({
          strokeColor: actionType === 'checkIn' ? '#1890ff' : '#ff4d4f',
          strokeOpacity: 0.4,
          strokeWeight: 1,
          fillColor: actionType === 'checkIn' ? '#1890ff' : '#ff4d4f',
          fillOpacity: 0.2,
          map: newMap,
          center: { lat: currentLocation.lat, lng: currentLocation.lng },
          radius: currentLocation.accuracy
        });
      }
      
      setMapLoading(false);
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapLoading(false);
    }
  };

  const getLocation = async () => {
    try {
      if (!navigator.geolocation) {
        showNotification({
          message: "Geolocation is not supported by your browser",
          type: "error",
        });
        onClose();
        return;
      }

      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        });
      });

      const { latitude, longitude, accuracy } = position.coords;
      
      if (accuracy > 200) {
        showNotification({
          message: `Low GPS accuracy (${Math.round(accuracy)} meters). For better results, enable GPS.`,
          type: "warning",
        });
      }

      const location = { lat: latitude, lng: longitude, accuracy };
      setCurrentLocation(location);
      
      // Get address from coordinates
      const address = await getFullAddress(latitude, longitude);
      setCurrentAddress(address);
      setStep(2);
      
    } catch (error) {
      console.error("Error getting location:", error);
      showNotification({
        message: "Failed to get your location. Please try again.",
        type: "error",
      });
      onClose();
    }
  };

  const getFullAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      return "Address not available";
    } catch (error) {
      console.error("Error getting address:", error);
      return "Could not retrieve address";
    }
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    
    try {
      const currentTime = new Date().toISOString();
      
      if (actionType === "checkIn") {
        const reqData = {
          _id: todayAttendanceData?._id,
          employeId: userInfoglobal?._id,
          companyId: userInfoglobal?.companyId || null,
          branchId: userInfoglobal?.branchId || null,
          directorId: userInfoglobal?.directorId || null,
          attendanceDate: moment().format("YYYY-MM-DD"),
          checkInTime: currentTime,
          checkOutTime: null,
          method: "google_api",
          checkInLocation: {
            latitude: currentLocation.lat,
            longitude: currentLocation.lng,
            address: currentAddress,
          },
        };
        
        await dispatch(attendancegCreate(reqData));
        showNotification({
          message: "Checked in successfully!",
          type: "success",
        });
        
      } else if (actionType === "checkOut") {
        const reqData = {
          _id: todayAttendanceData._id,
          employeId: todayAttendanceData.employeId || null,
          companyId: todayAttendanceData.companyId,
          branchId: todayAttendanceData.branchId,
          directorId: todayAttendanceData.directorId,
          attendanceDate: todayAttendanceData.attendanceDate,
          checkInTime: todayAttendanceData.checkInTime,
          checkOutTime: currentTime,
          method: "google_api",
          checkOutLocation: {
            latitude: currentLocation.lat,
            longitude: currentLocation.lng,
            address: currentAddress,
          },
        };
        
        await dispatch(updateattendanceg(reqData));
        showNotification({
          message: "Checked out successfully!",
          type: "success",
        });
      }
      
      setStep(3);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error("Error processing attendance:", error);
      showNotification({
        message: error?.data?.message || `Failed to ${actionType === "checkIn" ? "check in" : "check out"}. Please try again.`,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="text-center py-8">
            <div className="animate-pulse">
              <FaMapMarkerAlt className="text-4xl text-blue-500 mx-auto mb-4" />
            </div>
            <Title level={4} className="text-gray-700">
              Getting your location...
            </Title>
            <Text className="text-gray-500">
              Please allow location access to continue
            </Text>
          </div>
        );
      
      case 2:
        return (
          <div className="py-4">
            <div className="text-center mb-6">
              <FaMapMarkerAlt className="text-3xl text-blue-500 mx-auto mb-2" />
              <Title level={4} className="text-gray-700">
                Confirm Your Location
              </Title>
              <Text className="text-gray-500">
                Please verify this is your correct location before {actionType === "checkIn" ? "checking in" : "checking out"}
              </Text>
            </div>
            
            {/* Map Container */}
            <div className="mb-6 rounded-lg overflow-hidden border border-gray-200" style={{ height: '250px' }}>
              {mapLoading && (
                <div className="h-full flex items-center justify-center bg-gray-100">
                  <Spin tip="Loading map..." />
                </div>
              )}
              <div 
                ref={mapRef} 
                className="w-full h-full"
                style={{ display: mapLoading ? 'none' : 'block' }}
              />
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <Text strong className="block mb-2">Your current location:</Text>
              <Text className="text-gray-700">{currentAddress}</Text>
              
              {currentLocation && (
                <div className="mt-3 text-sm text-gray-500">
                  <div>Latitude: {currentLocation.lat.toFixed(6)}</div>
                  <div>Longitude: {currentLocation.lng.toFixed(6)}</div>
                  <div>Accuracy: {Math.round(currentLocation.accuracy)} meters</div>
                </div>
              )}
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <Text className="text-blue-700">
                <strong>Note:</strong> Your location will be recorded for attendance purposes.
              </Text>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                onClick={handleConfirm}
                loading={isLoading}
                icon={<FaMapMarkerAlt />}
              >
                Confirm {actionType === "checkIn" ? "Check-In" : "Check-Out"}
              </Button>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="text-center py-8">
            <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-4" />
            <Title level={4} className="text-gray-700">
              {actionType === "checkIn" ? "Checked In" : "Checked Out"} Successfully!
            </Title>
            <Text className="text-gray-500">
              Your attendance has been recorded
            </Text>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center">
          <FaMap className="mr-2 text-blue-500" />
          {actionType === "checkIn" ? "Check-In" : "Check-Out"} Verification
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={550}
      closable={step !== 1}
      destroyOnClose
    >
      {renderStepContent()}
    </Modal>
  );
};

export default AttendanceModal;