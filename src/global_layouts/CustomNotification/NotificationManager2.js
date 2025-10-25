import { notification } from 'antd';

export const showNotification = ({
  message,
  type = 'info',
  position = 'topRight',
  duration = 3, 
}) => {
  if(!message) return
  notification.config({
    placement: position,
    duration: duration,
    showProgress:true,
    maxCount : 1
  });

  notification[type]({
    message,
  });
};
