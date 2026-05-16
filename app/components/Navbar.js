'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Plus,
  User,
  LogIn,
  UserPlus,
  ChevronDown,
  LogOut,
  Briefcase,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const checkLoginStatus = () => {
      if (typeof window === 'undefined') return;
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (token && userData) {
        try {
          setIsLoggedIn(true);
          setUser(JSON.parse(userData));
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsLoggedIn(false);
          setUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };
    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);
    return () => window.removeEventListener('storage', checkLoginStatus);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setIsDropdownOpen(false);
    router.push('/');
  };

  const handlePostJob = () => {
    router.push(isLoggedIn ? '/new' : '/login');
  };

  const getLinks = () => {
    const base = [{ href: '/', label: 'Browse Jobs' }];
    if (isLoggedIn && user?.role === 'provider') {
      base.push({ href: '/my-jobs', label: 'My Jobs' });
    } else {
      base.push({ href: '/my-requests', label: 'My Requests' });
    }
    base.push({ href: '/about', label: 'About' });
    return base;
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      <style>{`
        .sb-nav-link:hover        { background: #f1f5f9; color: #1d4ed8; }
        .sb-profile-btn:hover     { background: #f1f5f9; }
        .sb-dropdown-item:hover   { background: #f1f5f9; }
        .sb-dropdown-danger:hover { background: #fef2f2; }
        .sb-post-job-btn:hover    { background: #1e40af; }
      `}</style>

      <header style={styles.header}>
        <div style={styles.inner}>
          <Link href="/" style={styles.logo}>ServiceBoard</Link>

          <nav style={styles.nav}>
            {getLinks().map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className="sb-nav-link"
                  style={{ ...styles.navLink, ...(active ? styles.navLinkActive : {}) }}
                >
                  {label}
                  {active && <span style={styles.activeDot} />}
                </Link>
              );
            })}
          </nav>

          <div style={styles.rightSection}>
            <button onClick={handlePostJob} className="sb-post-job-btn" style={styles.cta}>
              <Plus size={16} strokeWidth={2.5} />
              Post Job
            </button>

            <div style={styles.profileWrapper} ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen((o) => !o)}
                className="sb-profile-btn"
                style={styles.profile}
                aria-label="Account menu"
                aria-expanded={isDropdownOpen}
              >
                {isLoggedIn && user ? (
                  <div style={styles.avatar}>{getUserInitials()}</div>
                ) : (
                  <User size={18} strokeWidth={2} />
                )}
                <ChevronDown
                  size={14}
                  strokeWidth={2}
                  style={{
                    opacity: 0.6,
                    transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.2s',
                  }}
                />
              </button>

              {isDropdownOpen && (
                <div style={styles.dropdown} role="menu">
                  {isLoggedIn ? (
                    <>
                      <div style={styles.userInfo}>
                        <div style={styles.userAvatar}>{getUserInitials()}</div>
                        <div>
                          <div style={styles.userName}>{user?.name}</div>
                          <div style={styles.userEmail}>{user?.email}</div>
                          <div style={styles.userRole}>
                            {user?.role === 'provider' ? 'Service Provider' : 'Homeowner'}
                          </div>
                        </div>
                      </div>

                      <div style={styles.divider} />

                      {user?.role === 'provider' ? (
                        <Link href="/my-jobs" className="sb-dropdown-item" style={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}>
                          <Briefcase size={16} strokeWidth={2} />
                          My Jobs
                        </Link>
                      ) : (
                        <Link href="/my-requests" className="sb-dropdown-item" style={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}>
                          <Briefcase size={16} strokeWidth={2} />
                          My Requests
                        </Link>
                      )}

                      <div style={styles.divider} />

                      <button
                        onClick={handleLogout}
                        className="sb-dropdown-danger"
                        style={styles.dropdownItemButton}
                      >
                        <LogOut size={16} strokeWidth={2} />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="sb-dropdown-item" style={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}>
                        <LogIn size={16} strokeWidth={2} />
                        Sign In
                      </Link>
                      <Link href="/register" className="sb-dropdown-item" style={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}>
                        <UserPlus size={16} strokeWidth={2} />
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
  },
  inner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 24px',
    height: 60,
    display: 'flex',
    alignItems: 'center',
    gap: 32,
  },
  logo: {
    fontFamily: "'Sora', sans-serif",
    fontWeight: 700,
    fontSize: 18,
    color: '#1d4ed8',
    letterSpacing: '-0.03em',
    textDecoration: 'none',
    marginRight: 8,
    flexShrink: 0,
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  navLink: {
    position: 'relative',
    padding: '6px 12px',
    fontSize: 14,
    fontWeight: 500,
    color: '#475569',
    textDecoration: 'none',
    borderRadius: 8,
    transition: 'color 0.15s, background 0.15s',
  },
  navLinkActive: {
    color: '#1d4ed8',
    fontWeight: 600,
  },
  activeDot: {
    position: 'absolute',
    bottom: -1,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 20,
    height: 2,
    background: '#1d4ed8',
    borderRadius: 2,
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
  },
  cta: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: '#1d4ed8',
    color: '#ffffff',
    padding: '8px 16px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'background 0.15s',
  },
  profileWrapper: { position: 'relative' },
  profile: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 36,
    padding: '0 10px',
    borderRadius: 8,
    color: '#475569',
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
    transition: 'background 0.15s',
    fontFamily: "'DM Sans', sans-serif",
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: '#1d4ed8',
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    minWidth: 240,
    background: '#ffffff',
    borderRadius: 12,
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.12), 0 4px 10px -6px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    zIndex: 1000,
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 16px',
    background: '#f8fafc',
  },
  userAvatar: {
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
  userName:  { fontSize: 14, fontWeight: 600, color: '#0f172a' },
  userEmail: { fontSize: 12, color: '#64748b', marginTop: 2 },
  userRole:  { fontSize: 11, color: '#1d4ed8', marginTop: 2, fontWeight: 600 },
  divider:   { height: 1, background: '#e2e8f0', margin: '4px 0' },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 16px',
    fontSize: 14,
    fontWeight: 500,
    color: '#475569',
    textDecoration: 'none',
    transition: 'background 0.15s',
    cursor: 'pointer',
  },
  dropdownItemButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 16px',
    fontSize: 14,
    fontWeight: 500,
    color: '#dc2626',
    transition: 'background 0.15s',
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    width: '100%',
    textAlign: 'left',
    fontFamily: "'DM Sans', sans-serif",
  },
};