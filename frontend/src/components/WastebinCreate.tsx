import * as React from 'react';
import { useNavigate } from 'react-router';
import useNotifications from '../hooks/useNotifications/useNotifications';
import {
    validate as validateWastebin,
    type Wastebin,
} from '../data/wastebin';
import WastebinForm, {
    type FormFieldValue,
    type WastebinFormState,
} from './WastebinForm';
import PageContainer from './PageContainer';
import { createWastebin } from '../ApiClient';

const INITIAL_FORM_VALUES: Partial<WastebinFormState['values']> = {
    userId: 1
};

export default function WastebinCreate() {
    const navigate = useNavigate();

    const notifications = useNotifications();

    const [formState, setFormState] = React.useState<WastebinFormState>(() => ({
        values: INITIAL_FORM_VALUES,
        errors: {},
    }));
    const formValues = formState.values;
    const formErrors = formState.errors;

    const setFormValues = React.useCallback(
        (newFormValues: Partial<WastebinFormState['values']>) => {
            setFormState((previousState) => ({
                ...previousState,
                values: newFormValues,
            }));
        },
        [],
    );

    const setFormErrors = React.useCallback(
        (newFormErrors: Partial<WastebinFormState['errors']>) => {
            setFormState((previousState) => ({
                ...previousState,
                errors: newFormErrors,
            }));
        },
        [],
    );

    const handleFormFieldChange = React.useCallback(
        (name: keyof WastebinFormState['values'], value: FormFieldValue) => {
            const validateField = async (values: Partial<WastebinFormState['values']>) => {
                const { issues } = validateWastebin(values);
                setFormErrors({
                    ...formErrors,
                    [name]: issues?.find((issue) => issue.path?.[0] === name)?.message,
                });
            };

            const newFormValues = { ...formValues, [name]: value };

            setFormValues(newFormValues);
            validateField(newFormValues);
        },
        [formValues, formErrors, setFormErrors, setFormValues],
    );

    const handleFormReset = React.useCallback(() => {
        setFormValues(INITIAL_FORM_VALUES);
    }, [setFormValues]);

    const handleFormSubmit = React.useCallback(async () => {
        const { issues } = validateWastebin(formValues);
        if (issues && issues.length > 0) {
            setFormErrors(
                Object.fromEntries(issues.map((issue) => [issue.path?.[0], issue.message])),
            );
            return;
        }
        setFormErrors({});
        try {
            await createWastebin(formValues as Omit<Wastebin, 'id'>);
            notifications.show('Wastebin created successfully.', {
                severity: 'success',
                autoHideDuration: 3000,
            });

            navigate('/wastebins');
        } catch (createError) {
            notifications.show(
                `Failed to create wastebin. Reason: ${(createError as Error).message}`,
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
            title="New Wastebin"
            breadcrumbs={[{ title: 'Wastebins', path: '/wastebins' }, { title: 'New' }]}
        >
            <WastebinForm
                formState={formState}
                onFieldChange={handleFormFieldChange}
                onSubmit={handleFormSubmit}
                onReset={handleFormReset}
                submitButtonLabel="Create"
            />
        </PageContainer>
    );
}
