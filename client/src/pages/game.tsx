import {GameType, SelectedPage, SocialsType} from "../shared/types";
//import { GameList } from "../shared/data";
import {motion} from "framer-motion";
import {useEffect, useState} from "react";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/solid"
import { FaDiscord, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";


type Props = {
    setSelectedPage: (value: SelectedPage) => void;
}

const Game = ({setSelectedPage}: Props) => {
    const overlayStyles = `p-5 absolute z-40 bottom-0 xl:h-[20dvh] h-[12dvh] w-full flex flex-col items-center justify-center 
  whitespace-normal bg-[#D9D9D9]/75 text-center xl:rounded-4xl rounded-2xl`;
    const [gameList, setGameList] = useState<GameType[]>([])
    const [currentGame, setCurrentGame] = useState<number>(0);

    useEffect(() => {
        try {
            const fetchGames = async () => {
                const res = await fetch(`/api/game/getGames`);
                const data = await res.json();
                if (res.ok) {
                    setGameList(data);
                } else {
                    console.log(data.message)
                }
            };
            fetchGames();
        } catch (error: any) {
            console.log(error.message);
        }
    }, []);

    console.log(gameList);

    const handleNextOrPrevious = (next: boolean) => {
        setCurrentGame((prevIndex) => {
            const itemCount = gameList.length;
            if (next) {
                return (prevIndex + 1) % itemCount;
            } else {
                return (prevIndex - 1 + itemCount) % itemCount;
            }
        });
    };

    return (
        <section id="home">
            <motion.div
                className=" bg-[url(assets/mainBg.png)] xl:h-[80dvh] h-full"
                onViewportEnter={() => setSelectedPage(SelectedPage.Home)}
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
                    <h1 className="py-6 text-4xl text-[#4C3F3F]">Game</h1>
                    { gameList.filter((_item:GameType ,index: number) => index === currentGame).map((item: GameType, index: number) => (
                        <div className="relative aspect-video xl:h-[60dvh] xl:rounded-4xl rounded-2xl overflow-hidden">
                            <div id={`game-${index}`} className={overlayStyles}>
                                <h3 className="text-4xl">{item.name}</h3>
                                <div className="flex gap-4 xl:py-6">
                                    {item.socials.map((social:SocialsType) => (
                                        <a title={social.name} href={social.url}>
                                            {social.name==="discord" && (<FaDiscord size={25}/>)}
                                            {social.name==="instagram" && (<FaInstagram size={25}/>)}
                                            {social.name==="x" && (<FaXTwitter size={25}/>)}
                                        </a>
                                    ))}
                                </div>
                                {item.released ? (
                                    <a href={item.steam}>Purchase on Steam</a>
                                ) : (
                                    <a href={item.steam}>Wishlist on Steam</a>
                                    )}
                            </div>
                            {gameList.length > 1 && (
                                <div className="absolute flex justify-between items-center gap-4 z-30 w-full h-full">
                                    <button type="button" className="" onClick={() => handleNextOrPrevious(false)}><ChevronLeftIcon className="size-16 text-[#D9D9D9]/75" /></button>
                                    <button type="button" onClick={() => handleNextOrPrevious(true)}><ChevronRightIcon className="size-16 text-[#D9D9D9]/75" /></button>
                                </div>
                            )}
                            {item.isVideo ? (<video className="w-full" loop muted autoPlay id={`video-game-${index}`} src={item.media}/>):(<img alt={`${item.media}`} src={item.media} className="w-full"/>)}
                        </div>
                    ))}
                </motion.div>
            </motion.div>
        </section>

    )
}
export default Game
