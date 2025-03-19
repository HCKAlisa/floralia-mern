import logo from "../assets/logo.png";
import { MdDashboard } from "react-icons/md";
import { IoGameController } from "react-icons/io5";
import { RiTeamFill } from "react-icons/ri";
import { FaInfoCircle } from "react-icons/fa";
import { RiContactsBook3Fill } from "react-icons/ri";
import {useSearchParams} from "react-router-dom";

const Sidebar = () => {
    const [_searchParams, setSearchParams] = useSearchParams();

    const changeTab = (newSession: string) => {
        setSearchParams(params => {
            params.set("tab", newSession);
            return params;
        });
    };

    return (
        <div className="h-full w-[20dvw] bg-emerald-100 flex flex-col justify-between">
            <div className="w-full">
                <div className='flex flex-col items-center gap-2 py-6'>
                    <img alt='logo' src={logo} className='w-[8dvw]'/>
                    <h1 className='text-3xl font-bold'>Floralia Admin Panel</h1>
                </div>
                <div className="flex flex-col items-start">
                    <button onClick={() =>changeTab('Dashboard')} className="flex items-center gap-4 p-6 text-xl hover:bg-emerald-200 hover:shadow-sm hover:shadow-emerald-300/50 w-full text-start"><MdDashboard /> Dashboard</button>
                    <button onClick={() =>changeTab('Games')} className="flex items-center gap-4 p-6 text-xl hover:bg-emerald-200 hover:shadow-sm hover:shadow-emerald-300/50 w-full text-start"><IoGameController /> Games</button>
                    <button onClick={() =>changeTab('Team')} className="flex items-center gap-4 p-6 text-xl hover:bg-emerald-200 hover:shadow-sm hover:shadow-emerald-300/50 w-full text-start"><RiTeamFill /> Team</button>
                    <button onClick={() =>changeTab('FAQ')} className="flex items-center gap-4 p-6 text-xl hover:bg-emerald-200 hover:shadow-sm hover:shadow-emerald-300/50 w-full text-start"><FaInfoCircle /> FAQ</button>
                    <button onClick={() =>changeTab('Contact')} className="flex items-center gap-4 p-6 text-xl hover:bg-emerald-200 hover:shadow-sm hover:shadow-emerald-300/50 w-full text-start"><RiContactsBook3Fill /> Contact</button>
                </div>
            </div>
            <div className="flex flex-col items-start bg-emerald-200">
                <h3 className="text-2xl font-bold p-6">Username</h3>
            </div>
        </div>
    )
}
export default Sidebar
