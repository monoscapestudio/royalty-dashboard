import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppLayout from './components/layout/AppLayout';
import ConnectsPage from './pages/connects/ConnectsPage';
import RulesPage from './pages/rules/RulesPage';
import AuditPage from './pages/audit/AuditPage';
import FindingDetailOverlay from './pages/audit/overlay/FindingDetailOverlay';
import ReportingPage from './pages/reporting/ReportingPage';
import AccountLayout from './pages/account/AccountLayout';
import ProfilePage from './pages/account/profile/ProfilePage';
import NotificationsPage from './pages/account/notifications/NotificationsPage';
import TeamPage from './pages/account/team/TeamPage';
import RolesPage from './pages/account/roles/RolesPage';
import SupportPage from './pages/account/support/SupportPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

export default function App() {
  const baseUrl = import.meta.env.BASE_URL;
  const routerBasename =
    baseUrl.length > 1 && baseUrl.endsWith('/')
      ? baseUrl.slice(0, -1)
      : baseUrl === ''
        ? '/'
        : baseUrl || '/';

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={routerBasename}>
        <Routes>
          <Route path="/app" element={<AppLayout />}>
            <Route path="audit" element={<AuditPage />}>
              <Route path="finding/:id" element={<FindingDetailOverlay />} />
            </Route>
            <Route path="connects" element={<ConnectsPage />} />
            <Route path="rules" element={<RulesPage />} />
            <Route path="reporting" element={<ReportingPage />} />

            {/* Account section */}
            <Route path="account" element={<AccountLayout />}>
              <Route path="profile" element={<ProfilePage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="team" element={<TeamPage />} />
              <Route path="roles" element={<RolesPage />} />
              <Route path="support" element={<SupportPage />} />
              <Route index element={<Navigate to="profile" replace />} />
            </Route>

            <Route index element={<Navigate to="audit" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/app/audit" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
