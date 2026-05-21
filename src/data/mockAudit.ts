import type { Finding } from '../types';

const ALL_FINDINGS_DATA: Finding[] = [
  { id: 'f-001', contract: 'SoundExchange Master #4401', billingRecord: 'INV-2026-0892', discrepancy: '$142,000', discrepancyValue: 142000, confidence: 98, status: 'New' },
  { id: 'f-002', contract: 'SoundExchange Master #4401', billingRecord: 'INV-2026-0756', discrepancy: '$98,400', discrepancyValue: 98400, confidence: 97, status: 'New' },
  { id: 'f-003', contract: 'Spotify Recoupment Agreement', billingRecord: 'INV-2026-1102', discrepancy: '$67,200', discrepancyValue: 67200, confidence: 95, status: 'Recovery' },
  { id: 'f-004', contract: 'BMI License #8827', billingRecord: 'INV-2026-0445', discrepancy: '$34,800', discrepancyValue: 34800, confidence: 92, status: 'New' },
  { id: 'f-005', contract: 'Spotify Recoupment Agreement', billingRecord: 'INV-2026-0981', discrepancy: '$21,600', discrepancyValue: 21600, confidence: 91, status: 'Dismissed' },
  { id: 'f-006', contract: 'Warner Chappell Sync #2210', billingRecord: 'INV-2026-1340', discrepancy: '$18,900', discrepancyValue: 18900, confidence: 89, status: 'New' },
  { id: 'f-007', contract: 'ASCAP Performance #7744', billingRecord: 'INV-2026-0612', discrepancy: '$15,200', discrepancyValue: 15200, confidence: 88, status: 'New' },
  { id: 'f-008', contract: 'SoundExchange Master #4401', billingRecord: 'INV-2026-1488', discrepancy: '$12,400', discrepancyValue: 12400, confidence: 86, status: 'Recovery' },
  { id: 'f-009', contract: 'BMI License #8827', billingRecord: 'INV-2026-0933', discrepancy: '$9,800', discrepancyValue: 9800, confidence: 84, status: 'New' },
  { id: 'f-010', contract: 'Spotify Recoupment Agreement', billingRecord: 'INV-2026-1721', discrepancy: '$7,600', discrepancyValue: 7600, confidence: 82, status: 'New' },
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

