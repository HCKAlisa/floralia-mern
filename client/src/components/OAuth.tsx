import {AiOutlineGoogle} from "react-icons/ai";
import {GoogleAuthProvider, getAuth, signInWithPopup} from "firebase/auth";
import {app} from "../firebase.ts";
import {useDispatch} from "react-redux";
import {signInSuccess} from "../redux/user/userSlice.ts";
import {useNavigate} from "react-router-dom";

const OAuth = () => {
    const auth = getAuth(app)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleGoogleClick = async () =>{
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account' })
        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider)
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    googlePhotoUrl: resultsFromGoogle.user.photoURL,
                }),
            })
            const data = await res.json()
            if (res.ok){
                dispatch(signInSuccess(data))
                navigate('/admin?tab=Dashboard')
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <button type="button" onClick={handleGoogleClick} className="shadow-md shadow-emerald-200 hover:shadow-sm rounded-lg p-2 flex items-center justify-center gap-2 bg-emerald-100">
            Continue with
            <AiOutlineGoogle className='w-6 h-6' />
        </button>
    )
}
export default OAuth
