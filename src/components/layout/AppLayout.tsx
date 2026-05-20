import { Outlet } from 'react-router-dom';
import { useAppStore } from '../../store/app';
import LogoutModal from '../ui/LogoutModal';
import NotificationsPanel from '../ui/NotificationsPanel';
import Sidebar from './Sidebar';
import styles from './AppLayout.module.css';

export default function AppLayout() {
  const { logoutModalOpen, setLogoutModalOpen } = useAppStore();

  return (
    <div className={styles.shell}>
      <Sidebar />
      <main className={styles.main}>
        <AppMainContent />
      </main>

      {logoutModalOpen && (
        <LogoutModal
          onClose={() => setLogoutModalOpen(false)}
          onConfirm={() => {
            /* Wireframe: no auth backend — session ends in UI only */
          }}
        />
      )}
    </div>
  );
}

function AppMainContent() {
  const { notificationPanelOpen } = useAppStore();

  if (notificationPanelOpen) {
    return <NotificationsPanel />;
  }

  return (
    <div className={styles.mainContent}>
      <Outlet />
    </div>
  );
}
