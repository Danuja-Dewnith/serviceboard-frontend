import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import StatusBadge from './Statusbadge';
import { formatDistanceToNow } from '../lib/dateUtils';

export default function JobCard({ job }) {
  const {
    _id,
    title,
    category,
    status,
    location,
    description,
    createdAt,
  } = job;

  const isClosed =
    status?.toLowerCase() === 'closed' || status?.toLowerCase() === 'filled';

  return (
    <div style={{ ...styles.card, ...(isClosed ? styles.cardClosed : {}) }}>
      {/* Top row: category + status */}
      <div style={styles.topRow}>
        <span style={styles.category}>{category?.toUpperCase()}</span>
        <StatusBadge status={status} />
      </div>

      {/* Title */}
      <h3 style={styles.title}>{title}</h3>

      {/* Location */}
      <div style={styles.locationRow}>
        <MapPin size={13} color="#94a3b8" strokeWidth={2} />
        <span style={styles.locationText}>{location}</span>
      </div>

      {/* Description */}
      <p style={styles.description}>{description}</p>

      {/* Footer */}
      <div style={styles.footer}>
        <span style={styles.posted}>
          Posted {formatDistanceToNow(createdAt)}
        </span>
        {isClosed ? (
          <span style={styles.filled}>Filled</span>
        ) : (
          <Link href={`/job/${_id}`} style={styles.viewLink}>
            View Details
            <ArrowRight size={14} strokeWidth={2} />
          </Link>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 14,
    padding: '22px 22px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    transition: 'box-shadow 0.2s, transform 0.2s',
    cursor: 'default',
    animation: 'fadeUp 0.4s ease both',
  },
  cardClosed: {
    opacity: 0.7,
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.08em',
    color: '#64748b',
    background: '#f1f5f9',
    padding: '3px 8px',
    borderRadius: 5,
  },
  title: {
    fontFamily: "'Sora', sans-serif",
    fontSize: 16,
    fontWeight: 600,
    color: '#0f172a',
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
  },
  locationRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 13,
    color: '#94a3b8',
  },
  description: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 1.6,
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    flex: 1,
  },
  footer: {
    marginTop: 8,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  posted: {
    fontSize: 12,
    color: '#94a3b8',
  },
  viewLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 13,
    fontWeight: 600,
    color: '#1d4ed8',
    textDecoration: 'none',
    transition: 'gap 0.15s',
  },
  filled: {
    fontSize: 13,
    fontWeight: 500,
    color: '#94a3b8',
  },
};