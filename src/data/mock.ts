import type { DataSource, SubHeaderStats } from '../types';
import { mockRulesPopulated } from './mockRules';

export const mockSources: Record<string, DataSource[]> = {
  'music-royalty': [
    {
      id: 'src-1',
      name: 'SoundExchange',
      type: 'API',
      status: 'live',
      lastSync: '2 min ago',
      category: 'contracts',
    },
    {
      id: 'src-2',
      name: 'Google Drive (Contracts)',
      type: 'Folder',
      status: 'fix',
      lastSync: 'Failed',
      category: 'contracts',
    },
    {
      id: 'src-3',
      name: 'QuickBooks',
      type: 'OAuth',
      status: 'live',
      lastSync: '5 min ago',
      category: 'billing',
    },
    {
      id: 'src-4',
      name: 'Spotify Royalty Portal',
      type: 'API',
      status: 'live',
      lastSync: '12 min ago',
      category: 'billing',
    },
    {
      id: 'src-5',
      name: 'NetSuite',
      type: 'OAuth',
      status: 'pending',
      lastSync: '—',
      category: 'billing',
    },
    {
      id: 'src-6',
      name: 'Gmail',
      type: 'OAuth',
      status: 'live',
      lastSync: 'Connected',
      category: 'recovery',
    },
  ],
  'healthcare-claims': [],
  'logistics-freight': [],
  'fintech-ip': [],
};

const musicSources = mockSources['music-royalty'] ?? [];
const musicLive = musicSources.filter((s) => s.status === 'live').length;
const musicActiveRules = mockRulesPopulated.filter((r) => r.status === 'Active').length;

export const mockSubHeaderStats: Record<string, SubHeaderStats> = {
  'music-royalty': {
    connectsLabel: 'Connects:',
    connectsValue: `${musicLive} live`,
    connectsValueColor: 'green',
    rulesLabel: 'Rules:',
    rulesValue: `${musicActiveRules} active`,
    rulesValueColor: 'default',
    auditLabel: 'Audit:',
    auditValue: 'Ready',
    auditValueColor: 'green',
  },
  'healthcare-claims': {
    connectsLabel: 'Connects:',
    connectsValue: 'Not configured',
    connectsValueColor: 'amber',
    rulesLabel: 'Rules:',
    rulesValue: '0 active',
    rulesValueColor: 'amber',
    auditLabel: 'Audit:',
    auditValue: 'Not ready',
    auditValueColor: 'amber',
  },
  'logistics-freight': {
    connectsLabel: 'Connects:',
    connectsValue: 'Not configured',
    connectsValueColor: 'amber',
    rulesLabel: 'Rules:',
    rulesValue: '0 active',
    rulesValueColor: 'amber',
    auditLabel: 'Audit:',
    auditValue: 'Not ready',
    auditValueColor: 'amber',
  },
  'fintech-ip': {
    connectsLabel: 'Connects:',
    connectsValue: 'Not configured',
    connectsValueColor: 'amber',
    rulesLabel: 'Rules:',
    rulesValue: '0 active',
    rulesValueColor: 'amber',
    auditLabel: 'Audit:',
    auditValue: 'Not ready',
    auditValueColor: 'amber',
  },
};
