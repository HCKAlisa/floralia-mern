import { useEffect, useState } from "react";
import Navbar from "../components/navbar.tsx";
import Team from "./team.tsx";
import Socials from "./socials.tsx";
import Faq from "./faq.tsx";
import Game from "./game.tsx";
import { SelectedPage } from "../shared/types";
import About from "./about.tsx";
// import Devlog from "./devlog.tsx";
import Footer from "../components/footer.tsx";


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
        <div className="app bg-primary-background">
            <Navbar
                isTopOfPage={isTopOfPage}
                selectedPage={selectedPage}
                setSelectedPage={setSelectedPage}
            />
            <div>
            {/*<div className="md:pt-[20dvh] pt-[10dvh]">*/}
                <About setSelectedPage={setSelectedPage} />
                <Game setSelectedPage={setSelectedPage}/>
                {/*<Devlog setSelectedPage={setSelectedPage}/>*/}
                <Team setSelectedPage={setSelectedPage} />
                <Faq setSelectedPage={setSelectedPage} />
                <Socials setSelectedPage={setSelectedPage} />
                <Footer/>
            </div>

        </div>
    )
}
export default Home
