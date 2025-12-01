import { api } from '../utils/api'; // Usamos tu instancia configurada
import type {PotholeRepairDTO} from '../types/RepairTypes';

// Nota: api.ts ya tiene baseURL 'http://localhost:31234', así que solo ponemos la ruta relativa.
const ENDPOINT = '/api/repair-management';

export const RepairService = {

    // Buscar datos por ID de Reporte
    getRepairByReportId: async (potholeId: number): Promise<PotholeRepairDTO> => {
        // api.get ya inyecta el token y usa el puerto 31234
        const response = await api.get<PotholeRepairDTO>(`${ENDPOINT}/${potholeId}`);
        return response.data;
    },

    // Guardar o Actualizar
    saveRepair: async (data: PotholeRepairDTO): Promise<string> => {
        const response = await api.post<string>(`${ENDPOINT}/save`, data);
        return response.data; // Devuelve el mensaje de texto del backend
    },

    deleteRepair: async (potholeId: number): Promise<string> => {
        const response = await api.delete<string>(`${ENDPOINT}/delete/${potholeId}`);
        return response.data;
    }
};