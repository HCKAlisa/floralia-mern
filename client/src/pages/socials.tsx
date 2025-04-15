import { SelectedPage, SocialsType } from "../shared/types";
import {motion} from "framer-motion";
import logo from "../assets/logo.png";
import {SocialList} from "../shared/data.ts";

type Props = {
    setSelectedPage: (value: SelectedPage) => void;
}

const Socials = ({setSelectedPage}: Props) => {
    return (
        <section id="contact">
            <motion.div
                className=" bg-[url(assets/mainBg.png)] h-full"
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
                    <div className="flex flex-col justify-center items-center w-full xl:py-0 py-4">
                        <img alt="Floralia Logo" src={logo} className="xl:mt-[-2dvh]"/>
                        <div className="flex justify-center items-center w-full gap-4 py-4 3xl:py-6">
                            {SocialList.map((item: SocialsType) => (
                                <a key={`social-${item.name}`} href={item.url}><img alt={item.name} src={item.image} className="aspect-square h-[5dvh] 3xl:h-[7vh]"/></a>
                            ))}
                        </div>
                        <p>© All Rights Reserved Floralia Games 2025</p>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    )
}
export default Socials
