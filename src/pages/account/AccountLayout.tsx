import { NavLink, Outlet } from 'react-router-dom';
import { useAppStore } from '../../store/app';
import styles from './AccountLayout.module.css';

const NAV_ITEMS = [
  { to: '/app/account/profile', label: 'Profile settings' },
  { to: '/app/account/notifications', label: 'Notification preferences' },
];

const TEAM_ITEMS = [
  { to: '/app/account/team', label: 'Manage team members' },
  { to: '/app/account/roles', label: 'Roles and permissions' },
];

const SUPPORT_ITEMS = [
  { to: '/app/account/support', label: 'Contact support' },
];

export default function AccountLayout() {
  const { notificationPanelOpen } = useAppStore();

  const navClass = (isActive: boolean) =>
    `${styles.navItem} ${isActive && !notificationPanelOpen ? styles.navItemActive : ''}`;

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <span className={styles.sidebarTitle}>Account</span>
        </div>

        <div className={styles.sidebarSection}>General</div>
        {NAV_ITEMS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => navClass(isActive)}
          >
            {label}
          </NavLink>
        ))}

        <div className={styles.sidebarSection}>Team</div>
        {TEAM_ITEMS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => navClass(isActive)}
          >
            {label}
          </NavLink>
        ))}

        <div className={styles.sidebarSection}>Support</div>
        {SUPPORT_ITEMS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => navClass(isActive)}
          >
            {label}
          </NavLink>
        ))}
      </aside>

      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}
