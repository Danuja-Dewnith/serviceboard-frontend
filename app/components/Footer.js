import Link from 'next/link';
import { Globe, Mail, Share2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        {/* Brand */}
        <div style={styles.brand}>
          <span style={styles.logo}>ServiceBoard</span>
          <p style={styles.tagline}>
            Connecting skilled professionals with reliable job opportunities
            through transparency and professional excellence.
          </p>
          <div style={styles.iconRow}>
            <button style={styles.iconBtn} aria-label="Website">
              <Globe size={16} />
            </button>
            <button style={styles.iconBtn} aria-label="Email">
              <Mail size={16} />
            </button>
            <button style={styles.iconBtn} aria-label="Share">
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* Links */}
        <div style={styles.col}>
          <h4 style={styles.colTitle}>For Professionals</h4>
          <Link href="/" style={styles.link}>Browse Jobs</Link>
          <Link href="#" style={styles.link}>Service Fees</Link>
          <Link href="#" style={styles.link}>Professional App</Link>
        </div>

        <div style={styles.col}>
          <h4 style={styles.colTitle}>Company</h4>
          <Link href="#" style={styles.link}>About Us</Link>
          <Link href="#" style={styles.link}>Help Center</Link>
          <Link href="#" style={styles.link}>Terms & Privacy</Link>
        </div>
      </div>

      <div style={styles.bottom}>
        <span style={styles.copy}>© 2024 ServiceBoard Inc. All rights reserved.</span>
        <div style={styles.bottomLinks}>
          <Link href="#" style={styles.bottomLink}>Privacy</Link>
          <Link href="#" style={styles.bottomLink}>Terms</Link>
          <Link href="#" style={styles.bottomLink}>Cookies</Link>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: '#ffffff',
    borderTop: '1px solid #e2e8f0',
    marginTop: 80,
  },
  inner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '48px 24px 32px',
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    gap: 48,
  },
  brand: {},
  logo: {
    fontFamily: "'Sora', sans-serif",
    fontWeight: 700,
    fontSize: 18,
    color: '#1d4ed8',
    letterSpacing: '-0.03em',
  },
  tagline: {
    marginTop: 12,
    fontSize: 13,
    color: '#64748b',
    lineHeight: 1.6,
    maxWidth: 280,
  },
  iconRow: {
    display: 'flex',
    gap: 8,
    marginTop: 20,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    border: '1px solid #e2e8f0',
    background: 'transparent',
    color: '#64748b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'border-color 0.15s, color 0.15s',
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  colTitle: {
    fontFamily: "'Sora', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    color: '#0f172a',
    marginBottom: 4,
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
  },
  link: {
    fontSize: 14,
    color: '#64748b',
    textDecoration: 'none',
    transition: 'color 0.15s',
  },
  bottom: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '16px 24px',
    borderTop: '1px solid #f1f5f9',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  copy: {
    fontSize: 12,
    color: '#94a3b8',
  },
  bottomLinks: {
    display: 'flex',
    gap: 20,
  },
  bottomLink: {
    fontSize: 12,
    color: '#94a3b8',
    textDecoration: 'none',
  },
};