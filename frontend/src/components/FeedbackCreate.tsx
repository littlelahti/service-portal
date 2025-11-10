import * as React from 'react';
import { useNavigate } from 'react-router';
import useNotifications from '../hooks/useNotifications/useNotifications';
import { Feedback } from '../data/feedback';
import FeedbackForm, {
    type FormFieldValue,
    type FeedbackFormState,
} from './FeedbackForm';
import PageContainer from './PageContainer';
import { createFeedback } from '../ApiClient';

const INITIAL_FORM_VALUES: Partial<FeedbackFormState['values']> = {
    userId: 1
};

export default function FeedbackCreate() {
    const navigate = useNavigate();

    const notifications = useNotifications();

    const [formState, setFormState] = React.useState<FeedbackFormState>(() => ({
        values: INITIAL_FORM_VALUES,
        errors: {},
    }));
    const formValues = formState.values;
    const formErrors = formState.errors;

    const setFormValues = React.useCallback(
        (newFormValues: Partial<FeedbackFormState['values']>) => {
            setFormState((previousState) => ({
                ...previousState,
                values: newFormValues,
            }));
        },
        [],
    );

    const setFormErrors = React.useCallback(
        (newFormErrors: Partial<FeedbackFormState['errors']>) => {
            setFormState((previousState) => ({
                ...previousState,
                errors: newFormErrors,
            }));
        },
        [],
    );

    const handleFormFieldChange = React.useCallback(
        (name: keyof FeedbackFormState['values'], value: FormFieldValue) => {
            const newFormValues = { ...formValues, [name]: value };
            setFormValues(newFormValues);
        },
        [formValues, formErrors, setFormErrors, setFormValues],
    );

    const handleFormReset = React.useCallback(() => {
        setFormValues(INITIAL_FORM_VALUES);
    }, [setFormValues]);

    const handleFormSubmit = React.useCallback(async () => {
        try {
            await createFeedback(formValues as Omit<Feedback, 'id'>);
            notifications.show('Feedback created successfully.', {
                severity: 'success',
                autoHideDuration: 3000,
            });

            navigate('/wastebins');
        } catch (createError) {
            notifications.show(
                `Failed to create feedback. Reason: ${(createError as Error).message}`,
                {
                    severity: 'error',
                    autoHideDuration: 3000,
                },
            );
            throw createError;
        }
    }, [formValues, navigate, notifications, setFormErrors]);

    return (
        <PageContainer
            title="New Feedback"
            breadcrumbs={[{ title: 'Feedback'}, { title: 'New' }]}
        >
            <FeedbackForm
                formState={formState}
                onFieldChange={handleFormFieldChange}
                onSubmit={handleFormSubmit}
                onReset={handleFormReset}
                submitButtonLabel="Create"
            />
        </PageContainer>
    );
}
