import { motion } from "framer-motion";
import {SelectedPage, SocialsType} from "../shared/types.ts";
import {Image, Button, Link} from "@heroui/react";
import background from "../assets/background/about-bg-940.png";
import tabletBackground from "../assets/background/about-bg-940.png";
import { SocialList } from "../shared/data.ts";
import KofiWidget from "../components/kofi-widget.tsx";

type Props = {
    setSelectedPage: (value: SelectedPage) => void;
}

const About = ({setSelectedPage}: Props) => {

    return (
        <section id="about">
            <motion.div
                className="h-screen flex items-center justify-center bg-primary-background bg-[url('assets/background/about-bg-vertical.png')] bg-cover bg-center py-100 sm:py-0 sm:h-full sm:bg-none sm:block "
                onViewportEnter={() => setSelectedPage(SelectedPage.About)}
            >
                <div className="sm:relative">
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
                        <div className="text-primary-background [text-shadow:0_2px_8px_rgb(0_0_0/0.45)] sm:w-1/2 mx-auto w-5/6 sm:mr-10 xl:mr-[4cqw] text-center sm:text-start mt-10 sm:mt-25 xl:-mt-[10cqw]">
                            {/*<h1 className="text-9xl font-kavoon text-end">Floralia</h1>*/}
                            <h1 className="text-5xl sm:text-3xl md:text-5xl lg:text-7xl xl:text-[5cqw] font-kavoon ">Welcome to Floralia Games</h1>
                            <p className="text-2xl sm:text-xl md:text-2xl lg:text-4xl xl:text-[2cqw] xl:mt-[0.5cqw] xl:w-11/12">
                                We’re a cozy indie team of passionate game developers creating heartfelt games!
                            </p>
                            <div className="flex justify-center sm:justify-start gap-4 mt-4">
                                {SocialList.map((item: SocialsType) => (
                                    <Button
                                        key={`social-${item.name}`}
                                        as={Link} href={item.url}
                                        isIconOnly
                                        radius="full"
                                        variant="shadow"
                                        color="secondary"
                                        size="lg"
                                        className={`bg-primary-background shadow-[0_1px_4px_rgb(0_0_0/0.25)] shadow-black/25 p-2 font-kavoon justify-between hover:bg-gradient-yellow-310 transition-all duration-300 ${item.basis}`}
                                    >
                                        <img alt={item.name} src={item.image} className="object-center w-10"/>
                                    </Button>
                                ))}
                                <KofiWidget />
                            </div>
                        </div>

                    </motion.div>
                </div>
            </motion.div>
        </section>
    )
}
export default About
