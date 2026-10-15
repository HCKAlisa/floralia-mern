import { TeamType, GameType, FaqType, SocialsType } from "./types.ts";
import bloomtale from "../assets/images/bloomTale.png"
//import bloomtaleVideo from "../assets/videos/gameplayTralier.mp4"
import ins from "../assets/Icons/ins.png"
import steam from "../assets/Icons/steam.png"
import discord from "../assets/Icons/discord.png"
import max from "../assets/Icons/max.png"
import hanna from "../assets/Icons/hanna.png"
import joshua from "../assets/Icons/joshua.png"
import mia from "../assets/Icons/mia.png"
import tiktok from "../assets/Icons/tiktok.png"
import gmail from "../assets/Icons/gmail.png"
import alisa from "../assets/Icons/alisa.png"
import bloomtaleMobile from "../assets/images/bloomtale-mobile.png";
import pierce from "../assets/Icons/pierce.png"

const gameDataKey = Symbol('game');
export type TGameData = { [gameDataKey]: true; gameId: GameType['id'] };

export const getGames = (): GameType[] => {
    return GameList;
}

export const getGameData = (game: GameType) => {
    return { [gameDataKey]: true, gameId: game.id };
}

export const isGameData = (data: Record<string | symbol, unknown>): data is TGameData => {
    return data[gameDataKey] === true;
}

const teamDataKey = Symbol('team');
export type TTeamData = { [teamDataKey]: true; teamId: TeamType['id'] };

export const getTeams = (): TeamType[] => {
    return TeamList;
}

export const getTeamData = (team: TeamType) => {
    return { [teamDataKey]: true, teamId: team.id };
}

export const isTeamData = (data: Record<string | symbol, unknown>): data is TTeamData => {
    return data[gameDataKey] === true;
}

const GameList: GameType[] = [
    {
        id: "1",
        name: "BloomTale",
        description: "BloomTale is a cozy flower shop simulation game where creativity meets management. Arrange beautiful flower compositions that speak the language of flowers, manage your shop, and satisfy your customers in a world of blooming possibilities.",
        media: bloomtale,
        mobileMedia: bloomtaleMobile,
        isVideo: false,
        steam: "https://store.steampowered.com/app/3168520/BloomTale/",
        released: false,
        points: [
            "COZY",
            "CREATIVE",
            "RELAXING",
        ]
    },
    // {
    //     id: "2",
    //     name: "Test 2",
    //     description: "This is a test game for demonstration purposes.",
    //     media: game2,
    //     isVideo: false,
    //     steam: "https://store.steampowered.com/app/3168520/BloomTale/",
    //     released: false,
    //     points: [
    //         "COZY",
    //         "CREATIVE",
    //         "RELAXING",
    //     ]
    // },
]

const TeamList: TeamType[] = [
    {
        id: "1",
        name: "Max Choi",
        title: "Programmer",
        image: max,
        color: "#b5d6a3",
        linkedin: "https://www.linkedin.com/in/maxchoi01/"
    },
    {
        id: "2",
        name: "Hanna Dabrowska",
        title: "Artist",
        image: hanna,
        color: "#FC8F92",
        linkedin: "https://www.linkedin.com/in/hanna-dąbrowska-04b00834b/"
    },
    {
        id: "3",
        name: "Joshua Ingeneri",
        title: "Audio Designer",
        image: joshua,
        color: "#567AD4",
        linkedin: "https://www.linkedin.com/in/joshua-ingeneri-5764b4225/"
    },
    {
        id: "4",
        name: "Mia Delino",
        title: "Game Designer",
        image: mia,
        color: "#D1D161",
        linkedin: "https://www.linkedin.com/in/miadelino/"
    },
    {
        id: "5",
        name: "Alisa Ho",
        title: "Programmer",
        image: alisa,
        color: "#d9bd44",
        linkedin: "https://www.linkedin.com/in/alisa-ho-chung-ki/"
    },
    {
        id: "6",
        name: "Pierce Southcott",
        title: "Narrative Designer",
        image: pierce,
        color: "#8FD3DA",
        linkedin: "https://www.linkedin.com/in/pierce-southcott/"
    }
]

const FaqList: FaqType[] = [
    {
        question: "What are Floralia’s official social media accounts?",
        answer: "We currently have Instagram (@floralia_games), TikTok (@floraliagames) , Discord community server (@floraliagames).",
        color: "#FFFFFF",
        bgColor: "bg-gradient-yellow",
    },
    {
        question: "When will BloomTale be released?",
        answer: "Early Access is planned for October 23, 2026.",
        color: "#884239",
        bgColor: "bg-gradient-pink-215",
    },
    {
        question: "Is BloomTale a paid game?",
        answer: "Yes.",
        color: "#FFFFFF",
        bgColor: "bg-gradient-green-180",
    },
    {
        question: "What platforms will BloomTale be on?",
        answer: "Planned for Steam and App Store/Play Store.",
        color: "#884239",
        bgColor: "bg-gradient-pink-310",
    },
    {
        question: "Can I play BloomTale on a Mac and Windows?",
        answer: "Mac and Windows are confirmed. Linux is not supported.",
        color: "#FFFFFF",
        bgColor: "bg-gradient-yellow",
    },
    {
        question: "Can I play BloomTale on a mobile?",
        answer: "Yes, it is planned for future after Steam release.",
        color: "#884239",
        bgColor: "bg-gradient-pink-215",
    },
    {
        question: "Can I play BloomTale with a controller?",
        answer: "Yes, controller support is in the works.",
        color: "#FFFFFF",
        bgColor: "bg-[#D1D161]",
    },
    {
        question: "Can I play BloomTale on a Nintendo Switch or Steam Deck?",
        answer: "TBD",
        color: "#884239",
        bgColor: "bg-gradient-pink-310",
    },
    {
        question: "How do I keep updated with BloomTale progress?",
        answer: "Follow us on social medias and join our Discord community server for the latest updates.",
        color: "#FFFFFF",
        bgColor: "bg-[#FFDD93]",
    },
]

const SocialList: SocialsType[] = [
    {
        name: "Steam",
        image: steam,
        url: "https://store.steampowered.com/app/3168520/BloomTale/",
    },
    {
        name: "Instagram",
        image: ins,
        url: "https://www.instagram.com/floralia_games?igsh=OXlucWsxeGJkeDJ3",
    },
    {
        name: "Tiktok",
        image: tiktok,
        url: "https://www.tiktok.com/@floraliagames",
    },
    {
        name: "Discord",
        image: discord,
        url: "https://discord.com/invite/xHBexRWwdv?fbclid=PAZXh0bgNhZW0CMTEAAaYXRe6giX0f7_ed1atA1TvuQsrZd_pDz9qPSuCBYdp1ol0qW9vVQr4lb6w_aem_IzOfHwS2rwsdJ5GavB9mpQ",
    },
    {
        name: "floraliagames@gmail.com",
        image: gmail,
        url: "mailto:floraliagames@gmail.com",
        basis: "sm:col-span-2 text-sm sm:text-lg"
    },
]

export { GameList, TeamList, FaqList, SocialList };