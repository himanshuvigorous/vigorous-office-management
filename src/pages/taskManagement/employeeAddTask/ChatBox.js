import React, { useState, useRef, useEffect } from "react";
import { statusMapping } from "../../../constents/global";
import moment from "moment";
import { RxCross1 } from "react-icons/rx";

const ChatBox = ({ onClose, comment }) => {
  const [messages, setMessages] = useState([]);
  const [open, setOpen] = useState('translate-y-full');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setOpen("translate-y-0");
    return () => {
      setOpen("translate-y-full");
    };
  }, [messages]);

  useEffect(() => {
    if (comment) {
      const commentData = comment.map((comment) => ({
        sender: comment?.creatorData?.fullName,
        text: comment?.message,
        status: comment?.status,
        createdAt: comment?.createdAt || Date.now(),
      }));
      setMessages(commentData);
    }
  }, [comment]);

  const handleClose = () => {
    // Trigger the closing animation after 300ms
    setTimeout(() => {
      setOpen("translate-y-full"); // This will trigger the closing animation
      setTimeout(() => {
        onClose(); // Call the onClose function after the animation
      }, 300); // Ensure onClose is called after the animation ends (500ms)
    }, 50); // 300ms delay before starting the animation
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-end items-end px-2 z-[1501]"
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-lg w-full max-w-md max-h-[80vh] shadow-xl overflow-hidden transform transition-all duration-500 ease-in-out ${open}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-2 bg-header text-white rounded-lg shadow-md text-center text-md font-semibold flex justify-between items-center">
          Task Comments
          <RxCross1 className="cursor-pointer" onClick={handleClose} />
        </div>

        <div className="p-4 h-[60vh] overflow-y-auto space-y-2">
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.sender === "You" ? "items-end" : "items-start"}`}
              >
                <div className="p-1 w-[100%] max-w-[100%]">
                  <div className="text-sm font-semibold mb-2 text-gray-600 ">
                    {msg.sender}
                  </div>

                  <div
                    className={`pl-4 border-l border-gray-200 ${
                      msg.status === "Assigned"
                        ? "border-blue-500 text-white"
                        : msg.status === "Accepted"
                        ? "border-green-500 text-white"
                        : msg.status === "Pending_at_client"
                        ? "border-yellow-400 text-black"
                        : msg.status === "Completed"
                        ? "border-green-800 text-white"
                        : "border-gray-300 text-black"
                    }`}
                  >
                    <p className="text-sm mb-2 text-gray-800 ">{msg.text}</p>
                    <div
                      className={`text-xs mb-2 px-2 py-1 rounded-full inline-block shadow-xl ${
                        msg.status === "Assigned"
                          ? "bg-blue-500 text-white"
                          : msg.status === "Accepted"
                          ? "bg-green-500 text-white"
                          : msg.status === "Pending_at_client"
                          ? "bg-yellow-400 text-black"
                          : msg.status === "Completed"
                          ? "bg-green-800 text-white"
                          : "bg-gray-300 text-black"
                      }`}
                    >
                      {statusMapping[msg.status] || "No Status"}
                    </div>
                  </div>
                  {/* Date and Time at Bottom Left */}
                  <div className="text-xs text-gray-500 mt-2">
                    {moment(msg.createdAt).format("MMM DD, YYYY - h:mm A")}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No comments available.</p>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
