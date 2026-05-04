import type { Rule, AiSuggestion } from '../types';

export const LIBRARY_RULES_VISIBLE: Rule[] = [
  {
    id: 'lib-1',
    text: 'Recoupment rate floor: $0.005/stream minimum',
    source: 'Library',
    status: 'Active',
    lastModified: 'Library default',
  },
  {
    id: 'lib-2',
    text: 'Mechanical royalty: statutory rate compliance check',
    source: 'Library',
    status: 'Active',
    lastModified: 'Library default',
  },
  {
    id: 'lib-3',
    text: 'Performance royalty: BMI/ASCAP rate verification',
    source: 'Library',
    status: 'Inactive',
    lastModified: 'Library default',
  },
];

/* Generates a full set of 134 library rules (3 visible above + 131 generated) */
const EXTRA_LIBRARY: Rule[] = Array.from({ length: 131 }, (_, i) => ({
  id: `lib-extra-${i + 4}`,
  text: `Library rule ${i + 4}: Compliance check ${i + 4}`,
  source: 'Library' as const,
  status: 'Active' as const,
  lastModified: 'Library default',
}));

export const ALL_LIBRARY_RULES: Rule[] = [...LIBRARY_RULES_VISIBLE, ...EXTRA_LIBRARY];

export const USER_RULES_VISIBLE: Rule[] = [
  {
    id: 'user-1',
    text: 'Spotify recoupment rate must be minimum 0.005 per stream',
    source: 'User',
    status: 'Active',
    lastModified: '2 hours ago',
  },
  {
    id: 'user-2',
    text: 'SoundExchange claim rates below contract floor of $0.005/claim',
    source: 'User',
    status: 'Active',
    lastModified: '3 days ago',
  },
  {
    id: 'user-3',
    text: 'Distribution fee must not exceed 15% of gross revenue',
    source: 'User',
    status: 'Active',
    lastModified: '1 week ago',
  },
];

const EXTRA_USER: Rule[] = Array.from({ length: 9 }, (_, i) => ({
  id: `user-extra-${i + 4}`,
  text: `Custom rule ${i + 4}`,
  source: 'User' as const,
  status: 'Active' as const,
  lastModified: `${i + 2} weeks ago`,
}));

export const ALL_USER_RULES: Rule[] = [...USER_RULES_VISIBLE, ...EXTRA_USER];

export const AI_RULES: Rule[] = [
  {
    id: 'ai-1',
    text: 'Mechanical royalty rate below statutory minimum ($0.0091/unit)',
    source: 'AI',
    status: 'Active',
    lastModified: '1 day ago',
  },
  {
    id: 'ai-2',
    text: 'Sync licensing fee below contracted minimum for 3 publishers',
    source: 'AI',
    status: 'Active',
    lastModified: '1 day ago',
  },
  {
    id: 'ai-3',
    text: 'Digital distribution fee exceeds contract cap for 12 agreements',
    source: 'AI',
    status: 'Active',
    lastModified: '2 days ago',
  },
  {
    id: 'ai-4',
    text: 'Streaming royalty payment below MFN clause threshold',
    source: 'AI',
    status: 'Active',
    lastModified: '2 days ago',
  },
  {
    id: 'ai-5',
    text: 'Label recoupment calculation mismatches contract terms for 7 artists',
    source: 'AI',
    status: 'Active',
    lastModified: '3 days ago',
  },
];

export const AI_SUGGESTIONS: AiSuggestion[] = [
  {
    id: 'sug-1',
    text: 'Mechanical royalty rate appears below statutory minimum ($0.0091/unit) for 23 contracts.',
    confidence: 94,
    affectedRecords: '14,200',
  },
  {
    id: 'sug-2',
    text: 'Distribution fee percentage exceeds contract cap of 15% across 8 partner agreements.',
    confidence: 87,
    affectedRecords: '4,800',
  },
  {
    id: 'sug-3',
    text: 'Sync licensing fee below contracted minimum for 3 publishers.',
    confidence: 79,
    affectedRecords: '1,230',
  },
];

/* All populated rules for the music-royalty silo */
export const mockRulesPopulated: Rule[] = [
  ...ALL_LIBRARY_RULES,
  ...ALL_USER_RULES,
  ...AI_RULES,
];

export const mockRulesBySilo: Record<string, Rule[]> = {
  'music-royalty': mockRulesPopulated,
  'healthcare-claims': [],
  'logistics-freight': [],
  'fintech-ip': [],
};

export const mockAiSuggestionsBySilo: Record<string, AiSuggestion[]> = {
  'music-royalty': AI_SUGGESTIONS,
  'healthcare-claims': [],
  'logistics-freight': [],
  'fintech-ip': [],
};
