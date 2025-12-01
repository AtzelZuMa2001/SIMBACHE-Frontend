import type {JSX} from "react";
//import SecureContainer from "./SecureContainer.tsx";
import Home from "./Home.tsx";
import VehicleTypesCrud from "./VehicleTypesCrud.tsx";
import RepairManagementPage from "./RepairManagementPage.tsx";

export interface SecurePages {
    name: 'Inicio' | 'Baches' | 'Reportes' | 'Administración' | 'Tipos de vehículos';
    Element: () => JSX.Element;
}

export const AllSecurePages: SecurePages[] = [
    {
        name: 'Inicio',
        Element: Home
    },
    {
        name: 'Baches',
        Element: RepairManagementPage
    },
    {
        name: 'Reportes',
        Element: Home
    },
    {
        name: 'Administración',
        Element: Home
    },
    {
        name: 'Tipos de vehículos',
        Element: VehicleTypesCrud
    }
] as const;