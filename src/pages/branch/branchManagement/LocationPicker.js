import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LoadScript, GoogleMap, Marker, StandaloneSearchBox } from '@react-google-maps/api';

// const libraries = ['places'];

const LocationPicker = ({ initialLat, initialLng, onLocationChange, editable = true }) => {
  const [markerPosition, setMarkerPosition] = useState(null);
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [zoom, setZoom] = useState(10);
  const [geocoder, setGeocoder] = useState(null);
  const [map, setMap] = useState(null);
  const searchBoxRef = useRef(null);
  const searchInputRef = useRef(null);

  // Initialize map with props or current location
  useEffect(() => {
    if (initialLat && initialLng) {
      const position = { lat: initialLat, lng: initialLng };
      setMarkerPosition(position);
      setCenter(position);
      setZoom(15);
      reverseGeocode(position);
    } else if (editable) {
      getCurrentLocation();
    }
  }, [initialLat, initialLng, editable]);

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          updateLocation(pos);
          
        },
        (error) => {
          console.error("Error getting current location:", error);
          const defaultPos = { lat: 20.5937, lng: 78.9629 }; // India coordinates
          updateLocation(defaultPos);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      const defaultPos = { lat: 20.5937, lng: 78.9629 }; // India coordinates
      updateLocation(defaultPos);
    }
  }, []);

  const reverseGeocode = useCallback(async (position) => {
    if (!window.google || !geocoder) return;

    try {
      const response = await geocoder.geocode({ location: position });
      if (response.results && response.results.length > 0) {
        return parseAddressComponents(response.results[0].address_components);
      }
      return null;
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      return null;
    }
  }, [geocoder]);

  const parseAddressComponents = (addressComponents) => {
    const address = {
      street: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
      fullAddress: '',
    };

    addressComponents.forEach(component => {
      if (component.types.includes('street_number') || component.types.includes('route')) {
        address.street = address.street ? `${address.street} ${component.long_name}` : component.long_name;
      }
      if (component.types.includes('locality')) {
        address.city = component.long_name;
      }
      if (component.types.includes('administrative_area_level_1')) {
        address.state = component.long_name;
      }
      if (component.types.includes('country')) {
        address.country = component.long_name;
      }
      if (component.types.includes('postal_code')) {
        address.pincode = component.long_name;
      }
    });

    if (addressComponents.length > 0) {
      address.fullAddress = addressComponents[0].formatted_address;
    }

    return address;
  };

  const updateLocation = useCallback(async (position) => {
    setMarkerPosition(position);
    setCenter(position);
    setZoom(13);

    const address = await reverseGeocode(position);
    if (onLocationChange) {
      onLocationChange({
        lat: position.lat,
        lng: position.lng,
        ...address
      });
    }
  }, [onLocationChange, reverseGeocode]);

  const onMapClick = useCallback(async (event) => {
    if (!editable) return;
    
    const position = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    await updateLocation(position);
  }, [editable, updateLocation]);

  const onSearchBoxLoad = useCallback((ref) => {
    searchBoxRef.current = ref;
  }, []);

  const onPlacesChanged = useCallback(async () => {
    if (searchBoxRef.current) {
      const places = searchBoxRef.current.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        if (place.geometry && place.geometry.location) {
          const position = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };
          await updateLocation(position);
        }
      }
    }
  }, [updateLocation]);

  const onMapLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
    setGeocoder(new window.google.maps.Geocoder());
  }, []);

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      {/* <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        libraries={libraries}
      > */}
        <GoogleMap
          mapContainerStyle={{ height: '100%', width: '100%' }}
          center={center}
          zoom={zoom}
          onClick={onMapClick}
          onLoad={onMapLoad}
          options={{
              disableDefaultUI: false,
              zoomControl: true,
              fullscreenControl: true,
              mapTypeControl: true,
              streetViewControl: true,
              geolocationControl: true,
              
            }}
        >
          {markerPosition && <Marker position={markerPosition} draggable={editable} />}
          
          {editable && (
            <StandaloneSearchBox
              onLoad={onSearchBoxLoad}
              onPlacesChanged={onPlacesChanged}
            >
              <input
                type="text"
                placeholder="Search for a location"
                ref={searchInputRef}
                style={{
                  boxSizing: 'border-box',
                  border: '1px solid transparent',
                  width: '300px',
                  height: '32px',
                  padding: '0 12px',
                  borderRadius: '3px',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                  fontSize: '14px',
                  outline: 'none',
                  textOverflow: 'ellipses',
                  position: 'absolute',
                  bottom: '10px',
                  left: '50%',
                  marginLeft: '-120px',
                }}
              />
            </StandaloneSearchBox>
          )}
        </GoogleMap>
      {/* </LoadScript> */}
    </div>
  );
};

export default LocationPicker;