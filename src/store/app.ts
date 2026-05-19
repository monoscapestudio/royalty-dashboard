import { create } from 'zustand';
import type { AuditState } from '../types';

export type NotificationCategory = 'Audit' | 'Connection' | 'Recovery' | 'Rules';

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  desc: string;
  actionLabel?: string;
  actionRoute?: string;
  timestamp: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    category: 'Audit',
    title: 'Audit complete',
    desc: 'Music & Royalty audit finished. 1,390 findings, $12.45M potential recovery.',
    actionLabel: 'View findings',
    actionRoute: '/app/audit',
    timestamp: '2 minutes ago',
    read: false,
  },
  {
    id: 'n2',
    category: 'Connection',
    title: 'Connection failed',
    desc: 'Google Drive (Contracts) sync failed. Authentication expired.',
    actionLabel: 'Reconnect',
    actionRoute: '/app/connects',
    timestamp: '14 minutes ago',
    read: false,
  },
  {
    id: 'n3',
    category: 'Recovery',
    title: 'Recovery email drafted',
    desc: 'Email to matthew@soundexchange.com ready for review. INV-2026-0892, $4,200.',
    actionLabel: 'Review draft',
    actionRoute: '/app/audit',
    timestamp: '18 minutes ago',
    read: false,
  },
  {
    id: 'n4',
    category: 'Recovery',
    title: 'Recovery email sent',
    desc: 'Email to accounting@bmi.com sent successfully. INV-2026-0445, $999.',
    timestamp: '1 hour ago',
    read: false,
  },
  {
    id: 'n5',
    category: 'Connection',
    title: 'Integration provisioned',
    desc: 'NetSuite integration is now live. You can run audits with this source.',
    actionLabel: 'Configure',
    actionRoute: '/app/connects',
    timestamp: '3 hours ago',
    read: true,
  },
  {
    id: 'n6',
    category: 'Rules',
    title: 'Duplicate rule detected',
    desc: 'Your rule matches existing library rule: Recoupment rate floor.',
    actionLabel: 'Review',
    actionRoute: '/app/rules',
    timestamp: 'Yesterday',
    read: true,
  },
  {
    id: 'n7',
    category: 'Recovery',
    title: 'Response received',
    desc: 'SoundExchange replied to recovery email for INV-2026-0667.',
    actionLabel: 'View',
    actionRoute: '/app/audit',
    timestamp: 'Yesterday',
    read: true,
  },
];

interface AppState {
  activeSiloId: string;
  notificationPanelOpen: boolean;
  accountMenuOpen: boolean;
  notifications: AppNotification[];
  auditStateBySilo: Record<string, AuditState>;
  /** First-audit setup — marked when user visits Connects/Rules and criteria are met */
  auditReadiness: { contractSource: boolean; rulesApplied: boolean };
  /* Actions */
  setNotificationPanelOpen: (open: boolean) => void;
  toggleNotificationPanel: () => void;
  setAccountMenuOpen: (open: boolean) => void;
  toggleAccountMenu: () => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  setAuditState: (siloId: string, state: AuditState) => void;
  markContractSourceReady: () => void;
  markRulesApplied: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeSiloId: 'music-royalty',
  notificationPanelOpen: false,
  accountMenuOpen: false,
  notifications: INITIAL_NOTIFICATIONS,
  auditStateBySilo: { 'music-royalty': 'COMPLETE' },
  auditReadiness: { contractSource: false, rulesApplied: false },

  setNotificationPanelOpen: (open) =>
    set({ notificationPanelOpen: open, accountMenuOpen: false }),
  toggleNotificationPanel: () =>
    set((s) => ({
      notificationPanelOpen: !s.notificationPanelOpen,
      accountMenuOpen: false,
    })),
  setAccountMenuOpen: (open) =>
    set({ accountMenuOpen: open, notificationPanelOpen: false }),
  toggleAccountMenu: () =>
    set((s) => ({
      accountMenuOpen: !s.accountMenuOpen,
      notificationPanelOpen: false,
    })),
  markNotificationRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  markAllNotificationsRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    })),
  setAuditState: (siloId, state) =>
    set((s) => ({
      auditStateBySilo: { ...s.auditStateBySilo, [siloId]: state },
    })),
  markContractSourceReady: () =>
    set((s) => ({
      auditReadiness: { ...s.auditReadiness, contractSource: true },
    })),
  markRulesApplied: () =>
    set((s) => ({
      auditReadiness: { ...s.auditReadiness, rulesApplied: true },
    })),
}));
