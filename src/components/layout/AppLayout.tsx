import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import SubHeader from './SubHeader';
import styles from './AppLayout.module.css';

export default function AppLayout() {
  return (
    <div className={styles.shell}>
      <TopNav />
      {/* SubHeader hidden — not in Figma header design */}
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
