import { useEffect, useMemo, useRef, useState } from 'react';
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
      <div className={styles.rowTop}>
        <span className={`${styles.ruleText} ${inactive ? styles.ruleTextInactive : ''}`}>
          {rule.text}
        </span>
        <RuleBadge kind="status" value={rule.status} />
      </div>
      <div className={styles.rowMeta}>
        <RuleBadge kind="source" value={rule.source} />
        <span className={styles.metaDot}>·</span>
        <span className={styles.lastModified}>{rule.lastModified}</span>
      </div>
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
    <>
      <div className={styles.groupHeader}>
        <span className={styles.groupLabel}>{label}</span>
        <span className={styles.groupCount}>{rules.length}</span>
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

function FilterSelect({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: 'all' | RuleSource;
  onChange: (value: 'all' | RuleSource) => void;
  options: { value: 'all' | RuleSource; label: string }[];
  ariaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find((option) => option.value === value)?.label ?? options[0].label;

  return (
    <div className={styles.filterSelectWrap} ref={containerRef}>
      <button
        type="button"
        className={`${styles.filterTrigger} ${open ? styles.filterTriggerOpen : ''}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        <span className={styles.filterValue}>{selectedLabel}</span>
        <span className={styles.filterChevron}>▼</span>
      </button>

      {open && (
        <div className={styles.filterMenu} role="listbox">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`${styles.filterOption} ${option.value === value ? styles.filterOptionSelected : ''}`}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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
  const filterLabel = useMemo(
    () => FILTER_OPTIONS.find((opt) => opt.value === filter)?.label ?? 'All Sources',
    [filter]
  );

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
          <span className={styles.filterLabel}>Filter</span>
          <FilterSelect
            value={filter}
            onChange={onFilterChange}
            options={FILTER_OPTIONS}
            ariaLabel="Filter current rules by source"
          />
        </div>
      </div>

      <RuleGroup label="Library Rules" rules={library} onToggle={onToggle} onDuplicate={onDuplicate} onEdit={onEdit} onRemove={onRemove} />
      <RuleGroup label="User-Defined Rules" rules={user} onToggle={onToggle} onDuplicate={onDuplicate} onEdit={onEdit} onRemove={onRemove} />
      <RuleGroup label="AI-Approved Rules" rules={ai} onToggle={onToggle} onDuplicate={onDuplicate} onEdit={onEdit} onRemove={onRemove} />
    </div>
  );
}
