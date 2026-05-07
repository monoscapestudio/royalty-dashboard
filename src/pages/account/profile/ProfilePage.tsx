import { useState } from 'react';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const [firstName, setFirstName] = useState('Sarah');
  const [lastName, setLastName] = useState('Cone');
  const [email, setEmail] = useState('sarah@revorion.ai');
  const [role, setRole] = useState('cfo');
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Profile settings</h1>
      <p className={styles.pageSubtitle}>Manage your personal information and preferences.</p>

      {/* Personal info */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Personal information</h2>

        <div className={styles.avatarRow}>
          <div className={styles.avatar}>S</div>
          <button className={styles.avatarBtn}>Change photo</button>
        </div>

        <div className={styles.fields}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>First name</label>
              <input
                className={styles.input}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Last name</label>
              <input
                className={styles.input}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email address</label>
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className={styles.hint}>Used for login and notifications.</span>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Role</label>
            <select
              className={styles.select}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="cfo">CFO</option>
              <option value="revops">Revenue Operations</option>
              <option value="analyst">Analyst</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.btnPrimary} onClick={handleSave}>
            {saved ? 'Saved!' : 'Save changes'}
          </button>
        </div>
      </div>

      {/* Password */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Password</h2>
        <div className={styles.fields}>
          <div className={styles.field}>
            <label className={styles.label}>Current password</label>
            <input className={styles.input} type="password" placeholder="••••••••" />
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>New password</label>
              <input className={styles.input} type="password" placeholder="••••••••" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Confirm new password</label>
              <input className={styles.input} type="password" placeholder="••••••••" />
            </div>
          </div>
          <span className={styles.hint}>Minimum 8 characters.</span>
        </div>
        <div className={styles.actions}>
          <button className={styles.btnPrimary}>Update password</button>
        </div>
      </div>

      {/* Danger zone */}
      <div className={`${styles.card} ${styles.dangerZone}`}>
        <h2 className={styles.dangerTitle}>Danger zone</h2>
        <p className={styles.dangerText}>
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <button className={styles.btnDanger}>Delete my account</button>
      </div>
    </div>
  );
}
