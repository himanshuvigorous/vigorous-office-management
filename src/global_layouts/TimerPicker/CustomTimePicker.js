import { TimePicker } from 'antd';
import { inputClassName } from '../../constents/global'; 


function CustomTimePicker({ field, errors, disabledTime }) {
  return (
    <TimePicker
      {...field}
      disabledTime={disabledTime}
      use12Hours format="h:mm A"
      onChange={(time, timeString) => {
        field.onChange(time); 
      }}
      className={`${inputClassName} ${errors ? '' : 'border-gray-300'}`}
      popupClassName={'!z-[1580]'}
    />
  );
}

export default CustomTimePicker;
