import { motion } from "framer-motion";
import {SelectedPage} from "../shared/types.ts";

type Props = {
    setSelectedPage: (value: SelectedPage) => void;
}

const About = ({setSelectedPage}: Props) => {
    return (
        <section id="about">
            <motion.div
                className=" bg-[url(assets/mainBg.png)] h-full"
                onViewportEnter={() => setSelectedPage(SelectedPage.About)}
            >
                <div>
                    <motion.div
                        className="mx-auto flex items-center justify-end w-2/3"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{once:true, amount: 0.5}}
                        transition={{ duration: 0.5 }}
                        variants={{
                            hidden: { opacity: 0, y: -50 },
                            visible: { opacity: 1, y: 0 }
                        }}
                    >
                        <div className="justify-end items-center xl:w-1/2 w-full py-18 px-6">
                            <h1 className="text-6xl font-bold text-white mr-[8dvw]">Floralia</h1>
                            <h1 className="text-6xl font-bold text-white mr-[-8dvw]">Games</h1>
                            <p className="text-lg text-white mt-4 text-justify">
                                Lorem ipsum dolor sit amet consectetur. Laoreet sed tempus et semper luctus lorem. Tellus dapibus ullamcorper urna porta semper id orci ipsum massa. Consequat risus
                            </p>
                        </div>

                    </motion.div>
                </div>
            </motion.div>
        </section>
    )
}
export default About
