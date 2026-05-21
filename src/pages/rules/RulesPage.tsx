import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Idea, ChevronLeft, ChevronRight } from '@carbon/icons-react';
import { useAppStore } from '../../store/app';
import type { Rule, AiSuggestion, RuleSource } from '../../types';
import {
  mockRulesBySilo,
  mockAiSuggestionsBySilo,
  ALL_LIBRARY_RULES,
} from '../../data/mockRules';
import AddRulesSection from './components/AddRulesSection';
import AiSuggestionsPanel from './components/AiSuggestionsPanel';
import CurrentRulesTable from './components/CurrentRulesTable';
import RulesEmptyState from './RulesEmptyState';
import RuleEditModal from './modals/RuleEditModal';
import RuleEditImplicationsModal from './modals/RuleEditImplicationsModal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import FormSelect from '../../components/ui/FormSelect';
import styles from './RulesPage.module.css';

let _newId = 4000;

const CURRENT_RULES_FILTER_OPTIONS: { value: 'all' | RuleSource; label: string }[] = [
  { value: 'all', label: 'All sources' },
  { value: 'Library', label: 'Library' },
  { value: 'User', label: 'User-defined' },
  { value: 'AI', label: 'AI-approved' },
];

const TIPS = [
  'Define what the audit looks for. Add rules, review AI suggestions, manage your rule set.',
  'Rules are evaluated against every row of your billing data to find anomalies.',
  'AI continually suggests new rules based on patterns it detects in your sources.',
  'Industry libraries provide a strong foundation for your initial rule set.'
];

