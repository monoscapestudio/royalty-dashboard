import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/app';
import type { NotificationCategory } from '../../store/app';
import styles from './NotificationsPanel.module.css';

type FilterTab = 'All' | 'Connections' | 'Audit' | 'Recovery' | 'Rules';

const CATEGORY_MAP: Record<FilterTab, NotificationCategory | null> = {
  All: null,
  Connections: 'Connection',
  Audit: 'Audit',
  Recovery: 'Recovery',
  Rules: 'Rules',
};

const BADGE_STYLES: Record<NotificationCategory, { bg: string; color: string }> = {
  Audit:      { bg: '#e0f2e2', color: '#1a732e' },
  Connection: { bg: '#fce3e3', color: '#b22121' },
  Recovery:   { bg: '#fff4d5', color: '#8c660d' },
  Rules:      { bg: '#fff4d5', color: '#8c660d' },
};

export default function NotificationsPanel() {
  const navigate = useNavigate();
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setNotificationPanelOpen,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<FilterTab>('All');

  const filterCat = CATEGORY_MAP[activeTab];
  const filtered = filterCat
    ? notifications.filter((n) => n.category === filterCat)
    : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  function handleAction(id: string, route?: string) {
    markNotificationRead(id);
    setNotificationPanelOpen(false);
    if (route) navigate(route);
  }

  function handleRowClick(id: string) {
    markNotificationRead(id);
  }

  return (
    <div className={styles.panel}>
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.headerTitle}>Notifications</span>
          {unreadCount > 0 && (
            <span className={styles.unreadCount}>{unreadCount} unread</span>
          )}
          <button type="button" className={styles.markAllBtn} onClick={markAllNotificationsRead}>
            Mark all read
          </button>
        </div>

        <div className={styles.tabs}>
          {(['All', 'Connections', 'Audit', 'Recovery', 'Rules'] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className={styles.list}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyHeading}>No notifications</p>
            <p className={styles.emptyBody}>You're all caught up. New notifications will appear here.</p>
          </div>
        ) : (
          filtered.map((n) => {
            const badge = BADGE_STYLES[n.category];
            return (
              <div
                key={n.id}
                className={`${styles.row} ${!n.read ? styles.rowUnread : ''}`}
                onClick={() => handleRowClick(n.id)}
              >
                {/* Unread dot */}
                <div className={styles.dotWrap}>
                  {!n.read && <span className={styles.unreadDot} />}
                </div>

                <div className={styles.rowContent}>
                  <div className={styles.rowTop}>
                    <span
                      className={styles.badge}
                      style={{ background: badge.bg, color: badge.color }}
                    >
                      {n.category}
                    </span>
                    <span className={styles.timestamp}>{n.timestamp}</span>
                  </div>
                  <p className={styles.rowTitle}>{n.title}</p>
                  <p className={styles.rowDesc}>{n.desc}</p>
                  {n.actionLabel && (
                    <div className={styles.rowActions}>
                      <button
                        type="button"
                        className={styles.actionLink}
                        onClick={(e) => { e.stopPropagation(); handleAction(n.id, n.actionRoute); }}
                      >
                        {n.actionLabel}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        </div>
      </div>
    </div>
  );
}
