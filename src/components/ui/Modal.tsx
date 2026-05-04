import React, { useEffect, type ReactNode } from 'react';
import styles from './Modal.module.css';

interface Props {
  contextLabel?: string;
  title: string;
  titleSuffix?: ReactNode;
  titleLarge?: boolean;
  onClose: () => void;
  children: ReactNode;
  width?: number;
  zIndex?: number;
}

export default function Modal({ contextLabel, title, titleSuffix, titleLarge, onClose, children, width = 480, zIndex }: Props) {
  /* Close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className={styles.scrim}
      style={zIndex ? ({ '--modal-z': zIndex } as React.CSSProperties) : undefined}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.card} style={{ width }} role="dialog" aria-modal="true">
        <div className={styles.header}>
          <div className={styles.headerMeta}>
            {contextLabel && (
              <span className={styles.headerContext}>{contextLabel}</span>
            )}
            <div className={styles.headerTitleRow}>
              <span className={titleLarge ? styles.headerTitleLarge : styles.headerTitle}>
                {title}
              </span>
              {titleSuffix}
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