export default function RulesPage() {
  const activeSiloId = useAppStore((s) => s.activeSiloId);
  const [searchParams] = useSearchParams();
  const firstAuditMode = searchParams.get('first-audit') === '1';
  const setRulesApplied = useAppStore((s) => s.setRulesApplied);

  const [rules, setRules] = useState<Rule[]>(() => (firstAuditMode ? [] : mockRulesBySilo[activeSiloId] ?? []));
  const [suggestions, setSuggestions] = useState<AiSuggestion[]>(
    () => (firstAuditMode ? [] : mockAiSuggestionsBySilo[activeSiloId] ?? [])
  );

  /* ── Edit modal state ── */
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [editingSuggestion, setEditingSuggestion] = useState<AiSuggestion | null>(null);
  const [pendingUpdate, setPendingUpdate] = useState<Rule | null>(null);
  const [showImplications, setShowImplications] = useState(false);

  /* ── AI review flow ── */
  const [aiReviewMode, setAiReviewMode] = useState(false);
  const [currentRulesFilter, setCurrentRulesFilter] = useState<'all' | RuleSource>('all');
  const currentRulesPanelRef = useRef<HTMLDivElement | null>(null);

  /* ── Toast ── */
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [rulePendingDelete, setRulePendingDelete] = useState<Rule | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    setRules(firstAuditMode ? [] : mockRulesBySilo[activeSiloId] ?? []);
    setSuggestions(firstAuditMode ? [] : mockAiSuggestionsBySilo[activeSiloId] ?? []);
    setAiReviewMode(false);
    setCurrentRulesFilter('all');
  }, [activeSiloId, firstAuditMode]);

  const isEmpty = rules.length === 0;

  /* ── Tip Carousel ── */
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    if (firstAuditMode) return;
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % TIPS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [firstAuditMode]);

  const nextTip = () => setCurrentTip((prev) => (prev + 1) % TIPS.length);
  const prevTip = () => setCurrentTip((prev) => (prev - 1 + TIPS.length) % TIPS.length);

  /* ── Actions ── */
  const handleAddRule = (rule: Rule) => {
    setRulesApplied(activeSiloId, true);
    setRules((prev) => {
      const hasUser = prev.some((r) => r.source === 'User');
      if (hasUser) return [...prev, rule];
      /* Insert before AI rules */
      const aiIdx = prev.findIndex((r) => r.source === 'AI');
      if (aiIdx === -1) return [...prev, rule];
      return [...prev.slice(0, aiIdx), rule, ...prev.slice(aiIdx)];
    });
  };

  const handleToggle = (id: string) => {
    setRules((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: r.status === 'Active' ? 'Inactive' : 'Active' }
          : r
      )
    );
  };

  const handleDuplicate = (rule: Rule) => {
    const copy: Rule = {
      ...rule,
      id: `user-dup-${++_newId}`,
      source: 'User',
      lastModified: 'Just now',
    };
    handleAddRule(copy);
    showToast(`Rule duplicated as user-defined rule.`);
  };

  const handleRemove = (rule: Rule) => {
    setRules((prev) => {
      const next = prev.filter((r) => r.id !== rule.id);
      setRulesApplied(activeSiloId, next.length > 0);
      return next;
    });
  };

  const handleApprove = (suggestion: AiSuggestion) => {
    const newRule: Rule = {
      id: `ai-new-${++_newId}`,
      text: suggestion.text,
      source: 'AI',
      status: 'Active',
      lastModified: 'Just now',
    };
    setRulesApplied(activeSiloId, true);
    setRules((prev) => [...prev, newRule]);
  };

  const suggestionToRule = (suggestion: AiSuggestion): Rule => ({
    id: suggestion.id,
    text: suggestion.text,
    source: 'AI',
    status: 'Active',
    lastModified: 'Just now',
  });

  const handleEditSuggestion = (suggestion: AiSuggestion) => {
    setEditingSuggestion(suggestion);
  };

  const handleSaveSuggestionEdit = (updated: Rule) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === updated.id ? { ...s, text: updated.text } : s))
    );
    setEditingSuggestion(null);
    showToast('Suggestion updated.');
  };

  const handleDismissSuggestionFromEdit = (rule: Rule) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== rule.id));
    setEditingSuggestion(null);
    showToast('Suggestion dismissed.');
  };

  /* ── Edit handlers ── */
  const handleEdit = (rule: Rule) => {
    setEditingRule(rule);
  };

  const applyRuleUpdate = (updated: Rule) => {
    setRules((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const handleSaveDirect = (updated: Rule) => {
    applyRuleUpdate(updated);
    setEditingRule(null);
    showToast('Rule updated successfully.');
  };

  const handleNeedImplications = (updated: Rule) => {
    setPendingUpdate(updated);
    setShowImplications(true);
  };

  const handleEditAnyway = () => {
    if (pendingUpdate) {
      applyRuleUpdate(pendingUpdate);
      setPendingUpdate(null);
    }
    setShowImplications(false);
    setEditingRule(null);
    showToast('Rule updated. Previous audit results may need re-validation.');
  };

  const handleImplicationsCancel = () => {
    setShowImplications(false);
    setPendingUpdate(null);
    /* editingRule stays open — user returns to Rule Edit modal */
  };

  const handleLoadLibrary = () => {
    setRulesApplied(activeSiloId, true);
    setRules(ALL_LIBRARY_RULES);
  };

  const handleAddFromEmpty = (text: string) => {
    if (text.length < 5) return;
    handleAddRule({
      id: `user-empty-${++_newId}`,
      text,
      source: 'User',
      status: 'Active',
      lastModified: 'Just now',
    });
  };

  const libraryRules = rules.filter((r) => r.source === 'Library');
  const siloLabel = 'Music & Royalty';

  const handleReviewLibrary = () => {
    setCurrentRulesFilter('Library');
    currentRulesPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <div className={styles.content}>
        <div className={styles.topTipStrip}>
          <div className={styles.topTipInner}>
            <div className={styles.topTipContent}>
              <Idea size={20} className={styles.topTipIcon} />
              <span className={styles.topTipText}>
                {aiReviewMode
                  ? 'Review AI-identified rules and decide what joins the active rule set.'
                  : firstAuditMode
                  ? 'Step 2 of 2: load or add rules so AuditGraph knows what to check.'
                  : isEmpty
                  ? 'Define what the audit looks for.'
                  : TIPS[currentTip]}
              </span>
            </div>
          </div>
          {!firstAuditMode && !aiReviewMode && !isEmpty && (
            <div className={styles.topTipControls}>
              <button onClick={prevTip} className={styles.topTipBtn} aria-label="Previous tip">
                <ChevronLeft size={16} />
              </button>
              <button onClick={nextTip} className={styles.topTipBtn} aria-label="Next tip">
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {firstAuditMode && rules.length > 0 && (
          <div className={styles.stepCompleteBanner}>
            <span className={styles.stepCompleteCheck}>✓</span>
            <div className={styles.stepCompleteText}>
              <strong>Step 2 complete.</strong> {rules.length} rule{rules.length !== 1 ? 's' : ''} applied.
              You can fine-tune your rules, or run your first audit now.
            </div>
            <Link to="/app/audit" className={styles.stepCompleteBtn}>
              Run your first audit →
            </Link>
          </div>
        )}

        {aiReviewMode ? (
          <AiSuggestionsPanel
            suggestions={suggestions}
            onApprove={handleApprove}
            onDismiss={(id) => setSuggestions((prev) => prev.filter((s) => s.id !== id))}
            onEdit={handleEditSuggestion}
            onClose={() => setAiReviewMode(false)}
            mode="page"
          />
        ) : isEmpty ? (
          <RulesEmptyState
            siloLabel={siloLabel}
            libraryCount={134}
            onLoadLibrary={handleLoadLibrary}
            onAddRule={handleAddFromEmpty}
          />
        ) : (
          <div className={styles.columns}>
            {/* Apply Rules panel */}
            <div className={`${styles.panel} ${styles.panelLeft}`}>
              <div className={styles.panelHeader}>
                <span className={styles.panelTitle}>Apply Rules</span>
              </div>
              <div className={styles.panelBody}>
                <AddRulesSection
                  showLibraryBanner={libraryRules.length > 0}
                  siloLabel={siloLabel}
                  libraryCount={libraryRules.length}
                  existingRules={rules}
                  suggestions={suggestions}
                  onAddRule={handleAddRule}
                  onReviewLibrary={handleReviewLibrary}
                  onLoadLibrary={handleLoadLibrary}
                  onReviewSuggestions={() => setAiReviewMode(true)}
                />
              </div>
            </div>

            {/* Current Rules panel */}
            <div className={`${styles.panel} ${styles.panelRight}`} ref={currentRulesPanelRef}>
              <div className={styles.panelHeader}>
                <span className={styles.panelTitle}>Current Rules</span>
                <FormSelect
                  value={currentRulesFilter}
                  onChange={(v) => setCurrentRulesFilter(v as 'all' | RuleSource)}
                  options={CURRENT_RULES_FILTER_OPTIONS}
                  className={styles.panelFilterSelect}
                />
              </div>
              <div className={styles.panelScroll}>
                <CurrentRulesTable
                  rules={rules}
                  onToggle={handleToggle}
                  onDuplicate={handleDuplicate}
                  onEdit={handleEdit}
                  onRemove={(r) => setRulePendingDelete(r)}
                  filter={currentRulesFilter}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className={styles.toast}>{toast}</div>
      )}

      {/* AI suggestion edit modal */}
      {editingSuggestion && (
        <RuleEditModal
          rule={suggestionToRule(editingSuggestion)}
          isSuggestion
          onSave={handleSaveSuggestionEdit}
          onDelete={handleDismissSuggestionFromEdit}
          onClose={() => setEditingSuggestion(null)}
          onNeedImplications={handleSaveSuggestionEdit}
        />
      )}

      {/* Rule Edit modal */}
      {editingRule && !showImplications && (
        <RuleEditModal
          rule={editingRule}
          onSave={handleSaveDirect}
          onDelete={handleRemove}
          onClose={() => setEditingRule(null)}
          onNeedImplications={handleNeedImplications}
        />
      )}

      {/* Rule Edit Implications modal (stacks on top of dimmed Rule Edit modal) */}
      {editingRule && showImplications && (
        <>
          {/* Dimmed Rule Edit modal beneath */}
          <RuleEditModal
            rule={editingRule}
            onSave={handleSaveDirect}
            onDelete={handleRemove}
            onClose={() => { setShowImplications(false); setEditingRule(null); }}
            onNeedImplications={handleNeedImplications}
          />
          <RuleEditImplicationsModal
            rule={pendingUpdate ?? editingRule}
            onEditAnyway={handleEditAnyway}
            onCancel={handleImplicationsCancel}
          />
        </>
      )}

      {rulePendingDelete && (
        <ConfirmDialog
          title="Delete rule"
          warningTitle="This action cannot be undone."
          warningBody="Deleting this rule will remove it from your active rule set. Previous audits that used this rule may need re-validation."
          meta={[
            {
              key: 'Rule',
              value:
                rulePendingDelete.text.length > 90
                  ? `${rulePendingDelete.text.slice(0, 87)}…`
                  : rulePendingDelete.text,
            },
            { key: 'Source', value: rulePendingDelete.source },
          ]}
          confirmLabel="Delete"
          variant="danger"
          onConfirm={() => {
            handleRemove(rulePendingDelete);
            showToast('Rule deleted.');
          }}
          onClose={() => setRulePendingDelete(null)}
        />
      )}
    </>
  );
}
