import { useState, useRef, useEffect } from 'react';
import styles from './FormSelect.module.css';

interface Option {
  value: string;
  label: string;
}

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  className?: string;
}

export default function FormSelect({ label, value, onChange, options, className }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`${styles.group} ${className ?? ''}`} ref={containerRef}>
      <span className={styles.label}>{label}</span>
      <div 
        className={`${styles.select} ${isOpen ? styles.selectOpen : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        <span className={styles.selectedValue}>{selectedOption?.label}</span>
        <span className={styles.chevron}>▼</span>
      </div>
      
      {isOpen && (
        <div className={styles.dropdown}>
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`${styles.option} ${opt.value === value ? styles.optionSelected : ''}`}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
