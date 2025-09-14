export enum SelectedPage {
    Home = "home",
    Games = "games",
    Team = "team",
    FAQ = "faq",
    Contact = "contact",
    About = "about",
    Devlog = "devlog",
}

export interface TeamType {
    id: string;
    name: string;
    title: string;
    image: string;
    color: string;
    linkedin?: string;
}

export interface FaqType {
    id?: string;
    question: string;
    answer: string;
    color?: string;
    bgColor?: string;
}

export interface SocialsType {
    id?: string;
    name: string;
    url: string;
    image?: string;
    basis?: string;
}

export interface GameType {
    id: string;
    name: string;
    media: string;
    isVideo: boolean;
    socials?: SocialsType[];
    steam: string;
    released: boolean;
    description: string;
    points?: string[];
    mobileMedia?: string;
}

export interface UserType {
    username?: string;
    password?: string;
}