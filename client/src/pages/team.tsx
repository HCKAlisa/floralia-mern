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
                            <section id="team" className="xl:-mt-20">
                                <motion.div
                                    onViewportEnter={() => setSelectedPage(SelectedPage.Team)}
                                >
                                    <motion.div
                                        className="mx-auto flex flex-col items-center justify-center xl:w-full "
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
                                            removeWrapper
                                            className="mx-auto -mb-20 w-1/2 xl:w-1/4"
                                        />
                                        <div className="xl:relative w-full bg-[url(assets/background/team-bg.png)] bg-cover bg-center xl:bg-none xl:bg-transparent py-30 xl:py-0">
                                            <img
                                                src={background}
                                                alt="Background"
                                                className="hidden xl:block w-full h-auto"
                                                aria-hidden="true"
                                            />
                                            <div className="xl:absolute inset-0 z-10 flex flex-col items-center justify-center w-full h-full">
                                                <div className="w-11/12 xl:w-4/5 grid xl:grid-cols-2 gap-2 xl:gap-4">
                                                    {TeamList.map((item: TeamType, index: number) =>
                                                        index % 2 === 0 ? (
                                                            <div className="w-full" key={`team-${index}`}>
                                                                <Card className="rounded-lg shadow-lg" >
                                                                    <CardBody className="bg-primary-background grid grid-cols-2 place-items-start items-center ">
                                                                        <Image alt={item.name} src={item.image} className="aspect-square w-11/12 xl:w-2/3 place-self-center"/>
                                                                        <div className="place-item-center">
                                                                            <h6 className="pt-2 text-2xl xl:text-3xl 2xl:text-5xl" style={{ color: item.color }}>{item.name}</h6>
                                                                            <h6 className="pb-2 xl:text-xl 2xl:text-2xl">{item.title}</h6>
                                                                        </div>
                                                                    </CardBody>
                                                                </Card>
                                                            </div>
                                                        ) : (
                                                            <div className="w-full" key={`team-${index}`}>
                                                                <Card className="mx-auto my-auto rounded-lg shadow-lg xl:mt-7" >
                                                                    <CardBody className="bg-primary-background grid grid-cols-2 place-items-end items-center ">
                                                                        <div className="place-items-end">
                                                                            <h6 className="pt-2 text-2xl  xl:text-3xl 2xl:text-5xl text-end" style={{ color: item.color }}>{item.name}</h6>
                                                                            <h6 className="pb-2 xl:text-xl 2xl:text-2xl text-end">{item.title}</h6>
                                                                        </div>
                                                                        <Image alt={item.name} src={item.image} className="aspect-square w-11/12 xl:w-2/3 place-self-center"/>
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