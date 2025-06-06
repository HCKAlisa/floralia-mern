import {TeamType, SelectedPage} from "../shared/types";
import { motion } from 'framer-motion';
import {TeamList} from "../shared/data.ts";
import title from "../assets/Icons/team-title.png";
import {Card, CardBody, Image} from "@heroui/react";

type Props = {
    setSelectedPage: (value: SelectedPage) => void;
}

const Team = ({setSelectedPage}: Props) => {
    return (
        <section id="team">
            <motion.div
                className="h-full"
                onViewportEnter={() => setSelectedPage(SelectedPage.Team)}
            >
                <motion.div
                    className="mx-auto flex flex-col items-start justify-center xl:w-full w-11/12"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{once:true, amount: 0.5}}
                    transition={{ duration: 0.5 }}
                    variants={{
                        hidden: { opacity: 0, y: 50},
                        visible: {opacity: 1, y: 0}
                    }}
                >
                <Image
                    alt="Game Title"
                    src={title}
                    width="80%"
                    className="mx-auto"
                />
                <div className="mx-auto flex flex-col items-center justify-center bg-[url(assets/background/team-bg-horizontal.png)] bg-cover bg-center bg-no-repeat h-[1080px]">
                    <div className="w-11/12 xl:w-4/5 3xl:w-3/5 flex xl:flex-row justify-center items-center flex-wrap gap-2 xl:gap-16 mt-[-5vh]">
                        { TeamList.map((item: TeamType, index: number) => (
                            <Card key={`team-${index}`} className="xl:w-max w-2/5 " >
                                <CardBody className="bg-primary-background flex flex-col items-center">
                                    <img alt={`${item.image}`} src={item.image} className="aspect-square w-3/5 3xl:w-11/12"/>
                                    <h6 className="pt-2 xl:text-3xl">{item.name}</h6>
                                    <h6 className="pb-2">{item.title}</h6>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </div>

                </motion.div>
            </motion.div>
        </section>
    )
}
export default Team
