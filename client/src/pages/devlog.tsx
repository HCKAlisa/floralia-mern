import {motion} from "framer-motion";
import {SelectedPage} from "../shared/types.ts";
import {Image} from "@heroui/react";
import background from "../assets/background/devlog-bg.png";
import title from "../assets/Icons/devlog-title.png";

type Props = {
    setSelectedPage: (value: SelectedPage) => void;
}

const Devlog = ({setSelectedPage}: Props) => {
    return (
        <section id="devlog">
            <motion.div
                className="relative w-screen"
                onViewportEnter={() => setSelectedPage(SelectedPage.Devlog)}
            >
                <Image
                    alt="Game Title"
                    src={title}
                    width="50%"
                    className="mx-auto"
                />
                    <div className="h-[1750px]" >
                        <Image
                            alt="hero background"
                            src={background}
                            width="100%"
                            className="object-cover absolute top-0 left-0 z-0"
                        />
                        <motion.div
                            className=""
                            initial="hidden"
                            whileInView="visible"
                            viewport={{once:true, amount: 0.5}}
                            transition={{ duration: 0.5 }}
                            variants={{
                                hidden: { opacity: 0, y: -50 },
                                visible: { opacity: 1, y: 0 }
                            }}
                        >
                            <div className="relative z-20 flex items-center justify-center w-full h-[1750px]">
                                <div className="flex flex-col xl:w-1/2 w-full h-1/3 m-auto">
                                    {/*<h1 className="text-9xl font-kavoon text-end">Floralia</h1>*/}
                                    <h1 className="text-8xl font-kavoon">Welcome to Floralia Games</h1>
                                    <p className="text-5xl mt-4 text-justify">
                                        We’re a cozy indie team of passionate game developers creating heartfelt games!
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
            </motion.div>
        </section>
    )
}
export default Devlog
