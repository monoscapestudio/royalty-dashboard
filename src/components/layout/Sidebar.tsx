import { NavLink, Link } from 'react-router-dom';
import {
  DataConnected,
  Rule,
  ChartLineData,
  Report,
  Notification,
  UserAvatar,
  Logout,
} from '@carbon/icons-react';
import { useAppStore } from '../../store/app';
import NotificationsPanel from '../ui/NotificationsPanel';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { to: '/app/connects', label: 'Connects', Icon: DataConnected },
  { to: '/app/rules', label: 'Rules', Icon: Rule },
  { to: '/app/audit', label: 'Audit', Icon: ChartLineData },
  { to: '/app/reporting', label: 'Reporting', Icon: Report },
];

const ACCOUNT_ITEMS = [
  { to: '/app/account/profile', label: 'Profile', Icon: UserAvatar },
];

export default function Sidebar() {
  const {
    notificationPanelOpen,
    toggleNotificationPanel,
    setNotificationPanelOpen,
    notifications,
  } = useAppStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brandSection}>
        <Link to="/app/audit" className={styles.brand}>
          <img
            className={styles.brandMark}
            src="/header/brand-mark.png"
            alt="Revorion"
          />
        </Link>

        <div className={styles.industryBadge}>
          <span className={styles.industryLabel}>Music & Royalty</span>
        </div>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.spacer} />

      <div className={styles.bottom}>
        <button
          className={`${styles.navItem} ${notificationPanelOpen ? styles.navItemActive : ''}`}
          onClick={toggleNotificationPanel}
        >
          <span className={styles.bellWrap}>
            <Notification size={18} />
            {unreadCount > 0 && <span className={styles.badge} />}
          </span>
          <span>Notifications</span>
        </button>

        {ACCOUNT_ITEMS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}

        <button className={`${styles.navItem} ${styles.logoutBtn}`}>
          <Logout size={18} />
          <span>Logout</span>
        </button>
      </div>

      {notificationPanelOpen && (
        <>
          <div className={styles.scrim} onClick={() => setNotificationPanelOpen(false)} />
          <NotificationsPanel />
        </>
      )}
    </aside>
  );
}
