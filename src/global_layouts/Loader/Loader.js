import { Spin } from "antd"

function Loader() {
    return (
       <div className="flex justify-center items-center h-[80vh]">
         {/* <div class="loader"></div> */} 
         <Spin size="large" />
       </div>
    )
}

export default Loader
