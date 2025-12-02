// src/hooks/useRepairManagement.ts
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RepairService } from '../utils/RepairService';
import type { PotholeRepairDTO } from '../types/RepairTypes';

export const useRepairManagement = () => {
    const queryClient = useQueryClient();

    // --- ESTADOS LOCALES ---
    const [searchId, setSearchId] = useState<string>('');
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [formData, setFormData] = useState<PotholeRepairDTO | null>(null);
    const [snackbar, setSnackbar] = useState<{ open: boolean; success: boolean; message: string } | null>(null);

    // --- 1. QUERY: CATÁLOGOS ---
    const catalogsQuery = useQuery({
        queryKey: ['catalogs'],
        queryFn: RepairService.getCatalogs,
        staleTime: 1000 * 60 * 60,
    });

    // --- 2. QUERY: BUSCAR REPARACIÓN ---
    const repairQuery = useQuery({
        queryKey: ['repair', searchId],
        queryFn: () => RepairService.getRepairByReportId(Number(searchId)),
        enabled: false,
        retry: false
    });

    // Sincronización automática
    useEffect(() => {
        if (repairQuery.data && !isEditing) {
            setFormData(repairQuery.data);
        }
    }, [repairQuery.data, isEditing]);


    // --- 3. MUTATIONS ---
    const saveMutation = useMutation({
        mutationFn: RepairService.saveRepair,
        onSuccess: (msg) => {
            setSnackbar({ open: true, success: true, message: msg });
            setIsEditing(false);
            queryClient.invalidateQueries({ queryKey: ['repair', searchId] });
        },
        onError: (err: any) => {
            const msg = err.response?.data || "Error al guardar";
            setSnackbar({ open: true, success: false, message: String(msg) });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: RepairService.deleteRepair,
        onSuccess: (msg) => {
            setSnackbar({ open: true, success: true, message: msg });
            setIsEditing(false);
            setFormData(null);
            queryClient.invalidateQueries({ queryKey: ['repair', searchId] });
        },
        onError: (err: any) => {
            const msg = err.response?.data || "Error al eliminar";
            setSnackbar({ open: true, success: false, message: String(msg) });
        }
    });

    // --- ACCIONES (HANDLERS EXPORTABLES) ---
    const handleSearch = () => {
        setFormData(null);
        repairQuery.refetch();
    };

    const handleSave = () => {
        if (formData) saveMutation.mutate(formData);
    };

    const handleDelete = () => {
        if (formData && window.confirm("¿Seguro que deseas eliminar esta reparación?")) {
            deleteMutation.mutate(formData.potholeId);
        }
    };

    const handleInputChange = (field: keyof PotholeRepairDTO, value: any) => {
        if (formData) setFormData({ ...formData, [field]: value });
    };

    const closeSnackbar = () => setSnackbar(null);

    // --- RETORNAMOS TODO LO QUE LA VISTA NECESITA ---
    return {
        state: {
            searchId,
            isEditing,
            formData,
            snackbar,
            // Datos calculados
            displayData: formData || repairQuery.data,
            isLoadingSearch: repairQuery.isLoading,
            isErrorSearch: repairQuery.isError,
            errorSearch: repairQuery.error,
            catalogs: catalogsQuery.data,
            isSaving: saveMutation.isPending,
            isDeleting: deleteMutation.isPending
        },
        actions: {
            setSearchId,
            setIsEditing,
            setFormData,
            handleSearch,
            handleSave,
            handleDelete,
            handleInputChange,
            closeSnackbar
        }
    };
};