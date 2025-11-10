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
import type { Feedback } from '../data/feedback';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

export interface FeedbackFormState {
    values: Partial<Omit<Feedback, 'id'>>;
    errors: Partial<Record<keyof FeedbackFormState['values'], string>>;
}

export type FormFieldValue = string | string[] | number | boolean | File | null;

export interface FeedbackFormProps {
    formState: FeedbackFormState;
    onFieldChange: (
        name: keyof FeedbackFormState['values'],
        value: FormFieldValue,
    ) => void;
    onSubmit: (formValues: Partial<FeedbackFormState['values']>) => Promise<void>;
    onReset?: (formValues: Partial<FeedbackFormState['values']>) => void;
    submitButtonLabel: string;
    backButtonPath?: string;
}

export default function FeedbackForm(props: FeedbackFormProps) {
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
                event.target.name as keyof FeedbackFormState['values'],
                event.target.value,
            );
        },
        [onFieldChange],
    );

    const handleNumberFieldChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onFieldChange(
                event.target.name as keyof FeedbackFormState['values'],
                Number(event.target.value),
            );
        },
        [onFieldChange],
    );

    const handleDateFieldChange = React.useCallback(
        (fieldName: keyof FeedbackFormState['values']) => (value: Dayjs | null) => {
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
                            value={formValues.message ?? ''}
                            onChange={handleTextFieldChange}
                            name="message"
                            label="Feedback message"
                            error={!!formErrors.message}
                            helperText={formErrors.message ?? ' '}
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
