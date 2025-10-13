import type {JSX} from "react";
import SecureContainer from "./SecureContainer.tsx";
import Home from "./Home.tsx";

export interface SecurePages {
    name: 'Inicio' | 'Baches' | 'Reportes' | 'Administración';
    Element: () => JSX.Element;
}

export const AllSecurePages: SecurePages[] = [
    {
        name: 'Inicio',
        Element: Home
    },
    {
        name: 'Baches',
        Element: Home
    },
    {
        name: 'Reportes',
        Element: Home
    },
    {
        name: 'Administración',
        Element: Home
    }
] as const;