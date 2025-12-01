import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Alert,
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    Stack,
    TextField,
    Typography,
    CircularProgress
} from '@mui/material';
import {
    SearchRounded,
    SaveRounded,
    EditRounded,
    DeleteRounded,
    CancelRounded
} from '@mui/icons-material';

import { RepairService } from '../../utils/RepairService';
import type { PotholeRepairDTO } from '../../types/RepairTypes';

export default function RepairManagementPage() {
    const queryClient = useQueryClient();

    // --- ESTADOS LOCALES (Solo UI) ---
    const [searchId, setSearchId] = useState<string>('');
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean; success: boolean; message: string } | null>(null);

    // Estado temporal para editar el formulario
    const [formData, setFormData] = useState<PotholeRepairDTO | null>(null);

    // --- 1. QUERY: CATÁLOGOS ---
    const { data: catalogs } = useQuery({
        queryKey: ['catalogs'],
        queryFn: RepairService.getCatalogs,
        staleTime: 1000 * 60 * 60,
    });

    // --- 2. QUERY: BUSCAR REPARACIÓN ---
    const {
        data: serverData,
        isLoading: isSearching,
        isError,
        error,
        refetch
    } = useQuery({
        queryKey: ['repair', searchId],
        queryFn: () => RepairService.getRepairByReportId(Number(searchId)),
        enabled: false,
        retry: false
    });

    // Sincronizar datos del servidor con el formulario cuando llegan
    if (serverData && !formData && !isEditing) {
        setFormData(serverData);
    }

    // --- 3. MUTATION: GUARDAR ---
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

    // --- 4. MUTATION: ELIMINAR ---
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

    // --- HANDLERS ---
    const handleSearchClick = () => {
        setFormData(null);
        refetch();
    };

    const handleSaveClick = () => {
        if (formData) saveMutation.mutate(formData);
    };

    const handleDeleteClick = () => {
        if (formData && window.confirm("¿Seguro?")) {
            deleteMutation.mutate(formData.potholeId);
        }
    };

    const handleInputChange = (field: keyof PotholeRepairDTO, value: any) => {
        if (formData) setFormData({ ...formData, [field]: value });
    };

    // Usamos formData si estamos editando, sino serverData para visualizar
    const displayData = formData || serverData;

    return (
        <Box display={'flex'} height={'100%'} width={'100vw'} justifyContent={'center'}>
            <Stack spacing={3} alignItems={'center'} sx={{ width: '100%', p: 2, maxWidth: '1000px' }}>
                <Typography variant={'h3'}>Reparación de Baches</Typography>

                {/* BARRA DE BÚSQUEDA */}
                <Paper elevation={2} sx={{ p: 2, width: '100%', display: 'flex', gap: 2 }}>
                    <TextField
                        label="ID del Reporte"
                        size="small"
                        type="number"
                        value={searchId}
                        onChange={(e) => {
                            const val = e.target.value;
                            // Solo actualiza si está vacío (permite borrar) o si es positivo
                            if (val === '' || Number(val) > 0) {
                                setSearchId(val);
                            }
                        }}
                        sx={{ flexGrow: 1 }}
                    />
                    <Button
                        variant="contained"
                        startIcon={isSearching ? <CircularProgress size={20} color="inherit"/> : <SearchRounded />}
                        onClick={handleSearchClick}
                        disabled={isSearching || !searchId}
                    >
                        Buscar
                    </Button>
                </Paper>

                {isError && (
                    <Alert severity="warning">No se encontró el reporte o hubo un error: {String(error)}</Alert>
                )}

                {/* FORMULARIO COMPLETO */}
                {displayData && !isError && (
                    <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                        <Typography variant="h6" color="primary" gutterBottom>
                            Detalles del Reporte #{displayData.potholeId}
                        </Typography>

                        {/* Datos de Solo Lectura */}
                        <Stack spacing={2} sx={{ mb: 4 }}>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                <TextField label="Ciudadano" value={displayData.citizenName} fullWidth variant="filled" InputProps={{ readOnly: true }} />
                                <TextField
                                    label="Fecha Reporte"
                                    value={displayData.dateReported ? new Date(displayData.dateReported).toLocaleString() : ''}
                                    fullWidth variant="filled" InputProps={{ readOnly: true }}
                                />
                            </Stack>
                            <TextField
                                label="Ubicación"
                                value={`${displayData.streetName} (${displayData.betweenStreets})`}
                                fullWidth variant="filled" InputProps={{ readOnly: true }}
                            />
                        </Stack>

                        {/* Datos de Edición */}
                        <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 3, mt: 2 }}>
                            <Typography variant="h6" color="primary" gutterBottom>Asignación</Typography>

                            <Stack spacing={3}>
                                {/* FILA 1: Cuadrilla y Fecha Inicio */}
                                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                    <Box sx={{ width: '100%' }}>
                                        <FormControl fullWidth>
                                            <InputLabel>Cuadrilla</InputLabel>
                                            <Select
                                                value={displayData.squadId || ''}
                                                label="Cuadrilla"
                                                onChange={(e) => handleInputChange('squadId', Number(e.target.value))}
                                                disabled={!isEditing}
                                            >
                                                {(catalogs?.squads || []).map(sq => (
                                                    <MenuItem key={sq.squadId} value={sq.squadId}>{sq.squadName}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>

                                    <TextField
                                        label="Fecha Inicio"
                                        type="date"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        value={displayData.startDate || ''}
                                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                                        disabled={!isEditing}
                                    />
                                </Stack>

                                {/* FILA 2: Fecha Fin y Estado */}
                                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                    <TextField
                                        label="Fecha Fin"
                                        type="date"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        value={displayData.endDate || ''}
                                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                                        disabled={!isEditing}
                                    />

                                    <Box sx={{ width: '100%' }}>
                                        <FormControl fullWidth>
                                            <InputLabel>Estado</InputLabel>
                                            <Select
                                                value={displayData.statusId || ''}
                                                label="Estado"
                                                onChange={(e) => handleInputChange('statusId', Number(e.target.value))}
                                                disabled={!isEditing}
                                            >
                                                {(catalogs?.statuses || []).map(st => (
                                                    <MenuItem key={st.statusId} value={st.statusId}>
                                                        {st.statusName}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </Stack>
                            </Stack>

                            {/* BOTONERA */}
                            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
                                {!isEditing ? (
                                    <>
                                        <Button
                                            variant="outlined" color="error" startIcon={<DeleteRounded />}
                                            onClick={handleDeleteClick}
                                            disabled={!displayData.repairId || deleteMutation.isPending}
                                        >
                                            {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
                                        </Button>
                                        <Button
                                            variant="contained" startIcon={<EditRounded />}
                                            onClick={() => { setFormData(serverData ?? null); setIsEditing(true); }}
                                        >
                                            Modificar
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button variant="outlined" startIcon={<CancelRounded />} onClick={() => setIsEditing(false)}>
                                            Cancelar
                                        </Button>
                                        <Button
                                            variant="contained" color="success" startIcon={<SaveRounded />}
                                            onClick={handleSaveClick}
                                            disabled={saveMutation.isPending}
                                        >
                                            {saveMutation.isPending ? 'Guardando...' : 'Guardar'}
                                        </Button>
                                    </>
                                )}
                            </Stack>
                        </Box>
                    </Paper>
                )}
            </Stack>

            {/* SNACKBAR */}
            <Snackbar
                open={!!snackbar?.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar(null)}
            >
                <Alert severity={snackbar?.success ? 'success' : 'error'}>{snackbar?.message}</Alert>
            </Snackbar>
        </Box>
    );
}