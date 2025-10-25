import { MdCalendarToday, MdLocationOn } from "react-icons/md";
import Modal from "../../../../global_layouts/Modal/Modal";

function DetailEventCalender({ setOpenWatchDetails, eventWatchDetails }) {
  return (
    <Modal 
    className="antmodalclassName"
    onClose={() => setOpenWatchDetails(false)}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold text-gray-900">Event Details</h3>
        <button
          onClick={() => setOpenWatchDetails(false)}
          className="text-gray-500 hover:text-gray-800 transition duration-200"
        >
          X
        </button>
      </div>

      <h4 className="text-xl font-semibold text-gray-900 mb-2">
        {eventWatchDetails?.title || "N/A"}
      </h4>
      <p className="text-sm text-gray-500 mb-6">
        {eventWatchDetails?.description || "No description provided"}
      </p>

      <div className="space-y-4">
        {/* Event Start */}
        <div className="flex items-center space-x-3">
          <MdCalendarToday className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            Event Start:
          </span>
          <span className="text-sm text-gray-900">
            {eventWatchDetails?.start
              ? new Date(eventWatchDetails.start).toLocaleString()
              : "N/A"}
          </span>
        </div>

        {/* Event End */}
        <div className="flex items-center space-x-3">
          <MdCalendarToday className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Event End:</span>
          <span className="text-sm text-gray-900">
            {eventWatchDetails?.end
              ? new Date(eventWatchDetails.end).toLocaleString()
              : "N/A"}
          </span>
        </div>

        {/* Event Location */}
        <div className="flex items-center space-x-3">
          <MdLocationOn className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Address:</span>
          <span className="text-sm text-gray-900">
            {eventWatchDetails?.location || "No location provided"}
          </span>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setOpenWatchDetails(false)}
          className="px-4 py-2 bg-header text-white font-semibold rounded-md transition duration-200 "
        >
          Close
        </button>
      </div>
    </Modal>
  );
}

export default DetailEventCalender;
