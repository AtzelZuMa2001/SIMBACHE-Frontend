import { useQuery, useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';
import { api } from '../utils/api.ts';
import type { VehicleTypeDto } from '../types/VehicleTypeDto.ts';

// Query key
export const VEHICLE_TYPES_QUERY_KEY: QueryKey = ['vehicleTypes'];

// GET — list all vehicle types
export function useVehicleTypes() {
    return useQuery<string[]>({
        queryKey: VEHICLE_TYPES_QUERY_KEY,
        queryFn: async () => {
            const { data } = await api.get<string[]>('/api/vehicles/type/list');
            return data;
        },
    });
}

// POST — add a new vehicle type
export function useAddVehicleType() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newType: string) => {
            const { data } = await api.post<number>(
                '/api/vehicles/type/add',
                {},
                { headers: { newType } }
            );

            return data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: VEHICLE_TYPES_QUERY_KEY });
        },
    });
}

// PUT — update an existing vehicle type
export function useUpdateVehicleType() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: VehicleTypeDto) => {
            const { data } = await api.put('/api/vehicles/type/update', payload);
            return data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: VEHICLE_TYPES_QUERY_KEY });
        },
    });
}

// DELETE — delete a vehicle type
export function useDeleteVehicleType() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (typeName: string) => {
            const { data } = await api.delete(`/api/vehicles/type/delete`, {
                params: { typeName },
            });

            return data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: VEHICLE_TYPES_QUERY_KEY });
        },
    });
}

export type { VehicleTypeDto };
