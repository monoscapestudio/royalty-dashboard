import type { Finding } from '../types';

const ALL_FINDINGS_DATA: Finding[] = [
  { id: 'f-001', contract: 'SoundExchange Master #4401', billingRecord: 'INV-2026-0892', discrepancy: '$4,200', discrepancyValue: 4200, confidence: 98, status: 'New' },
  { id: 'f-002', contract: 'SoundExchange Master #4401', billingRecord: 'INV-2026-0756', discrepancy: '$3,800', discrepancyValue: 3800, confidence: 97, status: 'New' },
  { id: 'f-003', contract: 'Spotify Recoupment Agreement', billingRecord: 'INV-2026-1102', discrepancy: '$1,200', discrepancyValue: 1200, confidence: 95, status: 'Recovery' },
  { id: 'f-004', contract: 'BMI License #8827', billingRecord: 'INV-2026-0445', discrepancy: '$999', discrepancyValue: 999, confidence: 92, status: 'New' },
  { id: 'f-005', contract: 'Spotify Recoupment Agreement', billingRecord: 'INV-2026-0981', discrepancy: '$980', discrepancyValue: 980, confidence: 91, status: 'Dismissed' },
];

export const ALL_FINDINGS: Finding[] = ALL_FINDINGS_DATA;

const COMPUTED_TOTAL = ALL_FINDINGS.reduce((sum, f) => sum + f.discrepancyValue, 0);

export const MOCK_AUDIT_RESULT = {
  completedAt: 'April 21, 2026 at 14:32 UTC',
  duration: '8 minutes',
  recordsProcessed: 1_412_308,
  findings: ALL_FINDINGS,
  totalValue: COMPUTED_TOTAL,
  totalValueFormatted: '$' + (COMPUTED_TOTAL / 1_000_000).toFixed(2) + 'M',
  findingsCount: ALL_FINDINGS.length,
  coverage: 96,
  maxConfidence: 98,
};

