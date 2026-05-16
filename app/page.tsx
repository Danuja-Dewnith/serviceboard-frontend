"use client";

import { useEffect, useState, useCallback, type CSSProperties } from "react";
import { ArrowUpDown } from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FilterBar from "./components/Filterbar";
import JobCard from "./components/Jobcard";
import { getJobs } from "./lib/api";

type Job = {
  _id: string;
  title: string;
  category: string;
  status: string;
  location: string;
  description: string;
  createdAt: string;
  contactName: string;
  contactEmail: string;
};

export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState("newest");

  const fetchJobs = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getJobs(filters);
      const jobsData = res.data?.data || [];
      setJobs(jobsData);
    } catch (err: any) {
      console.error("Backend error:", err);
      setError(
        "Unable to connect to server. Please make sure the backend is running.",
      );
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleFilter = (filters: Record<string, string>) => {
    const backendFilters: Record<string, string> = {};
    if (filters.search) backendFilters.search = filters.search;
    if (filters.location) backendFilters.location = filters.location;
    if (filters.category) backendFilters.category = filters.category;
    if (filters.status) backendFilters.status = filters.status;
    fetchJobs(backendFilters);
  };

  const sorted = [...jobs].sort((a, b) => {
    const da = new Date(a.createdAt);
    const db = new Date(b.createdAt);
    return sortOrder === "newest"
      ? db.getTime() - da.getTime()
      : da.getTime() - db.getTime();
  });

  return (
    <>
      <Navbar />
      <main>
        <section style={styles.hero}>
          <div style={styles.container}>
            <h1 style={styles.heroTitle}>
              Find expert tradespeople for
              <br />
              your next project.
            </h1>
            <p style={styles.heroSub}>
              Reliable service connections for plumbing, electrical, and more.
            </p>
            <div style={styles.searchWrap}>
              <FilterBar onFilter={handleFilter} />
            </div>
          </div>
        </section>

        <section style={styles.listings}>
          <div style={styles.container}>
            <div style={styles.listHeader}>
              <div style={styles.listTitle}>
                <h2 style={styles.listH2}>Active Job Requests</h2>
                <span style={styles.badge}>{jobs.length} Results</span>
              </div>
              <button
                style={styles.sortBtn}
                onClick={() =>
                  setSortOrder((o) => (o === "newest" ? "oldest" : "newest"))
                }
              >
                <ArrowUpDown size={14} />
                {sortOrder === "newest" ? "Newest First" : "Oldest First"}
              </button>
            </div>

            {loading ? (
              <div style={styles.skeletonGrid}>
                {[...Array(6)].map((_, i) => (
                  <div key={`skeleton-${i}`} style={styles.skeleton} />
                ))}
              </div>
            ) : error ? (
              <div style={styles.error}>{error}</div>
            ) : sorted.length === 0 ? (
              <div style={styles.empty}>
                No jobs found. Try adjusting your filters.
              </div>
            ) : (
              <div style={styles.grid}>
                {sorted.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

const styles: Record<string, CSSProperties> = {
  container: { maxWidth: 1200, margin: "0 auto", padding: "0 24px" },
  hero: {
    padding: "56px 0 48px",
    background: "#ffffff",
    borderBottom: "1px solid #f1f5f9",
  },
  heroTitle: {
    fontSize: "clamp(28px, 4vw, 44px)",
    fontWeight: 700,
    color: "#0f172a",
    lineHeight: 1.15,
    marginBottom: 14,
  },
  heroSub: { fontSize: 16, color: "#64748b", marginBottom: 32, maxWidth: 560 },
  searchWrap: { maxWidth: 860 },
  listings: { padding: "40px 0 60px" },
  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    flexWrap: "wrap",
    gap: 12,
  },
  listTitle: { display: "flex", alignItems: "center", gap: 10 },
  listH2: { fontSize: 20, fontWeight: 700, color: "#0f172a" },
  badge: {
    background: "#f1f5f9",
    color: "#64748b",
    fontSize: 12,
    fontWeight: 600,
    padding: "3px 10px",
    borderRadius: 20,
  },
  sortBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    padding: "7px 14px",
    fontSize: 13,
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: 20,
  },
  skeletonGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: 20,
  },
  skeleton: {
    height: 260,
    background: "#f1f5f9",
    borderRadius: 14,
    animation: "pulse 1.5s ease-in-out infinite",
  },
  error: { padding: 40, textAlign: "center", color: "#ef4444" },
  empty: { padding: 60, textAlign: "center", color: "#94a3b8" },
};
