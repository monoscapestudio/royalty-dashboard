import { useState } from 'react';
import styles from './TeamPage.module.css';

interface Member {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Revenue Ops' | 'Analyst';
  status: 'Active' | 'Pending';
  initials: string;
}

const INITIAL_MEMBERS: Member[] = [
  { id: '1', name: 'Sarah Cone', email: 'sarah@revorion.ai', role: 'Admin', status: 'Active', initials: 'SC' },
  { id: '2', name: 'James Park', email: 'james@revorion.ai', role: 'Revenue Ops', status: 'Active', initials: 'JP' },
  { id: '3', name: 'Anika Torres', email: 'anika@revorion.ai', role: 'Analyst', status: 'Active', initials: 'AT' },
  { id: '4', name: 'Marcus Webb', email: 'marcus@revorion.ai', role: 'Analyst', status: 'Pending', initials: 'MW' },
];

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Analyst');

  function handleInvite() {
    if (!inviteEmail.trim()) return;
    const name = inviteEmail.split('@')[0];
    const initials = name.slice(0, 2).toUpperCase();
    setMembers((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name,
        email: inviteEmail,
        role: inviteRole as Member['role'],
        status: 'Pending',
        initials,
      },
    ]);
    setInviteEmail('');
    setShowInvite(false);
  }

  function handleRemove(id: string) {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  const roleClass = (role: Member['role']) => {
    if (role === 'Admin') return styles.roleAdmin;
    if (role === 'Revenue Ops') return styles.roleRevops;
    return styles.roleAnalyst;
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.pageTitle}>Team members</h1>
          <p className={styles.pageSubtitle}>{members.length} members in your organization.</p>
        </div>
        <button className={styles.btnPrimary} onClick={() => setShowInvite(true)}>
          Invite user
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.tableHeader}>
          <span className={styles.th}>Member</span>
          <span className={styles.th}>Role</span>
          <span className={styles.th}>Status</span>
          <span className={styles.th} />
        </div>
        {members.map((m) => (
          <div key={m.id} className={styles.tableRow}>
            <div className={styles.memberInfo}>
              <div className={styles.avatar}>{m.initials}</div>
              <div>
                <span className={styles.memberName}>{m.name}</span>
                <span className={styles.memberEmail}>{m.email}</span>
              </div>
            </div>
            <span className={`${styles.roleBadge} ${roleClass(m.role)}`}>{m.role}</span>
            <span className={`${styles.statusBadge} ${m.status === 'Active' ? styles.statusActive : styles.statusPending}`}>
              {m.status}
            </span>
            <button
              className={styles.actionBtn}
              onClick={() => handleRemove(m.id)}
              disabled={m.name === 'Sarah Cone'}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {showInvite && (
        <div className={styles.modalBackdrop} onClick={() => setShowInvite(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Invite user</h2>
            <p className={styles.modalSubtitle}>Send an invitation to join your organization.</p>
            <div className={styles.fields}>
              <div className={styles.field}>
                <label className={styles.label}>Email address</label>
                <input
                  className={styles.input}
                  type="email"
                  placeholder="name@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  autoFocus
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Role</label>
                <select
                  className={styles.select}
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                >
                  <option>Admin</option>
                  <option>Revenue Ops</option>
                  <option>Analyst</option>
                </select>
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.btnSecondary} onClick={() => setShowInvite(false)}>
                Cancel
              </button>
              <button className={styles.btnPrimary} onClick={handleInvite}>
                Send invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
