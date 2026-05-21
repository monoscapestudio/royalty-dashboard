import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Finding, FindingStatus } from '../../../types';
import FormSelect from '../../../components/ui/FormSelect';
import styles from './FindingsTable.module.css';

interface Props {
  findings: Finding[];
  onToast: (msg: string) => void;
}

function statusClass(s: FindingStatus): string {
  switch (s) {
    case 'New': return styles.statusNew;
    case 'Recovery': return styles.statusRecovery;
    case 'Recovered': return styles.statusRecovered;
    case 'Dismissed': return styles.statusDismissed;
    case 'Disputed': return styles.statusDisputed;
  }
}

/** Group labels for Contract column filtering */
function sourceBucket(contract: string): string {
  if (contract.startsWith('SoundExchange')) return 'SoundExchange';
  if (contract.startsWith('Spotify')) return 'Spotify';
  if (contract.startsWith('BMI')) return 'BMI';
  if (contract.startsWith('ASCAP')) return 'ASCAP';
  if (contract.startsWith('Warner')) return 'Warner';
  if (contract.startsWith('Universal')) return 'Universal';
  if (contract.startsWith('Sony')) return 'Sony';
  return contract.split(/\s+/)[0] ?? 'Other';
}

type ConfidenceFilter = '' | '90' | '80' | '70';
type RuleFilter = 'all' | 'recoupment' | 'licensing';

type FilterOption = {
  value: string;
  label: string;
};

function matchesRuleGroup(f: Finding, rule: RuleFilter): boolean {
  if (rule === 'all') return true;
  const t = `${f.contract} ${f.discrepancy}`.toLowerCase();
  if (rule === 'recoupment') return t.includes('recoupment');
  if (rule === 'licensing') return t.includes('license') || t.includes('master') || t.includes('publishing');
  return true;
}

