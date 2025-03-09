import {TeamType, GameType, FaqType, SocialsType} from "./types.ts";
import bloomtale from "../assets/videoPlaceholder.png"
import ins from "../assets/Icons/instagram.png"
import steam from "../assets/Icons/steam.png"
import discord from "../assets/Icons/discord.png"
import max from "../assets/Icons/max.png"
import hanna from "../assets/Icons/hanna.png"
import sion from "../assets/Icons/sion.png"
import yuki from "../assets/Icons/yuki.png"
import joshua from "../assets/Icons/joshua.png"


const GameList: GameType[] = [
    {
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
        media: bloomtale,
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
        answer: "sdfsdf"
    },
    {
        question: "When will BloomTale be released??",
        answer: "sdfsdf"
    },
    {
        question: "Is BloomTale a paid game?",
        answer: "sdfsdf"
    },
    {
        question: "What platforms will BloomTale be on?",
        answer: "sdfsdf"
    },
    {
        question: "Can I play BloomTale on a Mac and Windows?",
        answer: "sdfsdf"
    },
    {
        question: "Can I play BloomTale on a mobile?",
        answer: "sdfsdf"
    },
    {
        question: "Can I play BloomTale with a controller?",
        answer: "sdfsdf"
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