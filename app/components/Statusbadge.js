export default function StatusBadge({ status }) {
  const s = (status || '').toLowerCase().replace(/\s+/g, '_');

  const config = {
    open: {
      label: 'OPEN',
      bg: '#dcfce7',
      color: '#15803d',
      border: '#bbf7d0',
    },
    in_progress: {
      label: 'IN PROGRESS',
      bg: '#fef9c3',
      color: '#854d0e',
      border: '#fde68a',
    },
    closed: {
      label: 'CLOSED',
      bg: '#f1f5f9',
      color: '#475569',
      border: '#e2e8f0',
    },
    filled: {
      label: 'FILLED',
      bg: '#f1f5f9',
      color: '#475569',
      border: '#e2e8f0',
    },
  };

  const c = config[s] || config.open;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.06em',
        background: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      {c.label}
    </span>
  );
}