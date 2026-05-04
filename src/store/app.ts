import { create } from 'zustand';
import type { Silo, AuditState, AuditResult, SourceCategory } from '../types';

export interface OnboardingSource {
  id: string;
  name: string;
  type: string;
  category: SourceCategory;
}

export interface OnboardingData {
  orgName: string;
  userName: string;
  userRole: 'cfo' | 'revops' | 'other';
  selectedSilo: string;
  connectedSources: OnboardingSource[];
  syncComplete: boolean;
  rulesReviewed: boolean;
  firstAuditRun: boolean;
}

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

const SILOS: Silo[] = [
  {
    id: 'music-royalty',
    name: 'Music & Royalty',
    configured: true,
    sources: 6,
    rules: 321,
    lastAudit: '2 min ago',
  },
  { id: 'healthcare-claims', name: 'Healthcare & Claims', configured: false },
  { id: 'logistics-freight', name: 'Logistics & Freight', configured: false },
  { id: 'fintech-ip', name: 'Fintech & IP', configured: false },
];

const DEFAULT_ONBOARDING_DATA: OnboardingData = {
  orgName: '',
  userName: '',
  userRole: 'cfo',
  selectedSilo: 'music-royalty',
  connectedSources: [
    { id: 'se-1', name: 'SoundExchange', type: 'API', category: 'contracts' },
  ],
  syncComplete: false,
  rulesReviewed: false,
  firstAuditRun: false,
};

interface AppState {
  activeSiloId: string;
  silos: Silo[];
  siloSelectorOpen: boolean;
  siloSwitching: boolean;
  siloSwitchTargetName: string;
  notificationPanelOpen: boolean;
  accountMenuOpen: boolean;
  notifications: AppNotification[];
  /* Audit state machine — per silo */
  auditStateBySilo: Record<string, AuditState>;
  auditResultBySilo: Record<string, AuditResult | null>;
  /* Onboarding */
  onboardingStep: number;
  onboardingData: OnboardingData;
  /* Actions */
  setSilo: (id: string) => void;
  setSiloSelectorOpen: (open: boolean) => void;
  toggleSiloSelector: () => void;
  setSiloSwitching: (switching: boolean) => void;
  setNotificationPanelOpen: (open: boolean) => void;
  toggleNotificationPanel: () => void;
  setAccountMenuOpen: (open: boolean) => void;
  toggleAccountMenu: () => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  setAuditState: (siloId: string, state: AuditState) => void;
  setAuditResult: (siloId: string, result: AuditResult | null) => void;
  setOnboardingStep: (step: number) => void;
  updateOnboardingData: (partial: Partial<OnboardingData>) => void;
  /** Dev/demo: rewind onboarding wizard and block dashboard until completion */
  resetOnboardingDemo: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeSiloId: 'music-royalty',
  silos: SILOS,
  siloSelectorOpen: false,
  siloSwitching: false,
  siloSwitchTargetName: '',
  notificationPanelOpen: false,
  accountMenuOpen: false,
  notifications: INITIAL_NOTIFICATIONS,
  /* music-royalty starts as COMPLETE (has existing audit) */
  auditStateBySilo: { 'music-royalty': 'COMPLETE' },
  auditResultBySilo: { 'music-royalty': null },
  /* Onboarding — firstAuditRun=false until step 6/7 complete; RootRedirect sends here first */
  onboardingStep: 1,
  onboardingData: DEFAULT_ONBOARDING_DATA,

  setSilo: (id) =>
    set((s) => ({
      activeSiloId: id,
      siloSelectorOpen: false,
      siloSwitching: id !== s.activeSiloId,
      siloSwitchTargetName: SILOS.find((sl) => sl.id === id)?.name ?? '',
    })),
  setSiloSelectorOpen: (open) => set({ siloSelectorOpen: open }),
  toggleSiloSelector: () =>
    set((s) => ({
      siloSelectorOpen: !s.siloSelectorOpen,
      notificationPanelOpen: false,
      accountMenuOpen: false,
    })),
  setSiloSwitching: (switching) => set({ siloSwitching: switching }),
  setNotificationPanelOpen: (open) =>
    set({ notificationPanelOpen: open, accountMenuOpen: false, siloSelectorOpen: false }),
  toggleNotificationPanel: () =>
    set((s) => ({
      notificationPanelOpen: !s.notificationPanelOpen,
      accountMenuOpen: false,
      siloSelectorOpen: false,
    })),
  setAccountMenuOpen: (open) =>
    set({ accountMenuOpen: open, notificationPanelOpen: false, siloSelectorOpen: false }),
  toggleAccountMenu: () =>
    set((s) => ({
      accountMenuOpen: !s.accountMenuOpen,
      notificationPanelOpen: false,
      siloSelectorOpen: false,
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
  setAuditResult: (siloId, result) =>
    set((s) => ({
      auditResultBySilo: { ...s.auditResultBySilo, [siloId]: result },
    })),
  setOnboardingStep: (step) => set({ onboardingStep: step }),
  updateOnboardingData: (partial) =>
    set((s) => ({
      onboardingData: { ...s.onboardingData, ...partial },
    })),
  resetOnboardingDemo: () =>
    set({
      onboardingStep: 1,
      onboardingData: {
        ...DEFAULT_ONBOARDING_DATA,
        connectedSources: DEFAULT_ONBOARDING_DATA.connectedSources.map((s) => ({ ...s })),
      },
      notificationPanelOpen: false,
      accountMenuOpen: false,
      siloSelectorOpen: false,
    }),
}));

export const useActiveSilo = (): Silo => {
  const activeSiloId = useAppStore((s) => s.activeSiloId);
  const silos = useAppStore((s) => s.silos);
  return silos.find((s) => s.id === activeSiloId)!;
};
