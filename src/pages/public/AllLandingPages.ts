import type {JSX} from "react";
import ContractorsPage from "./ContractorsPage.tsx";
import AboutUs from "./AboutUs.tsx";
import MainPage from "./MainPage.tsx";

export interface LandingPage {
    name: 'Inicio' | 'Contratistas' | 'Acerca de nosotros',
    Element: () => JSX.Element,
}

export const AllLandingPages: LandingPage[] = [
    {
        name: "Inicio",
        Element: MainPage
    },
    {
        name: "Contratistas",
        Element: ContractorsPage
    },
    {
        name: "Acerca de nosotros",
        Element: AboutUs
    }
] as const;
