export enum SelectedPage {
    Home = "games",
    Team = "team",
    FAQ = "faq",
    Contact = "contact"
}

export interface TeamType {
    name: string;
    title: string;
    image: string;
}

export interface FaqType {
    question: string;
    answer: string;
}

export interface SocialsType {
    name: string;
    url: string;
    image?: string;
}

export interface GameType {
    name: string;
    media: string;
    socials: SocialsType[];
    steam: string;
    released: boolean;
}

export interface UserType {
    username?: string;
    password?: string;
}