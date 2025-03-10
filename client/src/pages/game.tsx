import {GameType, SelectedPage, SocialsType} from "../shared/types";
import { GameList } from "../shared/data";
import {motion} from "framer-motion";
import {useState} from "react";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/solid"

type Props = {
    setSelectedPage: (value: SelectedPage) => void;
}

const Game = ({setSelectedPage}: Props) => {
    const overlayStyles = `p-5 absolute z-30 bottom-0 h-[20dvh] w-full flex flex-col items-center justify-center 
  whitespace-normal bg-[#D9D9D9]/75 text-center rounded-4xl`;
    const [currentGame, setCurrentGame] = useState<number>(0);

    const handleNextOrPrevious = (next: boolean) => {
        setCurrentGame((prevIndex) => {
            const itemCount = GameList.length;
            if (next) {
                return (prevIndex + 1) % itemCount;
            } else {
                return (prevIndex - 1 + itemCount) % itemCount;
            }
        });
    };

    return (
        <section id="games">
            <motion.div
                className=" bg-[url(assets/mainBg.png)] md:h-[80dvh]"
                onViewportEnter={() => setSelectedPage(SelectedPage.Home)}
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
                    <h1 className="py-6 text-4xl text-[#4C3F3F]">Game</h1>
                    { GameList.filter((item:GameType ,index: number) => index === currentGame).map((item: GameType, index: number) => (
                        <div className="relative aspect-video md:h-[60dvh] rounded-4xl overflow-hidden">
                            <div id={`game-${index}`} className={overlayStyles}>
                                <h3 className="text-4xl">{item.name}</h3>
                                <div className="flex gap-4 md:py-6">
                                    {item.socials.map((social:SocialsType) => (
                                        <a href={social.url}><img alt={`${social.image}`} src={social.image} className="aspect-square h-[25px] md:h-[2dvh]"/></a>
                                    ))}
                                </div>
                                {item.released ? (
                                    <a href={item.steam}>Purchase on Steam</a>
                                ) : (
                                    <a href={item.steam}>Wishlist on Steam</a>
                                    )}
                            </div>
                            {GameList.length > 1 && (
                                <div className="absolute flex justify-between items-center gap-4 z-30 w-full h-full">
                                    <button type="button" className="" onClick={() => handleNextOrPrevious(false)}><ChevronLeftIcon className="size-16 text-[#D9D9D9]/75" /></button>
                                    <button type="button" onClick={() => handleNextOrPrevious(true)}><ChevronRightIcon className="size-16 text-[#D9D9D9]/75" /></button>
                                </div>
                            )}
                            <img alt={`${item.media}`} src={item.media} className="w-full"/>
                        </div>
                    ))}
                </motion.div>
            </motion.div>
        </section>

    )
}
export default Game
