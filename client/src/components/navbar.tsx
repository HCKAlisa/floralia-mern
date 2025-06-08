import { useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/solid";
import Link from "./link";
import { SelectedPage } from "../shared/types";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem
} from "@heroui/navbar";

type Props = {
    isTopOfPage: boolean;
    selectedPage: SelectedPage;
    setSelectedPage: (value: SelectedPage) => void;
};

const NavBar = ({selectedPage, setSelectedPage}: Props) => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    return (
        <Navbar isBordered maxWidth="full" className="bg-primary-bg" onMenuOpenChange={setIsMenuOpen}>
            <NavbarBrand>
                <h3 className="text-light-secondary text-2xl font-bold">FLORALIA GAMES</h3>
            </NavbarBrand>
            <NavbarContent justify="end">
                <NavbarItem>
                    <div className="hidden sm:flex gap-2">
                        <Link
                            page="About"
                            selectedPage={selectedPage}
                            setSelectedPage={setSelectedPage}
                        />
                        <Link
                            page="Games"
                            selectedPage={selectedPage}
                            setSelectedPage={setSelectedPage}
                        />
                        <Link
                            page="Team"
                            selectedPage={selectedPage}
                            setSelectedPage={setSelectedPage}
                        />
                        <Link
                            page="FAQ"
                            selectedPage={selectedPage}
                            setSelectedPage={setSelectedPage}
                        />
                        <Link
                            page="Socials"
                            selectedPage={selectedPage}
                            setSelectedPage={setSelectedPage}
                        />
                    </div>
                        <NavbarMenuToggle
                            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                            className="sm:hidden"
                        >
                            <Bars3Icon className="h-6 w-6 text-white" />
                        </NavbarMenuToggle>
                    <NavbarMenu>
                        <NavbarMenuItem>
                            <Link
                                page="Games"
                                selectedPage={selectedPage}
                                setSelectedPage={setSelectedPage}
                            />
                        </NavbarMenuItem>
                        <NavbarMenuItem>
                            <Link
                                page="FAQ"
                                selectedPage={selectedPage}
                                setSelectedPage={setSelectedPage}
                            />
                        </NavbarMenuItem>
                        <NavbarMenuItem>
                            <Link
                                page="Team"
                                selectedPage={selectedPage}
                                setSelectedPage={setSelectedPage}
                            />
                        </NavbarMenuItem>
                        <NavbarMenuItem>
                            <Link
                                page="Socials"
                                selectedPage={selectedPage}
                                setSelectedPage={setSelectedPage}
                            />
                        </NavbarMenuItem>
                    </NavbarMenu>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
        // <nav>
        //     <div className={`${flexEnd} bg-[url(assets/navbarBG.png)] bg-white bg-center drop-shadow px-10 fixed top-0 z-50 w-[100dvw] md:w-full md:h-[20dvh] h-[10dvh]`}>
        //         {/*<div className="fixed left-2/5"><img src={logo} className="h-[18dvh]"/></div>*/}
        //         <div className="flex items-end w-full h-full bg-[url(assets/logo.png)] bg-center bg-contain bg-no-repeat">
        //             <div className={`${flexEnd} w-full gap-16`}>
        //                 { isAboveMediumScreens ? (
        //                     <div className={`${flexEnd} gap-8 text-sm`}>
        //                         <Link
        //                             page="Home"
        //                             selectedPage={selectedPage}
        //                             setSelectedPage={setSelectedPage}
        //                         />
        //                         <Link page="Team"
        //                               selectedPage={selectedPage}
        //                               setSelectedPage={setSelectedPage}
        //                         />
        //                         <Link page="FAQ"
        //                               selectedPage={selectedPage}
        //                               setSelectedPage={setSelectedPage}
        //                         />
        //                         <Link page="Contact"
        //                               selectedPage={selectedPage}
        //                               setSelectedPage={setSelectedPage}
        //                         />
        //                     </div>
        //                 ) : (
        //                     <button title="Open Menu" className="rounded-full bg-orange-100 p-2" onClick={()=> setMenuToggled(!isMenuToggled)}><Bars3Icon className="h-6 w-6 text-white"/></button>
        //                 )}
        //             </div>
        //         </div>
        //
        //     </div>
        //
        //     {/* MOBILE MENU MODAL*/}
        //     {!isAboveMediumScreens && isMenuToggled && (
        //         <div className="fixed right-0 bottom-0 z-[120] h-full w-[200px] bg-blue-200 drop-shadow-xl">
        //             <div className="flex justify-end p-12">
        //                 <button title="Close Menu" onClick={()=> setMenuToggled(!isMenuToggled)}><XMarkIcon className="h-6 w-6 text-white"/></button>
        //             </div>
        //
        //             <div className="flex flex-col items-center gap-10 text-2xl">
        //                 <Link
        //                     page="Home"
        //                     selectedPage={selectedPage}
        //                     setSelectedPage={setSelectedPage}
        //                 />
        //                 <Link page="Team"
        //                       selectedPage={selectedPage}
        //                       setSelectedPage={setSelectedPage}
        //                 />
        //                 <Link page="FAQ"
        //                       selectedPage={selectedPage}
        //                       setSelectedPage={setSelectedPage}
        //                 />
        //                 <Link page="Contact"
        //                       selectedPage={selectedPage}
        //                       setSelectedPage={setSelectedPage}
        //                 />
        //             </div>
        //         </div>
        //     )
        //
        //     }
        //
        // </nav>
    )
}

export default NavBar