import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Finding, FindingStatus } from '../../../types';
import FormSelect from '../../../components/ui/FormSelect';
import styles from './FindingsTable.module.css';

const PAGE_SIZE = 9;

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
  const [page, setPage] = useState(0);
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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const pageRows = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  /* Reset paging when slice shrinks under current page */
  useEffect(() => {
    setPage((p) => Math.min(p, Math.max(0, totalPages - 1)));
  }, [totalPages]);

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

  const allSelected = pageRows.length > 0 && pageRows.every((r) => selectedIds.has(r.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        pageRows.forEach((r) => next.delete(r.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        pageRows.forEach((r) => next.add(r.id));
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
      {/* Header row (Outside glass card) */}
      <div className={styles.tableHeader}>
        <div className={styles.tableHeaderLeft}>
          <span className={styles.tableTitle}>Findings</span>
          <span className={styles.tableMeta}>{filtered.length.toLocaleString()} found, ranked by discrepancy size</span>
        </div>
        <div className={styles.filters}>
          <FormSelect
            value={statusFilter}
            onChange={(value) => { setStatusFilter(value); setPage(0); }}
            options={statusOptions}
            className={styles.filterSelect}
          />
          <FormSelect
            value={confidenceFilter || 'all'}
            onChange={(value) => {
              const v = value === 'all' ? '' : (value as ConfidenceFilter);
              setConfidenceFilter(v);
              setPage(0);
            }}
            options={confidenceOptions}
            className={styles.filterSelect}
          />
          <FormSelect
            value={sourceFilter}
            onChange={(value) => { setSourceFilter(value); setPage(0); }}
            options={sourceFilterOptions}
            className={styles.filterSelect}
          />
          <FormSelect
            value={ruleFilter}
            onChange={(value) => {
              setRuleFilter(value as RuleFilter);
              setPage(0);
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
            <input type="checkbox" checked={allSelected} onChange={toggleAll} />
            Select all
          </label>
          <span className={styles.bulkLabel}>Bulk actions:</span>
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

        {pageRows.map((row) => (
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

              <div className={styles.cardMain}>
                <div className={styles.cardHeader}>
                  <span className={styles.contract}>{row.contract}</span>
                  <div className={styles.cardHeaderRight}>
                    <span className={styles.discrepancy}>{row.discrepancy}</span>
                    <span className={`${styles.statusBadge} ${statusClass(row.status)}`}>
                      {row.status}
                    </span>
                  </div>
                </div>

                <div className={styles.cardMeta}>
                  <span className={styles.billing}>{row.billingRecord}</span>
                  <span className={styles.metaDot}>·</span>
                  <span className={styles.source}>{sourceBucket(row.contract)}</span>
                  <span className={styles.metaDot}>·</span>
                  <div className={styles.confidenceCell}>
                    <div className={styles.confBar}>
                      <div className={styles.confFill} style={{ width: `${row.confidence}%` }} />
                    </div>
                    <span className={styles.confPct}>{row.confidence}% confidence</span>
                  </div>
                </div>

                <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
                  <button type="button" className={styles.actionLink} onClick={() => openFinding(row.id)}>
                    Audit Trail
                  </button>
                  {row.status === 'New' && (
                    <button
                      type="button"
                      className={styles.actionLinkBlue}
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
                      className={styles.actionLinkRed}
                      onClick={() => onToast('Recovery cancelled for this finding (wireframe).')}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        <span className={styles.paginationInfo}>
          Showing {pageRows.length} of {filtered.length.toLocaleString()} findings
        </span>
        <div className={styles.paginationControls}>
          <button
            type="button"
            className={styles.pageBtn}
            disabled={safePage === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            ← Previous
          </button>
          <div className={styles.pageNumbers}>
            {[0, 1, 2].map((i) => (
              <button
                type="button"
                key={i}
                className={`${styles.pageNumber} ${safePage === i ? styles.pageNumberActive : ''}`}
                onClick={() => setPage(i)}
              >
                {i + 1}
              </button>
            ))}
            {totalPages > 3 && <span className={styles.pageEllipsis}>...</span>}
            {totalPages > 3 && (
              <button
                type="button"
                className={styles.pageNumber}
                onClick={() => setPage(totalPages - 1)}
              >
                {totalPages}
              </button>
            )}
          </div>
          <button
            type="button"
            className={styles.pageBtn}
            disabled={safePage >= totalPages - 1}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
