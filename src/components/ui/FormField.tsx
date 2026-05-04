import type { ReactNode } from 'react';
import styles from './FormField.module.css';

interface Props {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  type?: 'text' | 'password' | 'url' | 'email';
  error?: string;
  readOnly?: boolean;
  rightAction?: ReactNode;
  className?: string;
}

export default function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  readOnly = false,
  rightAction,
  className,
}: Props) {
  return (
    <div className={`${styles.group} ${className ?? ''}`}>
      <span className={`${styles.label} ${error ? styles.labelError : ''}`}>
        {label}
      </span>
      <div className={styles.inputWrap}>
        <input
          className={`${styles.input} ${error ? styles.inputError : ''}`}
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          style={rightAction ? { paddingRight: '64px' } : undefined}
        />
        {rightAction && (
          <span className={styles.rightAction}>{rightAction}</span>
        )}
      </div>
      {error && <span className={styles.errorMsg}>{error}</span>}
    </div>
  );
}
