import { useState } from 'react';
import { WarningAlt } from '@carbon/icons-react';
import styles from './RolesPage.module.css';

interface Permission {
  id: string;
  name: string;
  desc: string;
  admin: boolean;
  revops: boolean;
  analyst: boolean;
}

type RoleKey = 'admin' | 'revops' | 'analyst';

const INITIAL_PERMISSIONS: Permission[] = [
  { id: 'run-audit', name: 'Run audit', desc: 'Trigger a new audit run.', admin: true, revops: true, analyst: false },
  { id: 'view-findings', name: 'View findings', desc: 'Access audit findings and the audit trail.', admin: true, revops: true, analyst: true },
  { id: 'send-recovery', name: 'Send recovery emails', desc: 'Execute recovery email sequences.', admin: true, revops: true, analyst: false },
  { id: 'manage-sources', name: 'Manage data sources', desc: 'Add, configure, or remove data connections.', admin: true, revops: false, analyst: false },
  { id: 'manage-rules', name: 'Manage rules', desc: 'Create, edit, or delete audit rules.', admin: true, revops: true, analyst: false },
  { id: 'view-reports', name: 'View reports', desc: 'Access the Reporting section.', admin: true, revops: true, analyst: true },
  { id: 'manage-team', name: 'Manage team', desc: 'Invite, remove, or change team member roles.', admin: true, revops: false, analyst: false },
  { id: 'billing', name: 'Billing & subscription', desc: 'View and manage billing information.', admin: true, revops: false, analyst: false },
];

const ROLE_LABELS: Record<RoleKey, string> = {
  admin: 'Admin',
  revops: 'Rev Ops',
  analyst: 'Analyst',
};

function PermCheckbox({
  checked,
  label,
  permName,
  onToggle,
}: {
  checked: boolean;
  label: string;
  permName: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={`${permName} — ${label}`}
      className={styles.permCheckbox}
      onClick={onToggle}
    >
      <span className={checked ? styles.check : styles.nocheck} />
    </button>
  );
}

export default function RolesPage() {
  const [permissions, setPermissions] = useState<Permission[]>(INITIAL_PERMISSIONS);

  function togglePermission(permId: string, role: RoleKey) {
    setPermissions((prev) =>
      prev.map((p) =>
        p.id === permId ? { ...p, [role]: !p[role] } : p,
      ),
    );
  }
  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Roles and permissions</h1>
      <p className={styles.pageSubtitle}>
        Overview of what each role can do in AuditGraph.
      </p>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <p className={styles.cardTitle}>Permission matrix</p>
          <p className={styles.cardDesc}>Music &amp; Royalty — 3 roles</p>
        </div>

        <div className={styles.permGrid}>
          {/* Header row */}
          <div className={styles.gridHeadCell}>Permission</div>
          <div className={styles.gridHeadCell}>Admin</div>
          <div className={styles.gridHeadCell}>Rev Ops</div>
          <div className={styles.gridHeadCell}>Analyst</div>

          {/* Permission rows */}
          {permissions.map((p) => (
            <div key={p.id} className={styles.permRow}>
              <div className={styles.permCell}>
                <div>
                  <span className={styles.permName}>{p.name}</span>
                  <span className={styles.permDesc}>{p.desc}</span>
                </div>
              </div>
              {(['admin', 'revops', 'analyst'] as RoleKey[]).map((role) => (
                <div key={role} className={`${styles.permCell} ${styles.permCheck}`}>
                  <PermCheckbox
                    checked={p[role]}
                    label={ROLE_LABELS[role]}
                    permName={p.name}
                    onToggle={() => togglePermission(p.id, role)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.infoStrip}>
        <div className={styles.infoStripInner}>
          <div className={styles.infoStripContent}>
            <WarningAlt size={20} className={styles.infoStripIcon} />
            <span className={styles.infoStripText}>
              Role permissions are fixed by Revorion. To request a custom role or permission change, contact your account manager or use the support page.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
