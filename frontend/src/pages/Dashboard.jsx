import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

const BADGE_COLORS = ["badge-purple", "badge-blue", "badge-green", "badge-yellow", "badge-red", "badge-pink", "badge-gray"];

function getBadge(index) {
  return BADGE_COLORS[index % BADGE_COLORS.length];
}

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentResources, setRecentResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")) || {}; }
    catch { return {}; }
  })();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsRes, resourcesRes] = await Promise.all([
          API.get("/stats"),
          API.get("/resources"),
        ]);
        setStats(statsRes.data);
        setRecentResources(resourcesRes.data.slice(0, 6));
      } catch {
        // stats are non-critical; silently ignore
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const maxCount = stats?.byCategory?.length
    ? Math.max(...stats.byCategory.map((c) => c.count))
    : 1;

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">
              Hello, {user.name?.split(" ")[0] || "there"} 👋
            </h1>
            <p className="page-sub">Here's what's happening in your resource library.</p>
          </div>
          <button className="btn-primary" onClick={() => navigate("/add")}>
            ＋ Add Resource
          </button>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            Loading dashboard…
          </div>
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon indigo">📚</div>
                <div>
                  <div className="stat-value">{stats?.totalResources ?? 0}</div>
                  <div className="stat-label">Total Resources</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon green">🏷️</div>
                <div>
                  <div className="stat-value">{stats?.totalCategories ?? 0}</div>
                  <div className="stat-label">Categories</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon blue">👥</div>
                <div>
                  <div className="stat-value">{stats?.totalUsers ?? 0}</div>
                  <div className="stat-label">Contributors</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon orange">⭐</div>
                <div>
                  <div className="stat-value">{recentResources.length}</div>
                  <div className="stat-label">Recent Added</div>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem" }}>
              <div className="surface surface-pad">
                <p className="section-title">Resources by Category</p>
                {stats?.byCategory?.length ? (
                  stats.byCategory.map((cat) => (
                    <div key={cat.category_name} className="cat-bar-row">
                      <span className="cat-bar-label" title={cat.category_name}>{cat.category_name}</span>
                      <div className="cat-bar-track">
                        <div
                          className="cat-bar-fill"
                          style={{ width: `${(cat.count / maxCount) * 100}%` }}
                        />
                      </div>
                      <span className="cat-bar-count">{cat.count}</span>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: "0.875rem" }}>No data yet.</p>
                )}
              </div>

              <div className="surface surface-pad">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <p className="section-title" style={{ marginBottom: 0 }}>Recent Resources</p>
                  <button className="btn-ghost btn-sm" onClick={() => navigate("/resources")}>
                    View all →
                  </button>
                </div>
                {recentResources.length === 0 ? (
                  <div className="empty-state" style={{ padding: "2rem 0" }}>
                    <div className="empty-icon">📭</div>
                    <p>No resources yet.</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {recentResources.map((r, i) => (
                      <div
                        key={r.id}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "0.75rem",
                          padding: "0.75rem",
                          borderRadius: "var(--radius)",
                          background: "var(--surface-2)",
                          cursor: "pointer",
                          transition: "background var(--transition)",
                        }}
                        onClick={() => navigate(`/edit/${r.id}`)}
                        onMouseEnter={(e) => e.currentTarget.style.background = "var(--primary-light)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "var(--surface-2)"}
                      >
                        <span className={`badge ${getBadge(i)}`}>{r.category_name || "—"}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            color: "var(--text)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}>
                            {r.title}
                          </p>
                          <p style={{ fontSize: "0.78rem", marginTop: "0.1rem" }}>by {r.user_name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
