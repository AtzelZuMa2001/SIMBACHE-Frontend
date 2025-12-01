import { useState, useEffect } from 'react'; // <--- AGREGAR useEffect
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
    Typography
} from '@mui/material';
// ... imports de iconos ...
import SearchRounded from '@mui/icons-material/SearchRounded';
import SaveRounded from '@mui/icons-material/SaveRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import DeleteRounded from '@mui/icons-material/DeleteRounded';
import CancelRounded from '@mui/icons-material/CancelRounded';

// Importamos las nuevas interfaces del servicio
import { RepairService, type Squad, type RepairStatus } from '../../utils/RepairService';
import type { PotholeRepairDTO } from '../../types/RepairTypes';

export default function RepairManagementPage() {
    // --- ESTADOS ---
    const [searchId, setSearchId] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<PotholeRepairDTO | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    // --- ESTADOS PARA CATÁLOGOS (Dinámicos) ---
    const [squadsList, setSquadsList] = useState<Squad[]>([]);
    const [statusesList, setStatusesList] = useState<RepairStatus[]>([]);

    const [snackbar, setSnackbar] = useState<{ open: boolean; success: boolean; message: string } | null>(null);

    // --- EFECTO DE CARGA INICIAL ---
    useEffect(() => {
        // Cargamos los catálogos al entrar a la página
        const fetchCatalogs = async () => {
            try {
                const result = await RepairService.getCatalogs();
                setSquadsList(result.squads);
                setStatusesList(result.statuses);
            } catch (error) {
                console.error("Error cargando catálogos", error);
                setSnackbar({ open: true, success: false, message: "Error conectando con el servidor para catálogos." });
            }
        };
        fetchCatalogs();
    }, []);

    // --- HANDLERS (Igual que antes) ---
    const handleSearch = async () => {
        // Validación del ID negativo/cero
        if (!searchId || Number(searchId) < 1) return;

        setLoading(true);
        setData(null);
        setIsEditing(false);

        try {
            const result = await RepairService.getRepairByReportId(Number(searchId));
            setData(result);
        } catch (err: any) {
            const msg = err.response?.data || err.message || "Error al buscar.";
            setSnackbar({ open: true, success: false, message: typeof msg === 'string' ? msg : JSON.stringify(msg) });
        } finally {
            setLoading(false);
        }
    };

    // ... (Mantén handleSave, handleDelete y handleInputChange igual que antes) ...
    const handleSave = async () => {
        if (!data) return;
        setLoading(true);
        try {
            const msg = await RepairService.saveRepair(data);
            setSnackbar({ open: true, success: true, message: msg });
            setIsEditing(false);
        } catch (err: any) {
            const msg = err.response?.data || err.message || "Error al guardar.";
            setSnackbar({ open: true, success: false, message: typeof msg === 'string' ? msg : JSON.stringify(msg) });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!data || !data.repairId) return;
        if (!window.confirm("¿Estás seguro de eliminar esta reparación?")) return;

        setLoading(true);
        try {
            const msg = await RepairService.deleteRepair(data.potholeId);
            setSnackbar({ open: true, success: true, message: msg });
            setData({ ...data, repairId: null, squadId: null, startDate: null, endDate: null, statusId: null });
            setIsEditing(false);
        } catch (err: any) {
            const msg = err.response?.data || err.message || "Error al eliminar.";
            setSnackbar({ open: true, success: false, message: typeof msg === 'string' ? msg : JSON.stringify(msg) });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof PotholeRepairDTO, value: any) => {
        if (data) setData({ ...data, [field]: value });
    };


    return (
        <Box display={'flex'} height={'100%'} width={'100vw'} maxWidth={'100%'} justifyContent={'center'} alignItems={'flex-start'}>
            <Stack direction={'column'} spacing={3} alignItems={'center'} sx={{ width: '100%', p: 2, maxWidth: '1000px' }}>

                <Typography variant={'h3'} textAlign={'center'}>
                    Gestión de Reparaciones
                </Typography>

                {/* BARRA DE BÚSQUEDA */}
                <Paper elevation={2} sx={{ p: 2, width: '100%', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TextField
                        label="ID del Reporte"
                        variant="outlined"
                        size="small"
                        type="number"
                        inputProps={{ min: 1 }}
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        sx={{ flexGrow: 1 }}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button
                        variant="contained"
                        startIcon={<SearchRounded />}
                        onClick={handleSearch}
                        disabled={loading || !searchId}
                    >
                        Buscar
                    </Button>
                </Paper>

                {data && (
                    <Paper elevation={3} sx={{ p: 4, width: '100%' }}>

                        <Typography variant="h6" color="primary" gutterBottom>
                            Detalles del Reporte #{data.potholeId}
                        </Typography>

                        <Stack spacing={2} sx={{ mb: 4 }}>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                <TextField label="Ciudadano" value={data.citizenName} fullWidth variant="filled" InputProps={{ readOnly: true }} />
                                <TextField
                                    label="Fecha Reporte"
                                    value={data.dateReported ? new Date(data.dateReported).toLocaleString() : ''}
                                    fullWidth variant="filled" InputProps={{ readOnly: true }}
                                />
                            </Stack>
                            <TextField
                                label="Ubicación"
                                value={`${data.streetName} (${data.betweenStreets})`}
                                fullWidth variant="filled" InputProps={{ readOnly: true }}
                            />
                        </Stack>

                        <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 3 }}>
                            <Typography variant="h6" color="primary" gutterBottom>
                                Asignación de Reparación
                            </Typography>

                            <Stack spacing={3}>
                                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                    <Box sx={{ width: '100%' }}>
                                        <FormControl fullWidth>
                                            <InputLabel>Cuadrilla</InputLabel>
                                            <Select
                                                value={data.squadId || ''}
                                                label="Cuadrilla"
                                                onChange={(e) => handleInputChange('squadId', Number(e.target.value))}
                                                disabled={!isEditing}
                                            >
                                                {/* Iteramos sobre el estado squadsList */}
                                                {(squadsList || []).map(sq => (
                                                    <MenuItem key={sq.squadId} value={sq.squadId}>
                                                        {sq.squadName}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>

                                    <TextField
                                        label="Fecha Inicio"
                                        type="date"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        value={data.startDate || ''}
                                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                                        disabled={!isEditing}
                                    />
                                </Stack>

                                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                    <TextField
                                        label="Fecha Fin"
                                        type="date"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        value={data.endDate || ''}
                                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                                        disabled={!isEditing}
                                    />

                                    <Box sx={{ width: '100%' }}>
                                        <FormControl fullWidth>
                                            <InputLabel>Estado</InputLabel>
                                            <Select
                                                value={data.statusId || ''}
                                                label="Estado"
                                                onChange={(e) => handleInputChange('statusId', Number(e.target.value))}
                                                disabled={!isEditing}
                                            >
                                                {/* Iteramos sobre el estado statusesList */}
                                                {(statusesList || []).map(st => (
                                                    <MenuItem key={st.statusId} value={st.statusId}>
                                                        {st.statusName}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </Stack>
                            </Stack>

                            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
                                {!isEditing ? (
                                    <>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            startIcon={<DeleteRounded />}
                                            onClick={handleDelete}
                                            disabled={!data.repairId}
                                        >
                                            Eliminar
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<EditRounded />}
                                            onClick={() => setIsEditing(true)}
                                        >
                                            Modificar
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            variant="outlined"
                                            color="inherit"
                                            startIcon={<CancelRounded />}
                                            onClick={() => { setIsEditing(false); handleSearch(); }}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            startIcon={<SaveRounded />}
                                            onClick={handleSave}
                                        >
                                            Guardar
                                        </Button>
                                    </>
                                )}
                            </Stack>
                        </Box>
                    </Paper>
                )}
            </Stack>

            <Snackbar
                open={!!snackbar?.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbar(null)} severity={snackbar?.success ? 'success' : 'error'} sx={{ width: '100%' }}>
                    {snackbar?.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}