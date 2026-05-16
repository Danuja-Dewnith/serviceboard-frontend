'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ClipboardList,
  Users,
  Shield,
  HelpCircle,
  MapPin,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { createJob } from '../lib/api';

const CATEGORIES = [
  'Plumbing',
  'Electrical',
  'Painting',
  'Joinery',
  'Gardening',
  'Cleaning',
  'Roofing',
  'Other',
];

const HOW_IT_WORKS = [
  {
    icon: <ClipboardList size={18} color="#1d4ed8" />,
    title: 'Post Your Job',
    desc: 'Describe your task clearly with location and requirements so the right professionals can find it.',
  },
  {
    icon: <Users size={18} color="#1d4ed8" />,
    title: 'Professionals Reach Out',
    desc: 'Interested service providers will review your job and contact you directly if they want to take it on.',
  },
  {
    icon: <Shield size={18} color="#1d4ed8" />,
    title: 'Accept & Pay in Cash',
    desc: 'You choose who to hire. Once the job is done to your satisfaction, pay the professional directly in cash.',
  },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewJobPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    category: '',
    location: '',
    description: '',
    contactName: '',
    contactEmail: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Job title is required.';
    if (!form.category) errs.category = 'Please select a category.';
    if (!form.location.trim()) errs.location = 'Location is required.';
    if (form.description.trim().length < 50)
      errs.description = 'Description must be at least 50 characters.';
    if (!form.contactName.trim()) errs.contactName = 'Contact name is required.';
    if (!EMAIL_RE.test(form.contactEmail))
      errs.contactEmail = 'Please enter a valid business email.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    setApiError('');
    try {
      const payload = {
        title: form.title,
        category: form.category,
        location: form.location,
        description: form.description,
        contactName: form.contactName,
        contactEmail: form.contactEmail,
        status: 'open',
      };
      const res = await createJob(payload);
      const id = res.data?.data?._id || res.data?._id || '1';
      router.push(`/job/${id}`);
    } catch (err) {
      setApiError(err.message || 'Failed to post job. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main style={styles.main}>
        <div style={styles.container}>
          {/* Left sidebar */}
          <aside style={styles.sidebar}>
            {/* How it works */}
            <div style={styles.sideCard}>
              <h3 style={styles.sideTitle}>How it works</h3>
              <div style={styles.steps}>
                {HOW_IT_WORKS.map(({ icon, title, desc }) => (
                  <div key={title} style={styles.step}>
                    <div style={styles.stepIcon}>{icon}</div>
                    <div>
                      <div style={styles.stepTitle}>{title}</div>
                      <div style={styles.stepDesc}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Help card */}
            <div style={styles.helpCard}>
              <div style={styles.helpOverlay}>
                <HelpCircle size={20} color="#ffffff" />
                <strong style={styles.helpTitle}>Need help?</strong>
                <p style={styles.helpText}>
                  Our support team is available 24/7 to help you structure your
                  request.
                </p>
              </div>
            </div>
          </aside>

          {/* Form card */}
          <div style={styles.formCard}>
            <h1 style={styles.formTitle}>Post a New Job</h1>
            <p style={styles.formSub}>
              Provide details about the task you need completed to start receiving
              offers.
            </p>

            <form onSubmit={handleSubmit} style={styles.form} noValidate>
              {/* Job Title */}
              <div style={styles.field}>
                <label style={styles.label}>Job Title</label>
                <input
                  type="text"
                  placeholder="e.g. Office HVAC Maintenance"
                  value={form.title}
                  onChange={set('title')}
                  style={{
                    ...styles.input,
                    ...(errors.title ? styles.inputError : {}),
                  }}
                />
                {errors.title && <span style={styles.errMsg}>{errors.title}</span>}
              </div>

              {/* Category + Location */}
              <div style={styles.row}>
                <div style={{ ...styles.field, flex: 1 }}>
                  <label style={styles.label}>Category</label>
                  <select
                    value={form.category}
                    onChange={set('category')}
                    style={{
                      ...styles.input,
                      ...styles.select,
                      ...(errors.category ? styles.inputError : {}),
                    }}
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <span style={styles.errMsg}>{errors.category}</span>
                  )}
                </div>

                <div style={{ ...styles.field, flex: 1 }}>
                  <label style={styles.label}>Location</label>
                  <div style={styles.inputWrap}>
                    <MapPin
                      size={15}
                      color="#94a3b8"
                      style={styles.inputPrefixIcon}
                    />
                    <input
                      type="text"
                      placeholder="City or zip code"
                      value={form.location}
                      onChange={set('location')}
                      style={{
                        ...styles.input,
                        paddingLeft: 36,
                        ...(errors.location ? styles.inputError : {}),
                      }}
                    />
                  </div>
                  {errors.location && (
                    <span style={styles.errMsg}>{errors.location}</span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div style={styles.field}>
                <label style={styles.label}>Description</label>
                <textarea
                  placeholder="Describe the job in detail, including goals, timelines, and specific requirements..."
                  value={form.description}
                  onChange={set('description')}
                  rows={6}
                  style={{
                    ...styles.input,
                    ...styles.textarea,
                    ...(errors.description ? styles.inputError : {}),
                  }}
                />
                <span style={styles.hint}>Minimum 50 characters recommended.</span>
                {errors.description && (
                  <span style={styles.errMsg}>{errors.description}</span>
                )}
              </div>

              {/* Contact row */}
              <div style={styles.row}>
                <div style={{ ...styles.field, flex: 1 }}>
                  <label style={styles.label}>Contact Name</label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={form.contactName}
                    onChange={set('contactName')}
                    style={{
                      ...styles.input,
                      ...(errors.contactName ? styles.inputError : {}),
                    }}
                  />
                  {errors.contactName && (
                    <span style={styles.errMsg}>{errors.contactName}</span>
                  )}
                </div>

                <div style={{ ...styles.field, flex: 1 }}>
                  <label style={styles.label}>Contact Email</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={form.contactEmail}
                    onChange={set('contactEmail')}
                    style={{
                      ...styles.input,
                      ...(errors.contactEmail ? styles.inputError : {}),
                    }}
                  />
                  {errors.contactEmail && (
                    <span style={{ ...styles.errMsg, color: '#ef4444' }}>
                      {errors.contactEmail}
                    </span>
                  )}
                </div>
              </div>

              {apiError && <div style={styles.apiErr}>{apiError}</div>}

              <hr style={styles.divider} />

              {/* Actions */}
              <div style={styles.actions}>
                <Link href="/" style={styles.cancelBtn}>Cancel</Link>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    ...styles.submitBtn,
                    ...(submitting ? styles.submitDisabled : {}),
                  }}
                >
                  {submitting ? 'Posting...' : 'Post Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

const styles = {
  main: {
    padding: '40px 0 60px',
  },
  container: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '0 24px',
    display: 'grid',
    gridTemplateColumns: '300px 1fr',
    gap: 28,
    alignItems: 'start',
  },

  // Sidebar
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  sideCard: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: 14,
    padding: '24px 20px',
  },
  sideTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: 18,
    fontFamily: "'Sora', sans-serif",
  },
  steps: {
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },
  step: {
    display: 'flex',
    gap: 12,
    alignItems: 'flex-start',
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: '#eff6ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: '#0f172a',
    marginBottom: 3,
  },
  stepDesc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 1.5,
  },
  helpCard: {
    borderRadius: 14,
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
    minHeight: 160,
    position: 'relative',
  },
  helpOverlay: {
    padding: '24px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  helpTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: '#ffffff',
    fontFamily: "'Sora', sans-serif",
  },
  helpText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.5,
  },

  // Form card
  formCard: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 16,
    padding: '36px 36px 32px',
  },
  formTitle: {
    fontSize: 26,
    fontWeight: 700,
    color: '#0f172a',
    letterSpacing: '-0.03em',
    marginBottom: 6,
  },
  formSub: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 28,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: '#374151',
  },
  input: {
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: 14,
    color: '#0f172a',
    outline: 'none',
    background: '#ffffff',
    width: '100%',
    transition: 'border-color 0.15s',
    fontFamily: "'DM Sans', sans-serif",
  },
  inputError: {
    borderColor: '#ef4444',
  },
  select: {
    appearance: 'none',
    cursor: 'pointer',
  },
  textarea: {
    resize: 'vertical',
    lineHeight: 1.6,
    minHeight: 140,
  },
  inputWrap: {
    position: 'relative',
  },
  inputPrefixIcon: {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
  },
  hint: {
    fontSize: 12,
    color: '#94a3b8',
  },
  errMsg: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: 500,
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #f1f5f9',
    margin: '4px 0',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12,
    alignItems: 'center',
  },
  cancelBtn: {
    padding: '10px 22px',
    fontSize: 14,
    fontWeight: 600,
    color: '#475569',
    border: '1.5px solid #e2e8f0',
    borderRadius: 8,
    background: 'transparent',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'border-color 0.15s',
  },
  submitBtn: {
    padding: '10px 28px',
    fontSize: 14,
    fontWeight: 600,
    color: '#ffffff',
    background: '#1d4ed8',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'background 0.15s',
  },
  submitDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  apiErr: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: 13,
    color: '#dc2626',
  },
};