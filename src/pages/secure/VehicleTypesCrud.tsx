import {useMemo, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import {DataGrid, type GridColDef} from '@mui/x-data-grid';
import AddCircleOutlineRounded from '@mui/icons-material/AddCircleOutlineRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import DeleteRounded from '@mui/icons-material/DeleteRounded';
import {
    useAddVehicleType,
    useDeleteVehicleType,
    useUpdateVehicleType,
    useVehicleTypes,
} from '../../hooks/useVehicleTypes.ts';

export default function VehicleTypesCrud() {
  // Queries & Mutations
  const typesQuery = useVehicleTypes();
  const addType = useAddVehicleType();
  const updateType = useUpdateVehicleType();
  const deleteType = useDeleteVehicleType();

  // UI State
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [newTypeName, setNewTypeName] = useState('');
  const [editCurrentName, setEditCurrentName] = useState('');
  const [editNewName, setEditNewName] = useState('');
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [selectedRowName, setSelectedRowName] = useState<string>('');

  const [snackbar, setSnackbar] = useState<{ open: boolean; success: boolean; message: string } | null>(null);

  const rows = useMemo(() => {
    const data = typesQuery.data ?? [];
    // Map list of strings to grid rows with numeric ids
    return data.map((name, index) => ({ id: index, name }));
  }, [typesQuery.data]);

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'name', headerName: 'Tipo de vehículo', flex: 1, sortable: true },
      {
        field: 'actions',
        headerName: 'Acciones',
        sortable: false,
        width: 150,
        renderCell: (params) => (
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
              aria-label="Editar"
              size="small"
              onClick={() => {
                const name = String(params.row.name);
                setEditCurrentName(name);
                setEditNewName(name);
                setEditOpen(true);
              }}
            >
              <EditRounded fontSize="small" />
            </IconButton>
            <IconButton
              aria-label="Eliminar"
              size="small"
              color="error"
              onClick={() => {
                setSelectedRowId(Number(params.id));
                setSelectedRowName(String(params.row.name));
                setDeleteOpen(true);
              }}
            >
              <DeleteRounded fontSize="small" />
            </IconButton>
          </Stack>
        ),
      },
    ],
    []
  );

  const handleCreate = () => {
    const trimmed = newTypeName.trim();
    if (!trimmed) return;
    addType.mutate(trimmed, {
      onSuccess: () => {
        setCreateOpen(false);
        setNewTypeName('');
        setSnackbar({ open: true, success: true, message: 'Tipo creado correctamente' });
      },
      onError: (e: any) => {
        setSnackbar({ open: true, success: false, message: e?.message || 'Error al crear tipo' });
      },
    });
  };

  const handleEdit = () => {
    const trimmed = editNewName.trim();
    if (!trimmed || !editCurrentName.trim()) return;
    updateType.mutate(
      { currentName: editCurrentName, newName: trimmed },
      {
        onSuccess: () => {
          setEditOpen(false);
          setSnackbar({ open: true, success: true, message: 'Tipo actualizado correctamente' });
        },
        onError: (e: any) => {
          setSnackbar({ open: true, success: false, message: e?.message || 'Error al actualizar tipo' });
        },
      }
    );
  };

  const handleDelete = () => {
    if (selectedRowId == null) return;
    deleteType.mutate(selectedRowName, {
      onSuccess: () => {
        setDeleteOpen(false);
        setSelectedRowId(null);
        setSelectedRowName('');
        setSnackbar({ open: true, success: true, message: 'Tipo eliminado correctamente' });
      },
      onError: (e: any) => {
        setSnackbar({ open: true, success: false, message: e?.message || 'Error al eliminar tipo' });
      },
    });
  };

  return (
    <Box display={'flex'} height={'100%'} width={'100vw'} maxWidth={'100%'} justifyContent={'center'} alignItems={'flex-start'}>
      <Stack direction={'column'} spacing={2} alignItems={'center'} sx={{ width: '100%', p: 2 }}>
        <Typography variant={'h3'} textAlign={'center'}>Administrar tipos de vehículos</Typography>
          <Button
              variant={'contained'}
              size={'large'}
              startIcon={<AddCircleOutlineRounded />}
              onClick={() => setCreateOpen(true)}
              disabled={typesQuery.isLoading || addType.isPending}
          >
              Añadir
          </Button>

        <Box sx={{ height: 500, width: '70%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={typesQuery.isLoading}
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 25]}
            initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
            sx={{ backgroundColor: 'background.paper' }}
          />
        </Box>
      </Stack>

      {/* Create Dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Agregar nuevo tipo de vehículo</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre del tipo"
            type="text"
            fullWidth
            value={newTypeName}
            onChange={(e) => setNewTypeName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancelar</Button>
          <Button onClick={handleCreate} variant="contained" disabled={addType.isPending || !newTypeName.trim()}>
            Crear
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Editar tipo de vehículo</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nombre actual"
            type="text"
            fullWidth
            value={editCurrentName}
            disabled={true}
          />
          <TextField
            margin="dense"
            label="Nuevo nombre"
            type="text"
            fullWidth
            value={editNewName}
            onChange={(e) => setEditNewName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancelar</Button>
          <Button onClick={handleEdit} variant="contained" disabled={updateType.isPending || !editNewName.trim()}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Eliminar tipo</DialogTitle>
        <DialogContent>
          <Typography>¿Seguro que deseas eliminar "{selectedRowName}"?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={deleteType.isPending}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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