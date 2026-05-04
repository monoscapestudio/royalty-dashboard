import { useState } from 'react';
import type { Rule, RuleSource } from '../../../types';
import RuleBadge from './RuleBadge';
import styles from './CurrentRulesTable.module.css';

const VISIBLE_PER_GROUP = 3;

interface Props {
  rules: Rule[];
  onToggle: (id: string) => void;
  onDuplicate: (rule: Rule) => void;
  onEdit: (rule: Rule) => void;
  onRemove: (rule: Rule) => void;
}

function RuleRow({
  rule,
  onToggle,
  onDuplicate,
  onEdit,
  onRemove,
}: {
  rule: Rule;
  onToggle: (id: string) => void;
  onDuplicate: (r: Rule) => void;
  onEdit: (r: Rule) => void;
  onRemove: (r: Rule) => void;
}) {
  const inactive = rule.status === 'Inactive';
  return (
    <div className={styles.row}>
      <span className={`${styles.ruleText} ${inactive ? styles.ruleTextInactive : ''}`}>
        {rule.text}
      </span>
      <RuleBadge kind="source" value={rule.source} />
      <RuleBadge kind="status" value={rule.status} />
      <span className={styles.lastModified}>{rule.lastModified}</span>
      <div className={styles.actions}>
        {rule.source !== 'Library' && (
          <button className={`${styles.actionBtn} ${styles.actionBtnPrimary}`} onClick={() => onEdit(rule)}>
            Edit
          </button>
        )}
        <button className={`${styles.actionBtn} ${styles.actionBtnPrimary}`} onClick={() => onToggle(rule.id)}>
          Toggle
        </button>
        {rule.source === 'Library' ? (
          <button className={`${styles.actionBtn} ${styles.actionBtnMuted}`} onClick={() => onDuplicate(rule)}>
            Duplicate
          </button>
        ) : (
          <button className={`${styles.actionBtn} ${styles.actionBtnMuted}`} onClick={() => onRemove(rule)}>
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

function RuleGroup({
  label,
  rules,
  onToggle,
  onDuplicate,
  onEdit,
  onRemove,
}: {
  label: string;
  rules: Rule[];
  onToggle: (id: string) => void;
  onDuplicate: (r: Rule) => void;
  onEdit: (r: Rule) => void;
  onRemove: (r: Rule) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  if (rules.length === 0) return null;

  const visible = expanded ? rules : rules.slice(0, VISIBLE_PER_GROUP);
  const overflow = rules.length - VISIBLE_PER_GROUP;
  const hasOverflow = !expanded && overflow > 0;

  return (
    <>
      <div className={styles.groupHeader}>
        <span className={styles.groupLabel}>{label} ({rules.length})</span>
      </div>
      {visible.map((rule) => (
        <RuleRow
          key={rule.id}
          rule={rule}
          onToggle={onToggle}
          onDuplicate={onDuplicate}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      ))}
      {hasOverflow && (
        <div className={styles.overflowRow}>
          <span className={styles.overflowText}>... {overflow} more {label.toLowerCase()} rules</span>
          <button className={styles.showAllBtn} onClick={() => setExpanded(true)}>
            Show all
          </button>
        </div>
      )}
      {expanded && (
        <div className={styles.overflowRow}>
          <span />
          <button className={styles.showAllBtn} onClick={() => setExpanded(false)}>
            Collapse
          </button>
        </div>
      )}
    </>
  );
}

const FILTER_OPTIONS: { value: 'all' | RuleSource; label: string }[] = [
  { value: 'all', label: 'All Sources' },
  { value: 'Library', label: 'Library' },
  { value: 'User', label: 'User-defined' },
  { value: 'AI', label: 'AI-approved' },
];

export default function CurrentRulesTable({ rules, onToggle, onDuplicate, onEdit, onRemove }: Props) {
  const [filter, setFilter] = useState<'all' | RuleSource>('all');

  const filtered = filter === 'all' ? rules : rules.filter((r) => r.source === filter);

  const library = filtered.filter((r) => r.source === 'Library');
  const user = filtered.filter((r) => r.source === 'User');
  const ai = filtered.filter((r) => r.source === 'AI');

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>Current Rules</span>
        <div className={styles.sectionMeta}>
          <span>{rules.length} rules</span>
          <span>|</span>
          <span>Filter:</span>
          <select
            className={styles.filterSelect}
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
          >
            {FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.tableHeader}>
        <span className={styles.colHead}>Rule</span>
        <span className={styles.colHead}>Source</span>
        <span className={styles.colHead}>Status</span>
        <span className={styles.colHead}>Last Modified</span>
        <span className={styles.colHead}>Actions</span>
      </div>

      <RuleGroup label="Library Rules" rules={library} onToggle={onToggle} onDuplicate={onDuplicate} onEdit={onEdit} onRemove={onRemove} />
      <RuleGroup label="User-Defined Rules" rules={user} onToggle={onToggle} onDuplicate={onDuplicate} onEdit={onEdit} onRemove={onRemove} />
      <RuleGroup label="AI-Approved Rules" rules={ai} onToggle={onToggle} onDuplicate={onDuplicate} onEdit={onEdit} onRemove={onRemove} />
    </div>
  );
}
