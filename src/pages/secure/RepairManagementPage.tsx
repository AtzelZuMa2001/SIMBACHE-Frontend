import {
    Alert, Box, Button, FormControl, InputLabel, MenuItem, Paper, Select,
    Snackbar, Stack, TextField, Typography, CircularProgress
} from '@mui/material';
import {
    SearchRounded, SaveRounded, EditRounded, DeleteRounded, CancelRounded
} from '@mui/icons-material';

import { useRepairManagement } from '../../hooks/useRepairManagement';

export default function RepairManagementPage() {

    const { state, actions } = useRepairManagement();

    const { displayData, catalogs } = state;
    return (
        <Box display={'flex'} height={'100%'} width={'100vw'} justifyContent={'center'}>
            <Stack spacing={3} alignItems={'center'} sx={{ width: '100%', p: 2, maxWidth: '1000px' }}>
                <Typography variant={'h3'}>Reparación de baches</Typography>

                {/* BARRA DE BÚSQUEDA */}
                <Paper elevation={2} sx={{ p: 2, width: '100%', display: 'flex', gap: 2 }}>
                    <TextField
                        label="ID del Reporte"
                        size="small"
                        type="number"
                        value={state.searchId}
                        onChange={(e) => {
                            const val = e.target.value;
                            // Solo actualiza si está vacío (permite borrar) o si es positivo
                            if (val === '' || Number(val) > 0) {
                                actions.setSearchId(val);
                            }
                        }}
                        sx={{ flexGrow: 1 }}
                    />
                    <Button
                        variant="contained"
                        startIcon={state.isLoadingSearch ? <CircularProgress size={20} color="inherit"/> : <SearchRounded />}
                        onClick={actions.handleSearch}
                        disabled={state.isLoadingSearch || !state.searchId}
                    >
                        Buscar
                    </Button>
                </Paper>

                {state.isErrorSearch && (
                    <Alert severity="warning" sx={{ width: '100%', mb: 2 }}>
                        ⚠️ Este reporte de bache no existe o no se encontró.
                    </Alert>
                )}

                {/* FORMULARIO */}
                {displayData && !state.isErrorSearch && (
                    <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                        <Typography variant="h6" color="primary" gutterBottom>
                            Detalles del Reporte #{displayData.potholeId}
                        </Typography>

                        {/* Datos Solo Lectura */}
                        <Stack spacing={2} sx={{ mb: 4 }}>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                <TextField label="Ciudadano" value={displayData.citizenName} fullWidth variant="filled" InputProps={{ readOnly: true }} />
                                <TextField label="Fecha Reporte" value={displayData.dateReported ? new Date(displayData.dateReported).toLocaleString() : ''} fullWidth variant="filled" InputProps={{ readOnly: true }} />
                            </Stack>
                            <TextField label="Ubicación" value={`${displayData.streetName} (${displayData.betweenStreets})`} fullWidth variant="filled" InputProps={{ readOnly: true }} />
                        </Stack>

                        {/* Datos Editables */}
                        <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 3, mt: 2 }}>
                            <Typography variant="h6" color="primary" gutterBottom>Asignación</Typography>

                            <Stack spacing={3}>
                                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                    <FormControl fullWidth>
                                        <InputLabel>Cuadrilla</InputLabel>
                                        <Select
                                            value={displayData.squadId || ''}
                                            label="Cuadrilla"
                                            onChange={(e) => actions.handleInputChange('squadId', Number(e.target.value))}
                                            disabled={!state.isEditing}
                                        >
                                            {(catalogs?.squads || []).map(sq => (
                                                <MenuItem key={sq.squadId} value={sq.squadId}>{sq.squadName}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <TextField
                                        label="Fecha Inicio" type="date" fullWidth InputLabelProps={{ shrink: true }}
                                        value={displayData.startDate || ''}
                                        onChange={(e) => actions.handleInputChange('startDate', e.target.value)}
                                        disabled={!state.isEditing}
                                    />
                                </Stack>

                                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                    <TextField
                                        label="Fecha Fin" type="date" fullWidth InputLabelProps={{ shrink: true }}
                                        value={displayData.endDate || ''}
                                        onChange={(e) => actions.handleInputChange('endDate', e.target.value)}
                                        disabled={!state.isEditing}
                                    />
                                    <Box sx={{ width: '100%' }}>
                                        <FormControl fullWidth>
                                            <InputLabel>Estado</InputLabel>
                                            <Select
                                                value={displayData.statusId || ''}
                                                label="Estado"
                                                onChange={(e) => actions.handleInputChange('statusId', Number(e.target.value))}
                                                disabled={!state.isEditing}
                                            >
                                                {(catalogs?.statuses || []).map(st => (
                                                    <MenuItem key={st.statusId} value={st.statusId}>{st.statusName}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </Stack>
                            </Stack>

                            {/* BOTONERA */}
                            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
                                {!state.isEditing ? (
                                    <>
                                        <Button variant="outlined" color="error" startIcon={<DeleteRounded />}
                                                onClick={actions.handleDelete}
                                                disabled={!displayData.repairId || state.isDeleting}
                                        >
                                            {state.isDeleting ? '...' : 'Eliminar'}
                                        </Button>
                                        <Button variant="contained" startIcon={<EditRounded />}
                                                onClick={() => { actions.setFormData(state.displayData ?? null); actions.setIsEditing(true); }}
                                        >
                                            Modificar
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button variant="outlined" startIcon={<CancelRounded />} onClick={() => actions.setIsEditing(false)}>
                                            Cancelar
                                        </Button>
                                        <Button variant="contained" color="success" startIcon={<SaveRounded />}
                                                onClick={actions.handleSave}
                                                disabled={state.isSaving}
                                        >
                                            {state.isSaving ? 'Guardando...' : 'Guardar'}
                                        </Button>
                                    </>
                                )}
                            </Stack>
                        </Box>
                    </Paper>
                )}
            </Stack>

            <Snackbar
                open={!!state.snackbar?.open}
                autoHideDuration={4000}
                onClose={actions.closeSnackbar}
            >
                <Alert severity={state.snackbar?.success ? 'success' : 'error'}>{state.snackbar?.message}</Alert>
            </Snackbar>
        </Box>
    );
}