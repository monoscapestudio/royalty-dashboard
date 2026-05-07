import type { Finding, FindingStatus } from '../types';

/* The 9 visible findings from the Figma wireframe */
const SEED_FINDINGS: Finding[] = [
  { id: 'f-001', contract: 'SoundExchange Master #4401', billingRecord: 'INV-2026-0892', discrepancy: '$4,200', discrepancyValue: 4200, confidence: 98, status: 'New' },
  { id: 'f-002', contract: 'SoundExchange Master #4401', billingRecord: 'INV-2026-0756', discrepancy: '$3,800', discrepancyValue: 3800, confidence: 97, status: 'New' },
  { id: 'f-003', contract: 'Spotify Recoupment Agreement', billingRecord: 'INV-2026-1102', discrepancy: '$1,200', discrepancyValue: 1200, confidence: 95, status: 'Recovery' },
  { id: 'f-004', contract: 'BMI License #8827', billingRecord: 'INV-2026-0445', discrepancy: '$999', discrepancyValue: 999, confidence: 92, status: 'New' },
  { id: 'f-005', contract: 'Spotify Recoupment Agreement', billingRecord: 'INV-2026-0981', discrepancy: '$980', discrepancyValue: 980, confidence: 91, status: 'Dismissed' },
  { id: 'f-006', contract: 'SoundExchange Master #4401', billingRecord: 'INV-2026-0667', discrepancy: '$500', discrepancyValue: 500, confidence: 88, status: 'Recovered' },
  { id: 'f-007', contract: 'BMI License #8827', billingRecord: 'INV-2026-0334', discrepancy: '$450', discrepancyValue: 450, confidence: 86, status: 'New' },
  { id: 'f-008', contract: 'Spotify Recoupment Agreement', billingRecord: 'INV-2026-0225', discrepancy: '$120', discrepancyValue: 120, confidence: 78, status: 'Disputed' },
  { id: 'f-009', contract: 'SoundExchange Master #4401', billingRecord: 'INV-2026-0118', discrepancy: '$5', discrepancyValue: 5, confidence: 72, status: 'New' },
];

const CONTRACTS = [
  'SoundExchange Master #4401',
  'SoundExchange Master #4402',
  'Spotify Recoupment Agreement',
  'BMI License #8827',
  'BMI License #8828',
  'ASCAP Distribution Agreement',
  'Warner Music Publishing Contract',
  'Universal Publishing License',
  'Sony ATV Master Agreement',
];

const STATUSES: FindingStatus[] = ['New', 'New', 'New', 'New', 'Recovery', 'Recovered', 'Dismissed', 'Disputed'];

function fmt(n: number): string {
  return '$' + n.toLocaleString('en-US');
}

/* Generate 1,381 additional findings to reach 1,390 total */
const EXTRA_FINDINGS: Finding[] = Array.from({ length: 1381 }, (_, i) => {
  const idx = i + 10;
  const contract = CONTRACTS[idx % CONTRACTS.length];
  const inv = `INV-2026-${String(1000 + idx).padStart(4, '0')}`;
  const discVal = Math.max(1, Math.round(4500 - idx * 3.2 + Math.sin(idx) * 200));
  const conf = Math.max(60, Math.min(99, 98 - Math.floor(idx / 20)));
  const status: FindingStatus = STATUSES[idx % STATUSES.length];
  return {
    id: `f-${String(idx).padStart(4, '0')}`,
    contract,
    billingRecord: inv,
    discrepancy: fmt(discVal),
    discrepancyValue: discVal,
    confidence: conf,
    status,
  };
});

export const ALL_FINDINGS: Finding[] = [...SEED_FINDINGS, ...EXTRA_FINDINGS];

export const MOCK_AUDIT_RESULT = {
  completedAt: 'April 21, 2026 at 14:32 UTC',
  duration: '8 minutes',
  recordsProcessed: 1_412_308,
  findings: ALL_FINDINGS,
  totalValue: '$12,450,000',
  coverage: 96,
  maxConfidence: 98,
};

