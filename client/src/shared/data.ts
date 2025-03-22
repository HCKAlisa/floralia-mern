import {TeamType, GameType, FaqType, SocialsType} from "./types.ts";
//import bloomtale from "../assets/videoPlaceholder.png"
import bloomtaleVideo from "../assets/Videos/gameplayTralier.mp4"
import ins from "../assets/Icons/instagram.png"
import steam from "../assets/Icons/steam.png"
import discord from "../assets/Icons/discord.png"
import max from "../assets/Icons/max.png"
import hanna from "../assets/Icons/hanna.png"
import sion from "../assets/Icons/sion.png"
import yuki from "../assets/Icons/yuki.png"
import joshua from "../assets/Icons/joshua.png"

const gameDataKey = Symbol('game');
export type TGameData = { [gameDataKey]: true; gameId: GameType['id'] };

export const getGames = (): GameType[] => {
    return GameList;
}

export const getGameData = (game: GameType) => {
    return { [gameDataKey]: true, gameId: game.id };
}

export const isGameData = (data: Record<string | symbol, unknown>): data is TGameData => {
    return data[gameDataKey] === true; }

const GameList: GameType[] = [
    {
        id: "1",
        name: "BloomTale",
        socials: [
            {
                name: "instagram",
                image: ins,
                url: "https://www.instagram.com/floralia_games?igsh=OXlucWsxeGJkeDJ3"
            },
            {
                name: "Discord",
                image: discord,
                url: "https://discord.com/invite/xHBexRWwdv?fbclid=PAZXh0bgNhZW0CMTEAAaYXRe6giX0f7_ed1atA1TvuQsrZd_pDz9qPSuCBYdp1ol0qW9vVQr4lb6w_aem_IzOfHwS2rwsdJ5GavB9mpQ"
            }
        ],
        media: bloomtaleVideo,
        steam: "https://store.steampowered.com/app/3168520/BloomTale/",
        released: false,
    }
]

const TeamList: TeamType[] = [
    {
        name:"Max Choi",
        title: "Programmer",
        image: max,
    },
    {
        name:"Hanna Dabrowska",
        title: "Artist",
        image: hanna,
    },
    {
        name:"Sion Kim",
        title: "Game Designer",
        image: sion,
    },
    {
        name:"Yuki Hu",
        title: "Narrative Designer",
        image: yuki,
    },
    {
        name:"Joshua Ingeneri",
        title: "Audio Designer",
        image: joshua,
    },
]

const FaqList: FaqType[] = [
    {
        question: "What is Floralia?",
        answer: "Floralia Games is a small indie team of passionate game developers. We are currently working on our first game - BloomTale, a cozy flower shop game."
    },
    {
        question: "When will BloomTale be released??",
        answer: "Early Access is planned for July 2025."
    },
    {
        question: "Is BloomTale a paid game?",
        answer: "Yes, the price is undecided."
    },
    {
        question: "How do I keep updated with BloomTale's progress?",
        answer: "Follow us on social medias and join our Discord server to stay up to date."
    },
    {
        question: "What platforms will BloomTale be on?",
        answer: "Steam, App Store, and Play Store are confirmed."
    },
    {
        question: "Can I play BloomTale on a Mac and Windows?",
        answer: "Mac and Windows are confirmed. Linux is not supported."
    },
    {
        question: "Can I play BloomTale on a mobile?",
        answer: "Yes, it is planned for future after Steam release."
    },
    {
        question: "Can I play BloomTale with a controller?",
        answer: "No, BloomTale is mostly an interactive UI game designed for mouse interaction with touchscreen on mobile."
    },
    {
        question: "Can I play BloomTale on a Nintendo Switch or Steam Deck?",
        answer: "TBD"
    },
    {
        question: "What are the supported languages for BloomTale?",
        answer: "English, Spanish, Portuguese, Polish, Turkish, Latin, Chinese (Simplified), and Korean are confirmed. Open for suggestions."
    },
]

const SocialList: SocialsType[] = [
    {
        name: "instagram",
        image: ins,
        url: "https://www.instagram.com/floralia_games?igsh=OXlucWsxeGJkeDJ3",
    },
    {
        name: "steam",
        image: steam,
        url: "https://store.steampowered.com/app/3168520/BloomTale/",
    },
]

export {GameList, TeamList, FaqList, SocialList};