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
import type { User } from '../data/user';

export interface UserFormState {
    values: Partial<Omit<User, 'id'>>;
    errors: Partial<Record<keyof UserFormState['values'], string>>;
}

export type FormFieldValue = string | string[] | number | boolean | File | null;

export interface UserFormProps {
    formState: UserFormState;
    onFieldChange: (
        name: keyof UserFormState['values'],
        value: FormFieldValue,
    ) => void;
    onSubmit: (formValues: Partial<UserFormState['values']>) => Promise<void>;
    onReset?: (formValues: Partial<UserFormState['values']>) => void;
    submitButtonLabel: string;
    backButtonPath?: string;
}

export default function UserForm(props: UserFormProps) {
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
                event.target.name as keyof UserFormState['values'],
                event.target.value,
            );
        },
        [onFieldChange],
    );

    const handleNumberFieldChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onFieldChange(
                event.target.name as keyof UserFormState['values'],
                Number(event.target.value),
            );
        },
        [onFieldChange],
    );

    const handleCheckboxFieldChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
            onFieldChange(event.target.name as keyof UserFormState['values'], checked);
        },
        [onFieldChange],
    );

    const handleDateFieldChange = React.useCallback(
        (fieldName: keyof UserFormState['values']) => (value: Dayjs | null) => {
            if (value?.isValid()) {
                onFieldChange(fieldName, value.toISOString() ?? null);
            } else if (formValues[fieldName]) {
                onFieldChange(fieldName, null);
            }
        },
        [formValues, onFieldChange],
    );

    const handleSelectFieldChange = React.useCallback(
        (event: SelectChangeEvent) => {
            onFieldChange(
                event.target.name as keyof UserFormState['values'],
                event.target.value,
            );
        },
        [onFieldChange],
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
                            value={formValues.name ?? ''}
                            onChange={handleTextFieldChange}
                            name="name"
                            label="Name"
                            error={!!formErrors.name}
                            helperText={formErrors.name ?? ' '}
                            fullWidth
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
                        <TextField
                            value={formValues.email ?? ''}
                            onChange={handleTextFieldChange}
                            name="email"
                            label="Email"
                            error={!!formErrors.email}
                            helperText={formErrors.email ?? ' '}
                            fullWidth
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
                        <TextField
                            value={formValues.phone ?? ''}
                            onChange={handleTextFieldChange}
                            name="phone"
                            label="Phone number"
                            error={!!formErrors.phone}
                            helperText={formErrors.phone ?? ' '}
                            fullWidth
                        />
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
