import { Button, Modal } from "antd";
import { useForm } from "react-hook-form";
import { showNotification } from "../../../global_layouts/CustomNotification/NotificationManager";
import { useDispatch } from "react-redux";
import { inputClassName, inputLabelClassName } from "../../../constents/global";
import { updateGeneralVisitor } from "../visitor/visitorFeatures/_visitor_reducers";
import dayjs from "dayjs";


const ClientCheckoutModal = ({setVisitorModal, visitorModal , updateList}) => {
    const { control, handleSubmit, setValue, formState: { errors }, reset, register } = useForm();
    const visitorData = visitorModal?.data ?? null
    const dispatch = useDispatch()
    const onSubmit = async (data) => {
        const {
  date,
  checkInTime,
  checkOutTime,
  timeDurationStart,
  timeDurationEnd,
  ...payload
} = visitorData;
       const location = await getCurrentLocation();
             const address = await getFullAddress(location?.lat, location?.lng);
             const finalPayload = {
                ...payload,
                 checkOutTime: dayjs(),
                 checkOutLocation: {
                     latitude: location?.lat ?? 0,
                     longitude: location.lng ?? 0,
                     address: address ?? "",
                 },
                 kilometer: Number(data?.km),
             };
        dispatch(updateGeneralVisitor(finalPayload)).then((data) => {
            if (!data.error) 
            setValue('km', null)
            setVisitorModal({
                data:null,
                isOpen: false
            })
            updateList()
        });
    };

    return (
        <Modal
            className="antmodalclassName"
            title="Visitor Request"
            width={600}
            height={400}
            open={visitorModal?.isOpen}
            onCancel={() => setVisitorModal({
                data:null,
                isOpen: false
            })}
            footer={[

            ]}
        >
            <div>
                <div className="grid grid-col-1  gap-4">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="">
                            <label className={`${inputLabelClassName}`}>
                                Km <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="number"
                                {...register("km", {

                                })}
                                className={`placeholder: ${inputClassName} ${errors.km
                                    ? "border-[1px] "
                                    : "border-gray-300"
                                    }`}
                                placeholder="Enter Km"
                            />
                            {errors.km && (
                                <p className="text-red-500 text-sm">
                                    {errors.km.message}
                                </p>
                            )}
                        </div>
                        <div className="flex justify-end items-center m-2">
                            <Button key="checkin" type="primary" htmlType="submit" >
                                Check out
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
};

export default ClientCheckoutModal;




export const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
        showNotification({
            message: "Geolocation is not supported by your browser",
            type: "error",
        });
        throw new Error("Geolocation not supported");
    }

    const getPosition = () => {
        return new Promise((resolve, reject) => {
            const options = {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            };
            navigator.geolocation.getCurrentPosition(resolve, reject, options);
        });
    };

    try {
        const position = await getPosition();
        const { latitude, longitude, accuracy } = position.coords;

        if (accuracy > 200) {
            showNotification({
                message: "Low GPS accuracy. For better results, enable GPS in device settings.",
                type: "warning",
            });

            const userConfirmed = await new Promise((resolve) => {
                Modal.confirm({
                    title: "Low GPS Accuracy",
                    content: `Your location accuracy is low (${Math.round(accuracy)} meters). Do you want to continue anyway?`,
                    okText: "Yes, continue",
                    cancelText: "Cancel",
                    onOk: () => resolve(true),
                    onCancel: () => resolve(false),
                });
            });


            if (!userConfirmed) return null;
        }

        return {
            lat: latitude,
            lng: longitude,
            accuracy: accuracy,
            timestamp: position.timestamp,
            isFresh: (Date.now() - position.timestamp) < 30000
        };

    } catch (error) {
        console.warn("Primary geolocation failed:", error);
        try {
            const permission = await navigator.permissions?.query({ name: 'geolocation' });
            if (permission?.state === 'granted') {
                const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
                if (!apiKey) throw new Error("Missing Google Maps API key");

                const response = await fetch(
                    `https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`,
                    { method: "POST" }
                );

                const data = await response.json();

                if (data.location) {
                    showNotification({
                        message: "Using network-based location (enable GPS for higher accuracy)",
                        type: "info",
                    });

                    return {
                        lat: data.location.lat,
                        lng: data.location.lng,
                        accuracy: data.accuracy || 1000,
                        isApproximate: true
                    };
                }
            }
        } catch (fallbackError) {
            console.error("Fallback failed:", fallbackError);
        }

        showNotification({
            message: "Location not available. Please enable location services in your browser or device settings.",
            type: "error",
        });

        throw new Error("Location access failed");
    }
};








export const getFullAddress = async (lat, lng) => {
    return new Promise((resolve, reject) => {
        if (
            !window.google ||
            !window.google.maps ||
            !window.google.maps.Geocoder
        ) {
            console.error("Google Maps API is not loaded properly.");
            reject("Google Maps API is not loaded properly.");
            return;
        }

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results[0]) {
                resolve(results[0].formatted_address);
            } else {
                reject(`Geocoder failed due to: ${status}`);
            }
        });
    });
};