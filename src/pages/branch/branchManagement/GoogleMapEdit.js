import {
    GoogleMap,
    LoadScript,
    Marker,
    Autocomplete,
  } from "@react-google-maps/api";
  import React, { useEffect, useState, useRef } from "react";
  import { inputClassName } from "../../../constents/global";
  
  const containerStyle = {
    width: "100%",
    height: "90%",
  };
  
  const GoogleMapContainerEdit = ({
    setLocation,
    setClickLocationaddres,
    innitialLocation
  }) => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const [clickedLocation, setClickedLocation] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const autocompleteRef = useRef(null);
    const mapRef = useRef(null);


  
    const getFullAddress = (lat, lng) => {
      if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
        console.error("Google Maps API is not loaded properly.");
        return;
      }
  
      const geocoder = new window.google.maps.Geocoder();
  
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results[0]) {
          const addressComponents = results[0].address_components;
          const formattedAddress = results[0].formatted_address;
  
          const country = addressComponents.find((comp) =>
            comp.types.includes("country")
          )?.long_name;
          const state = addressComponents.find((comp) =>
            comp.types.includes("administrative_area_level_1")
          )?.long_name;
          const city = addressComponents.find((comp) =>
            comp.types.includes("locality")
          )?.long_name;
          const postalCode = addressComponents.find((comp) =>
            comp.types.includes("postal_code")
          )?.long_name;
  
          setClickLocationaddres({
            address: formattedAddress,
            country,
            state,
            city,
            postalCode,
          });
        } else {
          console.error("Geocoder failed due to: ", status);
        }
      });
    };

    const handleMapClick = (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setClickedLocation({ lat, lng });
      getFullAddress(lat, lng); 
    };
  
    const handlePlaceSelect = () => {
      if (autocompleteRef.current) {
        const place = autocompleteRef.current.getPlace();
        if (place.geometry) {
          const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };
          setClickedLocation(location);
          mapRef.current.panTo(location);
          getFullAddress(location.lat, location.lng);
        }
      }
    };
  
    useEffect(() => {
if(innitialLocation?.latitude && innitialLocation?.longitude ){
  const location = { lat: innitialLocation?.latitude, lng: innitialLocation?.longitude };
  setCurrentLocation(location);
  setClickedLocation(location);
}
    }, [innitialLocation]);
  
    useEffect(() => {
      if (clickedLocation) {
        setLocation(clickedLocation);
      }
    }, [clickedLocation]);
  

    return (
      <div className="p-3 m-2 min-h-[400px]">
        {/* <LoadScript googleMapsApiKey={apiKey} libraries={["places"]}> */}
          <div className="mb-3">
            <Autocomplete
              onLoad={(ref) => (autocompleteRef.current = ref)}
              onPlaceChanged={handlePlaceSelect}
            >
              <input
                type="text"
                placeholder="Search for a place"
                className={`${inputClassName}`}
              />
            </Autocomplete>
          </div>
  
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={currentLocation || { lat: 0, lng: 0 }}
            zoom={(currentLocation ) ? 17 : 2}
            onClick={handleMapClick}
            onLoad={(map) => (mapRef.current = map)}
            options={{
              disableDefaultUI: false,
              zoomControl: true,
              fullscreenControl: true,
              mapTypeControl: true,
              streetViewControl: true,
            }}
          >
            {clickedLocation && (
              <Marker
                position={clickedLocation}
                icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
              />
            )}
          </GoogleMap>
        {/* </LoadScript> */}
      </div>
    );
  };
  
  export default GoogleMapContainerEdit;
  