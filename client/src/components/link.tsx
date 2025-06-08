import AnchorLink from "react-anchor-link-smooth-scroll";
import { SelectedPage } from "../shared/types";
import useMediaQuery from "../hooks/useMediaQuery.ts";

type Props = {
    page: string;
    selectedPage: SelectedPage,
    setSelectedPage: (value:SelectedPage) => void
}

const Link = ({page, selectedPage, setSelectedPage}: Props) => {
    const lowerCasePageName = page.toLocaleLowerCase().replace(/ /g, "") as SelectedPage;
    const convertVhToPx= (vh=20):number  => {
        const oneVhInPx = window.innerHeight / 100;
        return oneVhInPx * vh;
    };
    const isAboveMediumScreens: boolean = useMediaQuery("(min-width:1060px)");

    return (
        <AnchorLink
            offset={isAboveMediumScreens ? convertVhToPx(20) : convertVhToPx(10)}
            href={`#${lowerCasePageName}`}
            className={`${selectedPage === lowerCasePageName ? "bg-yellow-100 px-4 rounded-full" : ""} text-2xl transition duration-500 hover:bg-orange-100 px-4 rounded-full`}
            onClick={() => setSelectedPage(lowerCasePageName)}>
            {page}
        </AnchorLink>
    )
}

export default Link