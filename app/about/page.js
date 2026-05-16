'use client';

import Link from 'next/link';
import { 
  CheckCircle, 
  Code, 
  Database, 
  Layout, 
  Shield, 
  Zap,
  Mail,
  Calendar,
  MapPin,
  Search,
  Filter,
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  LogIn,
  Bell,
  Globe,
  Clock,
  Award,
  BookOpen,
  Server,
  Smartphone,
  Lock,
  Cloud,
  FileText,
  Star,
  Briefcase,
  TrendingUp,
  CreditCard,
  Settings,
  ArrowLeft,
  ArrowRight,
  Home,
  Users,
  HelpCircle,
  ClipboardList,
  SlidersHorizontal,
  CircleDot,
  LogOut,
  ChevronDown,
  AlertCircle,
  Info,
  GitBranch,
  ExternalLink
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      
      <main style={styles.main}>
        <div style={styles.container}>
          
          {/* Hero Section */}
          <div style={styles.hero}>
            <h1 style={styles.title}>About ServiceBoard</h1>
            <p style={styles.subtitle}>
              A full-stack service request board built for the GlobalTNA 
              Full-Stack Developer Intern assessment.
            </p>
            <div style={styles.badges}>
              <span style={styles.badge}>Full Stack</span>
              <span style={styles.badge}>Next.js 14</span>
              <span style={styles.badge}>Express.js</span>
              <span style={styles.badge}>MongoDB</span>
              <span style={styles.badge}>JWT Auth</span>
            </div>
          </div>

          {/* Project Overview */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>📋 Project Overview</h2>
            <p style={styles.text}>
              ServiceBoard is a stripped-down, single-page version of a service request platform 
              where homeowners can post service requests and tradespeople can browse, accept, 
              and complete jobs. This project was developed as part of the GlobalTNA 
              Full-Stack Developer Intern assessment.
            </p>
            <div style={styles.infoBox}>
              <Calendar size={18} color="#1d4ed8" />
              <span><strong>Submission Date:</strong> 18 May 2026</span>
              <span style={styles.separator}>|</span>
              <Award size={18} color="#1d4ed8" />
              <span><strong>Status:</strong> Completed with bonus features</span>
            </div>
          </div>

          {/* Tech Stack - Detailed */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>🛠️ Technology Stack</h2>
            <div style={styles.stackGrid}>
              <div style={styles.stackCard}>
                <Layout size={28} color="#1d4ed8" />
                <h3 style={styles.stackCardH3}>Frontend</h3>
                <ul style={styles.stackCardUl}>
                  <li style={styles.stackCardLi}>Next.js 14 (App Router)</li>
                  <li style={styles.stackCardLi}>React 18 with Hooks</li>
                  <li style={styles.stackCardLi}>CSS-in-JS (inline styles)</li>
                  <li style={styles.stackCardLi}>Lucide React Icons</li>
                  <li style={styles.stackCardLi}>Axios for API calls</li>
                  <li style={styles.stackCardLi}>Leaflet for maps</li>
                </ul>
              </div>
              
              <div style={styles.stackCard}>
                <Server size={28} color="#1d4ed8" />
                <h3 style={styles.stackCardH3}>Backend</h3>
                <ul style={styles.stackCardUl}>
                  <li style={styles.stackCardLi}>Node.js + Express.js</li>
                  <li style={styles.stackCardLi}>RESTful API design</li>
                  <li style={styles.stackCardLi}>JWT Authentication</li>
                  <li style={styles.stackCardLi}>bcryptjs for password hashing</li>
                  <li style={styles.stackCardLi}>Nodemailer for emails</li>
                  <li style={styles.stackCardLi}>CORS enabled</li>
                </ul>
              </div>
              
              <div style={styles.stackCard}>
                <Database size={28} color="#1d4ed8" />
                <h3 style={styles.stackCardH3}>Database</h3>
                <ul style={styles.stackCardUl}>
                  <li style={styles.stackCardLi}>MongoDB Atlas (Cloud)</li>
                  <li style={styles.stackCardLi}>Mongoose ODM</li>
                  <li style={styles.stackCardLi}>Data validation</li>
                  <li style={styles.stackCardLi}>Timestamps (createdAt, updatedAt)</li>
                  <li style={styles.stackCardLi}>Population for references</li>
                </ul>
              </div>
              
              <div style={styles.stackCard}>
                <Cloud size={28} color="#1d4ed8" />
                <h3 style={styles.stackCardH3}>Deployment</h3>
                <ul style={styles.stackCardUl}>
                  <li style={styles.stackCardLi}>Frontend: Vercel</li>
                  <li style={styles.stackCardLi}>Backend: Render/Railway</li>
                  <li style={styles.stackCardLi}>Database: MongoDB Atlas</li>
                  <li style={styles.stackCardLi}>Environment variables</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Core Features (Required) */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>✅ Core Features (Required)</h2>
            <div style={styles.featuresGrid}>
              <div style={styles.featureItem}>
                <CheckCircle size={18} color="#10b981" />
                <div>
                  <strong>Home Page</strong>
                  <p style={styles.featureDesc}>List all job requests as cards with category filter</p>
                </div>
              </div>
              <div style={styles.featureItem}>
                <CheckCircle size={18} color="#10b981" />
                <div>
                  <strong>New Job Form</strong>
                  <p style={styles.featureDesc}>Create new requests with client-side validation</p>
                </div>
              </div>
              <div style={styles.featureItem}>
                <CheckCircle size={18} color="#10b981" />
                <div>
                  <strong>Job Detail Page</strong>
                  <p style={styles.featureDesc}>Full details, status update dropdown, delete button</p>
                </div>
              </div>
              <div style={styles.featureItem}>
                <CheckCircle size={18} color="#10b981" />
                <div>
                  <strong>REST API</strong>
                  <p style={styles.featureDesc}>All CRUD operations with proper HTTP status codes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bonus Features */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>⭐ Bonus Features Implemented</h2>
            <div style={styles.bonusGrid}>
              <div style={styles.bonusItem}>
                <Search size={18} color="#f59e0b" />
                <span>Keyword search across title & description</span>
              </div>
              <div style={styles.bonusItem}>
                <UserPlus size={18} color="#f59e0b" />
                <span>JWT-based authentication (login/register)</span>
              </div>
              <div style={styles.bonusItem}>
                <Shield size={18} color="#f59e0b" />
                <span>Role-based access (Homeowner vs Provider)</span>
              </div>
              <div style={styles.bonusItem}>
                <Globe size={18} color="#f59e0b" />
                <span>Deployed to Vercel + Render</span>
              </div>
              <div style={styles.bonusItem}>
                <Bell size={18} color="#f59e0b" />
                <span>Email notifications on job acceptance</span>
              </div>
              <div style={styles.bonusItem}>
                <MapPin size={18} color="#f59e0b" />
                <span>Interactive map for job locations (Leaflet)</span>
              </div>
              <div style={styles.bonusItem}>
                <Clock size={18} color="#f59e0b" />
                <span>Sri Lanka timezone support</span>
              </div>
              <div style={styles.bonusItem}>
                <Filter size={18} color="#f59e0b" />
                <span>Advanced filtering by category & status</span>
              </div>
              <div style={styles.bonusItem}>
                <Database size={18} color="#f59e0b" />
                <span>Data seeding script for sample jobs</span>
              </div>
              <div style={styles.bonusItem}>
                <Smartphone size={18} color="#f59e0b" />
                <span>Responsive design (mobile-friendly)</span>
              </div>
            </div>
          </div>

          {/* API Endpoints */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>🔌 API Endpoints</h2>
            <div style={styles.apiTable}>
              <div style={styles.apiHeader}>
                <span>Method</span>
                <span>Endpoint</span>
                <span>Description</span>
                <span>Auth</span>
              </div>
              <div style={styles.apiRow}>
                <span style={{...styles.method, background: '#10b981'}}>GET</span>
                <code style={styles.apiCode}>/api/jobs</code>
                <span>List all jobs (supports ?category & ?status)</span>
                <span>❌ No</span>
              </div>
              <div style={styles.apiRow}>
                <span style={{...styles.method, background: '#10b981'}}>GET</span>
                <code style={styles.apiCode}>/api/jobs/:id</code>
                <span>Fetch a single job</span>
                <span>❌ No</span>
              </div>
              <div style={styles.apiRow}>
                <span style={{...styles.method, background: '#1d4ed8'}}>POST</span>
                <code style={styles.apiCode}>/api/jobs</code>
                <span>Create a new job (validates required fields)</span>
                <span>✅ Yes</span>
              </div>
              <div style={styles.apiRow}>
                <span style={{...styles.method, background: '#f59e0b'}}>PATCH</span>
                <code style={styles.apiCode}>/api/jobs/:id</code>
                <span>Update job status only</span>
                <span>❌ No</span>
              </div>
              <div style={styles.apiRow}>
                <span style={{...styles.method, background: '#ef4444'}}>DELETE</span>
                <code style={styles.apiCode}>/api/jobs/:id</code>
                <span>Delete a job</span>
                <span>✅ Yes</span>
              </div>
              <div style={styles.apiRow}>
                <span style={{...styles.method, background: '#1d4ed8'}}>POST</span>
                <code style={styles.apiCode}>/api/auth/register</code>
                <span>Register new user</span>
                <span>❌ No</span>
              </div>
              <div style={styles.apiRow}>
                <span style={{...styles.method, background: '#1d4ed8'}}>POST</span>
                <code style={styles.apiCode}>/api/auth/login</code>
                <span>User login (returns JWT token)</span>
                <span>❌ No</span>
              </div>
              <div style={styles.apiRow}>
                <span style={{...styles.method, background: '#10b981'}}>GET</span>
                <code style={styles.apiCode}>/api/auth/me</code>
                <span>Get current user info</span>
                <span>✅ Yes</span>
              </div>
            </div>
          </div>

          {/* Setup Instructions */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>🚀 Setup Instructions</h2>
            <div style={styles.setupBox}>
              <h3 style={styles.setupH3}>Prerequisites</h3>
              <ul style={styles.setupUl}>
                <li>Node.js (v18 or higher)</li>
                <li>MongoDB Atlas account or local MongoDB</li>
                <li>Git</li>
              </ul>
              
              <h3 style={styles.setupH3}>Environment Variables</h3>
              <div style={styles.codeBlock}>
                <code># Backend (.env)</code>
                <code>PORT=5000</code>
                <code>MONGODB_URI=your_mongodb_connection_string</code>
                <code>JWT_SECRET=your_secret_key</code>
                <code>EMAIL_USER=your_email@gmail.com</code>
                <code>EMAIL_PASS=your_app_password</code>
                <br/>
                <code># Frontend (.env.local)</code>
                <code>NEXT_PUBLIC_API_URL=http://localhost:5000/api</code>
              </div>
              
              <h3 style={styles.setupH3}>Run Locally</h3>
              <div style={styles.codeBlock}>
                <code># Clone repository</code>
                <code>git clone https://github.com/yourusername/serviceboard.git</code>
                <code>cd serviceboard</code>
                <br/>
                <code># Backend</code>
                <code>cd backend</code>
                <code>npm install</code>
                <code>npm run dev</code>
                <br/>
                <code># Frontend (new terminal)</code>
                <code>cd frontend</code>
                <code>npm install</code>
                <code>npm run dev</code>
              </div>
            </div>
          </div>

          {/* Live Demo Links */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>🌐 Live Demo</h2>
            <div style={styles.linksBox}>
              <a href="#" style={styles.linkButton}>
                <Globe size={18} />
                Frontend (Vercel)
              </a>
              <a href="#" style={styles.linkButton}>
                <Server size={18} />
                Backend API (Railway)
              </a>
              <a href="#" style={styles.linkButton}>
                <GitBranch size={18} />
                GitHub Repository
              </a>
            </div>
          </div>

          {/* Developer Info */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>👨‍💻 Developer</h2>
            <div style={styles.developerBox}>
              <div><strong>Name:</strong> Your Name</div>
              <div><strong>Email:</strong> <a href="mailto:danujadewnith@gmail.com" style={styles.emailLink}>danujadewnith@gmail.com</a></div>
              <div><strong>GitHub:</strong> <a href="https://github.com/Danuja-Dewnith" style={styles.link} target="_blank" rel="noopener noreferrer">https://github.com/Danuja-Dewnith</a></div>
              <div><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/danuja-dewnith-munasingha-53439a371" style={styles.link} target="_blank" rel="noopener noreferrer">https://www.linkedin.com/in/danuja-dewnith-munasingha-53439a371</a></div>
            </div>
          </div>

          {/* Footer Note */}
          <div style={styles.footerNote}>
            <p>© 2026 ServiceBoard | Built for GlobalTNA Full-Stack Developer Intern Assessment</p>
            <p>Submission Date: 18 May 2026</p>
          </div>

        </div>
      </main>
      
      <Footer />
    </>
  );
}

// Styles
const styles = {
  main: { padding: '48px 0 60px', minHeight: 'calc(100vh - 200px)' },
  container: { maxWidth: 1200, margin: '0 auto', padding: '0 24px' },
  
  hero: { textAlign: 'center', marginBottom: 48 },
  title: { fontSize: 42, fontWeight: 700, color: '#0f172a', marginBottom: 16, fontFamily: "'Sora', sans-serif" },
  subtitle: { fontSize: 18, color: '#64748b', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 },
  badges: { display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' },
  badge: { background: '#f1f5f9', padding: '6px 14px', borderRadius: 20, fontSize: 13, color: '#475569', fontWeight: 500 },
  
  section: { marginBottom: 48 },
  sectionTitle: { fontSize: 26, fontWeight: 700, color: '#0f172a', marginBottom: 24, fontFamily: "'Sora', sans-serif" },
  text: { fontSize: 16, color: '#475569', lineHeight: 1.7 },
  
  infoBox: { background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '16px 20px', display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap', marginTop: 20 },
  separator: { color: '#cbd5e1' },
  
  stackGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 },
  stackCard: { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '24px' },
  stackCardH3: { fontSize: 18, fontWeight: 600, margin: '12px 0 16px', color: '#0f172a' },
  stackCardUl: { listStyle: 'none', padding: 0, margin: 0 },
  stackCardLi: { fontSize: 14, color: '#64748b', padding: '6px 0', borderBottom: '1px solid #f1f5f9' },
  
  featuresGrid: { display: 'flex', flexDirection: 'column', gap: 16 },
  featureItem: { display: 'flex', gap: 14, alignItems: 'flex-start', padding: '12px', background: '#f8fafc', borderRadius: 10 },
  featureDesc: { fontSize: 13, color: '#64748b', marginTop: 4 },
  
  bonusGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 },
  bonusItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: '#fffbeb', borderRadius: 8, fontSize: 14, color: '#92400e' },
  
  apiTable: { border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' },
  apiHeader: { display: 'grid', gridTemplateColumns: '80px 180px 1fr 80px', background: '#f8fafc', padding: '12px 16px', fontWeight: 600, borderBottom: '1px solid #e2e8f0' },
  apiRow: { display: 'grid', gridTemplateColumns: '80px 180px 1fr 80px', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', alignItems: 'center' },
  method: { display: 'inline-block', padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700, color: '#fff' },
  apiCode: { fontSize: 12, fontFamily: 'monospace' },
  
  setupBox: { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '24px' },
  setupH3: { fontSize: 16, fontWeight: 600, marginBottom: 12, marginTop: 20, color: '#0f172a' },
  setupUl: { marginBottom: 20, paddingLeft: 20 },
  codeBlock: { background: '#1e293b', color: '#e2e8f0', padding: '16px', borderRadius: 8, fontFamily: 'monospace', fontSize: 13, margin: '12px 0', lineHeight: 1.8 },
  
  linksBox: { display: 'flex', gap: 16, flexWrap: 'wrap' },
  linkButton: { display: 'flex', alignItems: 'center', gap: 8, background: '#1d4ed8', color: '#fff', padding: '12px 24px', borderRadius: 8, textDecoration: 'none', fontWeight: 600 },
  
  developerBox: { background: '#f1f5f9', borderRadius: 12, padding: '24px', display: 'flex', flexDirection: 'column', gap: 12 },
  emailLink: { color: '#1d4ed8', textDecoration: 'none' },
  link: { color: '#1d4ed8', textDecoration: 'none' },
  
  footerNote: { textAlign: 'center', paddingTop: 40, borderTop: '1px solid #e2e8f0', color: '#94a3b8', fontSize: 13 },
};