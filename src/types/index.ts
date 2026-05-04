export interface Silo {
  id: string;
  name: string;
  configured: boolean;
  sources?: number;
  rules?: number;
  lastAudit?: string;
}

export type ConnectionStatus = 'live' | 'fix' | 'pending' | 'inactive' | 'never-connected';

export type ConnectionType = 'API' | 'OAuth' | 'Folder';

export type SourceCategory = 'contracts' | 'billing' | 'recovery';

export interface DataSource {
  id: string;
  name: string;
  type: ConnectionType;
  status: ConnectionStatus;
  lastSync: string;
  category: SourceCategory;
}

/* ── Rules ── */
export type RuleSource = 'Library' | 'User' | 'AI';
export type RuleStatus = 'Active' | 'Inactive';

export interface Rule {
  id: string;
  text: string;
  source: RuleSource;
  status: RuleStatus;
  lastModified: string;
}

export interface AiSuggestion {
  id: string;
  text: string;
  confidence: number;
  affectedRecords: string;
}

/* ── Audit ── */
export type AuditState = 'NOT_YET_RUN' | 'RUNNING' | 'COMPLETE' | 'FAILED' | 'STOPPED';

export type FindingStatus = 'New' | 'Recovery' | 'Recovered' | 'Dismissed' | 'Disputed';

export interface Finding {
  id: string;
  contract: string;
  billingRecord: string;
  discrepancy: string;
  discrepancyValue: number;
  confidence: number;
  status: FindingStatus;
}

export interface AuditResult {
  completedAt: string;
  duration: string;
  recordsProcessed: number;
  findings: Finding[];
  totalValue: string;
  coverage: number;
  maxConfidence: number;
}

export type ConnectionModalType =
  | 'connection-type-selector'
  | 'add-api'
  | 'add-oauth'
  | 'add-folder'
  | 'configure'
  | 'request-integration'
  | null;

export interface SubHeaderStats {
  connectsLabel: string;
  connectsValue: string;
  connectsValueColor?: 'green' | 'red' | 'amber' | 'default';
  rulesLabel: string;
  rulesValue: string;
  rulesValueColor?: 'green' | 'red' | 'amber' | 'default';
  auditLabel: string;
  auditValue: string;
  auditValueColor?: 'green' | 'red' | 'amber' | 'default';
}
