import { SelectedPage } from "../shared/types";

type Props = {
    page: string;
    selectedPage: SelectedPage,
    setSelectedPage: (value:SelectedPage) => void,
    onLinkClick?: () => void;
}

const Link = ({page, setSelectedPage, onLinkClick}: Props) => {
    const lowerCasePageName = page.toLocaleLowerCase().replace(/ /g, "") as SelectedPage;

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setSelectedPage(lowerCasePageName);
        if (onLinkClick) {
            onLinkClick();
        }
        // Manually navigate to the section
        const element = document.getElementById(lowerCasePageName);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <a
            href={`#${lowerCasePageName}`}
            className={`text-2xl transition duration-500 hover:bg-orange-100 px-4 rounded-full font-jua`}
            onClick={handleClick}>
            {page}
        </a>
    )
}

export default Link