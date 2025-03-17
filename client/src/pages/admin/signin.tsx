import logo from "../../assets/logo.png";

const Signin = () => {
    return (
        <div className="min-h-screen w-full flex flex-col justify-center items-center gap-16 bg-[url(assets/mainBg.png)]">
            <div className="flex flex-col items-center">
                <img src={logo} alt="Floralia Logo" className="w-[8dvw]"/>
                <h1 className="text-4xl font-bold">Floralia Studio <br/> Admin Panel</h1>
            </div>
            <div className="">
                <form className="flex flex-col gap-4">
                    <div className="flex flex-col justify-start items-start">
                        <label htmlFor="username" className="text-xl">Username</label>
                        <input type="text" name="Username" id="username" className="block p-2 text-base rounded-lg text-gray-900 outline-1 bg-white placeholder:text-gray-400 focus:outline-2 sm:text-sm/6" placeholder="Username" />
                    </div>
                    <div className="flex flex-col justify-start items-start">
                        <label htmlFor="password" className="text-xl">Password</label>
                        <input type="text" name="Password" id="password" className="block p-2 text-base rounded-lg text-gray-900 outline-1 bg-white placeholder:text-gray-400 focus:outline-2 sm:text-sm/6" placeholder="Password" />
                    </div>
                    <button type="submit" className="bg-gradient-to-tr bg-emerald-500 p-2 text-base rounded-lg">Sign in</button>
                </form>
            </div>
        </div>
    )
}
export default Signin
