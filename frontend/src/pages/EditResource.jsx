import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useToast } from "../contexts/ToastContext";

function EditResource() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({ title: "", description: "", link: "", category_id: "" });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [catRes, resRes] = await Promise.all([
          API.get("/categories"),
          API.get(`/resources/${id}`),
        ]);
        setCategories(catRes.data);
        const r = resRes.data;
        setForm({
          title: r.title || "",
          description: r.description || "",
          link: r.link || "",
          category_id: r.category_id || "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load resource.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await API.put(`/resources/${id}`, form);
      toast("Resource updated successfully!", "success");
      navigate("/resources");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update resource.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="app-layout">
        <Navbar />
        <main className="main-content">
          <div className="loading-state">
            <div className="spinner" />
            Loading resource…
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div className="page-header">
            <div>
              <h1 className="page-title">Edit Resource</h1>
              <p className="page-sub">Update the details and save your changes.</p>
            </div>
          </div>

          <div className="surface surface-pad">
            {error && <div className="alert alert-error" style={{ marginBottom: "1.25rem" }}>⚠ {error}</div>}

            <form onSubmit={handleSubmit} className="form-stack">
              <div className="form-group">
                <label className="form-label" htmlFor="title">Title</label>
                <input
                  id="title"
                  name="title"
                  placeholder="Resource title"
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
                  placeholder="Describe this resource…"
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
                  ) : "Save Changes"}
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
          </div>
        </div>
      </main>
    </div>
  );
}

export default EditResource;
