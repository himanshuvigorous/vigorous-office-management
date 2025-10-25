import { DatePicker } from "antd"
import { inputCalanderClassName } from "../../constents/global"

function CustomDatePicker({field , errors , picker="date" ,format = "DD/MM/YYYY" , size="large", disabledDate ,disabled, defaultValue , report= false , allowClear = true ,placeholder = "Select Date" , showTime = false}) {
    return (
        <DatePicker
        defaultValue={defaultValue}
        showTime={showTime}
        {...field}
        size={size}
        disabled={disabled}
        picker={picker}
        format={format}
       disabledDate =  {disabledDate}
       value={field?.value|| null}
       getPopupContainer={() => document.body}
       popupClassName={'!z-[1580]'}
        onChange={(date) => field.onChange(date)}
        className={` ${report ? "inputCalanderClassNameReport" : inputCalanderClassName}  `}
        allowClear={allowClear}
        placeholder={placeholder}
        />
    )
}

export default CustomDatePicker
