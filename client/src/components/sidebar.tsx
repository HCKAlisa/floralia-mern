import logo from "../assets/logo.png";
import { MdDashboard } from "react-icons/md";
import { IoGameController } from "react-icons/io5";
import { RiTeamFill } from "react-icons/ri";
import { FaInfoCircle } from "react-icons/fa";
import { RiContactsBook3Fill } from "react-icons/ri";
import {useSearchParams} from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import {useDispatch} from "react-redux";
import { signoutSuccess }  from '../redux/user/userSlice.ts'
import { useSelector } from "react-redux";
import { combineReducers } from '@reduxjs/toolkit'
const rootReducer = combineReducers({})
export type IRootState = ReturnType<typeof rootReducer>

const Sidebar = () => {
    const { currentUser } = useSelector( (state:IRootState) => state.user);
    const [_searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch();
    const changeTab = (newSession: string) => {
        setSearchParams(params => {
            params.set("tab", newSession);
            return params;
        });
    };

    const handleSignout = async() => {
        try {
            const res = await fetch('api/user/signout', {
                method: 'POST',
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                dispatch(signoutSuccess());
            }
        } catch (error: any) {
            console.log(error.message);
        }
    };

    return (
        <div className="h-full w-[20dvw] bg-blue-100 flex flex-col justify-between">
            <div className="w-full">
                <div className='flex flex-col items-center gap-2 py-6 px-2'>
                    <img alt='logo' src={logo} className='w-[8dvw]'/>
                    <h1 className='text-3xl font-bold'>Floralia<br/> Admin Panel</h1>
                </div>
                <div className="flex flex-col items-start">
                    <button onClick={() =>changeTab('Dashboard')} className="flex items-center gap-4 p-6 text-xl hover:bg-emerald-200 hover:shadow-sm hover:shadow-emerald-300/50 w-full text-start"><MdDashboard /> Dashboard</button>
                    <button onClick={() =>changeTab('Games')} className="flex items-center gap-4 p-6 text-xl hover:bg-emerald-200 hover:shadow-sm hover:shadow-emerald-300/50 w-full text-start"><IoGameController /> Games</button>
                    <button onClick={() =>changeTab('Team')} className="flex items-center gap-4 p-6 text-xl hover:bg-emerald-200 hover:shadow-sm hover:shadow-emerald-300/50 w-full text-start"><RiTeamFill /> Team</button>
                    <button onClick={() =>changeTab('FAQ')} className="flex items-center gap-4 p-6 text-xl hover:bg-emerald-200 hover:shadow-sm hover:shadow-emerald-300/50 w-full text-start"><FaInfoCircle /> FAQ</button>
                    <button onClick={() =>changeTab('Contact')} className="flex items-center gap-4 p-6 text-xl hover:bg-emerald-200 hover:shadow-sm hover:shadow-emerald-300/50 w-full text-start"><RiContactsBook3Fill /> Contact</button>
                </div>
            </div>
            <div className="flex items-center justify-between bg-blue-200 p-6">
                {currentUser ? (
                    <h3 className="text-2xl font-bold">{currentUser.username}</h3>
                    ) : (
                    <h3 className="text-2xl font-bold">Username</h3>
                )}
                <button  onClick={handleSignout}><IoIosLogOut size={25}/></button>
            </div>
        </div>
    )
}
export default Sidebar
