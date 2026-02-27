"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../redux/slices/authSlice";
import { updateFarmerProfile } from "../redux/slices/farmerSlice";
import Loader from "../components/Loader";
import {
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLeaf, FaCheck,
  FaFacebook, FaInstagram, FaTwitter, FaTimes,
} from "react-icons/fa";

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Jost:wght@300;400;500;600&display=swap');

  .prp-root { font-family: 'Jost', sans-serif; background: #f9f5ef; min-height: 100vh; padding-bottom: 80px; }

  .prp-hero {
    background: linear-gradient(135deg, #1e2a1f, #2d5a3d);
    /* FIX: padding-top 110px clears the 90px fixed navbar */
    padding: 110px 2rem 44px; position: relative; overflow: hidden;
  }
  .prp-hero::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at 80% 50%, rgba(74,124,89,0.22) 0%, transparent 55%);
  }
  .prp-hero-inner {
    max-width: 860px; margin: 0 auto;
    display: flex; align-items: center; gap: 24px;
    position: relative;
  }
  .prp-avatar {
    width: 72px; height: 72px; flex-shrink: 0;
    background: rgba(74,124,89,0.25); border: 2px solid rgba(125,184,148,0.3);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    color: #7db894; font-size: 26px;
  }
  .prp-hero-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 700; color: #e8d5b0; margin-bottom: 4px;
  }
  .prp-hero-role {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(74,124,89,0.18); border: 1px solid rgba(74,124,89,0.28);
    color: #7db894; border-radius: 100px; padding: 4px 12px;
    font-size: 0.75rem; font-weight: 500; text-transform: capitalize;
  }

  .prp-main { max-width: 860px; margin: 0 auto; padding: 32px 2rem; }

  .prp-tabs {
    display: flex; gap: 4px; background: #fefcf8;
    border: 1px solid rgba(101,78,51,0.1); border-radius: 12px;
    padding: 4px; margin-bottom: 28px; width: fit-content;
  }
  .prp-tab {
    padding: 9px 22px; border-radius: 9px; border: none;
    font-family: 'Jost', sans-serif; font-size: 0.85rem; font-weight: 500;
    cursor: pointer; transition: all 0.2s; color: #8a7a65; background: transparent;
  }
  .prp-tab.active {
    background: linear-gradient(135deg, #4a7c59, #2d5a3d);
    color: #e8d5b0;
  }

  .prp-card {
    background: #fefcf8; border: 1px solid rgba(101,78,51,0.1);
    border-radius: 18px; padding: 32px; box-shadow: 0 2px 12px rgba(0,0,0,0.03);
    margin-bottom: 20px;
  }
  .prp-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.2rem; font-weight: 700; color: #2d1f0e;
    margin-bottom: 22px; padding-bottom: 12px;
    border-bottom: 1px solid rgba(101,78,51,0.08);
  }
  .prp-field { margin-bottom: 18px; }
  .prp-label {
    display: block; font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: #8a7a65; margin-bottom: 6px;
  }
  .prp-input-wrap { position: relative; }
  .prp-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: #b0a090; font-size: 12px; }
  .prp-input {
    width: 100%; background: #f4ede0;
    border: 1px solid rgba(101,78,51,0.15); border-radius: 10px;
    padding: 11px 13px 11px 38px;
    font-family: 'Jost', sans-serif; font-size: 0.88rem; color: #3d2f1e;
    outline: none; transition: all 0.2s; box-sizing: border-box;
  }
  .prp-input.no-icon { padding-left: 13px; }
  .prp-input::placeholder { color: #b0a090; }
  .prp-input:focus { border-color: rgba(74,124,89,0.4); background: #fefcf8; box-shadow: 0 0 0 3px rgba(74,124,89,0.08); }
  .prp-textarea {
    width: 100%; background: #f4ede0; border: 1px solid rgba(101,78,51,0.15);
    border-radius: 10px; padding: 11px 13px; font-family: 'Jost', sans-serif;
    font-size: 0.88rem; color: #3d2f1e; outline: none; resize: vertical;
    transition: all 0.2s; box-sizing: border-box;
  }
  .prp-textarea:focus { border-color: rgba(74,124,89,0.4); background: #fefcf8; }
  .prp-textarea::placeholder { color: #b0a090; }
  .prp-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .prp-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
  .prp-practice-input-row { display: flex; gap: 10px; margin-bottom: 12px; }
  .prp-add-btn {
    background: linear-gradient(135deg, #4a7c59, #2d5a3d); color: #e8d5b0;
    border: none; border-radius: 10px; padding: 0 18px;
    font-family: 'Jost', sans-serif; font-size: 0.85rem; font-weight: 600; cursor: pointer;
    white-space: nowrap;
  }
  .prp-tags { display: flex; flex-wrap: wrap; gap: 8px; }
  .prp-tag {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(74,124,89,0.1); border: 1px solid rgba(74,124,89,0.22);
    color: #2d5a3d; border-radius: 100px; padding: 5px 12px;
    font-size: 0.82rem; font-weight: 500;
  }
  .prp-tag-remove {
    background: none; border: none; color: #4a7c59; cursor: pointer;
    padding: 0; display: flex; opacity: 0.7; transition: opacity 0.2s;
  }
  .prp-tag-remove:hover { opacity: 1; }
  .prp-hours-row {
    display: grid; grid-template-columns: 100px 1fr 1fr; align-items: center; gap: 12px;
    padding: 8px 0; border-bottom: 1px solid rgba(101,78,51,0.06);
  }
  .prp-hours-row:last-child { border-bottom: none; }
  .prp-hours-day { font-size: 0.85rem; color: #5c4a32; text-transform: capitalize; font-weight: 500; }
  .prp-toggle-row { display: flex; align-items: center; gap: 12px; padding: 8px 0; }
  .prp-toggle-label { font-size: 0.88rem; color: #3d2f1e; }
  .prp-checkbox { accent-color: #2d5a3d; width: 16px; height: 16px; cursor: pointer; }
  .prp-submit {
    background: linear-gradient(135deg, #4a7c59, #2d5a3d); color: #e8d5b0;
    border: none; border-radius: 12px; padding: 13px 32px;
    font-family: 'Jost', sans-serif; font-size: 0.9rem; font-weight: 600;
    cursor: pointer; transition: all 0.25s; margin-top: 8px;
  }
  .prp-submit:hover { opacity: 0.9; box-shadow: 0 6px 20px rgba(45,90,61,0.3); transform: translateY(-1px); }
  .prp-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .prp-success {
    display: flex; align-items: center; gap: 8px;
    color: #2d5a3d; font-size: 0.85rem; font-weight: 500; margin-top: 12px;
  }
  @media (max-width: 640px) {
    .prp-grid-2, .prp-grid-3 { grid-template-columns: 1fr; }
    .prp-hours-row { grid-template-columns: 80px 1fr 1fr; }
  }
`;

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const { myFarmerProfile, loading: farmerLoading, success: farmerSuccess } = useSelector((state) => state.farmers);

  const [userForm, setUserForm] = useState({
    name: "", phone: "",
    address: { street: "", city: "", state: "", zipCode: "" },
  });

  const [farmerForm, setFarmerForm] = useState({
    farmName: "", description: "", farmingPractices: [], establishedYear: "",
    socialMedia: { facebook: "", instagram: "", twitter: "" },
    businessHours: {
      monday: { open: "", close: "" }, tuesday: { open: "", close: "" },
      wednesday: { open: "", close: "" }, thursday: { open: "", close: "" },
      friday: { open: "", close: "" }, saturday: { open: "", close: "" }, sunday: { open: "", close: "" },
    },
    acceptsPickup: false, acceptsDelivery: false, deliveryRadius: 0,
  });

  const [farmingPractice, setFarmingPractice] = useState("");
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    if (user) {
      setUserForm({
        name: user.name || "", phone: user.phone || "",
        address: {
          street: user.address?.street || "", city: user.address?.city || "",
          state: user.address?.state || "", zipCode: user.address?.zipCode || "",
        },
      });
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === "farmer" && myFarmerProfile) {
      setFarmerForm({
        farmName: myFarmerProfile.farmName || "",
        description: myFarmerProfile.description || "",
        farmingPractices: myFarmerProfile.farmingPractices || [],
        establishedYear: myFarmerProfile.establishedYear || "",
        socialMedia: {
          facebook: myFarmerProfile.socialMedia?.facebook || "",
          instagram: myFarmerProfile.socialMedia?.instagram || "",
          twitter: myFarmerProfile.socialMedia?.twitter || "",
        },
        businessHours: {
          monday: myFarmerProfile.businessHours?.monday || { open: "", close: "" },
          tuesday: myFarmerProfile.businessHours?.tuesday || { open: "", close: "" },
          wednesday: myFarmerProfile.businessHours?.wednesday || { open: "", close: "" },
          thursday: myFarmerProfile.businessHours?.thursday || { open: "", close: "" },
          friday: myFarmerProfile.businessHours?.friday || { open: "", close: "" },
          saturday: myFarmerProfile.businessHours?.saturday || { open: "", close: "" },
          sunday: myFarmerProfile.businessHours?.sunday || { open: "", close: "" },
        },
        acceptsPickup: myFarmerProfile.acceptsPickup || false,
        acceptsDelivery: myFarmerProfile.acceptsDelivery || false,
        deliveryRadius: myFarmerProfile.deliveryRadius || 0,
      });
    }
  }, [user, myFarmerProfile]);

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [p, c] = name.split(".");
      setUserForm({ ...userForm, [p]: { ...userForm[p], [c]: value } });
    } else {
      setUserForm({ ...userForm, [name]: value });
    }
  };

  const handleFarmerChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") { setFarmerForm({ ...farmerForm, [name]: checked }); return; }
    if (name.includes(".")) {
      const parts = name.split(".");
      if (parts.length === 3) {
        const [p, c, g] = parts;
        setFarmerForm({ ...farmerForm, [p]: { ...farmerForm[p], [c]: { ...farmerForm[p][c], [g]: value } } });
      } else {
        const [p, c] = parts;
        setFarmerForm({ ...farmerForm, [p]: { ...farmerForm[p], [c]: value } });
      }
    } else {
      setFarmerForm({ ...farmerForm, [name]: value });
    }
  };

  const addPractice = () => {
    if (farmingPractice.trim()) {
      setFarmerForm({ ...farmerForm, farmingPractices: [...farmerForm.farmingPractices, farmingPractice.trim()] });
      setFarmingPractice("");
    }
  };

  const removePractice = (i) => {
    setFarmerForm({ ...farmerForm, farmingPractices: farmerForm.farmingPractices.filter((_, idx) => idx !== i) });
  };

  if (loading || farmerLoading) return <Loader />;

  return (
    <>
      <style>{STYLE}</style>
      <div className="prp-root">
        <div className="prp-hero">
          <div className="prp-hero-inner">
            <div className="prp-avatar"><FaUser /></div>
            <div>
              <div className="prp-hero-name">{user?.name || "My Profile"}</div>
              <div className="prp-hero-role"><FaLeaf size={9} /> {user?.role}</div>
            </div>
          </div>
        </div>

        <div className="prp-main">
          <div className="prp-tabs">
            <button className={`prp-tab ${activeTab === "general" ? "active" : ""}`} onClick={() => setActiveTab("general")}>
              General Info
            </button>
            {user?.role === "farmer" && (
              <button className={`prp-tab ${activeTab === "farm" ? "active" : ""}`} onClick={() => setActiveTab("farm")}>
                Farm Profile
              </button>
            )}
          </div>

          {activeTab === "general" && (
            <form onSubmit={(e) => { e.preventDefault(); dispatch(updateProfile(userForm)); }}>
              <div className="prp-card">
                <div className="prp-card-title">Personal Information</div>
                <div className="prp-field">
                  <label className="prp-label">Full Name</label>
                  <div className="prp-input-wrap">
                    <FaUser className="prp-icon" />
                    <input name="name" type="text" value={userForm.name} onChange={handleUserChange} className="prp-input" placeholder="Your name" />
                  </div>
                </div>
                <div className="prp-field">
                  <label className="prp-label">Email</label>
                  <div className="prp-input-wrap">
                    <FaEnvelope className="prp-icon" />
                    <input type="email" value={user?.email || ""} className="prp-input" disabled style={{ opacity: 0.6, cursor: "not-allowed" }} />
                  </div>
                </div>
                <div className="prp-field">
                  <label className="prp-label">Phone</label>
                  <div className="prp-input-wrap">
                    <FaPhone className="prp-icon" />
                    <input name="phone" type="tel" value={userForm.phone} onChange={handleUserChange} className="prp-input" placeholder="Phone number" />
                  </div>
                </div>
              </div>

              <div className="prp-card">
                <div className="prp-card-title">Address</div>
                <div className="prp-field">
                  <label className="prp-label">Street</label>
                  <div className="prp-input-wrap">
                    <FaMapMarkerAlt className="prp-icon" />
                    <input name="address.street" type="text" value={userForm.address.street} onChange={handleUserChange} className="prp-input" placeholder="Street address" />
                  </div>
                </div>
                <div className="prp-grid-2" style={{ marginBottom: 14 }}>
                  <div className="prp-field" style={{ margin: 0 }}>
                    <label className="prp-label">City</label>
                    <input name="address.city" type="text" value={userForm.address.city} onChange={handleUserChange} className="prp-input no-icon" placeholder="City" />
                  </div>
                  <div className="prp-field" style={{ margin: 0 }}>
                    <label className="prp-label">State</label>
                    <input name="address.state" type="text" value={userForm.address.state} onChange={handleUserChange} className="prp-input no-icon" placeholder="State" />
                  </div>
                </div>
                <div className="prp-field">
                  <label className="prp-label">ZIP Code</label>
                  <input name="address.zipCode" type="text" value={userForm.address.zipCode} onChange={handleUserChange} className="prp-input no-icon" placeholder="ZIP / Postal code" />
                </div>
                <button type="submit" className="prp-submit" disabled={loading}>
                  {loading ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          )}

          {activeTab === "farm" && user?.role === "farmer" && (
            <form onSubmit={(e) => { e.preventDefault(); dispatch(updateFarmerProfile(farmerForm)); }}>
              <div className="prp-card">
                <div className="prp-card-title">Farm Information</div>
                <div className="prp-grid-2" style={{ marginBottom: 14 }}>
                  <div className="prp-field" style={{ margin: 0 }}>
                    <label className="prp-label">Farm Name</label>
                    <input name="farmName" type="text" value={farmerForm.farmName} onChange={handleFarmerChange} className="prp-input no-icon" placeholder="Your farm's name" required />
                  </div>
                  <div className="prp-field" style={{ margin: 0 }}>
                    <label className="prp-label">Established Year</label>
                    <input name="establishedYear" type="number" value={farmerForm.establishedYear} onChange={handleFarmerChange} className="prp-input no-icon" min="1900" max={new Date().getFullYear()} placeholder="e.g. 2008" />
                  </div>
                </div>
                <div className="prp-field">
                  <label className="prp-label">Description</label>
                  <textarea name="description" rows="4" value={farmerForm.description} onChange={handleFarmerChange} className="prp-textarea" placeholder="Tell customers about your farm…" required />
                </div>
                <div className="prp-field">
                  <label className="prp-label">Farming Practices</label>
                  <div className="prp-practice-input-row">
                    <input type="text" value={farmingPractice} onChange={(e) => setFarmingPractice(e.target.value)} className="prp-input no-icon" style={{ flex: 1 }} placeholder="e.g. Organic, No-till, Permaculture" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPractice())} />
                    <button type="button" onClick={addPractice} className="prp-add-btn">Add</button>
                  </div>
                  <div className="prp-tags">
                    {farmerForm.farmingPractices.map((p, i) => (
                      <span key={i} className="prp-tag">
                        {p}
                        <button type="button" onClick={() => removePractice(i)} className="prp-tag-remove"><FaTimes size={9} /></button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="prp-card">
                <div className="prp-card-title">Social Media</div>
                <div className="prp-grid-3">
                  <div className="prp-field" style={{ margin: 0 }}>
                    <label className="prp-label">Facebook</label>
                    <div className="prp-input-wrap">
                      <FaFacebook className="prp-icon" />
                      <input name="socialMedia.facebook" type="url" value={farmerForm.socialMedia.facebook} onChange={handleFarmerChange} className="prp-input" placeholder="https://facebook.com/…" />
                    </div>
                  </div>
                  <div className="prp-field" style={{ margin: 0 }}>
                    <label className="prp-label">Instagram</label>
                    <div className="prp-input-wrap">
                      <FaInstagram className="prp-icon" />
                      <input name="socialMedia.instagram" type="url" value={farmerForm.socialMedia.instagram} onChange={handleFarmerChange} className="prp-input" placeholder="https://instagram.com/…" />
                    </div>
                  </div>
                  <div className="prp-field" style={{ margin: 0 }}>
                    <label className="prp-label">Twitter</label>
                    <div className="prp-input-wrap">
                      <FaTwitter className="prp-icon" />
                      <input name="socialMedia.twitter" type="url" value={farmerForm.socialMedia.twitter} onChange={handleFarmerChange} className="prp-input" placeholder="https://twitter.com/…" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="prp-card">
                <div className="prp-card-title">Business Hours</div>
                {Object.entries(farmerForm.businessHours).map(([day, hours]) => (
                  <div key={day} className="prp-hours-row">
                    <span className="prp-hours-day">{day}</span>
                    <input type="time" name={`businessHours.${day}.open`} value={hours.open} onChange={handleFarmerChange} className="prp-input no-icon" style={{ margin: 0 }} />
                    <input type="time" name={`businessHours.${day}.close`} value={hours.close} onChange={handleFarmerChange} className="prp-input no-icon" style={{ margin: 0 }} />
                  </div>
                ))}
              </div>

              <div className="prp-card">
                <div className="prp-card-title">Order Options</div>
                <div className="prp-toggle-row">
                  <input type="checkbox" id="acceptsPickup" name="acceptsPickup" checked={farmerForm.acceptsPickup} onChange={handleFarmerChange} className="prp-checkbox" />
                  <label htmlFor="acceptsPickup" className="prp-toggle-label">Accept Pickup Orders</label>
                </div>
                <div className="prp-toggle-row">
                  <input type="checkbox" id="acceptsDelivery" name="acceptsDelivery" checked={farmerForm.acceptsDelivery} onChange={handleFarmerChange} className="prp-checkbox" />
                  <label htmlFor="acceptsDelivery" className="prp-toggle-label">Offer Delivery</label>
                </div>
                {farmerForm.acceptsDelivery && (
                  <div className="prp-field" style={{ marginTop: 12 }}>
                    <label className="prp-label">Delivery Radius (km)</label>
                    <input name="deliveryRadius" type="number" min="0" value={farmerForm.deliveryRadius} onChange={handleFarmerChange} className="prp-input no-icon" style={{ maxWidth: 120 }} />
                  </div>
                )}
                <button type="submit" className="prp-submit" disabled={farmerLoading}>
                  {farmerLoading ? "Saving…" : "Save Farm Profile"}
                </button>
                {farmerSuccess && (
                  <div className="prp-success">
                    <FaCheck size={13} /> Farm profile updated successfully!
                  </div>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;