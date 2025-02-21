import { SelectedPage } from "../shared/types";
import { motion } from 'framer-motion';

type Props = {
    setSelectedPage: (value: SelectedPage) => void;
}

const Team = ({setSelectedPage}: Props) => {
    return (
        <motion.div
            className=""
            onViewportEnter={() => setSelectedPage(SelectedPage.Team)}
        >
            <div>Team</div>
        </motion.div>
    )
}
export default Team
