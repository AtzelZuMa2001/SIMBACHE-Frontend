// src/types/RepairTypes.ts

export interface PotholeRepairDTO {
    // Datos de Lectura (Vienen del Reporte)
    potholeId: number;
    citizenName: string;
    dateReported: string; // LocalDateTime viene como string ISO
    streetName: string;
    betweenStreets: string;

    // Datos de Escritura (Reparación)
    repairId?: number | null; // Puede ser null si es nuevo
    squadId?: number | null;
    startDate?: string | null; // LocalDate "YYYY-MM-DD"
    endDate?: string | null;
    statusId?: number | null;
}

// Opcional: Para los selectores (dropdowns)
export interface CatalogOption {
    id: number;
    name: string;
}