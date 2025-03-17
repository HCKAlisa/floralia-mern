import logo from "../../assets/logo.png";
import {UserType} from "../../shared/types";
import {useState} from "react";
import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';

const Signin = () => {
    const [formData, setFormData] = useState<UserType>();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e: any) => {
        setFormData({...formData, [e.target.id]: e.target.value.trim()});
    };
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (formData==undefined || !formData.username || !formData.password){
            return setErrorMessage('Please fill in all fields.');
        }
            setErrorMessage(null);
        try {
            setIsLoading(true);
            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData),
            });
            setIsLoading(false);
            if (res.ok) {
                // dispatch(signInSuccess(data));
                navigate('/');
            }
        } catch (error: any) {
            setErrorMessage(error.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col justify-center items-center gap-16 bg-[url(assets/mainBg.png)]">
            <div className="flex flex-col items-center">
                <img src={logo} alt="Floralia Logo" className="w-[8dvw]"/>
                <h1 className="text-4xl font-bold">Floralia Studio <br/> Admin Panel</h1>
            </div>
            <div className="">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col justify-start items-start">
                        <label htmlFor="username" className="text-xl">Username</label>
                        <input onChange={handleChange} type="text" name="Username" id="username" className="block p-2 text-base rounded-lg text-gray-900 outline-1 bg-white placeholder:text-gray-400 focus:outline-2 sm:text-sm/6" placeholder="Username" />
                    </div>
                    <div className="flex flex-col justify-start items-start">
                        <label htmlFor="password" className="text-xl">Password</label>
                        <input onChange={handleChange} type="text" name="Password" id="password" className="block p-2 text-base rounded-lg text-gray-900 outline-1 bg-white placeholder:text-gray-400 focus:outline-2 sm:text-sm/6" placeholder="********" />
                    </div>
                    { errorMessage && (
                        <h6 className='text-red-700'>{errorMessage}</h6>
                    )}
                    <button type="submit" className="bg-gradient-to-tr bg-emerald-500 p-2 text-base rounded-lg disabled:bg-gray-300 disabled:p-3" disabled={isLoading}>
                        {isLoading ? (
                            <div id="spinner-container" className="space-y-10">
                                <div className="flex justify-center space-x-1">
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce"></div>
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce delay-100"></div>
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce delay-200"></div>
                                </div>
                            </div>
                        ): 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    )
}
export default Signin
