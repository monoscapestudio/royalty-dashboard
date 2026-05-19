import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAppStore } from '../../store/app';
import type { Rule, AiSuggestion, RuleSource } from '../../types';
import {
  mockRulesBySilo,
  mockAiSuggestionsBySilo,
  ALL_LIBRARY_RULES,
} from '../../data/mockRules';
import AddRulesSection from './components/AddRulesSection';
import AiSuggestionsSection from './components/AiSuggestionsSection';
import AiSuggestionsPanel from './components/AiSuggestionsPanel';
import CurrentRulesTable from './components/CurrentRulesTable';
import RulesEmptyState from './RulesEmptyState';
import RuleEditModal from './modals/RuleEditModal';
import RuleEditImplicationsModal from './modals/RuleEditImplicationsModal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import styles from './RulesPage.module.css';

let _newId = 4000;

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
  const [pendingUpdate, setPendingUpdate] = useState<Rule | null>(null);
  const [showImplications, setShowImplications] = useState(false);

  /* ── AI review flow ── */
  const [aiReviewMode, setAiReviewMode] = useState(false);
  const [currentRulesFilter, setCurrentRulesFilter] = useState<'all' | RuleSource>('all');
  const currentRulesRef = useRef<HTMLDivElement | null>(null);

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
    currentRulesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <h1 className={styles.pageTitle}>Rules</h1>
        <span className={styles.pageSubtitle}>
          {aiReviewMode
            ? 'Review AI-identified rules and decide what joins the active rule set.'
            : firstAuditMode
            ? 'Step 2 of 2: load or add rules so AuditGraph knows what to check.'
            : isEmpty
            ? 'Define what the audit looks for.'
            : 'Define what the audit looks for. Add rules, review AI suggestions, manage your rule set.'}
        </span>
        </div>
      </div>

      <div className={styles.content}>
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
          <>
            {/* Apply Rules panel */}
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <span className={styles.panelTitle}>Apply Rules</span>
              </div>
              <div className={styles.panelBody}>
                <AddRulesSection
                  showLibraryBanner={libraryRules.length > 0}
                  siloLabel={siloLabel}
                  libraryCount={libraryRules.length}
                  existingRules={rules}
                  onAddRule={handleAddRule}
                  onReviewLibrary={handleReviewLibrary}
                  onLoadLibrary={handleLoadLibrary}
                />
                <AiSuggestionsSection
                  suggestions={suggestions}
                  onReview={() => setAiReviewMode(true)}
                />
              </div>
            </div>

            {/* Current Rules panel */}
            <div className={styles.panel} ref={currentRulesRef}>
              <div className={styles.panelHeader}>
                <span className={styles.panelTitle}>Current Rules</span>
                <span className={styles.panelCount}>{rules.length} rule{rules.length !== 1 ? 's' : ''}</span>
              </div>
              <CurrentRulesTable
                rules={rules}
                onToggle={handleToggle}
                onDuplicate={handleDuplicate}
                onEdit={handleEdit}
                onRemove={(r) => setRulePendingDelete(r)}
                filter={currentRulesFilter}
                onFilterChange={setCurrentRulesFilter}
              />
            </div>
          </>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className={styles.toast}>{toast}</div>
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
