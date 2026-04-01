import { useEffect, useState, useMemo } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useToast } from "../contexts/ToastContext";

const BADGE_COLORS = ["badge-purple", "badge-blue", "badge-green", "badge-yellow", "badge-red", "badge-pink", "badge-gray"];

function Resources() {
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();
  const toast = useToast();

  const fetchResources = async () => {
    setLoading(true);
    try {
      const [resRes, catRes] = await Promise.all([
        API.get("/resources"),
        API.get("/categories"),
      ]);
      setResources(resRes.data);
      setCategories(catRes.data);
    } catch {
      toast("Unable to load resources.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResources(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resource?")) return;
    try {
      await API.delete(`/resources/${id}`);
      toast("Resource deleted.", "success");
      setResources((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      toast(err.response?.data?.message || "Delete failed.", "error");
    }
  };

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      const matchCat = activeCategory === "All" || r.category_name === activeCategory;
      const q = search.toLowerCase();
      const matchSearch = !q || r.title.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [resources, activeCategory, search]);

  const categoryColorMap = useMemo(() => {
    const map = {};
    categories.forEach((cat, i) => {
      map[cat.name] = BADGE_COLORS[i % BADGE_COLORS.length];
    });
    return map;
  }, [categories]);

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Resources</h1>
            <p className="page-sub">{resources.length} resource{resources.length !== 1 ? "s" : ""} in the library.</p>
          </div>
          <button className="btn-primary" onClick={() => navigate("/add")}>
            ＋ Add Resource
          </button>
        </div>

        <div className="filter-row">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              placeholder="Search resources…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-pills">
            <button
              className={`filter-pill ${activeCategory === "All" ? "active" : ""}`}
              onClick={() => setActiveCategory("All")}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`filter-pill ${activeCategory === cat.name ? "active" : ""}`}
                onClick={() => setActiveCategory(activeCategory === cat.name ? "All" : cat.name)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            Loading resources…
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">{search || activeCategory !== "All" ? "🔍" : "📭"}</div>
            <h3>{search || activeCategory !== "All" ? "No results found" : "No resources yet"}</h3>
            <p>
              {search || activeCategory !== "All"
                ? "Try a different search term or filter."
                : "Be the first to add a resource to the library."}
            </p>
            {!search && activeCategory === "All" && (
              <button className="btn-primary" onClick={() => navigate("/add")}>
                Add the first resource
              </button>
            )}
          </div>
        ) : (
          <div className="card-grid">
            {filtered.map((r) => (
              <div key={r.id} className="resource-card">
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem" }}>
                  <span className={`badge ${categoryColorMap[r.category_name] || "badge-gray"}`}>
                    {r.category_name || "Uncategorised"}
                  </span>
                </div>

                <h3 className="card-title">{r.title}</h3>

                {r.description && (
                  <p className="card-desc">{r.description}</p>
                )}

                <div className="card-meta">
                  <span>👤</span>
                  <span>{r.user_name || "Unknown"}</span>
                </div>

                <div className="card-footer">
                  {r.link ? (
                    <a
                      href={r.link}
                      target="_blank"
                      rel="noreferrer"
                      className="visit-link"
                    >
                      🔗 Visit link
                    </a>
                  ) : (
                    <span />
                  )}

                  <div className="card-actions">
                    <button
                      className="btn-secondary btn-sm"
                      onClick={() => navigate(`/edit/${r.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-danger btn-sm"
                      onClick={() => handleDelete(r.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Resources;
