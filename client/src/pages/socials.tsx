import { SelectedPage } from "../shared/types";
import {motion} from "framer-motion";

type Props = {
    setSelectedPage: (value: SelectedPage) => void;
}

const Socials = ({setSelectedPage}: Props) => {
    return (
        <motion.div
            className=""
            onViewportEnter={() => setSelectedPage(SelectedPage.Contact)}
        >
            <div>Contact</div>
        </motion.div>
    )
}
export default Socials
