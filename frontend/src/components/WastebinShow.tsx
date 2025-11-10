import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router';
import { useDialogs } from '../hooks/useDialogs/useDialogs';
import useNotifications from '../hooks/useNotifications/useNotifications';
import { Wastebin } from '../data/wastebin';
import PageContainer from './PageContainer';
import { fetchWastebin, deleteWastebin } from '../ApiClient';

export default function WastebinShow() {
    const { wastebinId } = useParams();
    const navigate = useNavigate();

    const dialogs = useDialogs();
    const notifications = useNotifications();

    const [wastebin, setWastebin] = React.useState<Wastebin | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<Error | null>(null);

    const loadData = React.useCallback(async () => {
        setError(null);
        setIsLoading(true);

        try {
            const showData = await fetchWastebin(Number(wastebinId));
            setWastebin(showData);
        } catch (showDataError) {
            setError(showDataError as Error);
        }
        setIsLoading(false);
    }, [wastebinId]);

    React.useEffect(() => {
        loadData();
    }, [loadData]);

    const handleWastebinEdit = React.useCallback(() => {
        navigate(`/wastebins/${wastebinId}/edit`);
    }, [navigate, wastebinId]);

    const handleWastebinDelete = React.useCallback(async () => {
        if (!wastebin) {
            return;
        }

        const confirmed = await dialogs.confirm(
            `Do you wish to delete wastebin with id ${wastebin.id}?`,
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
                await deleteWastebin(Number(wastebinId));

                navigate('/wastebins');

                notifications.show('Wastebin deleted successfully.', {
                    severity: 'success',
                    autoHideDuration: 3000,
                });
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
    }, [wastebin, dialogs, wastebinId, navigate, notifications]);

    const handleBack = React.useCallback(() => {
        navigate('/wastebins');
    }, [navigate]);

    const renderShow = React.useMemo(() => {
        if (isLoading) {
            return (
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        m: 1,
                    }}
                >
                    <CircularProgress />
                </Box>
            );
        }
        if (error) {
            return (
                <Box sx={{ flexGrow: 1 }}>
                    <Alert severity="error">{error.message}</Alert>
                </Box>
            );
        }

        return wastebin ? (
            <Box sx={{ flexGrow: 1, width: '100%' }}>
                <Grid container spacing={2} sx={{ width: '100%' }}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Paper sx={{ px: 2, py: 1 }}>
                            <Typography variant="overline">Address</Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                {wastebin.address}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Paper sx={{ px: 2, py: 1 }}>
                            <Typography variant="overline">Emptying Schedule</Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                {wastebin.emptyingSchedule}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Paper sx={{ px: 2, py: 1 }}>
                            <Typography variant="overline">Last Emptied At</Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                {dayjs(wastebin.lastEmptiedAt).format('MMMM D, YYYY')}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Paper sx={{ px: 2, py: 1 }}>
                            <Typography variant="overline">User Id</Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                {wastebin.userId}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
                <Divider sx={{ my: 3 }} />
                <Stack direction="row" spacing={2} justifyContent="space-between">
                    <Button
                        variant="contained"
                        startIcon={<ArrowBackIcon />}
                        onClick={handleBack}
                    >
                        Back
                    </Button>
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            onClick={handleWastebinEdit}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={handleWastebinDelete}
                        >
                            Delete
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        ) : null;
    }, [
        isLoading,
        error,
        wastebin,
        handleBack,
        handleWastebinEdit,
        handleWastebinDelete,
    ]);

    const pageTitle = `Wastebin ${wastebinId}`;

    return (
        <PageContainer
            title={pageTitle}
            breadcrumbs={[
                { title: 'Wastebins', path: '/wastebins' },
                { title: pageTitle },
            ]}
        >
            <Box sx={{ display: 'flex', flex: 1, width: '100%' }}>{renderShow}</Box>
        </PageContainer>
    );
}
