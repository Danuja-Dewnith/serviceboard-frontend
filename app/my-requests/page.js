'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  SlidersHorizontal,
  Calendar,
  Users,
  PlusCircle,
  Wrench,
  Zap,
  Paintbrush,
  Layout,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StatusBadge from '../components/Statusbadge';
import { getMyJobs } from '../lib/api';
import { formatDate } from '../lib/dateUtils';

// ── Icon mapping ──────────────────────────────────────────────────────────────
const ICON_MAP = {
  Plumbing: Wrench,
  Electrical: Zap,
  Painting: Paintbrush,
  Joinery: Layout,
  Gardening: Layout,
  Cleaning: Layout,
  Roofing: Layout,
  Other: Layout,
  default: Layout,
};

function JobIcon({ category, iconBg, iconColor }) {
  const Icon = ICON_MAP[category] || ICON_MAP.default;
  return (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: 10,
        background: iconBg || '#eff6ff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Icon size={20} color={iconColor || '#1d4ed8'} strokeWidth={1.8} />
    </div>
  );
}

export default function MyRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchMyJobs();
  }, [router]);

  const fetchMyJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getMyJobs();
      const data = res.data?.data || [];
      setRequests(data);
      setFiltered(data);
    } catch (err) {
      console.error('Error fetching my jobs:', err);
      if (err.response?.status === 401) {
        router.push('/login');
      } else {
        setError('Failed to load your requests. Please try again.');
      }
      setRequests([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (val) => {
    setSearch(val);
    const q = val.toLowerCase();
    setFiltered(
      requests.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
      )
    );
  };

  // Summary stats
  const total = requests.length;
  const inProgressCount = requests.filter(
    (r) => r.status === 'In Progress'
  ).length;
  const openCount = requests.filter((r) => r.status === 'Open').length;
  const closedCount = requests.filter((r) => r.status === 'Closed').length;

  // Layout: first card spans full width, rest in 2-col grid
  const [first, ...rest] = filtered;

  return (
    <>
      <Navbar />

      <main style={styles.main}>
        <div style={styles.container}>
          {/* Page header */}
          <div style={styles.pageHeader}>
            <div>
              <h1 style={styles.pageTitle}>My Requests</h1>
              <p style={styles.pageSub}>
                Manage and track your active service postings.
              </p>
            </div>
            <div style={styles.headerRight}>
              {/* Search */}
              <div style={styles.searchWrap}>
                <Search size={15} color="#94a3b8" style={{ flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  style={styles.searchInput}
                />
              </div>
              <button style={styles.filterBtn} onClick={fetchMyJobs}>
                <SlidersHorizontal size={14} />
                Refresh
              </button>
            </div>
          </div>

          {/* Body: left (cards) + right (sidebar) */}
          <div style={styles.body}>
            {/* ── Cards column ── */}
            <div style={styles.cardsCol}>
              {loading ? (
                <div style={styles.skeletonGrid}>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} style={styles.skeleton} />
                  ))}
                </div>
              ) : error ? (
                <div style={styles.errorMsg}>{error}</div>
              ) : filtered.length === 0 ? (
                <div style={styles.empty}>
                  <p>You haven't posted any jobs yet.</p>
                  <Link href="/new" style={styles.postFirstBtn}>
                    Post Your First Job
                  </Link>
                </div>
              ) : (
                <>
                  {/* First card — full width */}
                  {first && <RequestCard job={first} wide />}

                  {/* Remaining cards — 2 col grid */}
                  {rest.length > 0 && (
                    <div style={styles.grid2}>
                      {rest.map((job) => (
                        <RequestCard key={job._id} job={job} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ── Sidebar ── */}
            <aside style={styles.sidebar}>
              {/* Active Summary */}
              <div style={styles.summaryCard}>
                <p style={styles.summaryLabel}>YOUR SUMMARY</p>
                <div style={styles.summaryTotal}>
                  <span style={styles.summaryNum}>{total}</span>
                  <span style={styles.summaryTotalLabel}>Total Requests</span>
                </div>

                {/* Progress bar — Open */}
                <div style={styles.progressRow}>
                  <span style={styles.progressLabel}>Open</span>
                  <span style={styles.progressCount}>{openCount}</span>
                </div>
                <div style={styles.progressTrack}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: total ? `${(openCount / total) * 100}%` : '0%',
                      background: '#10b981',
                    }}
                  />
                </div>

                {/* Progress bar — In Progress */}
                <div style={{ ...styles.progressRow, marginTop: 10 }}>
                  <span style={styles.progressLabel}>In Progress</span>
                  <span style={styles.progressCount}>{inProgressCount}</span>
                </div>
                <div style={styles.progressTrack}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: total ? `${(inProgressCount / total) * 100}%` : '0%',
                      background: '#f59e0b',
                    }}
                  />
                </div>

                {/* Progress bar — Closed */}
                <div style={{ ...styles.progressRow, marginTop: 10 }}>
                  <span style={styles.progressLabel}>Closed</span>
                  <span style={styles.progressCount}>{closedCount}</span>
                </div>
                <div style={styles.progressTrack}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: total ? `${(closedCount / total) * 100}%` : '0%',
                      background: '#94a3b8',
                    }}
                  />
                </div>
              </div>

              {/* Need more help */}
              <div style={styles.helpCard}>
                <PlusCircle size={36} color="#1d4ed8" strokeWidth={1.5} />
                <h3 style={styles.helpTitle}>Need more help?</h3>
                <p style={styles.helpSub}>
                  Post another request for different trades.
                </p>
                <Link href="/new" style={styles.helpBtn}>
                  Post a New Job
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </>
  );
}

