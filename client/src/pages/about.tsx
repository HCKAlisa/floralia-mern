import { motion } from "framer-motion";
import {SelectedPage} from "../shared/types.ts";
import {Image, Button, Link} from "@heroui/react";
import background from "../assets/background/about-bg-940.png";
import tabletBackground from "../assets/background/about-bg-940.png";
import { SocialList } from "../shared/data.ts";

type Props = {
    setSelectedPage: (value: SelectedPage) => void;
}

const About = ({setSelectedPage}: Props) => {
    const discordLink = SocialList.find(social => social.name === "Discord")?.url || "#";

    return (
        <section id="about">
            <motion.div
                className="h-screen flex items-center justify-center bg-primary-background bg-[url('assets/background/about-bg-vertical.png')] bg-cover bg-center py-100 sm:py-0 sm:h-full sm:bg-none sm:block "
                onViewportEnter={() => setSelectedPage(SelectedPage.About)}
            >
                <div>
                    <Image
                        alt="hero background"
                        src={background}
                        width="100%"
                        className="hidden xl:block"
                    />
                    <Image
                        alt="hero background"
                        src={tabletBackground}
                        width="100%"
                        className="hidden sm:block xl:hidden"
                    />
                    {/*<Image*/}
                    {/*    alt="hero background"*/}
                    {/*    src={mobileBackground}*/}
                    {/*    width="100%"*/}
                    {/*    className="sm:hidden"*/}
                    {/*/>*/}
                    <motion.div
                        className="sm:absolute top-0 left-0 mx-auto flex items-center sm:items-start xl:items-center justify-center sm:justify-end w-full h-full z-10 "
                        initial="hidden"
                        whileInView="visible"
                        viewport={{once:true, amount: 0.5}}
                        transition={{ duration: 0.5 }}
                        variants={{
                            hidden: { opacity: 0, y: -50 },
                            visible: { opacity: 1, y: 0 }
                        }}
                    >
                        <div className="text-primary-background sm:w-1/2 mx-auto w-11/12 sm:mr-10 xl:mr-20 text-center sm:text-start mt-10 sm:mt-25 xl:mt-0">
                            {/*<h1 className="text-9xl font-kavoon text-end">Floralia</h1>*/}
                            <h1 className="text-5xl sm:text-3xl md:text-5xl lg:text-7xl 2xl:text-8xl 3xl:text-9xl font-kavoon ">Welcome to Floralia Games</h1>
                            <p className="text-2xl sm:text-xl md:text-2xl lg:text-4xl 3xl:text-5xl xl:mt-4 xl:w-11/12">
                                We’re a cozy indie team of passionate game developers creating heartfelt games!
                            </p>
                            <Button as={Link} href={discordLink} radius="full" variant="shadow" color="secondary" className="text-primary-background xl:text-3xl 3xl:text-4xl mt-4 xl:p-4 3xl:p-8 hover:bg-gradient-green-180 transition-colors duration-300">Join us on Discord</Button>
                        </div>

                    </motion.div>
                </div>
            </motion.div>
        </section>
    )
}
export default About
