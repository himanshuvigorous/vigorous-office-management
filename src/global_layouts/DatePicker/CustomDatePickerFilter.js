import { DatePicker } from "antd"
import { inputCalanderClassName } from "../../constents/global"

function CustomDatePickerFilter({value , onChange , picker="date" ,format = "DD/MM/YYYY" , size="large", disabledDate ,disabled, defaultValue , report= false , showTime = false}) {
    return (
        <DatePicker
        defaultValue={defaultValue}
        showTime={showTime}
 
        size={size}
        disabled={disabled}
        picker={picker}
        format={format}
       disabledDate =  {disabledDate}
       value={value}
       onChange={onChange}
       getPopupContainer={() => document.body}
        className={` ${report ? "inputCalanderClassNameReport" : inputCalanderClassName} `}
        popupClassName={'!z-[1580]'}
        />
    )
}

export default CustomDatePickerFilter
