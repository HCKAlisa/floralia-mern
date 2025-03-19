import {useSelector} from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
        const { currentUser } = useSelector((state: any) => state.user)
    return currentUser ? <Outlet></Outlet> : <Navigate to='/admin/signin'></Navigate>
}
export default PrivateRoute
