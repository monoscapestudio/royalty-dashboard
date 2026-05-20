import { useState } from 'react';
import type { Rule, RuleSource } from '../../../types';
import FormSelect from '../../../components/ui/FormSelect';
import RuleBadge from './RuleBadge';
import styles from './CurrentRulesTable.module.css';

const VISIBLE_PER_GROUP = 3;

function formatLastModified(value: string): string {
  if (value === 'Just now') return 'Just now';
  if (/ago$/i.test(value)) return value;
  return value;
}

function overflowGroupLabel(label: string): string {
  return label.replace(/\s+rules$/i, '').toLowerCase();
}

interface Props {
  rules: Rule[];
  onToggle: (id: string) => void;
  onDuplicate: (rule: Rule) => void;
  onEdit: (rule: Rule) => void;
  onRemove: (rule: Rule) => void;
  filter: 'all' | RuleSource;
  onFilterChange: (filter: 'all' | RuleSource) => void;
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
      <span className={`${styles.ruleText} ${inactive ? styles.ruleTextInactive : ''}`} title={rule.text}>
        {rule.text}
      </span>
      <RuleBadge kind="status" value={rule.status} />
      <RuleBadge kind="source" value={rule.source} />
      <span className={styles.lastModified}>{formatLastModified(rule.lastModified)}</span>
      <div className={styles.actions}>
        {rule.source !== 'Library' && (
          <button className={styles.actionBtn} onClick={() => onEdit(rule)}>
            Edit
          </button>
        )}
        <button className={styles.actionBtn} onClick={() => onToggle(rule.id)}>
          Toggle
        </button>
        {rule.source === 'Library' ? (
          <button className={styles.actionBtn} onClick={() => onDuplicate(rule)}>
            Duplicate
          </button>
        ) : (
          <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`} onClick={() => onRemove(rule)}>
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
    <div className={styles.groupContainer}>
      <div className={styles.groupHeader}>
        <span className={styles.groupLabel}>{label}</span>
        <span className={styles.groupCount}>{rules.length}</span>
      </div>
      <div className={styles.list}>
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
            <span className={styles.overflowText}>... {overflow} more {overflowGroupLabel(label)}</span>
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
      </div>
    </div>
  );
}

const FILTER_OPTIONS: { value: 'all' | RuleSource; label: string }[] = [
  { value: 'all', label: 'All sources' },
  { value: 'Library', label: 'Library' },
  { value: 'User', label: 'User-defined' },
  { value: 'AI', label: 'AI-approved' },
];

export default function CurrentRulesTable({
  rules,
  onToggle,
  onDuplicate,
  onEdit,
  onRemove,
  filter,
  onFilterChange,
}: Props) {
  const filtered = filter === 'all' ? rules : rules.filter((r) => r.source === filter);

  const library = filtered.filter((r) => r.source === 'Library');
  const user = filtered.filter((r) => r.source === 'User');
  const ai = filtered.filter((r) => r.source === 'AI');

  return (
    <div className={styles.section}>
      <div className={styles.utilityBar}>
        <div className={styles.sectionMeta}>
          <span className={styles.metaValue}>{filtered.length}</span>
          <span className={styles.metaLabel}>
            visible {filtered.length === 1 ? 'rule' : 'rules'}
          </span>
          <span className={styles.metaDivider}>/</span>
          <span>{rules.length} total</span>
        </div>
        <div className={styles.filterGroup}>
          <FormSelect
            value={filter}
            onChange={(v) => onFilterChange(v as 'all' | RuleSource)}
            options={FILTER_OPTIONS}
            className={styles.filterSelect}
          />
        </div>
      </div>

      <RuleGroup label="Library Rules" rules={library} onToggle={onToggle} onDuplicate={onDuplicate} onEdit={onEdit} onRemove={onRemove} />
      <RuleGroup label="User-Defined Rules" rules={user} onToggle={onToggle} onDuplicate={onDuplicate} onEdit={onEdit} onRemove={onRemove} />
      <RuleGroup label="AI-Approved Rules" rules={ai} onToggle={onToggle} onDuplicate={onDuplicate} onEdit={onEdit} onRemove={onRemove} />
    </div>
  );
}
