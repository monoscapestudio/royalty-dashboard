import { useState, useEffect, useRef } from 'react';
import { useAppStore, useActiveSilo } from '../../store/app';
import type { Rule, AiSuggestion } from '../../types';
import {
  mockRulesBySilo,
  mockAiSuggestionsBySilo,
  ALL_LIBRARY_RULES,
} from '../../data/mockRules';
import AddRulesSection from './components/AddRulesSection';
import AiSuggestionsSection from './components/AiSuggestionsSection';
import CurrentRulesTable from './components/CurrentRulesTable';
import RulesEmptyState from './RulesEmptyState';
import RuleEditModal from './modals/RuleEditModal';
import RuleEditImplicationsModal from './modals/RuleEditImplicationsModal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import styles from './RulesPage.module.css';

let _newId = 4000;

export default function RulesPage() {
  const activeSiloId = useAppStore((s) => s.activeSiloId);
  const silo = useActiveSilo();

  const [rules, setRules] = useState<Rule[]>(() => mockRulesBySilo[activeSiloId] ?? []);
  const [suggestions, setSuggestions] = useState<AiSuggestion[]>(
    () => mockAiSuggestionsBySilo[activeSiloId] ?? []
  );

  /* ── Edit modal state ── */
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [pendingUpdate, setPendingUpdate] = useState<Rule | null>(null);
  const [showImplications, setShowImplications] = useState(false);

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
    setRules(mockRulesBySilo[activeSiloId] ?? []);
    setSuggestions(mockAiSuggestionsBySilo[activeSiloId] ?? []);
  }, [activeSiloId]);

  const isEmpty = rules.length === 0;

  /* ── Actions ── */
  const handleAddRule = (rule: Rule) => {
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
    setRules((prev) => prev.filter((r) => r.id !== rule.id));
  };

  const handleApprove = (suggestion: AiSuggestion) => {
    const newRule: Rule = {
      id: `ai-new-${++_newId}`,
      text: suggestion.text,
      source: 'AI',
      status: 'Active',
      lastModified: 'Just now',
    };
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
  const siloLabel = silo.name.replace(/\s*\(.*\)/, '');

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Rules</h1>
        <span className={styles.pageSubtitle}>
          {isEmpty
            ? 'Define what the audit looks for.'
            : 'Define what the audit looks for. Add rules, review AI suggestions, manage your rule set.'}
        </span>
      </div>

      <div className={styles.content}>
        {isEmpty ? (
          <RulesEmptyState
            siloLabel={siloLabel}
            libraryCount={134}
            onLoadLibrary={handleLoadLibrary}
            onAddRule={handleAddFromEmpty}
          />
        ) : (
          <>
            <AddRulesSection
              showLibraryBanner={libraryRules.length > 0}
              siloLabel={siloLabel}
              libraryCount={libraryRules.length}
              existingRules={rules}
              onAddRule={handleAddRule}
            />

            <AiSuggestionsSection
              suggestions={suggestions}
              onApprove={handleApprove}
              onDismiss={(id) => setSuggestions((prev) => prev.filter((s) => s.id !== id))}
            />

            <CurrentRulesTable
              rules={rules}
              onToggle={handleToggle}
              onDuplicate={handleDuplicate}
              onEdit={handleEdit}
              onRemove={(r) => setRulePendingDelete(r)}
            />
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
