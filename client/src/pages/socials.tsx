import {SelectedPage, SocialsType} from "../shared/types";
import {motion} from "framer-motion";
import {SocialList} from "../shared/data.ts";
import {Button, Link} from "@heroui/react";
import background from "../assets/background/socials-bg.png";
import mobileBackground from "../assets/background/socials-bg-vertical.png";

type Props = {
    setSelectedPage: (value: SelectedPage) => void;
}

const Socials = ({setSelectedPage}: Props) => {
    return (
        <section id="socials">
            <motion.div
                className=" h-full"
                onViewportEnter={() => setSelectedPage(SelectedPage.Contact)}
            >
                {/*<motion.div*/}
                {/*    className="mx-auto w-5/6"*/}
                {/*    initial="hidden"*/}
                {/*    whileInView="visible"*/}
                {/*    viewport={{once:true, amount: 0.5}}*/}
                {/*    transition={{ duration: 0.5 }}*/}
                {/*    variants={{*/}
                {/*        hidden: { opacity: 0, y: 50},*/}
                {/*        visible: {opacity: 1, y: 0}*/}
                {/*    }}*/}
                {/*>*/}
                {/*    <div className="flex flex-col justify-center items-center w-full xl:py-0 py-4">*/}
                {/*        <img alt="Floralia Logo" src={logo} className="xl:mt-[-2dvh]"/>*/}
                {/*        <div className="flex justify-center items-center w-full gap-4 py-4 3xl:py-6">*/}
                {/*            {SocialList.map((item: SocialsType) => (*/}
                {/*                <a key={`social-${item.name}`} href={item.url}><img alt={item.name} src={item.image} className="aspect-square h-[5dvh] 3xl:h-[7vh]"/></a>*/}
                {/*            ))}*/}
                {/*        </div>*/}
                {/*        <p>© All Rights Reserved Floralia Games 2025</p>*/}
                {/*    </div>*/}
                {/*</motion.div>*/}

                <motion.div
                    className="mx-auto flex flex-col items-start justify-center sm:w-full"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{once:true, amount: 0.5}}
                    transition={{ duration: 0.5 }}
                    variants={{
                        hidden: { opacity: 0, y: 50},
                        visible: {opacity: 1, y: 0}
                    }}
                >
                    <div className="relative w-full ">
                        <img
                            src={background}
                            alt="Background"
                            className="w-full h-auto hidden sm:block"
                            aria-hidden="true"
                        />
                        <img
                            src={mobileBackground}
                            alt="Background"
                            className="w-full h-auto sm:hidden"
                            aria-hidden="true"
                        />
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-evenly xl:gap-20 w-full h-1/2 sm:mt-40 md:mt-50 m-auto">
                            <div className="w-11/12 md:w-4/5 flex sm:justify-end">
                                <h1 className="text-5xl xl:text-8xl 3xl:text-7xl xl:w-2/3 3xl:w-1/3 font-kavoon text-primary-background xl:text-end">Reach us on social media</h1>
                            </div>
                            <div className="w-11/12 xl:w-4/5 grid sm:grid-cols-3 gap-4">
                                {SocialList.map((item: SocialsType) => (
                                    <Button
                                        key={`social-${item.name}`}
                                        as={Link} href={item.url}
                                        className={`bg-primary-background p-8 rounded-3xl shadow-sm font-kavoon justify-between text-lg xl:text-2xl 3xl:text-3xl text-primary-text hover:bg-gradient-pink-310 hover:text-primary-background transition-all duration-300 ${item.basis}`}
                                        startContent={<img alt={item.name} src={item.image} className="object-center w-10"/>}
                                    >
                                        {item.name}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    )
}
export default Socials
