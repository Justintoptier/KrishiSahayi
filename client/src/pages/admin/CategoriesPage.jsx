/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../redux/slices/categorySlice";
import Loader from "../../components/Loader";
import { FaPlus, FaEdit, FaTrash, FaLeaf } from "react-icons/fa";

const CategoriesPage = () => {
  const dispatch = useDispatch();
  const { categories, loading, success } = useSelector((state) => state.categories);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "", icon: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => { dispatch(getCategories()); }, [dispatch]);

  useEffect(() => {
    if (success && showModal) {
      setShowModal(false);
      setFormData({ name: "", description: "", icon: "" });
    }
  }, [success]);

  const handleAddClick = () => {
    setModalMode("add");
    setFormData({ name: "", description: "", icon: "" });
    setShowModal(true);
  };

  const handleEditClick = (cat) => {
    setModalMode("edit");
    setCurrentCategory(cat);
    setFormData({ name: cat.name, description: cat.description || "", icon: cat.icon || "" });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === "add") dispatch(createCategory(formData));
    else dispatch(updateCategory({ id: currentCategory._id, categoryData: formData }));
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      dispatch(deleteCategory(categoryToDelete._id));
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    }
  };

  if (loading && categories.length === 0) return <Loader />;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500;600&display=swap');
        .adm-root{font-family:'Jost',sans-serif;background:#f9f5ef;min-height:100vh;padding:40px 2rem 80px}
        .adm-inner{max-width:1280px;margin:0 auto}
        .adm-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:36px;flex-wrap:wrap;gap:16px}
        .adm-title{font-family:'Cormorant Garamond',serif;font-size:2.2rem;font-weight:700;color:#1e2a1f}
        .adm-subtitle{font-size:.875rem;color:#8a7a65;font-weight:300;margin-top:4px}
        .adm-btn-primary{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,#4a7c59,#2d5a3d);color:#e8d5b0;border:none;border-radius:12px;padding:11px 22px;font-family:'Jost',sans-serif;font-size:.875rem;font-weight:500;cursor:pointer;transition:all .25s ease;box-shadow:0 2px 8px rgba(45,90,61,.25);text-decoration:none}
        .adm-btn-primary:hover{transform:translateY(-1px);box-shadow:0 6px 18px rgba(45,90,61,.35)}
        .adm-table-wrap{background:#fefcf8;border:1px solid rgba(101,78,51,.1);border-radius:20px;overflow:hidden}
        .adm-table{width:100%;border-collapse:collapse}
        .adm-table thead{background:#f4ede0}
        .adm-table th{padding:12px 20px;font-size:.72rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#8a7a65;text-align:left}
        .adm-table th.right{text-align:right}
        .adm-table td{padding:18px 20px;font-size:.875rem;color:#3d2f1e;border-bottom:1px solid rgba(101,78,51,.06)}
        .adm-table td.right{text-align:right}
        .adm-table tbody tr:hover{background:#faf6f0}
        .adm-table tbody tr:last-child td{border-bottom:none}
        .adm-cat-icon{width:42px;height:42px;background:rgba(74,124,89,.1);border-radius:12px;display:flex;align-items:center;justify-content:center;color:#4a7c59;font-size:16px;flex-shrink:0}
        .adm-icon-btn{width:32px;height:32px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;border:none;cursor:pointer;transition:all .2s ease;font-size:13px}
        .adm-icon-btn-edit{background:rgba(74,124,89,.1);color:#4a7c59}
        .adm-icon-btn-edit:hover{background:rgba(74,124,89,.2)}
        .adm-icon-btn-delete{background:rgba(192,57,43,.1);color:#c0392b}
        .adm-icon-btn-delete:hover{background:rgba(192,57,43,.2)}
        .adm-empty{text-align:center;padding:60px 20px;background:#fefcf8;border:1px solid rgba(101,78,51,.1);border-radius:20px}
        .adm-empty-icon{width:72px;height:72px;background:#f0e8d8;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;color:#8a7a65;font-size:26px}
        .adm-empty-title{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:600;color:#3d2f1e;margin-bottom:8px}
        .adm-empty-sub{color:#8a7a65;font-size:.875rem;margin-bottom:20px}
        .adm-modal-overlay{position:fixed;inset:0;background:rgba(20,15,8,.6);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:100;padding:20px}
        .adm-modal{background:#fefcf8;border:1px solid rgba(101,78,51,.12);border-radius:24px;padding:32px;max-width:480px;width:100%;box-shadow:0 24px 64px rgba(20,15,8,.25);animation:modalIn .25s ease}
        @keyframes modalIn{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}
        .adm-modal-title{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:700;color:#1e2a1f;margin-bottom:20px}
        .adm-field{margin-bottom:18px}
        .adm-label{display:block;font-size:.78rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#8a7a65;margin-bottom:8px}
        .adm-input{width:100%;background:#f4ede0;border:1px solid rgba(101,78,51,.15);border-radius:12px;padding:12px 16px;font-family:'Jost',sans-serif;font-size:.9rem;color:#3d2f1e;outline:none;transition:all .2s ease;box-sizing:border-box}
        .adm-input:focus{border-color:rgba(74,124,89,.4);background:#fefcf8;box-shadow:0 0 0 3px rgba(74,124,89,.08)}
        .adm-textarea{width:100%;background:#f4ede0;border:1px solid rgba(101,78,51,.15);border-radius:12px;padding:12px 16px;font-family:'Jost',sans-serif;font-size:.9rem;color:#3d2f1e;outline:none;resize:vertical;min-height:80px;transition:all .2s ease;box-sizing:border-box}
        .adm-textarea:focus{border-color:rgba(74,124,89,.4);background:#fefcf8}
        .adm-modal-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:24px}
        .adm-btn-outline{display:inline-flex;align-items:center;background:#f0e8d8;color:#3d2f1e;border:1px solid rgba(101,78,51,.2);border-radius:12px;padding:10px 20px;font-family:'Jost',sans-serif;font-size:.875rem;cursor:pointer;transition:all .2s ease}
        .adm-btn-outline:hover{background:#e5d9c5}
        .adm-btn-danger{display:inline-flex;align-items:center;background:#c0392b;color:white;border:none;border-radius:12px;padding:10px 20px;font-family:'Jost',sans-serif;font-size:.875rem;font-weight:500;cursor:pointer}
        .adm-btn-danger:hover{background:#a93226}
        @media(max-width:640px){.adm-root{padding:24px 1rem 60px}}
      `}</style>

      <div className="adm-root">
        <div className="adm-inner">
          <div className="adm-header">
            <div>
              <h1 className="adm-title">Categories</h1>
              <p className="adm-subtitle">Manage product categories</p>
            </div>
            <button className="adm-btn-primary" onClick={handleAddClick}>
              <FaPlus size={12} /> Add Category
            </button>
          </div>

          {categories.length > 0 ? (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Description</th>
                    <th className="right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat._id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                          <div className="adm-cat-icon">
                            {cat.icon ? <span style={{ fontSize: 18 }}>{cat.icon}</span> : <FaLeaf />}
                          </div>
                          <span style={{ fontWeight: 500 }}>{cat.name}</span>
                        </div>
                      </td>
                      <td style={{ color: "#8a7a65", fontSize: "0.82rem", maxWidth: 400 }}>
                        {cat.description || <em style={{ opacity: 0.5 }}>No description</em>}
                      </td>
                      <td className="right">
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                          <button className="adm-icon-btn adm-icon-btn-edit" onClick={() => handleEditClick(cat)} title="Edit">
                            <FaEdit size={11} />
                          </button>
                          <button className="adm-icon-btn adm-icon-btn-delete" onClick={() => { setCategoryToDelete(cat); setShowDeleteModal(true); }} title="Delete">
                            <FaTrash size={11} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="adm-empty">
              <div className="adm-empty-icon"><FaLeaf /></div>
              <h3 className="adm-empty-title">No Categories Yet</h3>
              <p className="adm-empty-sub">Add your first category to get started.</p>
              <button className="adm-btn-primary" onClick={handleAddClick}>
                <FaPlus size={12} /> Add Category
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="adm-modal-overlay">
          <div className="adm-modal">
            <h3 className="adm-modal-title">
              {modalMode === "add" ? "Add New Category" : "Edit Category"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="adm-field">
                <label className="adm-label">Category Name *</label>
                <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="adm-input" required />
              </div>
              <div className="adm-field">
                <label className="adm-label">Description</label>
                <textarea name="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="adm-textarea" placeholder="Optional description..." />
              </div>
              <div className="adm-field">
                <label className="adm-label">Icon (emoji)</label>
                <input type="text" name="icon" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} className="adm-input" placeholder="e.g. 🥦 🍎 🌾" />
              </div>
              <div className="adm-modal-actions">
                <button type="button" className="adm-btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="adm-btn-primary" disabled={loading}>
                  {loading ? "Saving..." : modalMode === "add" ? "Add Category" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="adm-modal-overlay">
          <div className="adm-modal">
            <h3 className="adm-modal-title">Delete Category</h3>
            <p style={{ fontSize: "0.875rem", color: "#8a7a65", lineHeight: 1.6, marginBottom: 24 }}>
              Are you sure you want to delete <strong style={{ color: "#3d2f1e" }}>{categoryToDelete?.name}</strong>? This action cannot be undone.
            </p>
            <div className="adm-modal-actions">
              <button className="adm-btn-outline" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="adm-btn-danger" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CategoriesPage;