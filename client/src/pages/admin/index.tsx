import Sidebar from "../../components/sidebar.tsx";
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import Dashboard from "./dashboard.tsx";
import Game from "./game/list.tsx"
import GameForm from "./game/form.tsx"
import Team from "./team/list.tsx"
import Faq from "./faq/list.tsx"
import Contact from "./contact/list.tsx"

const Admin = () => {
    const location = useLocation();
    const [tab, setTab] = useState('');
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);

    return (
        <div className="w-full h-full flex flex-row">
            <Sidebar/>
            <div className="w-full">
                { tab === 'Dashboard' && <Dashboard />}
                { tab === 'Games' && <Game />}
                { tab === 'GameForm' && <GameForm />}
                { tab === 'Team' && <Team />}
                { tab === 'FAQ' && <Faq />}
                { tab === 'Contact' && <Contact />}
            </div>
        </div>
    )
}
export default Admin
