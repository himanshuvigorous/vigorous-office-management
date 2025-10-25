import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"

function ErrorPage() {

    const navigate = useNavigate();

    useEffect(() => {
    }, []);

    const handleNavigate = (data) => {
        navigate("/")
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#F8FAFC] dark:bg-gray-50">
            <div className="flex grow items-center px-6 xl:px-10">
                <div className="mx-auto text-center">
                    <h1 className="rizzui-title-h1 text-[22px] font-bold leading-normal text-gray-1000 lg:text-3xl">Sorry, the page not found</h1>
                    <p className="rizzui-text-p font-normal mt-3 text-sm leading-loose text-gray-500 lg:mt-6 lg:text-base lg:leading-loose">We have been spending long hours in order to launch our new website. Join our<br className="hidden sm:inline-block" />mailing list or follow us on Facebook for get latest update.</p>
                    <button onClick={handleNavigate} className="rizzui-button inline-flex font-medium items-center justify-center active:enabled:translate-y-px focus:outline-none focus-visible:ring-[1.8px] focus-visible:ring-offset-2 ring-offset-background transition-colors duration-200 py-2.5 text-base rounded-md border border-transparent dark:backdrop-blur bg-header text-white focus-visible:ring-muted text-primary-foreground mt-8 h-12 px-4 xl:h-14 xl:px-6" type="button">
                        <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 256 256" className="mr-1.5 text-lg" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M240,204H228V144a12,12,0,0,0,12.49-19.78L142.14,25.85a20,20,0,0,0-28.28,0L15.51,124.2A12,12,0,0,0,28,144v60H16a12,12,0,0,0,0,24H240a12,12,0,0,0,0-24ZM52,121.65l76-76,76,76V204H164V152a12,12,0,0,0-12-12H104a12,12,0,0,0-12,12v52H52ZM140,204H116V164h24Z" />
                        </svg>
                        Back to home
                    </button>
                </div>
            </div>
            
        </div>

    )
}

export default ErrorPage
