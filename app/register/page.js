'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Users, Eye, EyeOff, ShieldCheck, Lock } from 'lucide-react';
import API from '../lib/api';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.replace('/');
    } else {
      setIsChecking(false);
    }
  }, [router]);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'homeowner',
    agreed: false,
  });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const set = (field) => (e) =>
    setForm((p) => ({
      ...p,
      [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required.';
    if (!EMAIL_RE.test(form.email)) errs.email = 'Enter a valid email.';
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters.';
    if (!form.agreed) errs.agreed = 'You must agree to the terms.';
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
      const response = await API.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      if (response.data.success) {
        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Set default authorization header for future requests
        API.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        // Redirect to home page
        router.push('/');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setApiError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading while checking auth status
  if (isChecking) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.leftPanel}>
        <div style={styles.logoWrap}>
          <span style={styles.logo}>ServiceLink</span>
        </div>

        <div style={styles.formCard}>
          <h1 style={styles.title}>Create your account</h1>
          <p style={styles.sub}>
            Join the community of trusted service providers and homeowners.
          </p>

          {apiError && <div style={styles.apiErr}>{apiError}</div>}

          <form onSubmit={handleSubmit} style={styles.form} noValidate>
            <div style={styles.field}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={set('name')}
                style={{
                  ...styles.input,
                  ...(errors.name ? styles.inputErr : {}),
                }}
              />
              {errors.name && <span style={styles.err}>{errors.name}</span>}
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                placeholder="name@company.com"
                value={form.email}
                onChange={set('email')}
                style={{
                  ...styles.input,
                  ...(errors.email ? styles.inputErr : {}),
                }}
              />
              {errors.email && <span style={styles.err}>{errors.email}</span>}
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <div style={styles.passWrap}>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set('password')}
                  style={{
                    ...styles.input,
                    paddingRight: 42,
                    ...(errors.password ? styles.inputErr : {}),
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  style={styles.eyeBtn}
                >
                  {showPass ? (
                    <EyeOff size={16} color="#94a3b8" />
                  ) : (
                    <Eye size={16} color="#94a3b8" />
                  )}
                </button>
              </div>
              {errors.password && (
                <span style={styles.err}>{errors.password}</span>
              )}
            </div>

            <div style={styles.field}>
              <label style={styles.label}>I am a...</label>
              <div style={styles.roleRow}>
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, role: 'homeowner' }))}
                  style={{
                    ...styles.roleBtn,
                    ...(form.role === 'homeowner' ? styles.roleBtnActive : {}),
                  }}
                >
                  <Home
                    size={22}
                    color={form.role === 'homeowner' ? '#1d4ed8' : '#94a3b8'}
                    strokeWidth={1.8}
                  />
                  <span
                    style={{
                      ...styles.roleBtnLabel,
                      color: form.role === 'homeowner' ? '#1d4ed8' : '#64748b',
                    }}
                  >
                    Homeowner
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, role: 'provider' }))}
                  style={{
                    ...styles.roleBtn,
                    ...(form.role === 'provider' ? styles.roleBtnActive : {}),
                  }}
                >
                  <Users
                    size={22}
                    color={form.role === 'provider' ? '#1d4ed8' : '#94a3b8'}
                    strokeWidth={1.8}
                  />
                  <span
                    style={{
                      ...styles.roleBtnLabel,
                      color: form.role === 'provider' ? '#1d4ed8' : '#64748b',
                    }}
                  >
                    Service Provider
                  </span>
                </button>
              </div>
            </div>

            <div style={styles.termsRow}>
              <input
                type="checkbox"
                id="agreed"
                checked={form.agreed}
                onChange={set('agreed')}
                style={styles.checkbox}
              />
              <label htmlFor="agreed" style={styles.termsLabel}>
                I agree to the{' '}
                <Link href="#" style={styles.termsLink}>
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="#" style={styles.termsLink}>
                  Privacy Policy
                </Link>
                .
              </label>
            </div>
            {errors.agreed && (
              <span style={{ ...styles.err, marginTop: -8 }}>
                {errors.agreed}
              </span>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{
                ...styles.submitBtn,
                ...(submitting ? styles.submitDisabled : {}),
              }}
            >
              {submitting ? 'Creating Account...' : 'Create Account'}
            </button>

            <p style={styles.signInRow}>
              Already have an account?{' '}
              <Link href="/login" style={styles.signInLink}>
                Sign in
              </Link>
            </p>
          </form>

          <div style={styles.trustRow}>
            <div style={styles.trustItem}>
              <ShieldCheck size={14} color="#94a3b8" />
              <span style={styles.trustText}>Secure Encryption</span>
            </div>
            <div style={styles.trustItem}>
              <Lock size={14} color="#94a3b8" />
              <span style={styles.trustText}>Privacy Guaranteed</span>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.testimonialCard}>
          <div style={styles.testimonialQuote}>99</div>
          <p style={styles.testimonialText}>
            "ServiceLink helped me grow my small plumbing business by 40% in
            just six months. The platform makes management effortless."
          </p>
          <div style={styles.testimonialAuthor}>
            <div style={styles.testimonialAvatar}>MT</div>
            <div>
              <div style={styles.testimonialName}>Marcus T.</div>
              <div style={styles.testimonialRole}>Top Rated Provider</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    background: '#f8fafc',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
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
  leftPanel: {
    flex: '0 0 580px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 24px',
    overflowY: 'auto',
  },
  logoWrap: { marginBottom: 24 },
  logo: {
    fontFamily: "'Sora', sans-serif",
    fontWeight: 700,
    fontSize: 24,
    color: '#1d4ed8',
    letterSpacing: '-0.03em',
  },
  formCard: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 16,
    padding: '36px 36px 28px',
    width: '100%',
    maxWidth: 460,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: '#0f172a',
    letterSpacing: '-0.025em',
    marginBottom: 6,
    textAlign: 'center',
    fontFamily: "'Sora', sans-serif",
  },
  sub: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 1.5,
  },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 5 },
  label: { fontSize: 13, fontWeight: 600, color: '#374151' },
  input: {
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: 14,
    color: '#0f172a',
    outline: 'none',
    width: '100%',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'border-color 0.15s',
  },
  inputErr: { borderColor: '#ef4444' },
  passWrap: { position: 'relative' },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
  },
  err: { fontSize: 12, color: '#ef4444', fontWeight: 500 },
  roleRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
  roleBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    padding: '14px 10px',
    border: '1.5px solid #e2e8f0',
    borderRadius: 10,
    background: '#ffffff',
    cursor: 'pointer',
    transition: 'border-color 0.15s, background 0.15s',
  },
  roleBtnActive: {
    borderColor: '#1d4ed8',
    background: '#eff6ff',
  },
  roleBtnLabel: {
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
  },
  termsRow: { display: 'flex', alignItems: 'flex-start', gap: 8 },
  checkbox: { marginTop: 2, accentColor: '#1d4ed8', cursor: 'pointer' },
  termsLabel: { fontSize: 13, color: '#475569', lineHeight: 1.5 },
  termsLink: { color: '#1d4ed8', fontWeight: 500, textDecoration: 'none' },
  submitBtn: {
    width: '100%',
    background: '#1d4ed8',
    color: '#ffffff',
    border: 'none',
    borderRadius: 8,
    padding: '12px 0',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'background 0.15s',
    marginTop: 4,
  },
  submitDisabled: { opacity: 0.6, cursor: 'not-allowed' },
  signInRow: { textAlign: 'center', fontSize: 13, color: '#64748b' },
  signInLink: { color: '#1d4ed8', fontWeight: 600, textDecoration: 'none' },
  trustRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: 24,
    marginTop: 20,
    paddingTop: 16,
    borderTop: '1px solid #f1f5f9',
  },
  trustItem: { display: 'flex', alignItems: 'center', gap: 5 },
  trustText: { fontSize: 11, color: '#94a3b8' },
  rightPanel: {
    flex: 1,
    background: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    padding: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  testimonialCard: {
    background: 'rgba(255,255,255,0.97)',
    borderRadius: 14,
    padding: '20px 22px',
    maxWidth: 320,
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
  },
  testimonialQuote: {
    fontSize: 28,
    fontWeight: 800,
    color: '#1d4ed8',
    fontFamily: "'Sora', sans-serif",
    marginBottom: 8,
  },
  testimonialText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 1.65,
    fontStyle: 'italic',
    marginBottom: 14,
  },
  testimonialAuthor: { display: 'flex', alignItems: 'center', gap: 10 },
  testimonialAvatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: '#1d4ed8',
    color: '#fff',
    fontSize: 12,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  testimonialName: { fontSize: 13, fontWeight: 700, color: '#0f172a' },
  testimonialRole: { fontSize: 11, color: '#64748b', marginTop: 1 },
  apiErr: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: 13,
    color: '#dc2626',
    marginBottom: 16,
  },
};