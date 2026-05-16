'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  CheckCircle,
  Briefcase,
  MapPin,
  Calendar,
  Search,
  ChevronDown,
  Settings,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import API from '../lib/api';
import { formatDate } from '../lib/dateUtils';

// ── Page ───────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const [filter, setFilter] = useState('This Month');
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeJobs: 0,
    completedJobs: 0,
    totalJobs: 0,
  });
  const [activeJobs, setActiveJobs] = useState([]);
  const [completedJobs, setCompletedJobs] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }
    
    const user = JSON.parse(userData);
    setCurrentUser(user);
    
    // Only providers should access this page
    if (user.role !== 'provider') {
      router.push('/');
      return;
    }
    
    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch jobs accepted by the current provider
      const response = await API.get('/jobs/provider-jobs');
      console.log('Provider jobs response:', response.data);
      
      const providerJobs = response.data?.data || [];
      console.log('All provider jobs:', providerJobs);
      
      // Separate active and completed jobs
      const active = providerJobs.filter(job => job.status === 'In Progress');
      const completed = providerJobs.filter(job => job.status === 'Closed');
      
      console.log('Active jobs:', active.length);
      console.log('Completed jobs:', completed.length);
      
      setActiveJobs(active);
      setCompletedJobs(completed);
      
      // Calculate stats
      setStats({
        activeJobs: active.length,
        completedJobs: completed.length,
        totalJobs: providerJobs.length,
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Get visible completed jobs based on showMore
  const visibleCompletedJobs = showMore ? completedJobs : completedJobs.slice(0, 3);

  if (loading) {
    return (
      <>
        <Navbar />
        <main style={styles.main}>
          <div style={styles.container}>
            <div style={styles.loadingContainer}>
              <div style={styles.spinner}></div>
              <p>Loading dashboard...</p>
            </div>
          </div>
        </main>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main style={styles.main}>
        <div style={styles.container}>

          {/* ── Page Header ── */}
          <div style={styles.pageHeader}>
            <div>
              <h1 style={styles.pageTitle}>Professional Dashboard</h1>
              <p style={styles.pageSub}>
                Manage your active assignments and track your completed work.
              </p>
            </div>
            <button onClick={fetchDashboardData} style={styles.browseBtn}>
              <Search size={15} strokeWidth={2} />
              Refresh
            </button>
          </div>

          {error && (
            <div style={styles.errorMsg}>
              {error}
            </div>
          )}

          {/* ── Stat Cards ── */}
          <div style={styles.statsGrid}>
            <div style={{ ...styles.statCard, background: '#ffffff', border: '1px solid #e2e8f0' }}>
              <p style={{ ...styles.statLabel, color: '#94a3b8' }}>ACTIVE JOBS</p>
              <p style={{ ...styles.statValue, color: '#0f172a' }}>{stats.activeJobs}</p>
              <div style={styles.statSub}>
                <TrendingUp size={13} color="#15803d" />
                <span style={{ ...styles.statSubText, color: '#64748b' }}>
                  {stats.activeJobs > 0 ? `${stats.activeJobs} job${stats.activeJobs > 1 ? 's' : ''} in progress` : 'No active jobs'}
                </span>
              </div>
            </div>

            <div style={{ ...styles.statCard, background: '#ffffff', border: '1px solid #e2e8f0' }}>
              <p style={{ ...styles.statLabel, color: '#94a3b8' }}>COMPLETED</p>
              <p style={{ ...styles.statValue, color: '#0f172a' }}>{stats.completedJobs}</p>
              <div style={styles.statSub}>
                <CheckCircle size={13} color="#15803d" />
                <span style={{ ...styles.statSubText, color: '#64748b' }}>
                  {stats.completedJobs > 0 ? `${stats.completedJobs} completed job${stats.completedJobs > 1 ? 's' : ''}` : 'No completed jobs yet'}
                </span>
              </div>
            </div>

            <div style={{ ...styles.statCard, background: '#1d4ed8' }}>
              <p style={{ ...styles.statLabel, color: 'rgba(255,255,255,0.75)' }}>TOTAL JOBS</p>
              <p style={{ ...styles.statValue, color: '#ffffff' }}>{stats.totalJobs}</p>
              <div style={styles.statSub}>
                <Briefcase size={13} color="rgba(255,255,255,0.8)" />
                <span style={{ ...styles.statSubText, color: 'rgba(255,255,255,0.8)' }}>
                  Total jobs accepted
                </span>
              </div>
            </div>
          </div>

          {/* ── Active Jobs ── */}
          <div style={styles.sectionHeader}>
            <div style={styles.sectionTitleRow}>
              <h2 style={styles.sectionTitle}>Active Jobs</h2>
              <span style={styles.countBadge}>{stats.activeJobs}</span>
            </div>
          </div>

          <div style={styles.activeGrid}>
            {activeJobs.length === 0 ? (
              <div style={styles.emptyState}>
                <p>No active jobs at the moment.</p>
                <Link href="/" style={styles.browseLink}>Browse available jobs</Link>
              </div>
            ) : (
              activeJobs.map((job) => (
                <ActiveJobCard key={job._id} job={job} />
              ))
            )}
          </div>

          {/* ── Recently Completed ── */}
          <div style={{ ...styles.sectionHeader, marginTop: 40 }}>
            <h2 style={styles.sectionTitle}>Recently Completed</h2>
            <div style={styles.filterWrap}>
              <span style={styles.filterLabel}>Show:</span>
              <button
                style={styles.filterBtn}
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? 'Show Less' : 'Show All'}
                <ChevronDown size={13} />
              </button>
            </div>
          </div>

          {/* Table */}
          <div style={styles.tableWrap}>
            {/* Table header */}
            <div style={styles.tableHead}>
              {['JOB DESCRIPTION', 'CLIENT', 'DATE', 'STATUS'].map(
                (col) => (
                  <span key={col} style={styles.tableHeadCell}>
                    {col}
                  </span>
                )
              )}
            </div>

            {/* Rows */}
            {completedJobs.length === 0 ? (
              <div style={styles.emptyTableRow}>
                <p>No completed jobs yet.</p>
                <Link href="/" style={styles.browseJobsLink}>Browse and accept jobs</Link>
              </div>
            ) : (
              visibleCompletedJobs.map((job, i) => (
                <div
                  key={job._id}
                  style={{
                    ...styles.tableRow,
                    borderBottom: i < visibleCompletedJobs.length - 1
                      ? '1px solid #f1f5f9'
                      : 'none',
                  }}
                >
                  <div style={styles.tableJobCol}>
                    <Link href={`/job/${job._id}`} style={styles.tableJobLink}>
                      <span style={styles.tableJobTitle}>{job.title}</span>
                    </Link>
                    <span style={styles.tableJobSub}>
                      {job.description ? job.description.substring(0, 60) : 'No description'}...
                    </span>
                  </div>
                  <span style={styles.tableCell}>{job.contactName || 'N/A'}</span>
                  <span style={styles.tableCell}>
                    {formatDate(job.completedAt || job.updatedAt)}
                  </span>
                  <span style={styles.paidBadge}>COMPLETED</span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* ── Dashboard Footer ── */}
      <footer style={footerStyles.footer}>
        <div style={footerStyles.inner}>
          <div style={footerStyles.brand}>
            <span style={footerStyles.logo}>ServiceBoard</span>
            <p style={footerStyles.tagline}>
              Professional Trades Connection. Empowering skilled labor with
              modern tools and transparent communication.
            </p>
            <p style={footerStyles.copy}>
              © 2024 ServiceBoard Inc. Professional Trades Connection.
            </p>
          </div>

          <div style={footerStyles.linksWrap}>
            <div style={footerStyles.col}>
              <span style={footerStyles.colTitle}>COMPANY</span>
              <a href="#" style={footerStyles.link}>About Us</a>
              <a href="#" style={footerStyles.link}>Contact Us</a>
              <a href="#" style={footerStyles.link}>Help Center</a>
            </div>
            <div style={footerStyles.col}>
              <span style={footerStyles.colTitle}>LEGAL</span>
              <a href="#" style={footerStyles.link}>Terms of Service</a>
              <a href="#" style={footerStyles.link}>Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

// ── Active Job Card ────────────────────────────────────────────────────────
function ActiveJobCard({ job }) {
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getStatusColor = () => {
    switch (job.status) {
      case 'In Progress': return '#1d4ed8';
      case 'Open': return '#10b981';
      default: return '#64748b';
    }
  };

  const getStatusBg = () => {
    switch (job.status) {
      case 'In Progress': return '#eff6ff';
      case 'Open': return '#dcfce7';
      default: return '#f1f5f9';
    }
  };

  return (
    <div style={cardStyles.card}>
      {/* Top row */}
      <div style={cardStyles.top}>
        <div style={cardStyles.clientRow}>
          <div
            style={{
              ...cardStyles.avatar,
              background: '#fef3c7',
            }}
          >
            <span style={cardStyles.avatarText}>
              {getInitials(job.contactName)}
            </span>
          </div>
          <div>
            <h3 style={cardStyles.title}>{job.title}</h3>
            <p style={cardStyles.clientName}>Client: {job.contactName}</p>
          </div>
        </div>

        {/* Status pill */}
        <span
          style={{
            ...cardStyles.statusPill,
            color: getStatusColor(),
            background: getStatusBg(),
          }}
        >
          <span
            style={{
              ...cardStyles.statusDot,
              background: getStatusColor(),
            }}
          />
          {job.status}
        </span>
      </div>

      {/* Location */}
      <div style={cardStyles.metaRow}>
        <div style={cardStyles.metaItem}>
          <MapPin size={13} color="#94a3b8" strokeWidth={2} />
          <span style={cardStyles.metaText}>{job.location}</span>
        </div>
        <div style={cardStyles.metaItem}>
          <Calendar size={13} color="#94a3b8" strokeWidth={2} />
          <span style={cardStyles.metaText}>
            Accepted: {formatDate(job.acceptedAt)}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div style={cardStyles.divider} />

      {/* Action */}
      <div style={cardStyles.footer}>
        <Link href={`/job/${job._id}`} style={cardStyles.actionLink}>
          <Settings size={13} />
          View Details
        </Link>
      </div>
    </div>
  );
}

// ── Styles ──
const styles = {
  main: { padding: '36px 0 60px' },
  container: { maxWidth: 1200, margin: '0 auto', padding: '0 24px' },

  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: 16,
  },
  spinner: {
    width: 40,
    height: 40,
    border: '4px solid #e2e8f0',
    borderTopColor: '#1d4ed8',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },

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
  browseBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    background: '#ffffff',
    border: '1.5px solid #e2e8f0',
    borderRadius: 10,
    padding: '9px 18px',
    fontSize: 13,
    fontWeight: 600,
    color: '#374151',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'border-color 0.15s',
  },
  errorMsg: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: 8,
    padding: '12px 16px',
    color: '#dc2626',
    marginBottom: 20,
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1.4fr',
    gap: 16,
    marginBottom: 40,
  },
  statCard: {
    borderRadius: 14,
    padding: '22px 24px',
    animation: 'fadeUp 0.4s ease both',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.1em',
    marginBottom: 10,
  },
  statValue: {
    fontFamily: "'Sora', sans-serif",
    fontSize: 36,
    fontWeight: 700,
    letterSpacing: '-0.03em',
    lineHeight: 1.1,
    marginBottom: 10,
  },
  statSub: { display: 'flex', alignItems: 'center', gap: 5 },
  statSubText: { fontSize: 12, fontWeight: 500 },

  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleRow: { display: 'flex', alignItems: 'center', gap: 10 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: '#0f172a',
    letterSpacing: '-0.02em',
    fontFamily: "'Sora', sans-serif",
  },
  countBadge: {
    background: '#f1f5f9',
    border: '1px solid #e2e8f0',
    color: '#64748b',
    fontSize: 12,
    fontWeight: 700,
    padding: '2px 10px',
    borderRadius: 20,
  },

  activeGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
  },

  filterWrap: { display: 'flex', alignItems: 'center', gap: 8 },
  filterLabel: { fontSize: 13, color: '#94a3b8' },
  filterBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    background: '#ffffff',
    border: '1.5px solid #e2e8f0',
    borderRadius: 8,
    padding: '6px 12px',
    fontSize: 13,
    fontWeight: 600,
    color: '#374151',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  },

  tableWrap: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 14,
    overflow: 'hidden',
  },
  tableHead: {
    display: 'grid',
    gridTemplateColumns: '2.5fr 1.2fr 1.2fr 0.8fr',
    padding: '12px 24px',
    background: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
    gap: 12,
  },
  tableHeadCell: {
    fontSize: 11,
    fontWeight: 700,
    color: '#94a3b8',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '2.5fr 1.2fr 1.2fr 0.8fr',
    padding: '16px 24px',
    alignItems: 'center',
    gap: 12,
    transition: 'background 0.15s',
  },
  tableJobLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
  emptyTableRow: {
    padding: '40px 24px',
    textAlign: 'center',
    color: '#94a3b8',
  },
  tableJobCol: { display: 'flex', flexDirection: 'column', gap: 2 },
  tableJobTitle: { fontSize: 13, fontWeight: 600, color: '#0f172a' },
  tableJobSub: { fontSize: 12, color: '#94a3b8' },
  tableCell: { fontSize: 13, color: '#475569' },
  paidBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#dcfce7',
    color: '#15803d',
    border: '1px solid #bbf7d0',
    borderRadius: 6,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.07em',
    padding: '3px 8px',
    width: 'fit-content',
  },
  emptyState: {
    gridColumn: 'span 2',
    textAlign: 'center',
    padding: 40,
    background: '#f8fafc',
    borderRadius: 14,
    color: '#64748b',
  },
  browseLink: {
    display: 'inline-block',
    marginTop: 12,
    color: '#1d4ed8',
    textDecoration: 'none',
    fontWeight: 600,
  },
  browseJobsLink: {
    display: 'inline-block',
    marginTop: 12,
    color: '#1d4ed8',
    textDecoration: 'none',
    fontWeight: 600,
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
    gap: 14,
    animation: 'fadeUp 0.4s ease both',
  },
  top: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  clientRow: { display: 'flex', alignItems: 'center', gap: 12 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: { fontSize: 13, fontWeight: 700, color: '#64748b' },
  title: {
    fontSize: 15,
    fontWeight: 700,
    color: '#0f172a',
    fontFamily: "'Sora', sans-serif",
    letterSpacing: '-0.01em',
  },
  clientName: { fontSize: 12, color: '#94a3b8', marginTop: 2 },

  statusPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    padding: '4px 10px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.04em',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
  },

  metaRow: { display: 'flex', gap: 20, flexWrap: 'wrap' },
  metaItem: { display: 'flex', alignItems: 'center', gap: 5 },
  metaText: { fontSize: 12, color: '#64748b' },

  divider: { height: 1, background: '#f1f5f9' },

  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  actionLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: 'transparent',
    border: '1.5px solid #e2e8f0',
    borderRadius: 8,
    padding: '8px 16px',
    fontSize: 13,
    fontWeight: 600,
    color: '#374151',
    textDecoration: 'none',
    transition: 'border-color 0.15s, background 0.15s',
  },
};

const footerStyles = {
  footer: {
    background: '#ffffff',
    borderTop: '1px solid #e2e8f0',
    padding: '40px 0 24px',
    marginTop: 40,
  },
  inner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between',
    gap: 40,
    flexWrap: 'wrap',
  },
  brand: { maxWidth: 280 },
  logo: {
    fontFamily: "'Sora', sans-serif",
    fontWeight: 700,
    fontSize: 18,
    color: '#0f172a',
    letterSpacing: '-0.03em',
    display: 'block',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 1.6,
    marginBottom: 16,
  },
  copy: { fontSize: 12, color: '#94a3b8' },
  linksWrap: { display: 'flex', gap: 48 },
  col: { display: 'flex', flexDirection: 'column', gap: 8 },
  colTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: '#0f172a',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  link: {
    fontSize: 13,
    color: '#64748b',
    textDecoration: 'none',
    transition: 'color 0.15s',
  },
};