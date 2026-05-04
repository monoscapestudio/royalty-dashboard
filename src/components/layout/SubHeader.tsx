import { useSearchParams, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/app';
import { mockSubHeaderStats } from '../../data/mock';
import type { AuditState } from '../../types';
import styles from './SubHeader.module.css';

function auditStatusFromState(
  state: AuditState,
  onReporting: boolean,
): { text: string; color: 'green' | 'red' | 'amber' | 'default' } {
  switch (state) {
    case 'RUNNING': return { text: 'Running...', color: 'amber' };
    case 'COMPLETE': return { text: onReporting ? 'Complete' : 'Ready', color: 'green' };
    case 'FAILED': return { text: 'Failed', color: 'red' };
    case 'STOPPED': return { text: 'Stopped', color: 'amber' };
    case 'NOT_YET_RUN': return { text: 'Not ready', color: onReporting ? 'default' : 'amber' };
  }
}

export default function SubHeader() {
  const activeSiloId = useAppStore((s) => s.activeSiloId);
  const auditStateBySilo = useAppStore((s) => s.auditStateBySilo);
  const stats = mockSubHeaderStats[activeSiloId] ?? mockSubHeaderStats['music-royalty'];

  /* Honour dev query param override */
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const onReporting = location.pathname === '/app/reporting';
  const devParam = searchParams.get('audit-state') as AuditState | null;
  const storedState: AuditState = auditStateBySilo[activeSiloId] ?? 'NOT_YET_RUN';
  const auditState: AuditState = devParam ?? storedState;
  const auditStatus = auditStatusFromState(auditState, onReporting);

  const valueClass = (color?: 'green' | 'red' | 'amber' | 'default') => {
    if (color === 'green') return `${styles.value} ${styles.valueGreen}`;
    if (color === 'red') return `${styles.value} ${styles.valueRed}`;
    if (color === 'amber') return `${styles.value} ${styles.valueAmber}`;
    return styles.value;
  };

  return (
    <div className={styles.subHeader}>
      <div className={styles.segment}>
        <span className={styles.label}>{stats.connectsLabel}</span>
        <span className={valueClass(stats.connectsValueColor)}>{stats.connectsValue}</span>
      </div>

      <span className={styles.divider}>|</span>

      <div className={styles.segment}>
        <span className={styles.label}>{stats.rulesLabel}</span>
        <span className={valueClass(stats.rulesValueColor)}>{stats.rulesValue}</span>
      </div>

      <span className={styles.divider}>|</span>

      <div className={styles.segment}>
        <span className={styles.label}>{stats.auditLabel}</span>
        <span className={valueClass(auditStatus.color)}>{auditStatus.text}</span>
      </div>
    </div>
  );
}
