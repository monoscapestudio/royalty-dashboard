import { NavLink } from 'react-router-dom';
import { Notification } from '@carbon/icons-react';
import { useAppStore } from '../../store/app';
import NotificationsPanel from '../ui/NotificationsPanel';
import AccountMenu from '../ui/AccountMenu';
import styles from './TopNav.module.css';

export default function TopNav() {
  const {
    notificationPanelOpen,
    toggleNotificationPanel,
    setNotificationPanelOpen,
    accountMenuOpen,
    toggleAccountMenu,
    setAccountMenuOpen,
    notifications,
  } = useAppStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <nav className={styles.nav}>
      {/* Left: logo + industry label */}
      <div className={styles.left}>
        <span className={styles.logo}>AuditGraph</span>
        <span className={styles.industryLabel}>Industry: Music &amp; Royalty</span>
      </div>

      {/* Center: nav tabs */}
      <div className={styles.tabs}>
        {[
          { to: '/app/connects', label: 'Connects' },
          { to: '/app/rules', label: 'Rules' },
          { to: '/app/audit', label: 'Audit' },
          { to: '/app/reporting', label: 'Reporting' },
        ].map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `${styles.tab} ${isActive ? styles.tabActive : ''}`}
          >
            {label}
          </NavLink>
        ))}
      </div>

      {/* Right: bell + account */}
      <div className={styles.right}>
        <div className={styles.bellWrapper}>
          <button
            className={`${styles.bellButton} ${notificationPanelOpen ? styles.bellActive : ''}`}
            aria-label="Notifications"
            onClick={toggleNotificationPanel}
          >
            <Notification size={16} />
            {unreadCount > 0 && <span className={styles.bellBadge} />}
          </button>

          {notificationPanelOpen && (
            <>
              <div className={styles.scrim} onClick={() => setNotificationPanelOpen(false)} />
              <NotificationsPanel />
            </>
          )}
        </div>

        <div className={styles.accountWrapper}>
          <button
            className={`${styles.account} ${accountMenuOpen ? styles.accountActive : ''}`}
            onClick={toggleAccountMenu}
          >
            Account
            {accountMenuOpen && <span className={styles.accountUnderline} />}
          </button>

          {accountMenuOpen && (
            <>
              <div className={styles.scrim} onClick={() => setAccountMenuOpen(false)} />
              <AccountMenu />
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
