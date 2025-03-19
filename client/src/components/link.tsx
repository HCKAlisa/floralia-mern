import AnchorLink from "react-anchor-link-smooth-scroll";
import { SelectedPage } from "../shared/types";

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

    return (
        <AnchorLink
            offset={convertVhToPx(20)}
            href={`#${lowerCasePageName}`}
            className={`${selectedPage === lowerCasePageName ? "bg-yellow-100 px-4 rounded-full" : ""} text-xl transition duration-500 hover:bg-orange-100 px-4 rounded-full`}
            onClick={() => setSelectedPage(lowerCasePageName)}>
            {page}
        </AnchorLink>
    )
}

export default Link