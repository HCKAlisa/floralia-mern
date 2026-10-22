import {useSelector} from "react-redux";
import type { RootState } from "../redux/store";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
        const { currentUser } = useSelector((state: RootState) => state.user)
    return currentUser ? <Outlet></Outlet> : <Navigate to='/admin/signin'></Navigate>
}
export default PrivateRoute
