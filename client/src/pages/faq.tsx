import { SelectedPage } from "../shared/types";
import {motion} from "framer-motion";

type Props = {
    setSelectedPage: (value: SelectedPage) => void;
}

const Faq = ({setSelectedPage}: Props) => {
    return (
        <motion.div
            className=""
            onViewportEnter={() => setSelectedPage(SelectedPage.FAQ)}
        >
            <div>FAQ</div>
        </motion.div>
    )
}
export default Faq
