import styles from './RolesPage.module.css';

interface Permission {
  id: string;
  name: string;
  desc: string;
  admin: boolean;
  revops: boolean;
  analyst: boolean;
}

const PERMISSIONS: Permission[] = [
  { id: 'run-audit', name: 'Run audit', desc: 'Trigger a new audit run.', admin: true, revops: true, analyst: false },
  { id: 'view-findings', name: 'View findings', desc: 'Access audit findings and the audit trail.', admin: true, revops: true, analyst: true },
  { id: 'send-recovery', name: 'Send recovery emails', desc: 'Execute recovery email sequences.', admin: true, revops: true, analyst: false },
  { id: 'manage-sources', name: 'Manage data sources', desc: 'Add, configure, or remove data connections.', admin: true, revops: false, analyst: false },
  { id: 'manage-rules', name: 'Manage rules', desc: 'Create, edit, or delete audit rules.', admin: true, revops: true, analyst: false },
  { id: 'view-reports', name: 'View reports', desc: 'Access the Reporting section.', admin: true, revops: true, analyst: true },
  { id: 'manage-team', name: 'Manage team', desc: 'Invite, remove, or change team member roles.', admin: true, revops: false, analyst: false },
  { id: 'billing', name: 'Billing & subscription', desc: 'View and manage billing information.', admin: true, revops: false, analyst: false },
];

export default function RolesPage() {
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
          <div className={styles.gridHeadCell} style={{ textAlign: 'left' }}>Permission</div>
          <div className={styles.gridHeadCell}>Admin</div>
          <div className={styles.gridHeadCell}>Rev Ops</div>
          <div className={styles.gridHeadCell}>Analyst</div>

          {/* Permission rows */}
          {PERMISSIONS.map((p) => (
            <div key={p.id} className={styles.permRow}>
              <div className={styles.permCell}>
                <div>
                  <span className={styles.permName}>{p.name}</span>
                  <span className={styles.permDesc}>{p.desc}</span>
                </div>
              </div>
              <div className={`${styles.permCell} ${styles.permCheck}`}>
                {p.admin ? <span className={styles.check} /> : <span className={styles.nocheck} />}
              </div>
              <div className={`${styles.permCell} ${styles.permCheck}`}>
                {p.revops ? <span className={styles.check} /> : <span className={styles.nocheck} />}
              </div>
              <div className={`${styles.permCell} ${styles.permCheck}`}>
                {p.analyst ? <span className={styles.check} /> : <span className={styles.nocheck} />}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.infoCard}>
        <span className={styles.infoIcon}>ℹ️</span>
        <span className={styles.infoText}>
          Role permissions are fixed by Revorion. To request a custom role or permission change, contact your account manager or use the support page.
        </span>
      </div>
    </div>
  );
}
