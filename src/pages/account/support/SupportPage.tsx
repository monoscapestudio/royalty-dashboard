import { useState } from 'react';
import styles from './SupportPage.module.css';

const FAQS = [
  {
    q: 'How do I add a new data source?',
    a: 'Go to Connects in the main navigation and click "Add source". You can connect via API, OAuth, or by uploading a folder. Once connected, the source will appear in your Connects list.',
  },
  {
    q: 'How long does an audit take?',
    a: 'Audit duration depends on the volume of contracts and billing records. A typical Music & Royalty audit with 6 sources and 300+ rules completes in 5–15 minutes. You will receive a notification when it finishes.',
  },
  {
    q: 'How does the recovery email sequence work?',
    a: 'After an audit completes, each finding includes a pre-drafted recovery email. You can edit the email, then click "Execute sequence" to send it and any follow-up emails automatically. Replies are tracked in the findings table.',
  },
  {
    q: 'Can I customize audit rules?',
    a: 'Yes. Go to Rules and use "Add rule" to create custom rules, or accept AI suggestions. Library rules (provided by Revorion) are read-only but can be toggled on or off.',
  },
  {
    q: 'Who can see audit findings?',
    a: 'Any team member with at least the Analyst role can view findings. Only Admin and Revenue Ops roles can send recovery emails or run new audits. See Roles and permissions for the full breakdown.',
  },
];

export default function SupportPage() {
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function handleSubmit() {
    if (!message.trim()) return;
    setSent(true);
    setTopic('');
    setSubject('');
    setMessage('');
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Contact support</h1>
      <p className={styles.pageSubtitle}>
        Our team typically responds within one business day.
      </p>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Send a message</h2>
        {sent ? (
          <p style={{ color: 'var(--status-live-text)', fontWeight: 600 }}>
            ✓ Message sent. We'll get back to you at sarah@revorion.ai.
          </p>
        ) : (
          <>
            <div className={styles.fields}>
              <div className={styles.field}>
                <label className={styles.label}>Topic</label>
                <select className={styles.select} value={topic} onChange={(e) => setTopic(e.target.value)}>
                  <option value="">Select a topic...</option>
                  <option>Data connection issue</option>
                  <option>Audit not running</option>
                  <option>Recovery email problem</option>
                  <option>Rules question</option>
                  <option>Billing or subscription</option>
                  <option>Other</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Subject</label>
                <input
                  className={styles.input}
                  placeholder="Brief summary of your issue"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Message</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Describe your issue in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.actions}>
              <button className={styles.btnPrimary} onClick={handleSubmit}>
                Send message
              </button>
            </div>
          </>
        )}
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Frequently asked questions</h2>
        {FAQS.map((faq, i) => (
          <div
            key={i}
            className={styles.faqItem}
            onClick={() => setOpenFaq(openFaq === i ? null : i)}
          >
            <div className={styles.faqQuestion}>
              <span>{faq.q}</span>
              <span className={`${styles.faqChevron} ${openFaq === i ? styles.faqChevronOpen : ''}`}>▾</span>
            </div>
            {openFaq === i && (
              <p className={styles.faqAnswer}>{faq.a}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
