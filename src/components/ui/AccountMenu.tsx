import { useState } from 'react';
import { useAppStore } from '../../store/app';
import styles from './AccountMenu.module.css';

const TOAST_MSG = 'Settings pages are out of scope for this wireframe.';

interface MenuItemProps {
  label: string;
  danger?: boolean;
  onAction: () => void;
}

function MenuItem({ label, danger, onAction }: MenuItemProps) {
  return (
    <button
      className={`${styles.menuItem} ${danger ? styles.menuItemDanger : ''}`}
      onClick={onAction}
    >
      {label}
    </button>
  );
}

export default function AccountMenu() {
  const { setAccountMenuOpen } = useAppStore();
  const [toast, setToast] = useState<string | null>(null);

  function handleItem() {
    setAccountMenuOpen(false);
    setToast(TOAST_MSG);
    setTimeout(() => setToast(null), 2500);
  }

  return (
    <>
      <div className={styles.menu}>
        {/* User info */}
        <div className={styles.userInfo}>
          <div className={styles.avatar}>S</div>
          <div className={styles.userText}>
            <span className={styles.userName}>Sarah Cone</span>
            <span className={styles.userEmail}>sarah@revorion.ai</span>
          </div>
        </div>

        <div className={styles.divider} />

        {/* Role row */}
        <div className={styles.roleRow}>
          <span className={styles.roleText}>Role: Admin</span>
        </div>

        <div className={styles.divider} />

        <MenuItem label="Profile settings" onAction={handleItem} />
        <MenuItem label="Notification preferences" onAction={handleItem} />

        <div className={styles.divider} />

        <div className={styles.sectionLabel}>TEAM</div>
        <MenuItem label="Manage team members" onAction={handleItem} />
        <MenuItem label="Invite user" onAction={handleItem} />
        <MenuItem label="Roles and permissions" onAction={handleItem} />

        <div className={styles.divider} />

        <div className={styles.sectionLabel}>SUPPORT</div>
        <MenuItem label="Documentation" onAction={handleItem} />
        <MenuItem label="Contact support" onAction={handleItem} />

        <div className={styles.divider} />

        <MenuItem label="Log out" danger onAction={handleItem} />
      </div>

      {toast && (
        <div className={styles.toast}>{toast}</div>
      )}
    </>
  );
}
