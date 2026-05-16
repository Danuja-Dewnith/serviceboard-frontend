'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import API from '../lib/api';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  // Check if already logged in - but don't auto-redirect if token exists
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsChecking(false);
        return;
      }

      // Optionally verify token with backend
      try {
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await API.get('/auth/me');
        
        if (response.data.success) {
          // User is already logged in, redirect to home
          router.replace('/');
        } else {
          // Token is invalid, clear it
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsChecking(false);
        }
      } catch (error) {
        // Token verification failed, clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  const [form, setForm] = useState({
    email: '',
    password: '',
    remember: false,
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
    if (!EMAIL_RE.test(form.email)) errs.email = 'Enter a valid email address.';
    if (!form.password) errs.password = 'Password is required.';
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
      const response = await API.post('/auth/login', {
        email: form.email,
        password: form.password,
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
      console.error('Login error:', error);
      setApiError(error.response?.data?.message || 'Login failed. Please try again.');
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
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.shapeTL1} />
      <div style={styles.shapeTL2} />

      <div style={styles.logoBlock}>
        <div style={styles.logoRow}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="2.5" fill="#1d4ed8" />
            <circle cx="4"  cy="6"  r="2"   fill="#1d4ed8" />
            <circle cx="20" cy="6"  r="2"   fill="#1d4ed8" />
            <circle cx="4"  cy="18" r="2"   fill="#1d4ed8" />
            <circle cx="20" cy="18" r="2"   fill="#1d4ed8" />
            <line x1="12" y1="12" x2="4"  y2="6"  stroke="#1d4ed8" strokeWidth="1.5" />
            <line x1="12" y1="12" x2="20" y2="6"  stroke="#1d4ed8" strokeWidth="1.5" />
            <line x1="12" y1="12" x2="4"  y2="18" stroke="#1d4ed8" strokeWidth="1.5" />
            <line x1="12" y1="12" x2="20" y2="18" stroke="#1d4ed8" strokeWidth="1.5" />
          </svg>
          <span style={styles.logo}>ServiceLink</span>
        </div>
        <p style={styles.tagline}>Your gateway to professional services</p>
      </div>

      <div style={styles.card}>
        <h1 style={styles.cardTitle}>Sign In</h1>
        <p style={styles.cardSub}>
          Enter your credentials to access your dashboard.
        </p>

        <form onSubmit={handleSubmit} style={styles.form} noValidate>
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
            <div style={styles.passLabelRow}>
              <label style={styles.label}>Password</label>
              <Link href="#" style={styles.forgotLink}>
                Forgot password?
              </Link>
            </div>
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

          <div style={styles.rememberRow}>
            <input
              type="checkbox"
              id="remember"
              checked={form.remember}
              onChange={set('remember')}
              style={styles.checkbox}
            />
            <label htmlFor="remember" style={styles.rememberLabel}>
              Remember this device
            </label>
          </div>

          {apiError && <div style={styles.apiErr}>{apiError}</div>}

          <button
            type="submit"
            disabled={submitting}
            style={{
              ...styles.submitBtn,
              ...(submitting ? styles.submitDisabled : {}),
            }}
          >
            {submitting ? 'Signing in...' : 'Sign In'}
            {!submitting && <ArrowRight size={16} strokeWidth={2.5} />}
          </button>

          <div style={styles.dividerRow}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>Or continue with</span>
            <span style={styles.dividerLine} />
          </div>

          <div style={styles.socialRow}>
            <button type="button" style={styles.socialBtn}>
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Google
            </button>

            <button type="button" style={styles.socialBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Apple
            </button>
          </div>
        </form>
      </div>

      <p style={styles.signUpRow}>
        Don't have an account?{' '}
        <Link href="/register" style={styles.signUpLink}>
          Sign up
        </Link>
      </p>

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
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #e8eef8 0%, #dce8f8 40%, #c8d8f0 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 24px',
    position: 'relative',
    overflow: 'hidden',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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
  shapeTL1: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 220,
    height: 220,
    background: 'rgba(29,78,216,0.07)',
    clipPath: 'polygon(0 0, 100% 0, 0 100%)',
    pointerEvents: 'none',
  },
  shapeTL2: {
    position: 'absolute',
    top: 0,
    left: 60,
    width: 160,
    height: 160,
    background: 'rgba(29,78,216,0.05)',
    clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
    pointerEvents: 'none',
  },
  logoBlock: { textAlign: 'center', marginBottom: 20 },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 4,
  },
  logo: {
    fontFamily: "'Sora', sans-serif",
    fontWeight: 700,
    fontSize: 22,
    color: '#1d4ed8',
    letterSpacing: '-0.03em',
  },
  tagline: { fontSize: 13, color: '#64748b' },
  card: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 16,
    padding: '36px 36px 28px',
    width: '100%',
    maxWidth: 420,
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: '#0f172a',
    letterSpacing: '-0.025em',
    marginBottom: 6,
    fontFamily: "'Sora', sans-serif",
  },
  cardSub: { fontSize: 13, color: '#64748b', marginBottom: 24 },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 5 },
  label: { fontSize: 13, fontWeight: 600, color: '#374151' },
  input: {
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: '11px 14px',
    fontSize: 14,
    color: '#0f172a',
    outline: 'none',
    width: '100%',
    fontFamily: "'DM Sans', sans-serif",
    background: '#ffffff',
    transition: 'border-color 0.15s',
  },
  inputErr: { borderColor: '#ef4444' },
  passLabelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotLink: {
    fontSize: 13,
    color: '#1d4ed8',
    fontWeight: 500,
    textDecoration: 'none',
  },
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
  rememberRow: { display: 'flex', alignItems: 'center', gap: 8 },
  checkbox: { accentColor: '#1d4ed8', cursor: 'pointer', width: 15, height: 15 },
  rememberLabel: { fontSize: 13, color: '#475569' },
  apiErr: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: 13,
    color: '#dc2626',
  },
  submitBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    background: '#1d4ed8',
    color: '#ffffff',
    border: 'none',
    borderRadius: 8,
    padding: '12px 0',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'background 0.15s',
  },
  submitDisabled: { opacity: 0.6, cursor: 'not-allowed' },
  dividerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: '#e2e8f0',
  },
  dividerText: { fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap' },
  socialRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
  socialBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    border: '1.5px solid #e2e8f0',
    borderRadius: 8,
    padding: '10px 0',
    fontSize: 13,
    fontWeight: 600,
    color: '#374151',
    background: '#ffffff',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'border-color 0.15s',
  },
  signUpRow: {
    marginTop: 18,
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
  },
  signUpLink: {
    color: '#1d4ed8',
    fontWeight: 600,
    textDecoration: 'none',
  },
  trustRow: {
    display: 'flex',
    gap: 24,
    marginTop: 16,
  },
  trustItem: { display: 'flex', alignItems: 'center', gap: 5 },
  trustText: { fontSize: 11, color: '#94a3b8' },
};