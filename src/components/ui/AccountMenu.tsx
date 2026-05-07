import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/app';
import styles from './AccountMenu.module.css';

interface MenuItemProps {
  label: string;
  danger?: boolean;
  onClick: () => void;
}

function MenuItem({ label, danger, onClick }: MenuItemProps) {
  return (
    <button
      className={`${styles.menuItem} ${danger ? styles.menuItemDanger : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export default function AccountMenu() {
  const { setAccountMenuOpen } = useAppStore();
  const navigate = useNavigate();

  function go(path: string) {
    setAccountMenuOpen(false);
    navigate(path);
  }

  return (
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

      <div className={styles.roleRow}>
        <span className={styles.roleText}>Role: Admin</span>
      </div>

      <div className={styles.divider} />

      <MenuItem label="Profile settings" onClick={() => go('/app/account/profile')} />
      <MenuItem label="Notification preferences" onClick={() => go('/app/account/notifications')} />

      <div className={styles.divider} />

      <div className={styles.sectionLabel}>TEAM</div>
      <MenuItem label="Manage team members" onClick={() => go('/app/account/team')} />
      <MenuItem label="Invite user" onClick={() => go('/app/account/team')} />
      <MenuItem label="Roles and permissions" onClick={() => go('/app/account/roles')} />

      <div className={styles.divider} />

      <div className={styles.sectionLabel}>SUPPORT</div>
      <MenuItem
        label="Documentation"
        onClick={() => {
          setAccountMenuOpen(false);
          window.open('https://docs.revorion.ai', '_blank');
        }}
      />
      <MenuItem label="Contact support" onClick={() => go('/app/account/support')} />

      <div className={styles.divider} />

      <MenuItem label="Log out" danger onClick={() => setAccountMenuOpen(false)} />
    </div>
  );
}
