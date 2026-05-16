'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft, MapPin, Trash2, CheckCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import StatusBadge from '../../components/Statusbadge';
import { getJobById, updateJobStatus, deleteJob } from '../../lib/api';
import { formatDate } from '../../lib/dateUtils';

// Dynamically import the map component to avoid SSR issues
const JobLocationMap = dynamic(() => import('../../components/JobLocationMap'), {
  ssr: false,
  loading: () => (
    <div style={styles.mapPlaceholder}>
      <div style={styles.mapDot} />
      <p style={{ marginTop: 10, fontSize: 12, color: '#94a3b8' }}>Loading map...</p>
    </div>
  ),
});

const STATUSES = ['Open', 'In Progress', 'Closed'];

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isProvider, setIsProvider] = useState(false);
  const [isJobOwner, setIsJobOwner] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasAcceptedJob, setHasAcceptedJob] = useState(false); // NEW: Track if current provider accepted this job

  // Get current user from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      const user = JSON.parse(userData);
      setCurrentUser(user);
      setIsProvider(user.role === 'provider');
    } else {
      setIsLoggedIn(false);
      setCurrentUser(null);
      setIsProvider(false);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        console.log('Fetching job with ID:', id);
        const response = await getJobById(id);
        console.log('Full response:', response);
        
        const jobData = response.data?.data || response.data;
        console.log('Job data:', jobData);
        
        if (jobData && jobData._id) {
          setJob(jobData);
          setSelectedStatus(jobData.status);
          
          // Check if current user is the job owner
          if (currentUser && jobData.user && jobData.user._id === currentUser.id) {
            setIsJobOwner(true);
          }
          
          // Check if current provider has accepted this job
          if (currentUser && jobData.acceptedBy && jobData.acceptedBy._id === currentUser.id) {
            setHasAcceptedJob(true);
          }
        } else {
          console.error('No job found in response');
          setJob(null);
        }
      } catch (err) {
        console.error('Error loading job:', err);
        setJob(null);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      load();
    }
  }, [id, currentUser]);

  const handleSaveStatus = async () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    
    if (!isJobOwner) {
      setSaveMsg('Only the job owner can update status.');
      setTimeout(() => setSaveMsg(''), 3000);
      return;
    }
    
    if (selectedStatus === job.status) {
      setSaveMsg('Status is already set to this value.');
      setTimeout(() => setSaveMsg(''), 3000);
      return;
    }
    
    setSaving(true);
    setSaveMsg('');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/jobs/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'userid': currentUser?.id || '',
        },
        body: JSON.stringify({ status: selectedStatus }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setJob(data.data);
        setSelectedStatus(selectedStatus);
        
        if (selectedStatus === 'Closed') {
          setSaveMsg('Job marked as completed! The provider has been notified.');
        } else {
          setSaveMsg('Status updated successfully!');
        }
      } else {
        setSaveMsg('Failed to update status. Please try again.');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setSaveMsg('Failed to update status. Please try again.');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(''), 4000);
    }
  };

  const handleAcceptJob = async () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    
    if (!isProvider) {
      setSaveMsg('Only service providers can accept jobs.');
      setTimeout(() => setSaveMsg(''), 3000);
      return;
    }
    
    if (job.status !== 'Open') {
      setSaveMsg('This job is no longer available for acceptance.');
      setTimeout(() => setSaveMsg(''), 3000);
      return;
    }
    
    setSaving(true);
    setSaveMsg('');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/jobs/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'providerid': currentUser?.id || '',
        },
        body: JSON.stringify({ status: 'In Progress' }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setJob(data.data);
        setSelectedStatus('In Progress');
        setHasAcceptedJob(true); // Mark that this provider accepted the job
        if (data.emailSent) {
          setSaveMsg('You have accepted this job! The homeowner has been notified via email.');
        } else {
          setSaveMsg('You have accepted this job! Status changed to In Progress.');
        }
      } else {
        setSaveMsg('Failed to accept job. Please try again.');
      }
    } catch (err) {
      console.error('Error accepting job:', err);
      setSaveMsg('Failed to accept job. Please try again.');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(''), 4000);
    }
  };

  const handleCompleteJob = async () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    
    if (!isProvider) {
      setSaveMsg('Only service providers can complete jobs.');
      setTimeout(() => setSaveMsg(''), 3000);
      return;
    }
    
    // CRITICAL: Only the provider who accepted the job can complete it
    if (!hasAcceptedJob) {
      setSaveMsg('You can only complete jobs that you have accepted.');
      setTimeout(() => setSaveMsg(''), 3000);
      return;
    }
    
    if (job.status !== 'In Progress') {
      setSaveMsg('Only jobs that are "In Progress" can be marked as completed.');
      setTimeout(() => setSaveMsg(''), 3000);
      return;
    }
    
    setSaving(true);
    setSaveMsg('');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/jobs/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'providerid': currentUser?.id || '',
        },
        body: JSON.stringify({ status: 'Closed' }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setJob(data.data);
        setSelectedStatus('Closed');
        if (data.emailSent) {
          setSaveMsg('Job marked as completed! The homeowner has been notified.');
        } else {
          setSaveMsg('Job marked as completed!');
        }
      } else {
        setSaveMsg('Failed to complete job. Please try again.');
      }
    } catch (err) {
      console.error('Error completing job:', err);
      setSaveMsg('Failed to complete job. Please try again.');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(''), 4000);
    }
  };

  const handleDelete = async () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    
    if (!isJobOwner) {
      setSaveMsg('Only the job owner can delete this job.');
      setTimeout(() => setSaveMsg(''), 3000);
      return;
    }
    
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    try {
      await deleteJob(id);
      router.push('/');
    } catch (err) {
      console.error('Error deleting job:', err);
      setDeleting(false);
      setConfirmDelete(false);
      alert('Failed to delete job. Please try again.');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main style={styles.main}>
          <div style={styles.container}>
            <div style={styles.skeletonWrap}>
              <div style={{ ...styles.skeleton, height: 32 }} />
              <div style={{ ...styles.skeleton, height: 20 }} />
              <div style={{ ...styles.skeleton, height: 120 }} />
              <div style={{ ...styles.skeleton, height: 60 }} />
            </div>
          </div>
        </main>
        <Footer />
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
      </>
    );
  }

  if (!job) {
    return (
      <>
        <Navbar />
        <main style={styles.main}>
          <div style={styles.container}>
            <div style={{ textAlign: 'center', padding: 60 }}>
              <p style={{ color: '#94a3b8', marginBottom: 20 }}>Job not found.</p>
              <Link href="/" style={styles.backHomeBtn}>
                ← Back to Home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const initials = job.contactName
    ? job.contactName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  // Updated button visibility logic
  const showAcceptButton = isProvider && !isJobOwner && job.status === 'Open';
  const showCompleteButton = isProvider && !isJobOwner && job.status === 'In Progress' && hasAcceptedJob;
  const showDeleteButton = isJobOwner && job.status !== 'Closed';
  const showLoginMessage = !isLoggedIn;

  return (
    <>
      <Navbar />

      <main style={styles.main}>
        <div style={styles.container}>
          {/* Back link */}
          <Link href="/" style={styles.backLink}>
            <ArrowLeft size={15} strokeWidth={2.5} />
            Back to Marketplace
          </Link>

          <div style={styles.layout}>
            {/* ── Left: Main content ── */}
            <div style={styles.left}>
              <div style={styles.mainCard}>
                {/* Header */}
                <div style={styles.jobHeader}>
                  <div style={styles.jobMeta}>
                    <h1 style={styles.jobTitle}>{job.title}</h1>
                    <div style={styles.badgeRow}>
                      <span style={styles.categoryPill}>
                        {job.category}
                      </span>
                      <StatusBadge status={job.status} />
                    </div>
                  </div>
                  <div style={styles.dateBlock}>
                    <span style={styles.dateLabel}>Created Date</span>
                    <span style={styles.dateValue}>{formatDate(job.createdAt)}</span>
                    {job.completedAt && (
                      <>
                        <span style={styles.dateLabel}>Completed Date</span>
                        <span style={styles.dateValue}>{formatDate(job.completedAt)}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Location row */}
                <div style={styles.infoRow}>
                  <div style={styles.infoItem}>
                    <MapPin size={15} color="#64748b" />
                    <div>
                      <div style={styles.infoLabel}>Location</div>
                      <div style={styles.infoValue}>{job.location}</div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div style={styles.section}>
                  <h2 style={styles.sectionTitle}>Job Description</h2>
                  <p style={styles.descText}>{job.description}</p>
                </div>

                {/* Accepted By Info */}
                {job.acceptedBy && (
                  <div style={styles.acceptedInfo}>
                    <div style={styles.acceptedHeader}>
                      <CheckCircle size={16} color="#10b981" />
                      <span style={styles.acceptedTitle}>Accepted By</span>
                    </div>
                    <div style={styles.acceptedDetails}>
                      <div style={styles.acceptedName}>{job.acceptedBy.name}</div>
                      <div style={styles.acceptedDate}>
                        Accepted on: {formatDate(job.acceptedAt)}
                      </div>
                    </div>
                  </div>
                )}

                {/* Completed By Info */}
                {job.completedBy && (
                  <div style={styles.completedInfo}>
                    <div style={styles.completedHeader}>
                      <CheckCircle size={16} color="#f59e0b" />
                      <span style={styles.completedTitle}>Completed By</span>
                    </div>
                    <div style={styles.completedDetails}>
                      <div style={styles.completedName}>{job.completedBy.name}</div>
                      <div style={styles.completedDate}>
                        Completed on: {formatDate(job.completedAt)}
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact */}
                {job.contactName && (
                  <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Homeowner Contact</h2>
                    <div style={styles.contactCard}>
                      <div style={styles.avatar}>{initials}</div>
                      <div style={styles.contactInfo}>
                        <div style={styles.contactName}>{job.contactName}</div>
                        <div style={styles.contactMeta}>
                          Verified Homeowner
                        </div>
                      </div>
                      {job.contactEmail && (
                        <a
                          href={`mailto:${job.contactEmail}`}
                          style={styles.messageBtn}
                        >
                          Message
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Right: Sidebar actions ── */}
            <div style={styles.right}>
              {/* Login Required Message - Show for non-logged in users */}
              {showLoginMessage && (
                <div style={styles.loginCard}>
                  <h3 style={styles.loginTitle}>Login Required</h3>
                  <p style={styles.loginText}>
                    Please login to accept jobs or manage job postings.
                  </p>
                  <Link href="/login" style={styles.loginBtn}>
                    Sign In to Continue
                  </Link>
                </div>
              )}

              {/* Provider Actions Card */}
              {isLoggedIn && isProvider && (showAcceptButton || showCompleteButton) && (
                <div style={styles.sideCard}>
                  <h3 style={styles.sideTitle}>Provider Actions</h3>
                  <p style={styles.sideDesc}>
                    {showAcceptButton && 'Accept this job to start working'}
                    {showCompleteButton && 'Mark this job as completed when done'}
                  </p>

                  {showAcceptButton && (
                    <button
                      onClick={handleAcceptJob}
                      disabled={saving}
                      style={{
                        ...styles.acceptBtn,
                        ...(saving ? styles.saveBtnDisabled : {}),
                      }}
                    >
                      <CheckCircle size={16} strokeWidth={2} />
                      {saving ? 'Processing...' : 'Accept Job'}
                    </button>
                  )}

                  {showCompleteButton && (
                    <button
                      onClick={handleCompleteJob}
                      disabled={saving}
                      style={{
                        ...styles.completeBtn,
                        ...(saving ? styles.saveBtnDisabled : {}),
                      }}
                    >
                      <CheckCircle size={16} strokeWidth={2} />
                      {saving ? 'Processing...' : 'Mark as Completed'}
                    </button>
                  )}

                  {saveMsg && (
                    <p
                      style={{
                        fontSize: 12,
                        marginTop: 12,
                        color: saveMsg.includes('success') || saveMsg.includes('accepted') || saveMsg.includes('completed')
                          ? '#15803d' 
                          : '#ef4444',
                        textAlign: 'center',
                      }}
                    >
                      {saveMsg}
                    </p>
                  )}
                </div>
              )}

              {/* Update Status Card - Only for job owners */}
              {isLoggedIn && isJobOwner && (
                <div style={styles.sideCard}>
                  <h3 style={styles.sideTitle}>Update Status</h3>
                  <p style={styles.sideDesc}>
                    Manage job progress
                  </p>

                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    style={styles.statusSelect}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handleSaveStatus}
                    disabled={saving || selectedStatus === job.status}
                    style={{
                      ...styles.saveBtn,
                      ...(saving || selectedStatus === job.status
                        ? styles.saveBtnDisabled
                        : {}),
                    }}
                  >
                    {saving ? 'Saving...' : 'Save Status Change'}
                  </button>

                  {saveMsg && !saveMsg.includes('accepted') && !saveMsg.includes('completed') && (
                    <p
                      style={{
                        fontSize: 12,
                        marginTop: 8,
                        color: saveMsg.includes('success') ? '#15803d' : '#ef4444',
                        textAlign: 'center',
                      }}
                    >
                      {saveMsg}
                    </p>
                  )}

                  <hr style={styles.sideHr} />

                  <div>
                    <p style={styles.adminLabel}>Administrative Actions</p>
                    {showDeleteButton && (
                      <button
                        onClick={handleDelete}
                        disabled={deleting}
                        style={styles.deleteBtn}
                      >
                        <Trash2 size={15} />
                        {confirmDelete
                          ? 'Click again to confirm'
                          : deleting
                          ? 'Deleting...'
                          : 'Delete Job Posting'}
                      </button>
                    )}
                    {confirmDelete && (
                      <p style={styles.deleteWarning}>
                        This action cannot be undone.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Job Location card with Map - Visible to everyone */}
              <div style={styles.sideCard}>
                <h3 style={styles.sideTitle}>Job Location</h3>
                <div style={styles.mapContainer}>
                  <JobLocationMap location={job.location} address={job.title} />
                </div>
                <div style={styles.locationInfo}>
                  <MapPin size={14} color="#64748b" />
                  <span style={styles.locationText}>{job.location}</span>
                </div>
                <p style={styles.mapNote}>
                  Precise address will be shared once a professional is hired.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>
    </>
  );
}

// Styles remain the same as your existing styles
const styles = {
  // ... (keep all your existing styles exactly as they are)
  main: {
    padding: '32px 0 60px',
  },
  container: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '0 24px',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 14,
    fontWeight: 500,
    color: '#1d4ed8',
    textDecoration: 'none',
    marginBottom: 24,
    transition: 'opacity 0.15s',
  },
  backHomeBtn: {
    display: 'inline-block',
    padding: '10px 20px',
    background: '#1d4ed8',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    gap: 24,
    alignItems: 'start',
  },
  left: {},
  mainCard: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 16,
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  jobHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 20,
    flexWrap: 'wrap',
  },
  jobMeta: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: '#0f172a',
    letterSpacing: '-0.025em',
    marginBottom: 10,
    fontFamily: "'Sora', sans-serif",
  },
  badgeRow: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  categoryPill: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '3px 10px',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    background: '#dbeafe',
    color: '#1d4ed8',
    border: '1px solid #bfdbfe',
  },
  dateBlock: {
    textAlign: 'right',
    flexShrink: 0,
  },
  dateLabel: {
    display: 'block',
    fontSize: 11,
    fontWeight: 600,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: 600,
    color: '#0f172a',
  },
  infoRow: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: '16px 20px',
    display: 'flex',
    gap: 40,
    flexWrap: 'wrap',
  },
  infoItem: {
    display: 'flex',
    gap: 10,
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 600,
    color: '#0f172a',
  },
  section: {},
  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: 12,
    fontFamily: "'Sora', sans-serif",
    letterSpacing: '-0.01em',
  },
  descText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 1.75,
  },
  acceptedInfo: {
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: 12,
    padding: '16px',
    marginTop: 8,
  },
  acceptedHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  acceptedTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: '#166534',
  },
  acceptedDetails: {
    paddingLeft: 24,
  },
  acceptedName: {
    fontSize: 14,
    fontWeight: 500,
    color: '#0f172a',
  },
  acceptedDate: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  completedInfo: {
    background: '#fffbeb',
    border: '1px solid #fde68a',
    borderRadius: 12,
    padding: '16px',
    marginTop: 8,
  },
  completedHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  completedTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: '#92400e',
  },
  completedDetails: {
    paddingLeft: 24,
  },
  completedName: {
    fontSize: 14,
    fontWeight: 500,
    color: '#0f172a',
  },
  completedDate: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  contactCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: '14px 16px',
    background: '#fafafa',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: '#1d4ed8',
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 14,
    fontWeight: 700,
    color: '#0f172a',
  },
  contactMeta: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  messageBtn: {
    padding: '7px 18px',
    fontSize: 13,
    fontWeight: 600,
    color: '#1d4ed8',
    border: '1.5px solid #bfdbfe',
    borderRadius: 8,
    background: '#eff6ff',
    textDecoration: 'none',
    transition: 'background 0.15s',
    whiteSpace: 'nowrap',
  },
  right: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  loginCard: {
    background: '#ffffff',
    border: '2px solid #bfdbfe',
    borderRadius: 14,
    padding: '24px 20px',
    textAlign: 'center',
  },
  loginTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: 8,
    fontFamily: "'Sora', sans-serif",
  },
  loginText: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 16,
  },
  loginBtn: {
    display: 'inline-block',
    background: '#1d4ed8',
    color: '#ffffff',
    padding: '10px 20px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    textDecoration: 'none',
  },
  sideCard: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 14,
    padding: '22px 20px',
  },
  sideTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: 4,
    fontFamily: "'Sora', sans-serif",
  },
  sideDesc: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 14,
  },
  statusSelect: {
    width: '100%',
    border: '1.5px solid #e2e8f0',
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: 14,
    fontWeight: 500,
    color: '#0f172a',
    background: '#ffffff',
    outline: 'none',
    cursor: 'pointer',
    marginBottom: 12,
    fontFamily: "'DM Sans', sans-serif",
    appearance: 'none',
  },
  saveBtn: {
    width: '100%',
    background: '#1d4ed8',
    color: '#ffffff',
    border: 'none',
    borderRadius: 8,
    padding: '11px 0',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'background 0.15s',
  },
  acceptBtn: {
    width: '100%',
    background: '#10b981',
    color: '#ffffff',
    border: 'none',
    borderRadius: 8,
    padding: '11px 0',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'background 0.15s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  completeBtn: {
    width: '100%',
    background: '#f59e0b',
    color: '#ffffff',
    border: 'none',
    borderRadius: 8,
    padding: '11px 0',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'background 0.15s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  sideHr: {
    border: 'none',
    borderTop: '1px solid #f1f5f9',
    margin: '16px 0',
  },
  adminLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: 500,
    marginBottom: 10,
  },
  deleteBtn: {
    width: '100%',
    background: 'transparent',
    color: '#ef4444',
    border: '1.5px solid #fca5a5',
    borderRadius: 8,
    padding: '10px 0',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    fontFamily: "'DM Sans', sans-serif",
    transition: 'background 0.15s',
  },
  deleteWarning: {
    fontSize: 11,
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 6,
  },
  mapContainer: {
    height: 220,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 12,
    border: '1px solid #e2e8f0',
    position: 'relative',
  },
  mapPlaceholder: {
    height: 220,
    background: '#f1f5f9',
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  mapDot: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: '#1d4ed8',
    border: '3px solid #ffffff',
    boxShadow: '0 0 0 4px rgba(29,78,216,0.2)',
  },
  locationInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 0 6px 0',
    borderTop: '1px solid #f1f5f9',
    marginTop: 4,
  },
  locationText: {
    fontSize: 13,
    fontWeight: 500,
    color: '#0f172a',
  },
  mapNote: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 1.5,
    marginTop: 8,
  },
  skeletonWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    maxWidth: 600,
    padding: '40px 0',
  },
  skeleton: {
    background: '#f1f5f9',
    borderRadius: 8,
    animation: 'pulse 1.5s ease-in-out infinite',
  },
};