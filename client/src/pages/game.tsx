import { SelectedPage } from "../shared/types";
import {motion} from "framer-motion";

type Props = {
    setSelectedPage: (value: SelectedPage) => void;
}

const Game = ({setSelectedPage}: Props) => {
    return (
        <motion.div
            className=""
            onViewportEnter={() => setSelectedPage(SelectedPage.Home)}
        >
            <div>Game</div>
        </motion.div>
    )
}
export default Game
