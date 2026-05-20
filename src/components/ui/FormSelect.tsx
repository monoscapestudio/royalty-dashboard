import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styles from './FormSelect.module.css';

interface Option {
  value: string;
  label: string;
}

interface Props {
  /** Omit or leave empty to hide the field label (e.g. inline filter bars). */
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  className?: string;
}

interface DropdownPosition {
  top: number;
  left: number;
  width: number;
}

export default function FormSelect({ label = '', value, onChange, options, className }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<DropdownPosition | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value) || options[0];

  const updatePosition = useCallback(() => {
    if (!selectRef.current) return;
    const rect = selectRef.current.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        containerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) {
        return;
      }
      setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dropdown = isOpen && dropdownPos
    ? createPortal(
        <div
          ref={dropdownRef}
          className={styles.dropdown}
          style={{
            top: dropdownPos.top,
            left: dropdownPos.left,
            width: dropdownPos.width,
          }}
        >
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
        </div>,
        document.body,
      )
    : null;

  return (
    <div
      className={`${styles.group} ${isOpen ? styles.groupOpen : ''} ${className ?? ''}`}
      ref={containerRef}
    >
      {label ? <span className={styles.label}>{label}</span> : null}
      <div
        ref={selectRef}
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
      {dropdown}
    </div>
  );
}
