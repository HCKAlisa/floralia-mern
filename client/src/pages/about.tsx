import { motion } from "framer-motion";
import {SelectedPage} from "../shared/types.ts";
import {Image, Button, Link} from "@heroui/react";
import background from "../assets/background/about-bg-940.png";
import mobileBackground from "../assets/background/about-bg.png";
import { SocialList } from "../shared/data.ts"; // Assuming you have a data file for socials

type Props = {
    setSelectedPage: (value: SelectedPage) => void;
}

const About = ({setSelectedPage}: Props) => {
    const discordLink = SocialList.find(social => social.name === "Discord")?.url || "#";

    return (
        <section id="about">
            <motion.div
                className="h-full"
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
                        src={mobileBackground}
                        width="100%"
                        className="xl:hidden"
                    />
                    <motion.div
                        className="absolute top-20 left-40 xl:top-0 xl:left-0 xl:mx-auto flex xl:items-center justify-end w-2/3 xl:w-full h-full z-10"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{once:true, amount: 0.5}}
                        transition={{ duration: 0.5 }}
                        variants={{
                            hidden: { opacity: 0, y: -50 },
                            visible: { opacity: 1, y: 0 }
                        }}
                    >
                        <div className="text-primary-background xl:w-1/2 w-full xl:mx-20">
                            {/*<h1 className="text-9xl font-kavoon text-end">Floralia</h1>*/}
                            <h1 className="text-xl xl:text-7xl 2xl:text-8xl 3xl:text-9xl font-kavoon ">Welcome to Floralia Games</h1>
                            <p className="xl:text-4xl 3xl:text-5xl mt-4">
                                We’re a cozy indie team of passionate game developers creating heartfelt games!
                            </p>
                            <Button as={Link} href={discordLink} radius="full" variant="shadow" color="secondary" className="text-primary-background xl:text-3xl 3xl:text-4xl mt-4 xl:p-4 3xl:p-8 ">Join us on Discord</Button>
                        </div>

                    </motion.div>
                </div>
            </motion.div>
        </section>
    )
}
export default About
