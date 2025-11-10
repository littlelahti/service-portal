import CssBaseline from '@mui/material/CssBaseline';
import { createHashRouter, RouterProvider } from 'react-router';
import DashboardLayout from './components/DashboardLayout';
import FeedbackCreate from './components/FeedbackCreate';
import UserEdit from './components/UserEdit';
import UserShow from './components/UserShow';
import WastebinCreate from './components/WastebinCreate';
import WastebinEdit from './components/WastebinEdit';
import WastebinList from './components/WastebinList';
import WastebinShow from './components/WastebinShow';
import DialogsProvider from './hooks/useDialogs/DialogsProvider';
import NotificationsProvider from './hooks/useNotifications/NotificationsProvider';
import AppTheme from './theme/AppTheme';
import {
  dataGridCustomizations,
  datePickersCustomizations,
  formInputCustomizations,
  sidebarCustomizations,
} from './theme/customizations';

const router = createHashRouter([
  {
    Component: DashboardLayout,
    children: [
      {
        path: '/wastebins',
        Component: WastebinList,
      },
      {
        path: '/wastebin/:wastebinId',
        Component: WastebinShow,
      },
      {
        path: '/wastebin/new',
        Component: WastebinCreate,
      },
      {
        path: '/wastebins/:wastebinId/edit',
        Component: WastebinEdit,
      },
      {
        path: '/user/:userId',
        Component: UserShow,
      },
      {
        path: '/user/:userId/edit',
        Component: UserEdit,
      },
      {
        path: '/feedback/new',
        Component: FeedbackCreate,
      },
      // Fallback route for the example routes in dashboard sidebar items
      {
        path: '*',
        Component: WastebinList,
      },
    ],
  },
]);
const themeComponents = {
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...sidebarCustomizations,
  ...formInputCustomizations,
};

export default function CrudDashboard(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props} themeComponents={themeComponents}>
      <CssBaseline enableColorScheme />
        <NotificationsProvider>
        <DialogsProvider>
          <RouterProvider router={router} />
        </DialogsProvider>
        </NotificationsProvider>
    </AppTheme>
  );
}