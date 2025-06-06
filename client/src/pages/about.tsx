import { motion } from "framer-motion";
import {SelectedPage} from "../shared/types.ts";
import {Image, Button, Link} from "@heroui/react";
import background from "../assets/background/about-bg.png";
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
                    />
                    <motion.div
                        className="absolute top-0 left-0 mx-auto flex items-center justify-end w-full h-full z-10"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{once:true, amount: 0.5}}
                        transition={{ duration: 0.5 }}
                        variants={{
                            hidden: { opacity: 0, y: -50 },
                            visible: { opacity: 1, y: 0 }
                        }}
                    >
                        <div className="text-primary-background xl:w-1/2 w-full  mx-20">
                            {/*<h1 className="text-9xl font-kavoon text-end">Floralia</h1>*/}
                            <h1 className="text-8xl font-kavoon ">Welcome to Floralia Games</h1>
                            <p className="text-5xl mt-4">
                                We’re a cozy indie team of passionate game developers creating heartfelt games!
                            </p>
                            <Button as={Link} href={discordLink} radius="full" variant="shadow" color="secondary" className="text-primary-background mt-4">Join us on Discord</Button>
                        </div>

                    </motion.div>
                </div>
            </motion.div>
        </section>
    )
}
export default About
