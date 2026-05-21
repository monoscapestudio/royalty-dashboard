import type { Finding, FindingStatus } from '../types';

const CONTRACTS = [
  'SoundExchange Master #4401',
  'Spotify Recoupment Agreement',
  'Universal Music Publishing #3390',
  'BMI License #8827',
  'Sony ATV Sync #1190',
  'ASCAP Performance #7744',
  'Warner Chappell Sync #2210',
];

const STATUS_DIST: FindingStatus[] = [
  'New', 'New', 'New', 'New', 'New', 'New', 'New', 'New',
  'Recovery', 'Recovery', 'Recovery',
  'Dismissed', 'Dismissed',
  'Disputed',
];

function seededRng(seed: number) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647; };
}

function generateFindings(count: number): Finding[] {
  const rng = seededRng(42);
  const findings: Finding[] = [];

  const topValue = 218_400;
  const decay = 0.965;

  for (let i = 0; i < count; i++) {
    const idx = String(i + 1).padStart(3, '0');
    const contract = CONTRACTS[Math.floor(rng() * CONTRACTS.length)];
    const invNum = String(Math.floor(rng() * 9000 + 1000));

    const baseValue = Math.round(topValue * Math.pow(decay, i));
    const jitter = 1 + (rng() - 0.5) * 0.15;
    const value = Math.max(800, Math.round(baseValue * jitter / 100) * 100);

    const confidence = Math.max(62, Math.min(98, Math.round(98 - i * 0.24 - rng() * 3)));
    const status = STATUS_DIST[Math.floor(rng() * STATUS_DIST.length)];

    findings.push({
      id: `f-${idx}`,
      contract,
      billingRecord: `INV-2026-${invNum}`,
      discrepancy: '$' + value.toLocaleString('en-US'),
      discrepancyValue: value,
      confidence,
      status,
    });
  }

  findings.sort((a, b) => b.discrepancyValue - a.discrepancyValue);
  return findings;
}

export const ALL_FINDINGS: Finding[] = generateFindings(157);

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
  maxConfidence: Math.max(...ALL_FINDINGS.map(f => f.confidence)),
};
