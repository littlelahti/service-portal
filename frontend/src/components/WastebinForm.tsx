import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent, SelectProps } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';
import dayjs, { Dayjs } from 'dayjs';
import type { Wastebin } from '../data/wastebin';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

export interface WastebinFormState {
    values: Partial<Omit<Wastebin, 'id'>>;
    errors: Partial<Record<keyof WastebinFormState['values'], string>>;
}

export type FormFieldValue = string | string[] | number | boolean | File | null;

export interface WastebinFormProps {
    formState: WastebinFormState;
    onFieldChange: (
        name: keyof WastebinFormState['values'],
        value: FormFieldValue,
    ) => void;
    onSubmit: (formValues: Partial<WastebinFormState['values']>) => Promise<void>;
    onReset?: (formValues: Partial<WastebinFormState['values']>) => void;
    submitButtonLabel: string;
    backButtonPath?: string;
}

export default function WastebinForm(props: WastebinFormProps) {
    const {
        formState,
        onFieldChange,
        onSubmit,
        onReset,
        submitButtonLabel,
        backButtonPath,
    } = props;

    const formValues = formState.values;
    const formErrors = formState.errors;

    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleSubmit = React.useCallback(
        async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            setIsSubmitting(true);
            try {
                await onSubmit(formValues);
            } finally {
                setIsSubmitting(false);
            }
        },
        [formValues, onSubmit],
    );

    const handleTextFieldChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onFieldChange(
                event.target.name as keyof WastebinFormState['values'],
                event.target.value,
            );
        },
        [onFieldChange],
    );

    const handleNumberFieldChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onFieldChange(
                event.target.name as keyof WastebinFormState['values'],
                Number(event.target.value),
            );
        },
        [onFieldChange],
    );

    const handleDateFieldChange = React.useCallback(
        (fieldName: keyof WastebinFormState['values']) => (value: Dayjs | null) => {
            if (value?.isValid()) {
                onFieldChange(fieldName, value.toISOString() ?? null);
            } else if (formValues[fieldName]) {
                onFieldChange(fieldName, null);
            }
        },
        [formValues, onFieldChange],
    );

    const handleReset = React.useCallback(() => {
        if (onReset) {
            onReset(formValues);
        }
    }, [formValues, onReset]);

    const handleBack = React.useCallback(() => {
        navigate(backButtonPath ?? '/wastebins');
    }, [navigate, backButtonPath]);

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            autoComplete="off"
            onReset={handleReset}
            sx={{ width: '100%' }}
        >
            <FormGroup>
                <Grid container spacing={2} sx={{ mb: 2, width: '100%' }}>
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
                        <TextField
                            value={formValues.address ?? ''}
                            onChange={handleTextFieldChange}
                            name="address"
                            label="Address"
                            error={!!formErrors.address}
                            helperText={formErrors.address ?? ' '}
                            fullWidth
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
                        <TextField
                            value={formValues.emptyingSchedule ?? ''}
                            onChange={handleTextFieldChange}
                            name="emptyingSchedule"
                            label="Emptying Schedule"
                            error={!!formErrors.emptyingSchedule}
                            helperText={formErrors.emptyingSchedule ?? ' '}
                            fullWidth
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={formValues.lastEmptiedAt ? dayjs(formValues.lastEmptiedAt) : null}
                                onChange={handleDateFieldChange('lastEmptiedAt')}
                                name="lastEmptiedAt"
                                label="Last Emptied At"
                                slotProps={{
                                    textField: {
                                        error: !!formErrors.lastEmptiedAt,
                                        helperText: formErrors.lastEmptiedAt ?? ' ',
                                        fullWidth: true,
                                    },
                                }}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
                        <Paper sx={{ px: 2, py: 1 }}>
                            <Typography variant="overline">User Id</Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                {formValues.userId ? formValues.userId : 1}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </FormGroup>
            <Stack direction="row" spacing={2} justifyContent="space-between">
                <Button
                    variant="contained"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                >
                    Back
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    loading={isSubmitting}
                >
                    {submitButtonLabel}
                </Button>
            </Stack>
        </Box>
    );
}
