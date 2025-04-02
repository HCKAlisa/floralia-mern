import {TeamType, SelectedPage} from "../shared/types";
import { motion } from 'framer-motion';
import {TeamList} from "../shared/data.ts";

type Props = {
    setSelectedPage: (value: SelectedPage) => void;
}

const Team = ({setSelectedPage}: Props) => {
    return (
        <section id="team">
            <motion.div
                className=" bg-[url(assets/mainBg.png)] h-full overflow-y-visible"
                onViewportEnter={() => setSelectedPage(SelectedPage.Team)}
            >
                <motion.div
                    className="mx-auto flex flex-col items-center justify-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{once:true, amount: 0.5}}
                    transition={{ duration: 0.5 }}
                    variants={{
                        hidden: { opacity: 0, y: 50},
                        visible: {opacity: 1, y: 0}
                    }}
                >
                    <h1 className="py-6 text-4xl text-[#4C3F3F]">Team</h1>
                        <div className="w-11/12 xl:w-4/5 3xl:w-3/5 flex xl:flex-row justify-center items-center flex-wrap gap-2 xl:gap-16 ">
                            { TeamList.map((item: TeamType, index: number) => (
                                <div id={`team-${index}`} className="xl:w-max w-2/5 flex flex-col items-center" >
                                    <img alt={`${item.image}`} src={item.image} className="aspect-square w-3/5 3xl:w-11/12"/>
                                    <h6 className="pt-2 xl:text-3xl">{item.name}</h6>
                                    <h6 className="pb-2">{item.title}</h6>
                                </div>

                            ))}
                        </div>
                </motion.div>
            </motion.div>
        </section>
    )
}
export default Team
