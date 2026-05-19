import { NavLink, Link } from 'react-router-dom';
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
      <div className={styles.content}>
        <div className={styles.brandSection}>
          <Link to="/app/audit" style={{ display: 'flex' }}>
            <img
              className={styles.brandMark}
              src="/header/brand-mark.png"
              alt="Go to Audit"
            />
          </Link>
          <div className={styles.brandText}>
            <span className={styles.industryLabel}>
              <span className={styles.industryLabelPrefix}>Industry:</span>
              <span className={styles.industryLabelValue}>Music &amp; Royalty</span>
            </span>
          </div>
        </div>

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
              data-text={label}
              className={({ isActive }) =>
                `${styles.tab} ${isActive ? styles.tabActive : ''}`
              }
            >
              <span className={styles.tabLabel}>{label}</span>
            </NavLink>
          ))}
        </div>

        <div className={styles.bellWrapper}>
          <button
            className={`${styles.bellButton} ${notificationPanelOpen ? styles.bellActive : ''}`}
            aria-label="Notifications"
            onClick={toggleNotificationPanel}
          >
            <Notification size={24} />
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
            data-text="Account"
          >
            <span className={styles.accountLabel}>Account</span>
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
