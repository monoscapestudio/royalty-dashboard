import type { RuleSource, RuleStatus } from '../../../types';
import styles from './RuleBadge.module.css';

type Props =
  | { kind: 'source'; value: RuleSource }
  | { kind: 'status'; value: RuleStatus };

const SOURCE_LABEL: Record<RuleSource, string> = {
  Library: 'Library',
  User: 'User',
  AI: 'AI',
};

const SOURCE_CLASS: Record<RuleSource, string> = {
  Library: styles.library,
  User: styles.user,
  AI: styles.ai,
};

const STATUS_CLASS: Record<RuleStatus, string> = {
  Active: styles.active,
  Inactive: styles.inactive,
};

export default function RuleBadge(props: Props) {
  if (props.kind === 'source') {
    return (
      <span className={`${styles.pill} ${SOURCE_CLASS[props.value]}`}>
        {SOURCE_LABEL[props.value]}
      </span>
    );
  }
  return (
    <span className={`${styles.pill} ${STATUS_CLASS[props.value]}`}>
      {props.value}
    </span>
  );
}
