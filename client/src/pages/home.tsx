import { useEffect, useState } from "react";
import Navbar from "../components/navbar.tsx";
import Team from "./team.tsx";
import Footer from "./socials.tsx";
import Faq from "./faq.tsx";
import Game from "./game.tsx";
import { SelectedPage } from "../shared/types";
const Home = () => {
    const [selectedPage, setSelectedPage] = useState<SelectedPage>(SelectedPage.Home);
    const [isTopOfPage, setIsTopOfPage] = useState<boolean>(true);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY === 0) {
                setIsTopOfPage(true);
                setSelectedPage(SelectedPage.Home);
            }
            if (window.scrollY !== 0) setIsTopOfPage(false);
        }
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll); // run this when component unmount
    }, []);

    return (
        <div className="app bg-primary-800">
            <Navbar
                isTopOfPage={isTopOfPage}
                selectedPage={selectedPage}
                setSelectedPage={setSelectedPage}
            />
            <div className="md:pt-[20dvh]">
                <Game setSelectedPage={setSelectedPage}/>
                <Team setSelectedPage={setSelectedPage} />
                <Faq setSelectedPage={setSelectedPage} />
                <Footer setSelectedPage={setSelectedPage} />
            </div>

        </div>
    )
}
export default Home
