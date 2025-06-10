import AnchorLink from "react-anchor-link-smooth-scroll";
import { SelectedPage } from "../shared/types";

type Props = {
    page: string;
    selectedPage: SelectedPage,
    setSelectedPage: (value:SelectedPage) => void
}

const Link = ({page, setSelectedPage}: Props) => {
    const lowerCasePageName = page.toLocaleLowerCase().replace(/ /g, "") as SelectedPage;

    return (
        <AnchorLink
            href={`#${lowerCasePageName}`}
            className={`text-2xl transition duration-500 hover:bg-orange-100 px-4 rounded-full font-jua`}
            onClick={() => setSelectedPage(lowerCasePageName)}>
            {page}
        </AnchorLink>
    )
}

export default Link