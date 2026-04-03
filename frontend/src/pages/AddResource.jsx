import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useToast } from "../contexts/ToastContext";

function AddResource() {
  const [form, setForm] = useState({ title: "", description: "", link: "", category_id: "" });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    API.get("/categories")
      .then((res) => setCategories(res.data))
      .catch(() => setError("Unable to load categories."))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await API.post("/resources", form);
      toast("Resource added successfully!", "success");
      navigate("/resources");
    } catch (err) {
      setError(err.response?.data?.message || "Error adding resource.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div className="page-header">
            <div>
              <h1 className="page-title">Add Resource</h1>
              <p className="page-sub">Share a useful link, article, or tool with the community.</p>
            </div>
          </div>

          <div className="surface surface-pad">
            {error && <div className="alert alert-error" style={{ marginBottom: "1.25rem" }}>⚠ {error}</div>}

            {loading ? (
              <div className="loading-state" style={{ padding: "2rem 0" }}>
                <div className="spinner" />
                Loading categories…
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="form-stack">
                <div className="form-group">
                  <label className="form-label" htmlFor="title">Title</label>
                  <input
                    id="title"
                    name="title"
                    placeholder="e.g. React Official Docs"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="What is this resource about? Why is it useful?"
                    value={form.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="link">URL</label>
                  <input
                    id="link"
                    name="link"
                    type="url"
                    placeholder="https://example.com"
                    value={form.link}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="category_id">Category</label>
                  <select
                    id="category_id"
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="row" style={{ paddingTop: "0.5rem" }}>
                  <button className="btn-primary" type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <span className="spinner" style={{ width: 16, height: 16, borderTopColor: "#fff" }} />
                        Saving…
                      </>
                    ) : "Save Resource"}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => navigate("/resources")}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AddResource;
