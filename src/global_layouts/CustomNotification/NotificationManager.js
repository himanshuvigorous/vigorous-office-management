import React from "react";
import ReactDOM from "react-dom/client";
import Notification from "./Notification";

const notificationContainer = (() => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = ReactDOM.createRoot(container);
  return root;
})();

let notifications = [];

export const showNotification = ({
  message,
  type = "info",
  position ,
  duration = 3000,
}) => {
  const id = Date.now();
  if (!message) return;
  const removeNotification = (id) => {
    notifications = notifications.filter((n) => n.id !== id);
    renderNotifications();
  };

  notifications.push({
    id,
    message,
    type,
    position,
    duration,
    onRemove: removeNotification,
  });

  renderNotifications();

  setTimeout(() => removeNotification(id), duration + 300);
};

const renderNotifications = () => {
  notificationContainer.render(
    <>
      {notifications.map((n) => (
        <Notification
          key={n.id}
          id={n.id}
          message={n.message}
          type={n.type}
          position={n.position}
          duration={n.duration}
          onRemove={n.onRemove}
        />
      ))}
    </>
  );
};
