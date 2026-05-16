'use client';

import { useState } from 'react';
import { Search, MapPin, SlidersHorizontal, CircleDot } from 'lucide-react';

const CATEGORIES = [
  'All Categories',
  'Plumbing',
  'Electrical',
  'Painting',
  'Joinery',
  'Gardening',
  'Cleaning',
  'Roofing',
  'Other',
];

const STATUSES = [
  'All Statuses',
  'Open',
  'In Progress',
  'Closed',
];

export default function FilterBar({ onFilter }) {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [status, setStatus] = useState('All Statuses');

  const handleSearch = (e) => {
    e.preventDefault();
    onFilter?.({
      search,
      location,
      category: category === 'All Categories' ? '' : category,
      status: status === 'All Statuses' ? '' : status, // Send status as is (Open, In Progress, Closed)
    });
  };

  return (
    <form onSubmit={handleSearch} style={styles.wrapper}>
      {/* Search */}
      <div style={styles.field}>
        <Search size={16} color="#94a3b8" style={styles.icon} />
        <input
          type="text"
          placeholder="Search jobs (e.g. leaking tap, rewire)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={styles.divider} />

      {/* Location */}
      <div style={styles.field}>
        <MapPin size={16} color="#94a3b8" style={styles.icon} />
        <input
          type="text"
          placeholder="Location (e.g. London, Manchester)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={styles.divider} />

      {/* Category */}
      <div style={{ ...styles.field, flex: 'none' }}>
        <SlidersHorizontal size={16} color="#94a3b8" style={styles.icon} />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.select}
        >
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div style={styles.divider} />

      {/* Status */}
      <div style={{ ...styles.field, flex: 'none' }}>
        <CircleDot size={16} color="#94a3b8" style={styles.icon} />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={styles.select}
        >
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        {/* Live colour dot shows selected status */}
        {status !== 'All Statuses' && (
          <span
            style={{
              ...styles.statusDot,
              background:
                status === 'Open'
                  ? '#10b981'
                  : status === 'In Progress'
                  ? '#f59e0b'
                  : '#94a3b8',
            }}
          />
        )}
      </div>

      {/* Submit */}
      <button type="submit" style={styles.btn}>
        Search Jobs
      </button>
    </form>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: '6px 6px 6px 0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    gap: 0,
    flexWrap: 'wrap',
  },
  field: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    padding: '6px 16px',
    minWidth: 150,
    position: 'relative',
  },
  icon: {
    flexShrink: 0,
  },
  input: {
    border: 'none',
    outline: 'none',
    fontSize: 14,
    color: '#0f172a',
    background: 'transparent',
    width: '100%',
  },
  select: {
    border: 'none',
    outline: 'none',
    fontSize: 14,
    color: '#0f172a',
    background: 'transparent',
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
    paddingRight: 16,
  },
  divider: {
    width: 1,
    height: 28,
    background: '#e2e8f0',
    flexShrink: 0,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    flexShrink: 0,
    marginLeft: 2,
  },
  btn: {
    background: '#1d4ed8',
    color: '#ffffff',
    border: 'none',
    borderRadius: 8,
    padding: '10px 22px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    marginLeft: 6,
    transition: 'background 0.15s',
    fontFamily: "'DM Sans', sans-serif",
  },
};