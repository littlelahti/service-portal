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
import { User } from '../data/user';
import PageContainer from './PageContainer';
import { fetchUser, } from '../ApiClient';

export default function UserShow() {
    const { userId } = useParams();
    const navigate = useNavigate();

    const dialogs = useDialogs();
    const notifications = useNotifications();

    const [user, setUser] = React.useState<User | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<Error | null>(null);

    const loadData = React.useCallback(async () => {
        setError(null);
        setIsLoading(true);

        try {
            const showData = await fetchUser(Number(userId));
            setUser(showData);
        } catch (showDataError) {
            setError(showDataError as Error);
        }
        setIsLoading(false);
    }, [userId]);

    React.useEffect(() => {
        loadData();
    }, [loadData]);

    const handleUserEdit = React.useCallback(() => {
        navigate(`/user/${userId}/edit`);
    }, [navigate, userId]);

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

        return user ? (
            <Box sx={{ flexGrow: 1, width: '100%' }}>
                <Grid container spacing={2} sx={{ width: '100%' }}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Paper sx={{ px: 2, py: 1 }}>
                            <Typography variant="overline">User Id</Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                {user.id}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Paper sx={{ px: 2, py: 1 }}>
                            <Typography variant="overline">Name</Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                {user.name}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Paper sx={{ px: 2, py: 1 }}>
                            <Typography variant="overline">email</Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                {user.email}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Paper sx={{ px: 2, py: 1 }}>
                            <Typography variant="overline">Phone number</Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                {user.phone}
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
                            onClick={handleUserEdit}
                        >
                            Edit
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        ) : null;
    }, [
        isLoading,
        error,
        user,
        handleBack,
        handleUserEdit,
    ]);

    const pageTitle = `User ${user?.name}`;

    return (
        <PageContainer
            title={pageTitle}
        >
            <Box sx={{ display: 'flex', flex: 1, width: '100%' }}>{renderShow}</Box>
        </PageContainer>
    );
}
