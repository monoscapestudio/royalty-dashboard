import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Notification } from '@carbon/icons-react';
import { useAppStore, useActiveSilo } from '../../store/app';
import NotificationsPanel from '../ui/NotificationsPanel';
import AccountMenu from '../ui/AccountMenu';
import styles from './TopNav.module.css';

export default function TopNav() {
  const {
    silos,
    activeSiloId,
    siloSelectorOpen,
    setSilo,
    toggleSiloSelector,
    setSiloSelectorOpen,
    notificationPanelOpen,
    toggleNotificationPanel,
    setNotificationPanelOpen,
    accountMenuOpen,
    toggleAccountMenu,
    setAccountMenuOpen,
    notifications,
  } = useAppStore();
  const activeSilo = useActiveSilo();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const [industryToast, setIndustryToast] = useState<string | null>(null);
  const industryToastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (industryToastTimer.current) clearTimeout(industryToastTimer.current);
    };
  }, []);

  function flashIndustryToast(msg: string) {
    setIndustryToast(msg);
    if (industryToastTimer.current) clearTimeout(industryToastTimer.current);
    industryToastTimer.current = setTimeout(() => setIndustryToast(null), 3000);
  }

  return (
    <nav className={styles.nav}>
      {/* Left: logo + silo */}
      <div className={styles.left}>
        <span className={styles.logo}>AuditGraph</span>

        <div className={styles.siloWrapper}>
          <button
            className={`${styles.siloButton} ${siloSelectorOpen ? styles.siloOpen : ''}`}
            onClick={toggleSiloSelector}
            aria-haspopup="listbox"
            aria-expanded={siloSelectorOpen}
          >
            Industry: {activeSilo.name}&nbsp;▾
          </button>

          {siloSelectorOpen && (
            <>
              <div className={styles.scrim} onClick={() => setSiloSelectorOpen(false)} />
              <div className={styles.siloDropdown} role="listbox">
                <div className={styles.siloDropdownHeader}>
                  <span className={styles.siloDropdownHeaderLabel}>Current Industry</span>
                </div>

                {silos.map((silo) => {
                  const isActive = silo.id === activeSiloId;
                  return (
                    <div
                      key={silo.id}
                      className={`${styles.siloRow} ${isActive ? styles.siloRowActive : ''}`}
                      role="option"
                      aria-selected={isActive}
                      onClick={() => setSilo(silo.id)}
                    >
                      <span className={`${styles.siloRowName} ${isActive ? styles.siloRowNameActive : ''}`}>
                        {silo.name}
                      </span>
                      <span className={`${styles.siloRowSub} ${isActive ? styles.siloRowSubActive : ''}`}>
                        {silo.configured && silo.sources != null
                          ? `${silo.sources} sources  |  ${silo.rules} rules  |  Last audit: ${silo.lastAudit}`
                          : 'Not configured'}
                      </span>
                    </div>
                  );
                })}

                <div className={styles.siloFooterDivider} />
                <button
                  type="button"
                  className={`${styles.siloFooter} ${styles.siloFooterBtn}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSiloSelectorOpen(false);
                    flashIndustryToast('Industry management is out of scope for this wireframe.');
                  }}
                >
                  <span className={styles.siloFooterLabel}>Manage industries</span>
                </button>
              </div>
            </>
          )}
        </div>
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
        {/* Bell button + panel */}
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

        {/* Account button + menu */}
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
      {industryToast && (
        <div className={styles.globalToast}>{industryToast}</div>
      )}
    </nav>
  );
}
