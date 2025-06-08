import {TeamType, SelectedPage} from "../shared/types";
                    import { motion } from 'framer-motion';
                    import {TeamList} from "../shared/data.ts";
                    import title from "../assets/Icons/team-title.png";
                    import {Card, CardBody, Image} from "@heroui/react";
                    import background from "../assets/background/team-bg-1359.png";

                    type Props = {
                        setSelectedPage: (value: SelectedPage) => void;
                    }

                    const Team = ({setSelectedPage}: Props) => {
                        return (
                            <section id="team">
                                <motion.div
                                    onViewportEnter={() => setSelectedPage(SelectedPage.Team)}
                                >
                                    <motion.div
                                        className="mx-auto flex flex-col items-center justify-center xl:w-full w-11/12"
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
                                            alt="Team Title"
                                            src={title}
                                            width="80%"
                                            className="mx-auto -mb-20 -mt-10"
                                        />
                                        <div className="relative w-full overflow-hidden">
                                            <img
                                                src={background}
                                                alt="Background"
                                                className="w-full h-auto block"
                                                aria-hidden="true"
                                            />
                                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center w-full h-full">
                                                <div className="w-11/12 xl:w-4/5 grid xl:grid-cols-2 gap-4">
                                                    {TeamList.map((item: TeamType, index: number) =>
                                                        index % 2 === 0 ? (
                                                            <div className="w-full" key={`team-${index}`}>
                                                                <Card className="rounded-lg shadow-lg" >
                                                                    <CardBody className="bg-primary-background grid grid-cols-2 place-items-start items-center ">
                                                                        <img alt={item.name} src={item.image} className="aspect-square xl:w-2/3 place-self-center"/>
                                                                        <div className="place-item-center">
                                                                            <h6 className="pt-2 xl:text-3xl 2xl:text-5xl" style={{ color: item.color }}>{item.name}</h6>
                                                                            <h6 className="pb-2 xl:text-xl 2xl:text-2xl">{item.title}</h6>
                                                                        </div>
                                                                    </CardBody>
                                                                </Card>
                                                            </div>
                                                        ) : (
                                                            <div className="w-full" key={`team-${index}`}>
                                                                <Card className="mx-auto my-auto rounded-lg shadow-lg mt-7" >
                                                                    <CardBody className="bg-primary-background grid grid-cols-2 place-items-end items-center ">
                                                                        <div className="place-items-end">
                                                                            <h6 className="pt-2 xl:text-3xl 2xl:text-5xl text-end" style={{ color: item.color }}>{item.name}</h6>
                                                                            <h6 className="pb-2 xl:text-xl 2xl:text-2xl text-end">{item.title}</h6>
                                                                        </div>
                                                                        <img alt={item.name} src={item.image} className="aspect-square xl:w-2/3 place-self-center"/>
                                                                    </CardBody>
                                                                </Card>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </section>
                        )
                    }
                    export default Team