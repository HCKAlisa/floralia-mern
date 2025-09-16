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
import {Image} from "@heroui/react";
import icon from "../assets/Icons/floralia.png";

type Props = {
    isTopOfPage: boolean;
    selectedPage: SelectedPage;
    setSelectedPage: (value: SelectedPage) => void;
};

const NavBar = ({selectedPage, setSelectedPage}: Props) => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    
    return (
        <Navbar maxWidth="full" className="bg-primary-background shadow" onMenuOpenChange={setIsMenuOpen} isMenuOpen={isMenuOpen} isBlurred={false}>
            <NavbarBrand>
                <h3 className="text-light-secondary text-2xl font-bold hidden xl:block">FLORALIA GAMES</h3>
                <Image
                    src={icon}
                    alt="Floralia Games Icon"
                    className="block xl:hidden"
                />
            </NavbarBrand>
            <NavbarContent justify="end">
                    <div className="hidden sm:flex gap-2">
                        <NavbarItem>
                        <Link
                            page="About"
                            selectedPage={selectedPage}
                            setSelectedPage={setSelectedPage}
                        />
                        </NavbarItem>
                        <NavbarItem>
                        <Link
                            page="Games"
                            selectedPage={selectedPage}
                            setSelectedPage={setSelectedPage}
                        />
                        </NavbarItem>
                        <NavbarItem>
                        <Link
                            page="Team"
                            selectedPage={selectedPage}
                            setSelectedPage={setSelectedPage}
                        />
                        </NavbarItem>
                        <NavbarItem>
                        <Link
                            page="FAQ"
                            selectedPage={selectedPage}
                            setSelectedPage={setSelectedPage}
                        />
                        </NavbarItem>
                        <NavbarItem>
                        <Link
                            page="Socials"
                            selectedPage={selectedPage}
                            setSelectedPage={setSelectedPage}
                        />
                        </NavbarItem>
                    </div>
                    <NavbarMenuToggle
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        className="sm:hidden"
                    >
                        <Bars3Icon className="h-6 w-6 text-white" />
                    </NavbarMenuToggle>
            </NavbarContent>
            <NavbarMenu className="flex flex-col items-center h-full justify-center bg-gradient-yellow-310">
                <NavbarMenuItem>
                    <Link
                        page="About"
                        selectedPage={selectedPage}
                        setSelectedPage={setSelectedPage}
                        onLinkClick={() => setIsMenuOpen(false)}
                    />
                </NavbarMenuItem>
                <NavbarMenuItem>
                    <Link
                        page="Games"
                        selectedPage={selectedPage}
                        setSelectedPage={setSelectedPage}
                        onLinkClick={() => setIsMenuOpen(false)}
                    />
                </NavbarMenuItem>
                <NavbarMenuItem>
                    <Link
                        page="FAQ"
                        selectedPage={selectedPage}
                        setSelectedPage={setSelectedPage}
                        onLinkClick={() => setIsMenuOpen(false)}
                    />
                </NavbarMenuItem>
                <NavbarMenuItem>
                    <Link
                        page="Team"
                        selectedPage={selectedPage}
                        setSelectedPage={setSelectedPage}
                        onLinkClick={() => setIsMenuOpen(false)}
                    />
                </NavbarMenuItem>
                <NavbarMenuItem>
                    <Link
                        page="Socials"
                        selectedPage={selectedPage}
                        setSelectedPage={setSelectedPage}
                        onLinkClick={() => setIsMenuOpen(false)}
                    />
                </NavbarMenuItem>
            </NavbarMenu>
        </Navbar>
    )
}

export default NavBar