export default function FindingsTable({ findings, onToast }: Props) {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('All');
  const [confidenceFilter, setConfidenceFilter] = useState<ConfidenceFilter>('');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [ruleFilter, setRuleFilter] = useState<RuleFilter>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const sourceOptions = useMemo(() => {
    const uniq = [...new Set(findings.map((f) => sourceBucket(f.contract)))];
    uniq.sort((a, b) => a.localeCompare(b));
    return ['All', ...uniq];
  }, [findings]);

  const statusOptions: FilterOption[] = [
    { value: 'All', label: 'Status: All' },
    { value: 'New', label: 'Status: New' },
    { value: 'Recovery', label: 'Status: Recovery' },
    { value: 'Recovered', label: 'Status: Recovered' },
    { value: 'Dismissed', label: 'Status: Dismissed' },
    { value: 'Disputed', label: 'Status: Disputed' },
  ];

  const confidenceOptions: FilterOption[] = [
    { value: 'all', label: 'Confidence: All' },
    { value: '90', label: 'Confidence: >= 90%' },
    { value: '80', label: 'Confidence: >= 80%' },
    { value: '70', label: 'Confidence: >= 70%' },
  ];

  const sourceFilterOptions: FilterOption[] = sourceOptions.map((source) => ({
    value: source,
    label: source === 'All' ? 'Source: All' : `Source: ${source}`,
  }));

  const ruleOptions: FilterOption[] = [
    { value: 'all', label: 'Rule: All' },
    { value: 'recoupment', label: 'Rule: Recoupment-related' },
    { value: 'licensing', label: 'Rule: Licensing / master' },
  ];

  const filtered = useMemo(() => {
    let list = findings;
    if (statusFilter !== 'All') {
      list = list.filter((f) => f.status === statusFilter);
    }
    if (confidenceFilter) {
      const min = Number(confidenceFilter);
      list = list.filter((f) => f.confidence >= min);
    }
    if (sourceFilter !== 'All') {
      list = list.filter((f) => sourceBucket(f.contract) === sourceFilter);
    }
    if (ruleFilter !== 'all') {
      list = list.filter((f) => matchesRuleGroup(f, ruleFilter));
    }
    return list;
  }, [findings, statusFilter, confidenceFilter, sourceFilter, ruleFilter]);

  /* Drop selections that vanished from filtered set */
  useEffect(() => {
    const idSet = new Set(filtered.map((f) => f.id));
    setSelectedIds((prev) => {
      let changed = false;
      const next = new Set<string>();
      prev.forEach((id) => {
        if (idSet.has(id)) next.add(id);
        else changed = true;
      });
      return changed ? next : prev;
    });
  }, [filtered]);

  const allSelected = filtered.length > 0 && filtered.every((r) => selectedIds.has(r.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filtered.forEach((r) => next.delete(r.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filtered.forEach((r) => next.add(r.id));
        return next;
      });
    }
  };

  const openFinding = (id: string) => {
    navigate(`/app/audit/finding/${id}`);
  };

  function bulkEligibleNew() {
    return [...selectedIds].filter((id) => findings.find((f) => f.id === id)?.status === 'New');
  }

  return (
    <div className={styles.tableWrap}>
      {/* Row 1: Panel Header */}
      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>Findings</span>
        <span className={styles.panelCount}>
          {filtered.length.toLocaleString()} finding{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Row 2: Utility Bar */}
      <div className={styles.utilityBar}>
        <div className={styles.sectionMeta}>
          <span className={styles.metaValue}>{filtered.length.toLocaleString()}</span>
          <span className={styles.metaLabel}>found, ranked by discrepancy size</span>
        </div>
        <div className={styles.filters}>
          <FormSelect
            value={statusFilter}
            onChange={(value) => { setStatusFilter(value); }}
            options={statusOptions}
            className={styles.filterSelect}
          />
          <FormSelect
            value={confidenceFilter || 'all'}
            onChange={(value) => {
              const v = value === 'all' ? '' : (value as ConfidenceFilter);
              setConfidenceFilter(v);
            }}
            options={confidenceOptions}
            className={styles.filterSelect}
          />
          <FormSelect
            value={sourceFilter}
            onChange={(value) => { setSourceFilter(value); }}
            options={sourceFilterOptions}
            className={styles.filterSelect}
          />
          <FormSelect
            value={ruleFilter}
            onChange={(value) => {
              setRuleFilter(value as RuleFilter);
            }}
            options={ruleOptions}
            className={styles.filterSelect}
          />
        </div>
      </div>

      {/* Glass card container */}
      <div className={styles.list}>
        {/* Bulk actions */}
        <div className={styles.bulkBar}>
          <label className={styles.selectAll}>
            <span className={styles.rowCheck}>
              <input type="checkbox" checked={allSelected} onChange={toggleAll} />
            </span>
            Select all
          </label>
          <div className={styles.bulkActions}>
            <button
              type="button"
              className={styles.bulkBtn}
              onClick={() => {
                if (selectedIds.size === 0) {
                  onToast('Select at least one finding first.');
                  return;
                }
                const eligible = bulkEligibleNew();
                if (eligible.length === 0) {
                  onToast('Bulk recovery applies to findings in New status. No matching selections.');
                  return;
                }
                onToast(`${eligible.length.toLocaleString()} recovery draft${eligible.length === 1 ? '' : 's'} queued for review (wireframe).`);
                setSelectedIds(new Set());
              }}
            >
              Send recovery
            </button>
            <button
              type="button"
              className={styles.bulkBtnSecondary}
              onClick={() => {
                if (selectedIds.size === 0) {
                  onToast('Select at least one finding first.');
                  return;
                }
                onToast(`${selectedIds.size} finding${selectedIds.size === 1 ? '' : 's'} dismissed (wireframe demo).`);
                setSelectedIds(new Set());
              }}
            >
              Dismiss
            </button>
            <button
              type="button"
              className={styles.bulkBtnSecondary}
              onClick={() => {
                onToast(`Exported ${filtered.length.toLocaleString()} rows to CSV (wireframe).`);
              }}
            >
              Export CSV
            </button>
          </div>
        </div>

        {filtered.map((row) => (
          <div
            key={row.id}
            className={`${styles.findingCard} ${selectedIds.has(row.id) ? styles.findingCardSelected : ''}`}
            onClick={() => openFinding(row.id)}
          >
            <div className={styles.cardTop}>
              <label className={styles.rowCheck} onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedIds.has(row.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    setSelectedIds((prev) => {
                      const next = new Set(prev);
                      next.has(row.id) ? next.delete(row.id) : next.add(row.id);
                      return next;
                    });
                  }}
                />
              </label>

              <span className={styles.contract} title={row.contract}>
                {row.contract}
              </span>

              <span className={styles.discrepancy}>{row.discrepancy}</span>

              <div className={styles.confidenceCell} title={`${row.confidence}% confidence`}>
                <div className={styles.confBar}>
                  <div className={styles.confFill} style={{ width: `${row.confidence}%` }} />
                </div>
                <span className={styles.confPct}>{row.confidence}%</span>
              </div>

              <span className={`${styles.statusBadge} ${statusClass(row.status)}`}>
                {row.status}
              </span>

              <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
                <button type="button" className={styles.actionLink} onClick={() => openFinding(row.id)}>
                  Audit Trail
                </button>
                {row.status === 'New' && (
                  <button
                    type="button"
                    className={styles.actionLink}
                    onClick={() => {
                      onToast('Recovery email draft opened from finding (wireframe).');
                      openFinding(row.id);
                    }}
                  >
                    Send Recovery
                  </button>
                )}
                {row.status === 'Recovery' && (
                  <button
                    type="button"
                    className={styles.actionLink}
                    onClick={() => onToast('Recovery cancelled for this finding (wireframe).')}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