// ── Request Card ─────────────────────────────────────────────────────────────
function RequestCard({ job, wide }) {
  const {
    _id,
    title,
    category,
    description,
    status,
    createdAt,
    updatedAt,
  } = job;

  const isClosed = status === 'Closed';
  const dateLabel = isClosed ? 'Completed' : 'Posted';
  const dateVal = formatDate(isClosed ? updatedAt : createdAt);

  // Get status color for badge
  const getStatusColor = () => {
    switch (status) {
      case 'Open': return '#10b981';
      case 'In Progress': return '#f59e0b';
      case 'Closed': return '#94a3b8';
      default: return '#64748b';
    }
  };

  return (
    <div style={{ ...cardStyles.card, animation: 'fadeUp 0.4s ease both' }}>
      {/* Top row */}
      <div style={cardStyles.top}>
        <div style={cardStyles.titleRow}>
          <JobIcon category={category} />
          <div>
            <h3 style={cardStyles.title}>{title}</h3>
            <p style={cardStyles.meta}>{category}</p>
          </div>
        </div>
        <div style={{ ...cardStyles.statusBadge, background: `${getStatusColor()}15`, color: getStatusColor() }}>
          {status}
        </div>
      </div>

      {/* Description */}
      <p
        style={{
          ...cardStyles.desc,
          WebkitLineClamp: wide ? 2 : 3,
          color: isClosed ? '#94a3b8' : '#475569',
        }}
      >
        {description}
      </p>

      {/* Footer */}
      <div style={cardStyles.footer}>
        <div style={cardStyles.footerLeft}>
          <Calendar size={13} color="#94a3b8" />
          <span style={cardStyles.date}>
            {dateLabel} {dateVal}
          </span>
        </div>

        <Link href={`/job/${_id}`} style={cardStyles.viewLink}>
          View Details →
        </Link>
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  main: { padding: '36px 0 60px' },
  container: { maxWidth: 1200, margin: '0 auto', padding: '0 24px' },

  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
    flexWrap: 'wrap',
    gap: 16,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: '#0f172a',
    letterSpacing: '-0.025em',
    fontFamily: "'Sora', sans-serif",
  },
  pageSub: { fontSize: 14, color: '#64748b', marginTop: 4 },
  headerRight: { display: 'flex', gap: 10, alignItems: 'center' },
  searchWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: '8px 14px',
    width: 240,
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    fontSize: 13,
    color: '#0f172a',
    background: 'transparent',
    width: '100%',
    fontFamily: "'DM Sans', sans-serif",
  },
  filterBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: '8px 16px',
    fontSize: 13,
    fontWeight: 500,
    color: '#475569',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  },

  body: {
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    gap: 24,
    alignItems: 'start',
  },
  cardsCol: { display: 'flex', flexDirection: 'column', gap: 16 },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
  },

  // Sidebar
  sidebar: { display: 'flex', flexDirection: 'column', gap: 16 },
  summaryCard: {
    background: '#1d4ed8',
    borderRadius: 14,
    padding: '22px 20px',
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 10,
  },
  summaryTotal: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 18,
  },
  summaryNum: {
    fontSize: 40,
    fontWeight: 700,
    color: '#ffffff',
    fontFamily: "'Sora', sans-serif",
    lineHeight: 1,
  },
  summaryTotalLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: 500,
  },
  progressRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  progressCount: {
    fontSize: 12,
    fontWeight: 700,
    color: '#ffffff',
    background: 'rgba(255,255,255,0.2)',
    padding: '1px 8px',
    borderRadius: 10,
  },
  progressTrack: {
    height: 5,
    background: 'rgba(255,255,255,0.2)',
    borderRadius: 99,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 99,
    transition: 'width 0.5s ease',
  },

  helpCard: {
    background: '#ffffff',
    border: '1.5px dashed #bfdbfe',
    borderRadius: 14,
    padding: '28px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: 8,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#0f172a',
    fontFamily: "'Sora', sans-serif",
    marginTop: 4,
  },
  helpSub: { fontSize: 13, color: '#64748b', lineHeight: 1.5 },
  helpBtn: {
    marginTop: 8,
    width: '100%',
    background: '#1d4ed8',
    color: '#ffffff',
    padding: '11px 0',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    textDecoration: 'none',
    display: 'block',
    textAlign: 'center',
    transition: 'background 0.15s',
  },

  skeletonGrid: { display: 'flex', flexDirection: 'column', gap: 16 },
  skeleton: {
    height: 180,
    background: '#f1f5f9',
    borderRadius: 14,
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  empty: {
    padding: 60,
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 15,
    background: '#f8fafc',
    borderRadius: 12,
  },
  postFirstBtn: {
    display: 'inline-block',
    marginTop: 16,
    background: '#1d4ed8',
    color: '#fff',
    padding: '10px 24px',
    borderRadius: 8,
    textDecoration: 'none',
  },
  errorMsg: {
    padding: 40,
    textAlign: 'center',
    color: '#dc2626',
    background: '#fef2f2',
    borderRadius: 12,
  },
};

const cardStyles = {
  card: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 14,
    padding: '20px 22px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  top: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  titleRow: { display: 'flex', alignItems: 'center', gap: 12 },
  title: {
    fontSize: 16,
    fontWeight: 700,
    color: '#0f172a',
    fontFamily: "'Sora', sans-serif",
    letterSpacing: '-0.01em',
  },
  meta: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  statusBadge: {
    fontSize: 11,
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: 20,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  desc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 1.65,
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  footerLeft: { display: 'flex', alignItems: 'center', gap: 6 },
  date: { fontSize: 12, color: '#94a3b8' },
  viewLink: {
    fontSize: 13,
    fontWeight: 600,
    color: '#1d4ed8',
    textDecoration: 'none',
  },
};