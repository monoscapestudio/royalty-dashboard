import type { CSSProperties, ReactNode } from 'react';
import styles from './Banner.module.css';

type BannerVariant = 'error' | 'info' | 'warning' | 'success' | 'neutral';
type BannerSize = 'default' | 'compact';

interface Props {
  variant: BannerVariant;
  title?: string;
  body?: ReactNode;
  size?: BannerSize;
  className?: string;
  style?: CSSProperties;
}

export default function Banner({ variant, title, body, size = 'default', className, style }: Props) {
  const sizeClass = size === 'compact' ? styles.sizeCompact : styles.sizeDefault;

  return (
    <div
      className={`${styles.banner} ${styles[variant]} ${sizeClass} ${className ?? ''}`}
      style={style}
    >
      {title && <span className={styles.title}>{title}</span>}
      {body && <span className={styles.body}>{body}</span>}
    </div>
  );
}
