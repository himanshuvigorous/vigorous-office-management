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
  
  const GoogleMapContainer = ({

    setLocation,
    // address,
    setClickLocationaddres,
  }) => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const [clickedLocation, setClickedLocation] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const autocompleteRef = useRef(null);
    const mapRef = useRef(null);

    const getCurrentLocation = () => {

      const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    
      fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`, {
        method: 'POST',
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.location) {
            const { lat, lng } = data.location;
            const location = { lat, lng };
            setCurrentLocation(location);
            setClickedLocation(location); 
            getFullAddress(lat, lng);
          } else {
            console.error("Location data not found");
          }
        })
        .catch((error) => {
          console.error("Error getting location from Google API:", error);
        });
    };
    
  
    // Function to get the full address from latitude and longitude
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
  
          // Extract specific components
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
  
    // Handle map click to get latitude and longitude
    const handleMapClick = (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setClickedLocation({ lat, lng });
      getFullAddress(lat, lng); // Get address when map is clicked
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
          getFullAddress(location.lat, location.lng); // Get address for selected place
        }
      }
    };
  
    useEffect(() => {
      getCurrentLocation();
    }, []);
  
    useEffect(() => {
      if (clickedLocation) {
        setLocation(clickedLocation);
      }
    }, [clickedLocation]);
  
    // useEffect(() => {
    //   if (address && mapRef.current) {
    //     const geocoder = new window.google.maps.Geocoder();
    //     geocoder.geocode({ address }, (results, status) => {
    //       if (status === "OK" && results[0].geometry.location) {
    //         const location = {
    //           lat: results[0].geometry.location.lat(),
    //           lng: results[0].geometry.location.lng(),
    //         };
    //         setClickedLocation(location);
    //         mapRef.current.panTo(location);
    //         getFullAddress(location.lat, location.lng); // Get address for provided address
    //       } else {
    //         console.error(
    //           "Geocode was not successful for the following reason:",
    //           status
    //         );
    //       }
    //     });
    //   }
    // }, [address]);
  
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
            zoom={currentLocation ? 15 : 2}
            onClick={handleMapClick}
            onLoad={(map) => (mapRef.current = map)}
            options={{
            //   disableDefaultUI: false,
            //   zoomControl: true,
            //   fullscreenControl: true,
            //   mapTypeControl: true,
            //   streetViewControl: true,


              disableDefaultUI: false,
              zoomControl: true,
              fullscreenControl: true,
              mapTypeControl: true,
              streetViewControl: true,
              // Enable current location control (button on map)
              geolocationControl: true,
              
            }}
          >
            {/* Marker for the clicked location */}
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
  
  export default GoogleMapContainer;
  