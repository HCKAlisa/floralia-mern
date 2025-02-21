import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import Link from "./link";
import { SelectedPage } from "../shared/types";
import useMediaQuery from "../hooks/useMediaQuery";

type Props = {
    isTopOfPage: boolean;
    selectedPage: SelectedPage;
    setSelectedPage: (value: SelectedPage) => void;
};

const Navbar = ({isTopOfPage, selectedPage, setSelectedPage}: Props) => {
    const flexBetween = "flex items-center justify-between";
    const [isMenuToggled, setMenuToggled] = useState<boolean>(false);
    const isAboveMediumScreens: boolean = useMediaQuery("(min-width:1060px)");
    const navBarBackground: string = isTopOfPage ? "" : "bg-primary-600 drop-shadow rounded-full py-3 px-4";

    return (
        <nav>
            <div className={`${flexBetween} fixed top-0 z-50 w-[100dvw] md:w-full py-6`}>
                <div className={` ${navBarBackground} ${flexBetween} mx-auto w-11/12`}>
                    <div className={`${flexBetween} w-full gap-16`}>
                        { isAboveMediumScreens ? (
                            <div className={`${flexBetween} gap-8 text-sm`}>
                                <Link
                                    page="Home"
                                    selectedPage={selectedPage}
                                    setSelectedPage={setSelectedPage}
                                />
                                <Link page="Team"
                                      selectedPage={selectedPage}
                                      setSelectedPage={setSelectedPage}
                                />
                                <Link page="FAQ"
                                      selectedPage={selectedPage}
                                      setSelectedPage={setSelectedPage}
                                />
                                <Link page="Contact"
                                      selectedPage={selectedPage}
                                      setSelectedPage={setSelectedPage}
                                />
                            </div>
                        ) : (
                            <button title="Open Menu" className="rounded-full bg-orange-100 p-2" onClick={()=> setMenuToggled(!isMenuToggled)}><Bars3Icon className="h-6 w-6 text-white"/></button>
                        )}
                    </div>
                </div>
            </div>

            {/* MOBILE MENU MODAL*/}
            {!isAboveMediumScreens && isMenuToggled && (
                <div className="fixed right-0 bottom-0 z-[120] h-full w-[300px] bg-primary-600 drop-shadow-xl">
                    <div className="flex justify-end p-12">
                        <button title="Close Menu" onClick={()=> setMenuToggled(!isMenuToggled)}><XMarkIcon className="h-6 w-6 text-white"/></button>
                    </div>

                    <div className="flex flex-col items-center gap-10 text-2xl">
                        <Link
                            page="Home"
                            selectedPage={selectedPage}
                            setSelectedPage={setSelectedPage}
                        />
                        <Link page="Team"
                              selectedPage={selectedPage}
                              setSelectedPage={setSelectedPage}
                        />
                        <Link page="FAQ"
                              selectedPage={selectedPage}
                              setSelectedPage={setSelectedPage}
                        />
                        <Link page="Contact"
                              selectedPage={selectedPage}
                              setSelectedPage={setSelectedPage}
                        />
                    </div>
                </div>
            )

            }

        </nav>
    )
}

export default Navbar