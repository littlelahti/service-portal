import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridEventListener,
    gridClasses,
} from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router';
import { useDialogs } from '../hooks/useDialogs/useDialogs';
import useNotifications from '../hooks/useNotifications/useNotifications';
import PageContainer from './PageContainer';
import { Wastebin } from '../data/wastebin';
import { deleteWastebin, fetchWastebins } from '../ApiClient';

export default function WastebinList() {
    const navigate = useNavigate();

    const dialogs = useDialogs();
    const notifications = useNotifications();

    const [rowsState, setRowsState] = React.useState<{
        rows: Wastebin[];
        rowCount: number;
    }>({
        rows: [],
        rowCount: 0,
    }); 
    
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<Error | null>(null); 
    
    const loadData = React.useCallback(async () => {
        setError(null);
        setIsLoading(true);

         try {
             const listData = await fetchWastebins();
                console.log(listData);
             setRowsState({
                 rows: listData,
                 rowCount: listData.length,
             });
         } catch (listDataError) {
             setError(listDataError as Error);
         }

        setIsLoading(false);
    }, []);

    React.useEffect(() => {
        loadData();
    }, [loadData]);

    const handleRowClick = React.useCallback<GridEventListener<'rowClick'>>(
        ({ row }) => {
            console.log(`Nagivating to Wastebin ${row.id}`)
            navigate(`/wastebin/${row.id}`);
        },
        [navigate],
    );
    const handleCreateClick = React.useCallback(() => {
        navigate('/wastebin/new');
    }, [navigate]);

    const handleRowEdit = React.useCallback(
        (wastebin: Wastebin) => () => {
            navigate(`/wastebins/${wastebin.id}/edit`);
        },
        [navigate],
    );

    const handleRowDelete = React.useCallback(
        (wastebin: Wastebin) => async () => {
            const confirmed = await dialogs.confirm(
                `Do you wish to delete wastebin number ${wastebin.id}?`,
                {
                    title: `Delete wastebin?`,
                    severity: 'error',
                    okText: 'Delete',
                    cancelText: 'Cancel',
                },
            );

            if (confirmed) {
                setIsLoading(true);
                try {
                    await deleteWastebin(Number(wastebin.id));

                    notifications.show('Wastebin deleted successfully.', {
                        severity: 'success',
                        autoHideDuration: 3000,
                    });
                    loadData();
                } catch (deleteError) {
                    notifications.show(
                        `Failed to delete wastebin. Reason:' ${(deleteError as Error).message}`,
                        {
                            severity: 'error',
                            autoHideDuration: 3000,
                        },
                    );
                }
                setIsLoading(false);
            }
        },
        [dialogs, notifications, loadData],
    );

    const columns = React.useMemo<GridColDef[]>(
        () => [
            { field: 'id', headerName: 'ID' },
            {
                field: 'address', 
                headerName: 'Address',
                flex: 2, 
            },
            {
                field: 'emptyingSchedule',
                headerName: 'Emptying Schedule',
                type: 'string',
                flex: 1,
            },
            {
                field: 'lastEmptiedAt',
                headerName: 'Last Emptied At',
                type: 'date',
                valueGetter: (value) => value && new Date(value),
                width: 140,
            },
            {
                field: 'userId',
                headerName: 'User Id',
                type: 'string', //User Object
                flex: 1,
            },
            {
                field: 'actions',
                type: 'actions',
                flex: 1,
                align: 'right',
                getActions: ({ row }) => [
                    <GridActionsCellItem
                        key="edit-item"
                        icon={<EditIcon />}
                        label="Edit"
                        onClick={handleRowEdit(row)}
                    />,
                    <GridActionsCellItem
                        key="delete-item"
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleRowDelete(row)}
                    />,
                ],
            },
        ],
        [handleRowEdit, handleRowDelete],
    );
    const pageTitle = 'Your Wastebins';

    return (
        <PageContainer
            title={pageTitle}
            breadcrumbs={[{ title: pageTitle }]}
            actions={
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Tooltip title="Reload data" placement="right" enterDelay={1000}>
                        <div>
                            <IconButton size="small" aria-label="refresh" >
                                <RefreshIcon />
                            </IconButton>
                        </div>
                    </Tooltip>
                    <Button
                        variant="contained"
                        onClick={handleCreateClick}
                        startIcon={<AddIcon />}
                    >
                        Create
                    </Button>
                </Stack>
            }
        >
            <Box sx={{ flex: 1, width: '100%' }}>
                {error ? (
                    <Box sx={{ flexGrow: 1 }}>
                        <Alert severity="error">{error.message}</Alert>
                    </Box>
                ) : (
                    <DataGrid
                        rows={rowsState.rows}
                        rowCount={rowsState.rowCount}
                        columns={columns}
                        pagination
                        sortingMode="server"
                        filterMode="server"
                        paginationMode="server"
                        disableRowSelectionOnClick
                        onRowClick={handleRowClick}
                        loading={isLoading}
                        showToolbar
                        sx={{
                            [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {
                                outline: 'transparent',
                            },
                            [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]:
                            {
                                outline: 'none',
                            },
                            [`& .${gridClasses.row}:hover`]: {
                                cursor: 'pointer',
                            },
                        }}
                        slotProps={{
                            loadingOverlay: {
                                variant: 'circular-progress',
                                noRowsVariant: 'circular-progress',
                            },
                            baseIconButton: {
                                size: 'small',
                            },
                        }}
                    />
                )}
                    
            </Box>
        </PageContainer>
    );
}
