import styles from './InlineBanner.module.css';

export type InlineBannerVariant = 'green' | 'red' | 'blue' | 'amber';

interface Props {
  id: string;
  variant: InlineBannerVariant;
  title: string;
  body: string;
  onDismiss: (id: string) => void;
}

export default function InlineBanner({ id, variant, title, body, onDismiss }: Props) {
  return (
    <div className={`${styles.banner} ${styles[`banner_${variant}`]}`}>
      <div className={`${styles.accent} ${styles[`accent_${variant}`]}`} />
      <div className={styles.content}>
        <span className={`${styles.title} ${styles[`title_${variant}`]}`}>{title}</span>
        <span className={styles.body}>{body}</span>
      </div>
      <button
        className={styles.dismissBtn}
        onClick={() => onDismiss(id)}
        aria-label="Dismiss banner"
      >
        Dismiss&nbsp;✕
      </button>
    </div>
  );
}
