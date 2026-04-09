import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useToast } from "../contexts/ToastContext";

const BADGE_COLORS = ["badge-purple", "badge-blue", "badge-green", "badge-yellow", "badge-red", "badge-pink", "badge-gray"];

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const toast = useToast();

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch {
      toast("Failed to load categories.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdding(true);
    try {
      await API.post("/categories", { name: newName.trim() });
      setNewName("");
      toast("Category created.", "success");
      fetchCategories();
    } catch {
      toast("Failed to create category.", "error");
    } finally {
      setAdding(false);
    }
  };

  const handleEditSave = async (id) => {
    if (!editName.trim()) return;
    try {
      await API.put(`/categories/${id}`, { name: editName.trim() });
      toast("Category updated.", "success");
      setEditId(null);
      fetchCategories();
    } catch {
      toast("Failed to update category.", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category? Resources using it will lose their category.")) return;
    try {
      await API.delete(`/categories/${id}`);
      toast("Category deleted.", "success");
      fetchCategories();
    } catch {
      toast("Failed to delete category.", "error");
    }
  };

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Categories</h1>
            <p className="page-sub">Organize your resources into topics.</p>
          </div>
        </div>

        <div className="surface surface-pad" style={{ marginBottom: "1.5rem" }}>
          <p className="section-title">Add New Category</p>
          <form onSubmit={handleAdd} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <input
              placeholder="Category name (e.g. Design, Math, Science…)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={{ flex: 1, minWidth: 200 }}
              required
            />
            <button className="btn-primary" type="submit" disabled={adding || !newName.trim()}>
              {adding ? "Adding…" : "＋ Add Category"}
            </button>
          </form>
        </div>

        <div className="surface">
          {loading ? (
            <div className="loading-state">
              <div className="spinner" />
              Loading categories…
            </div>
          ) : categories.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏷️</div>
              <h3>No categories yet</h3>
              <p>Add your first category above to get started.</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Category Name</th>
                  <th>Tag</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, i) => (
                  <tr key={cat.id}>
                    <td style={{ color: "var(--text-light)", width: 48 }}>{i + 1}</td>
                    <td>
                      {editId === cat.id ? (
                        <div className="inline-edit">
                          <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleEditSave(cat.id);
                              if (e.key === "Escape") setEditId(null);
                            }}
                            autoFocus
                          />
                          <button className="btn-primary btn-sm" onClick={() => handleEditSave(cat.id)}>Save</button>
                          <button className="btn-secondary btn-sm" onClick={() => setEditId(null)}>Cancel</button>
                        </div>
                      ) : (
                        <span style={{ fontWeight: 500 }}>{cat.name}</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${BADGE_COLORS[i % BADGE_COLORS.length]}`}>
                        {cat.name}
                      </span>
                    </td>
                    <td>
                      <div className="row" style={{ justifyContent: "flex-end" }}>
                        {editId !== cat.id && (
                          <>
                            <button
                              className="btn-secondary btn-sm"
                              onClick={() => { setEditId(cat.id); setEditName(cat.name); }}
                            >
                              Edit
                            </button>
                            <button
                              className="btn-danger btn-sm"
                              onClick={() => handleDelete(cat.id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

export default Categories;
