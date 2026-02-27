"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, deleteUser } from "../../redux/slices/userSlice";
import Loader from "../../components/Loader";
import { FaSearch, FaUserEdit, FaTrash, FaEnvelope, FaPhone, FaMapMarkerAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";

const UsersPage = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.users);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);

  useEffect(() => { dispatch(getAllUsers()); }, [dispatch]);

  const filteredUsers = (users || []).filter((u) => {
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchSearch = !searchTerm ||
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchRole && matchSearch;
  });

  const confirmDelete = () => {
    if (userToDelete) {
      dispatch(deleteUser(userToDelete._id));
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const roleBadge = (role) => {
    const map = { admin: "adm-badge adm-badge-purple", farmer: "adm-badge adm-badge-green", consumer: "adm-badge adm-badge-blue" };
    return map[role] || "adm-badge adm-badge-gray";
  };

  if (loading && users.length === 0) return <Loader />;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500;600&display=swap');
        .adm-root{font-family:'Jost',sans-serif;background:#f9f5ef;min-height:100vh;padding:110px 2rem 80px}
        .adm-inner{max-width:1280px;margin:0 auto}
        .adm-title{font-family:'Cormorant Garamond',serif;font-size:2.2rem;font-weight:700;color:#1e2a1f}
        .adm-subtitle{font-size:.875rem;color:#8a7a65;font-weight:300;margin-top:4px;margin-bottom:32px}
        .adm-toolbar{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:28px}
        .adm-search-wrap{position:relative;flex:1;min-width:200px}
        .adm-search-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:#8a7a65;font-size:13px;pointer-events:none}
        .adm-search{width:100%;background:#fefcf8;border:1px solid rgba(101,78,51,.15);border-radius:12px;padding:11px 16px 11px 38px;font-family:'Jost',sans-serif;font-size:.875rem;color:#3d2f1e;outline:none;transition:all .2s ease;box-sizing:border-box}
        .adm-search:focus{border-color:rgba(74,124,89,.4);box-shadow:0 0 0 3px rgba(74,124,89,.08)}
        .adm-select{background:#fefcf8;border:1px solid rgba(101,78,51,.15);border-radius:12px;padding:11px 16px;font-family:'Jost',sans-serif;font-size:.875rem;color:#3d2f1e;outline:none;cursor:pointer}
        .adm-table-wrap{background:#fefcf8;border:1px solid rgba(101,78,51,.1);border-radius:20px;overflow:hidden}
        .adm-table{width:100%;border-collapse:collapse}
        .adm-table thead{background:#f4ede0}
        .adm-table th{padding:12px 20px;font-size:.72rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#8a7a65;text-align:left}
        .adm-table th.center{text-align:center}
        .adm-table th.right{text-align:right}
        .adm-table td{padding:16px 20px;font-size:.875rem;color:#3d2f1e;border-bottom:1px solid rgba(101,78,51,.06)}
        .adm-table td.center{text-align:center}
        .adm-table td.right{text-align:right}
        .adm-table tbody tr:hover{background:#faf6f0}
        .adm-table tbody tr:last-child td{border-bottom:none}
        .adm-badge{display:inline-flex;align-items:center;padding:4px 10px;border-radius:100px;font-size:.72rem;font-weight:600}
        .adm-badge-green{background:rgba(74,124,89,.12);color:#2d5a3d}
        .adm-badge-blue{background:rgba(52,152,219,.12);color:#1a6fa8}
        .adm-badge-purple{background:rgba(142,68,173,.1);color:#7d3c98}
        .adm-badge-gray{background:rgba(101,78,51,.08);color:#8a7a65}
        .adm-icon-btn{width:32px;height:32px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;border:none;cursor:pointer;transition:all .2s ease;font-size:13px}
        .adm-icon-btn-edit{background:rgba(52,152,219,.1);color:#2980b9}
        .adm-icon-btn-edit:hover{background:rgba(52,152,219,.2)}
        .adm-icon-btn-delete{background:rgba(192,57,43,.1);color:#c0392b}
        .adm-icon-btn-delete:hover{background:rgba(192,57,43,.2)}
        .adm-avatar{width:38px;height:38px;border-radius:12px;background:linear-gradient(135deg,#4a7c59,#2d5a3d);display:flex;align-items:center;justify-content:center;color:#e8d5b0;font-family:'Cormorant Garamond',serif;font-size:1.1rem;font-weight:700;flex-shrink:0}
        .adm-expand-row{background:#faf6f0;border-bottom:1px solid rgba(101,78,51,.06)}
        .adm-expand-inner{padding:16px 20px 20px 70px;display:grid;grid-template-columns:repeat(2,1fr);gap:20px}
        .adm-expand-section h4{font-size:.78rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#8a7a65;margin-bottom:12px}
        .adm-expand-item{display:flex;align-items:center;gap:10px;font-size:.85rem;color:#5c4a32;margin-bottom:8px}
        .adm-expand-item-icon{color:#4a7c59;font-size:12px;width:16px}
        .adm-empty{text-align:center;padding:60px 20px;background:#fefcf8;border:1px solid rgba(101,78,51,.1);border-radius:20px}
        .adm-empty-icon{width:72px;height:72px;background:#f0e8d8;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;color:#8a7a65;font-size:26px}
        .adm-empty-title{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:600;color:#3d2f1e;margin-bottom:8px}
        .adm-empty-sub{color:#8a7a65;font-size:.875rem}
        .adm-modal-overlay{position:fixed;inset:0;background:rgba(20,15,8,.6);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:100;padding:20px}
        .adm-modal{background:#fefcf8;border:1px solid rgba(101,78,51,.12);border-radius:24px;padding:32px;max-width:480px;width:100%;box-shadow:0 24px 64px rgba(20,15,8,.25);animation:modalIn .25s ease}
        @keyframes modalIn{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}
        .adm-modal-title{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:700;color:#1e2a1f;margin-bottom:8px}
        .adm-modal-desc{font-size:.875rem;color:#8a7a65;font-weight:300;line-height:1.6;margin-bottom:24px}
        .adm-modal-actions{display:flex;justify-content:flex-end;gap:10px}
        .adm-btn-outline{display:inline-flex;align-items:center;gap:8px;background:#f0e8d8;color:#3d2f1e;border:1px solid rgba(101,78,51,.2);border-radius:12px;padding:10px 20px;font-family:'Jost',sans-serif;font-size:.875rem;cursor:pointer;transition:all .2s ease}
        .adm-btn-outline:hover{background:#e5d9c5}
        .adm-btn-danger{display:inline-flex;align-items:center;background:#c0392b;color:white;border:none;border-radius:12px;padding:10px 20px;font-family:'Jost',sans-serif;font-size:.875rem;font-weight:500;cursor:pointer;transition:all .2s ease}
        .adm-btn-danger:hover{background:#a93226}
        @media(max-width:640px){.adm-root{padding:24px 1rem 60px}.adm-expand-inner{grid-template-columns:1fr;padding-left:20px}}
      `}</style>

      <div className="adm-root">
        <div className="adm-inner">
          <h1 className="adm-title">Manage Users</h1>
          <p className="adm-subtitle">{filteredUsers.length} users found</p>

          <div className="adm-toolbar">
            <div className="adm-search-wrap">
              <FaSearch className="adm-search-icon" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or email..."
                className="adm-search"
              />
            </div>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="adm-select">
              <option value="all">All Roles</option>
              <option value="consumer">Consumers</option>
              <option value="farmer">Farmers</option>
              <option value="admin">Admins</option>
            </select>
          </div>

          {filteredUsers.length > 0 ? (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th className="center">Role</th>
                    <th className="center">Joined</th>
                    <th className="right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <React.Fragment key={user._id}>
                      <tr>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div className="adm-avatar">{user.name.charAt(0)}</div>
                            <div>
                              <div style={{ fontWeight: 500, color: "#1e2a1f" }}>{user.name}</div>
                              <div style={{ fontSize: "0.78rem", color: "#8a7a65", fontWeight: 300 }}>{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="center">
                          <span className={roleBadge(user.role)}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="center" style={{ color: "#8a7a65", fontSize: "0.82rem" }}>
                          {new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td className="right">
                          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                            <button
                              className="adm-icon-btn adm-icon-btn-edit"
                              onClick={() => setExpandedUser(expandedUser === user._id ? null : user._id)}
                              title="View Details"
                            >
                              {expandedUser === user._id ? <FaChevronUp size={11} /> : <FaChevronDown size={11} />}
                            </button>
                            {user.role !== "admin" && (
                              <button
                                className="adm-icon-btn adm-icon-btn-delete"
                                onClick={() => { setUserToDelete(user); setShowDeleteModal(true); }}
                                title="Delete"
                              >
                                <FaTrash size={11} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      {expandedUser === user._id && (
                        <tr className="adm-expand-row">
                          <td colSpan="4" style={{ padding: 0 }}>
                            <div className="adm-expand-inner">
                              <div className="adm-expand-section">
                                <h4>Contact</h4>
                                <div className="adm-expand-item">
                                  <FaEnvelope className="adm-expand-item-icon" />
                                  {user.email}
                                </div>
                                {user.phone && (
                                  <div className="adm-expand-item">
                                    <FaPhone className="adm-expand-item-icon" />
                                    {user.phone}
                                  </div>
                                )}
                              </div>
                              {user.address && (
                                <div className="adm-expand-section">
                                  <h4>Address</h4>
                                  <div className="adm-expand-item">
                                    <FaMapMarkerAlt className="adm-expand-item-icon" />
                                    <div>
                                      {user.address.street && <div>{user.address.street}</div>}
                                      {user.address.city && <div>{user.address.city}, {user.address.state} {user.address.zipCode}</div>}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="adm-empty">
              <div className="adm-empty-icon"><FaSearch /></div>
              <h3 className="adm-empty-title">No Users Found</h3>
              <p className="adm-empty-sub">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <div className="adm-modal-overlay">
          <div className="adm-modal">
            <h3 className="adm-modal-title">Delete User</h3>
            <p className="adm-modal-desc">
              Are you sure you want to delete <strong>{userToDelete?.name}</strong> ({userToDelete?.email})? This action cannot be undone.
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

export default UsersPage;