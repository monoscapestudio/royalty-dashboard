import { useState } from 'react';
import styles from './NotificationsPage.module.css';

interface PrefRow {
  id: string;
  label: string;
  desc: string;
  email: boolean;
  inApp: boolean;
}

const INITIAL: PrefRow[] = [
  { id: 'audit', label: 'Audit updates', desc: 'When an audit starts, completes, or fails.', email: true, inApp: true },
  { id: 'connection', label: 'Connection alerts', desc: 'When a data source connects, disconnects, or fails.', email: true, inApp: true },
  { id: 'recovery', label: 'Recovery emails', desc: 'When a recovery email is drafted, sent, or receives a reply.', email: false, inApp: true },
  { id: 'rules', label: 'Rules activity', desc: 'When new AI rule suggestions are available or conflicts detected.', email: false, inApp: true },
  { id: 'team', label: 'Team activity', desc: 'When a team member is added, removed, or changes role.', email: true, inApp: false },
];

export default function NotificationsPage() {
  const [prefs, setPrefs] = useState<PrefRow[]>(INITIAL);
  const [saved, setSaved] = useState(false);

  function toggle(id: string, field: 'email' | 'inApp') {
    setPrefs((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: !p[field] } : p))
    );
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Notification preferences</h1>
      <p className={styles.pageSubtitle}>Choose how and when you receive notifications.</p>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Email notifications</h2>
        <p className={styles.cardSubtitle}>Sent to sarah@revorion.ai</p>
        {prefs.map((p) => (
          <div key={p.id + '-email'} className={styles.row}>
            <div className={styles.rowLeft}>
              <span className={styles.rowLabel}>{p.label}</span>
              <span className={styles.rowDesc}>{p.desc}</span>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={p.email}
                onChange={() => toggle(p.id, 'email')}
              />
              <span className={styles.slider} />
            </label>
          </div>
        ))}
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>In-app notifications</h2>
        <p className={styles.cardSubtitle}>Shown in the notifications panel.</p>
        {prefs.map((p) => (
          <div key={p.id + '-inapp'} className={styles.row}>
            <div className={styles.rowLeft}>
              <span className={styles.rowLabel}>{p.label}</span>
              <span className={styles.rowDesc}>{p.desc}</span>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={p.inApp}
                onChange={() => toggle(p.id, 'inApp')}
              />
              <span className={styles.slider} />
            </label>
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <button className={styles.btnPrimary} onClick={handleSave}>
          {saved ? 'Saved!' : 'Save preferences'}
        </button>
      </div>
    </div>
  );
}
