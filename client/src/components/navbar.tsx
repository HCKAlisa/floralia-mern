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
    const flexEnd = "flex items-end justify-end pb-2";
    const [isMenuToggled, setMenuToggled] = useState<boolean>(false);
    const isAboveMediumScreens: boolean = useMediaQuery("(min-width:1060px)");
    return (
        <nav>
            <div className={`${flexEnd} bg-blue-100 drop-shadow px-10 fixed top-0 z-50 w-[100dvw] md:w-full md:h-[20vh]`}>
                <div className={`${flexEnd} w-full gap-16`}>
                    { isAboveMediumScreens ? (
                        <div className={`${flexEnd} gap-8 text-sm`}>
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