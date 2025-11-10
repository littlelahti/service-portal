import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, useParams } from 'react-router';
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
import { fetchWastebin, updateWastebin } from '../ApiClient';

function WastebinEditForm({
  initialValues,
  onSubmit,
}: {
  initialValues: Partial<WastebinFormState['values']>;
  onSubmit: (formValues: Partial<WastebinFormState['values']>) => Promise<void>;
}) {
  const { wastebinId } = useParams();
  const navigate = useNavigate();

  const notifications = useNotifications();

  const [formState, setFormState] = React.useState<WastebinFormState>(() => ({
    values: initialValues,
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
    setFormValues(initialValues);
  }, [initialValues, setFormValues]);

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
      await onSubmit(formValues);
      notifications.show('Wastebin edited successfully.', {
        severity: 'success',
        autoHideDuration: 3000,
      });

      navigate('/wastebins');
    } catch (editError) {
      notifications.show(
        `Failed to edit wastebin. Reason: ${(editError as Error).message}`,
        {
          severity: 'error',
          autoHideDuration: 3000,
        },
      );
      throw editError;
    }
  }, [formValues, navigate, notifications, onSubmit, setFormErrors]);

  return (
    <WastebinForm
      formState={formState}
      onFieldChange={handleFormFieldChange}
      onSubmit={handleFormSubmit}
      onReset={handleFormReset}
      submitButtonLabel="Save"
      backButtonPath={`/wastebins/${wastebinId}`}
    />
  );
}

export default function WastebinEdit() {
  const { wastebinId } = useParams();

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

  const handleSubmit = React.useCallback(
    async (formValues: Partial<WastebinFormState['values']>) => {
      const updatedData = await updateWastebin(Number(wastebinId), formValues);
      setWastebin(updatedData);
    },
    [wastebinId],
  );

  const renderEdit = React.useMemo(() => {
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
      <WastebinEditForm initialValues={wastebin} onSubmit={handleSubmit} />
    ) : null;
  }, [isLoading, error, wastebin, handleSubmit]);

  return (
    <PageContainer
      title={`Edit Wastebin ${wastebinId}`}
      breadcrumbs={[
        { title: 'Wastebins', path: '/wastebins' },
        { title: `Wastebin ${wastebinId}`, path: `/wastebins/${wastebinId}` },
        { title: 'Edit' },
      ]}
    >
      <Box sx={{ display: 'flex', flex: 1 }}>{renderEdit}</Box>
    </PageContainer>
  );
}
