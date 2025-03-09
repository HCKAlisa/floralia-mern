import { SelectedPage } from "../shared/types";
import {motion} from "framer-motion";

type Props = {
    setSelectedPage: (value: SelectedPage) => void;
}

const Socials = ({setSelectedPage}: Props) => {
    return (
        <section id="game">
            <motion.div
                className=" bg-[url(assets/mainBg.png)] md:h-[25dvh]"
                onViewportEnter={() => setSelectedPage(SelectedPage.Contact)}
            >
                <motion.div
                    className="mx-auto w-5/6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{once:true, amount: 0.5}}
                    transition={{ duration: 0.5 }}
                    variants={{
                        hidden: { opacity: 0, y: 50},
                        visible: {opacity: 1, y: 0}
                    }}
                >
                    <h1 className="py-2 text-4xl text-[#4C3F3F]">Socials</h1>
                </motion.div>
            </motion.div>
        </section>
    )
}
export default Socials
