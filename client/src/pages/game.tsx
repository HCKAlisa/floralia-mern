import {GameType, SelectedPage} from "../shared/types";
import { GameList } from "../shared/data";
import {motion} from "framer-motion";
// import {useEffect, useState} from "react";
import {Button, Image, Link} from "@heroui/react";
import title from "../assets/Icons/games-title.png";
import bullet from "../assets/Icons/bullet.png";
import steam from "../assets/Icons/steam.png";


type Props = {
    setSelectedPage: (value: SelectedPage) => void;
}

const Game = ({setSelectedPage}: Props) => {
    // const [gameList, setGameList] = useState<GameType[]>([])
    // const [currentGame, setCurrentGame] = useState<number>(0);

    // useEffect(() => {
    //     try {
    //         const fetchGames = async () => {
    //             const res = await fetch(`/api/game/getGames`);
    //             const data = await res.json();
    //             if (res.ok) {
    //                 setGameList(data);
    //             } else {
    //                 console.log(data.message)
    //             }
    //         };
    //         fetchGames();
    //     } catch (error: any) {
    //         console.log(error.message);
    //     }
    // }, []);

    return (
        <section id="games">
            <motion.div
                className="h-full"
                onViewportEnter={() => setSelectedPage(SelectedPage.Games)}
            >
                <motion.div
                    className="mx-auto flex flex-col items-center justify-center sm:w-full"
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
                        removeWrapper
                        className=" mx-auto w-1/2 sm:w-1/3 xl:w-1/6 xl:-mb-20 3xl:-mb-50"
                    />
                    { GameList.map((item: GameType, index: number) => (
                        <div key={`game-${index}`} className="w-full flex flex-col sm:flex-row items-center justify-between text-center sm:text-left">
                            <Image
                                src={item.mobileMedia}
                                alt={item.name}
                                removeWrapper
                                className="sm:hidden mb-5 w-full h-auto"
                            />
                            { index% 2 !== 0 && (
                                <Image
                                    src={item.media}
                                    alt={item.name}
                                    width="40%"
                                    removeWrapper
                                    className="hidden sm:block"
                                />
                            )}
                            <div className="sm:w-3/5 3xl:w-1/2 w-5/6 mx-auto sm:mx-5 xl:mx-[4cqw] flex flex-col items-center sm:items-start justify-center gap-4 ">
                                <h1 className="text-5xl xl:text-[3.5cqw] text-tertiary font-kavoon">{item.name}</h1>
                                <p className="text-xl xl:text-[1.1cqw]">{item.description}</p>
                                <ul>
                                    { item.points?.map((point, pointIndex) => (
                                        <li key={`point-${pointIndex}`} className="flex gap-2 items-center text-2xl xl:text-[1.1cqw] text-secondary my-2">
                                            <Image src={bullet} width="80%"/> {point}
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    key={`steam-${item.name}`}
                                    as={Link}
                                    href={item.steam}
                                    target="_blank"
                                    radius="full"
                                    variant="shadow"
                                    className="w-full xl:w-1/2 bg-tertiary text-primary-background hover:bg-gradient-pink-310 font-kavoon text-2xl xl:text-[1.1cqw] px-4 py-2 transition-colors duration-300"
                                >
                                    Check it out <Image src={steam} removeWrapper className="w-7 xl:w-[1.5cqw]"/>
                                </Button>
                            </div>
                            { index% 2 === 0 && (
                                <Image
                                    src={item.media}
                                    alt={item.name}
                                    width="40%"
                                    removeWrapper
                                    className="hidden sm:block"
                                />
                            )}

                        </div>
                    ))}
                </motion.div>
            </motion.div>
        </section>

    )
}
export default Game
