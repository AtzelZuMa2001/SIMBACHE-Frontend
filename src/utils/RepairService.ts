import { api } from './api.ts';
import type { PotholeRepairDTO } from '../types/RepairTypes';

const ENDPOINT = '/api/repair-management';

// Definimos las interfaces para los catálogos
export interface Squad {
    squadId: number;
    squadName: string;
}

export interface RepairStatus {
    statusId: number;
    statusName: string;
}

export interface RepairCatalogs {
    squads: Squad[];
    statuses: RepairStatus[];
}

export const RepairService = {

    // --- NUEVO: Obtener Catálogos ---
    getCatalogs: async (): Promise<RepairCatalogs> => {
        const response = await api.get<RepairCatalogs>(`${ENDPOINT}/catalogs`);
        return response.data;
    },

    // ... (Mantén getRepairByReportId, saveRepair y deleteRepair igual que antes) ...
    getRepairByReportId: async (potholeId: number): Promise<PotholeRepairDTO> => {
        const response = await api.get<PotholeRepairDTO>(`${ENDPOINT}/${potholeId}`);
        return response.data;
    },
    saveRepair: async (data: PotholeRepairDTO): Promise<string> => {
        const response = await api.post<string>(`${ENDPOINT}/save`, data);
        return response.data;
    },
    deleteRepair: async (potholeId: number): Promise<string> => {
        const response = await api.delete<string>(`${ENDPOINT}/delete/${potholeId}`);
        return response.data;
    }
};