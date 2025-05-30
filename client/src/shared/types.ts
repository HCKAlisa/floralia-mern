export enum SelectedPage {
    Home = "home",
    Team = "team",
    FAQ = "faq",
    Contact = "contact",
    About = "about"
}

export interface TeamType {
    id: string;
    name: string;
    title: string;
    image: string;
}

export interface FaqType {
    id?: string;
    question: string;
    answer: string;
}

export interface SocialsType {
    id?: string;
    name: string;
    url: string;
    image?: string;
}

export interface GameType {
    id: string;
    name: string;
    media: string;
    isVideo: boolean;
    socials: SocialsType[];
    steam: string;
    released: boolean;
}

export interface UserType {
    username?: string;
    password?: string;
}