import { useState, useRef, useCallback, useEffect } from "react";

const ROOMS = [
  { id: "living", label: "Living Room", icon: "🛋️" },
  { id: "kitchen", label: "Kitchen", icon: "🍳" },
  { id: "dining", label: "Dining Room", icon: "🍽️" },
  { id: "master_bed", label: "Primary Bedroom", icon: "🛏️" },
  { id: "bed2", label: "Bedroom 2", icon: "🛏️" },
  { id: "bed3", label: "Bedroom 3", icon: "🛏️" },
  { id: "bath1", label: "Bathroom 1", icon: "🚿" },
  { id: "bath2", label: "Bathroom 2", icon: "🚿" },
  { id: "laundry", label: "Laundry", icon: "👕" },
  { id: "garage", label: "Garage", icon: "🚗" },
  { id: "exterior", label: "Exterior", icon: "🏠" },
  { id: "basement", label: "Basement", icon: "⬇️" },
];

const CHECKLIST_ITEMS = {
  living: ["Walls & Paint", "Ceiling", "Flooring/Carpet", "Windows & Screens", "Window Coverings", "Light Fixtures", "Electrical Outlets", "Doors & Locks", "Baseboards & Trim", "Smoke Detector"],
  kitchen: ["Countertops", "Cabinets & Drawers", "Sink & Faucet", "Dishwasher", "Stove/Oven", "Range Hood", "Refrigerator", "Microwave", "Flooring", "Walls & Backsplash", "Light Fixtures", "Garbage Disposal"],
  dining: ["Walls & Paint", "Ceiling", "Flooring", "Windows & Screens", "Light Fixtures", "Electrical Outlets", "Baseboards & Trim"],
  master_bed: ["Walls & Paint", "Ceiling", "Flooring/Carpet", "Windows & Screens", "Window Coverings", "Closet & Doors", "Light Fixtures", "Electrical Outlets", "Doors & Locks", "Smoke Detector"],
  bed2: ["Walls & Paint", "Ceiling", "Flooring/Carpet", "Windows & Screens", "Window Coverings", "Closet & Doors", "Light Fixtures", "Electrical Outlets", "Doors & Locks"],
  bed3: ["Walls & Paint", "Ceiling", "Flooring/Carpet", "Windows & Screens", "Window Coverings", "Closet & Doors", "Light Fixtures", "Electrical Outlets", "Doors & Locks"],
  bath1: ["Toilet", "Sink & Faucet", "Vanity/Countertop", "Tub/Shower", "Shower Door/Curtain Rod", "Mirror & Medicine Cabinet", "Tile & Grout", "Flooring", "Exhaust Fan", "Towel Bars & Hooks", "Caulking"],
  bath2: ["Toilet", "Sink & Faucet", "Vanity/Countertop", "Tub/Shower", "Shower Door/Curtain Rod", "Mirror & Medicine Cabinet", "Tile & Grout", "Flooring", "Exhaust Fan", "Towel Bars & Hooks", "Caulking"],
  laundry: ["Washer Hookups", "Dryer Hookups/Vent", "Flooring", "Walls", "Sink (if applicable)", "Cabinets/Shelving", "Light Fixtures"],
  garage: ["Garage Door & Opener", "Flooring/Slab", "Walls", "Lighting", "Electrical Outlets", "Storage/Shelving", "Entry Door"],
  exterior: ["Siding/Paint", "Roof (visible)", "Gutters & Downspouts", "Front Door & Lock", "Porch/Deck", "Railings", "Driveway", "Walkways", "Landscaping", "Exterior Lighting", "Mailbox", "Address Numbers"],
  basement: ["Walls & Foundation", "Flooring", "Ceiling", "Windows & Wells", "Sump Pump", "Water Heater", "Furnace/HVAC", "Electrical Panel", "Lighting", "Stairway & Railing"],
};

const RATINGS = [
  { value: 5, label: "Excellent", color: "#16a34a", bg: "#dcfce7" },
  { value: 4, label: "Good", color: "#65a30d", bg: "#ecfccb" },
  { value: 3, label: "Fair", color: "#ca8a04", bg: "#fef9c3" },
  { value: 2, label: "Poor", color: "#ea580c", bg: "#ffedd5" },
  { value: 1, label: "Damaged", color: "#dc2626", bg: "#fee2e2" },
  { value: 0, label: "N/A", color: "#71717a", bg: "#f4f4f5" },
];

function SignaturePad({ value, onChange, label }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(!!value);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); canvas.width = canvas.offsetWidth * 2; canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2); ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.lineWidth = 2; ctx.strokeStyle = "#1e293b";
    if (value) { const img = new Image(); img.onload = () => ctx.drawImage(img, 0, 0, canvas.offsetWidth, canvas.offsetHeight); img.src = value; }
  }, []);
  const getPos = (e) => { const rect = canvasRef.current.getBoundingClientRect(); const cx = e.touches ? e.touches[0].clientX : e.clientX; const cy = e.touches ? e.touches[0].clientY : e.clientY; return { x: cx - rect.left, y: cy - rect.top }; };
  const startDraw = (e) => { e.preventDefault(); const ctx = canvasRef.current.getContext("2d"); const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); setIsDrawing(true); };
  const draw = (e) => { if (!isDrawing) return; e.preventDefault(); const ctx = canvasRef.current.getContext("2d"); const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); };
  const endDraw = () => { if (!isDrawing) return; setIsDrawing(false); setHasSignature(true); onChange(canvasRef.current.toDataURL()); };
  const clearSig = () => { const c = canvasRef.current; c.getContext("2d").clearRect(0, 0, c.width, c.height); setHasSignature(false); onChange(null); };
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontFamily: "var(--font)", fontSize: 13, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
        {hasSignature && <button onClick={clearSig} style={{ background: "none", border: "none", color: "#ef4444", fontSize: 12, cursor: "pointer", fontFamily: "var(--font)", fontWeight: 600 }}>Clear</button>}
      </div>
      <canvas ref={canvasRef} onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw} onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
        style={{ width: "100%", height: 120, border: "2px dashed #cbd5e1", borderRadius: 12, cursor: "crosshair", background: "#fafbfc", touchAction: "none" }} />
      {!hasSignature && <p style={{ fontSize: 11, color: "#94a3b8", textAlign: "center", marginTop: 4, fontFamily: "var(--font)" }}>Sign above</p>}
    </div>
  );
}

function PhotoUpload({ photos, onAdd, onRemove }) {
  const fileRef = useRef(null);
  const handleFiles = (e) => { Array.from(e.target.files).forEach((f) => { const r = new FileReader(); r.onload = (ev) => onAdd({ data: ev.target.result, name: f.name, timestamp: new Date().toLocaleString() }); r.readAsDataURL(f); }); e.target.value = ""; };
  return (
    <div>
      <input ref={fileRef} type="file" accept="image/*" multiple capture="environment" onChange={handleFiles} style={{ display: "none" }} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {photos.map((p, i) => (
          <div key={i} style={{ position: "relative", width: 90, height: 90, borderRadius: 10, overflow: "hidden", border: "2px solid #e2e8f0" }}>
            <img src={p.data} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <button onClick={() => onRemove(i)} style={{ position: "absolute", top: 2, right: 2, width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", cursor: "pointer", fontSize: 14, lineHeight: "20px" }}>×</button>
          </div>
        ))}
        <button onClick={() => fileRef.current?.click()} style={{ width: 90, height: 90, borderRadius: 10, border: "2px dashed #cbd5e1", background: "#f8fafc", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#64748b", fontSize: 11, fontFamily: "var(--font)", gap: 4 }}>
          <span style={{ fontSize: 24 }}>📷</span>Add Photo
        </button>
      </div>
    </div>
  );
}

function RatingSelector({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
      {RATINGS.map((r) => (
        <button key={r.value} onClick={() => onChange(r.value)} style={{
          padding: "4px 10px", borderRadius: 20, border: value === r.value ? `2px solid ${r.color}` : "2px solid transparent",
          background: value === r.value ? r.bg : "#f1f5f9", color: value === r.value ? r.color : "#94a3b8",
          fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font)", transition: "all 0.15s",
        }}>{r.label}</button>
      ))}
    </div>
  );
}

function ProgressRing({ progress, size = 44 }) {
  const r = (size - 6) / 2; const circ = 2 * Math.PI * r; const offset = circ - (progress / 100) * circ;
  const color = progress === 100 ? "#16a34a" : progress > 50 ? "#ca8a04" : "#2563eb";
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.4s ease" }}/>
      <text x={size/2} y={size/2} textAnchor="middle" dy="0.35em" fontSize={11} fontWeight={700} fill={color} style={{ transform: "rotate(90deg)", transformOrigin: "center" }} fontFamily="var(--font)">{progress}%</text>
    </svg>
  );
}

function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, []);
  const c = { success: { bg: "#dcfce7", b: "#16a34a", t: "#166534", i: "✓" }, error: { bg: "#fee2e2", b: "#dc2626", t: "#991b1b", i: "✕" }, info: { bg: "#dbeafe", b: "#2563eb", t: "#1e40af", i: "ℹ" } }[type] || { bg: "#dbeafe", b: "#2563eb", t: "#1e40af", i: "ℹ" };
  return (
    <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 9999, background: c.bg, border: `2px solid ${c.b}`, borderRadius: 12, padding: "12px 20px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.15)", animation: "slideDown 0.3s ease", maxWidth: "90vw" }}>
      <span style={{ fontSize: 16, fontWeight: 800, color: c.b }}>{c.i}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: c.t, fontFamily: "var(--font)" }}>{message}</span>
    </div>
  );
}

// ===== MAIN APP =====
export default function RentalInspectionApp() {
  const [screen, setScreen] = useState("home");
  const [activeRooms, setActiveRooms] = useState(["living", "kitchen", "master_bed", "bath1", "exterior"]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [toast, setToast] = useState(null);
  const [sending, setSending] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);
  const [showReport, setShowReport] = useState(false);

  // Settings
  const [webhookUrl, setWebhookUrl] = useState("");
  const [emailTo, setEmailTo] = useState("");
  const [emailCc, setEmailCc] = useState("");
  const [emailTenant, setEmailTenant] = useState(true);
  const [emailSubjectTemplate, setEmailSubjectTemplate] = useState("Inspection Report: {{address}} — {{date}}");

  const [inspectionData, setInspectionData] = useState({
    property: { address: "", unit: "", tenant: "", tenantEmail: "", inspector: "Steve Hartje", date: new Date().toISOString().split("T")[0], type: "Move-In" },
    rooms: {},
    signatures: { tenant: null, inspector: null },
    notes: "",
  });

  const showToast = (msg, type = "info") => setToast({ message: msg, type });
  const updateProperty = (f, v) => setInspectionData((d) => ({ ...d, property: { ...d.property, [f]: v } }));
  const getRoomData = (id) => inspectionData.rooms[id] || { items: {}, photos: [], notes: "" };
  const updateRoomData = (id, data) => setInspectionData((d) => ({ ...d, rooms: { ...d.rooms, [id]: { ...getRoomData(id), ...data } } }));
  const updateItemRating = (rid, item, rating) => { const r = getRoomData(rid); updateRoomData(rid, { items: { ...r.items, [item]: { ...r.items[item], rating } } }); };
  const updateItemNote = (rid, item, note) => { const r = getRoomData(rid); updateRoomData(rid, { items: { ...r.items, [item]: { ...r.items[item], note } } }); };
  const addPhoto = (rid, p) => { const r = getRoomData(rid); updateRoomData(rid, { photos: [...r.photos, p] }); };
  const removePhoto = (rid, i) => { const r = getRoomData(rid); updateRoomData(rid, { photos: r.photos.filter((_, j) => j !== i) }); };

  const getRoomProgress = (id) => {
    const items = CHECKLIST_ITEMS[id] || []; const d = getRoomData(id);
    return items.length === 0 ? 0 : Math.round((items.filter((i) => d.items[i]?.rating !== undefined).length / items.length) * 100);
  };
  const getTotalProgress = () => activeRooms.length === 0 ? 0 : Math.round(activeRooms.reduce((s, r) => s + getRoomProgress(r), 0) / activeRooms.length);
  const getOverallCondition = () => {
    let t = 0, c = 0;
    activeRooms.forEach((rid) => { Object.values(getRoomData(rid).items).forEach((i) => { if (i.rating !== undefined && i.rating > 0) { t += i.rating; c++; } }); });
    if (c === 0) return "—";
    const a = t / c; return a >= 4.5 ? "Excellent" : a >= 3.5 ? "Good" : a >= 2.5 ? "Fair" : a >= 1.5 ? "Poor" : "Damaged";
  };

  // Build email body (plain text version for Zapier)
  const buildEmailBody = () => {
    const { property } = inspectionData;
    let body = `RENTAL INSPECTION REPORT\n${"─".repeat(40)}\n\n`;
    body += `Property: ${property.address}${property.unit ? `, Unit ${property.unit}` : ""}\n`;
    body += `Tenant: ${property.tenant}\nInspector: ${property.inspector}\n`;
    body += `Date: ${property.date} | Type: ${property.type}\n`;
    body += `Overall Condition: ${getOverallCondition()} | Progress: ${getTotalProgress()}%\n\n`;

    // Issues summary at top
    const allIssues = [];
    activeRooms.forEach((rid) => {
      const room = ROOMS.find((r) => r.id === rid);
      const data = getRoomData(rid);
      (CHECKLIST_ITEMS[rid] || []).forEach((item) => {
        const d = data.items[item];
        if (d?.rating !== undefined && d.rating > 0 && d.rating <= 2) {
          allIssues.push({ room: room.label, item, rating: RATINGS.find((r) => r.value === d.rating)?.label, note: d.note || "" });
        }
      });
    });

    if (allIssues.length > 0) {
      body += `⚠ ISSUES REQUIRING ATTENTION (${allIssues.length})\n${"─".repeat(40)}\n`;
      allIssues.forEach((issue) => {
        body += `• ${issue.room} → ${issue.item}: ${issue.rating}`;
        if (issue.note) body += ` — ${issue.note}`;
        body += "\n";
      });
      body += "\n";
    }

    // Room details
    body += `ROOM-BY-ROOM DETAILS\n${"─".repeat(40)}\n\n`;
    activeRooms.forEach((rid) => {
      const room = ROOMS.find((r) => r.id === rid);
      const data = getRoomData(rid);
      body += `${room.icon} ${room.label} (${getRoomProgress(rid)}% complete)\n`;
      (CHECKLIST_ITEMS[rid] || []).forEach((item) => {
        const d = data.items[item] || {};
        const rl = d.rating !== undefined ? RATINGS.find((r) => r.value === d.rating)?.label : "Not Rated";
        body += `   ${item}: ${rl}`;
        if (d.note) body += ` — ${d.note}`;
        body += "\n";
      });
      if (data.notes) body += `   Notes: ${data.notes}\n`;
      if (data.photos?.length > 0) body += `   📷 ${data.photos.length} photo(s) attached\n`;
      body += "\n";
    });

    if (inspectionData.notes) body += `GENERAL NOTES\n${"─".repeat(40)}\n${inspectionData.notes}\n\n`;
    body += `${"─".repeat(40)}\n`;
    body += `Tenant Signed: ${inspectionData.signatures.tenant ? "✓ Yes" : "✗ No"}\n`;
    body += `Inspector Signed: ${inspectionData.signatures.inspector ? "✓ Yes" : "✗ No"}\n`;
    body += `\nGenerated by InspectPro · ${new Date().toLocaleString()}\n`;
    return body;
  };

  // Build structured payload
  const buildPayload = () => {
    const { property } = inspectionData;
    const roomResults = {};
    const issues = [];
    let totalRating = 0, ratingCount = 0, photoCount = 0;

    activeRooms.forEach((rid) => {
      const room = ROOMS.find((r) => r.id === rid);
      const data = getRoomData(rid);
      const itemResults = {};
      (CHECKLIST_ITEMS[rid] || []).forEach((item) => {
        const d = data.items[item] || {};
        const rl = d.rating !== undefined ? RATINGS.find((r) => r.value === d.rating)?.label || "Not Rated" : "Not Rated";
        itemResults[item] = { rating: d.rating ?? null, rating_label: rl, note: d.note || "" };
        if (d.rating !== undefined && d.rating > 0) { totalRating += d.rating; ratingCount++; }
        if (d.rating !== undefined && d.rating > 0 && d.rating <= 2) issues.push({ room: room.label, item, rating: rl, note: d.note || "" });
      });
      photoCount += (data.photos || []).length;
      roomResults[room.label] = { progress: getRoomProgress(rid) + "%", items: itemResults, notes: data.notes || "", photo_count: (data.photos || []).length };
    });

    // Build recipient list
    const recipients = [];
    if (emailTo) recipients.push(...emailTo.split(",").map((e) => e.trim()).filter(Boolean));
    if (emailTenant && property.tenantEmail) recipients.push(property.tenantEmail);

    const subject = emailSubjectTemplate
      .replace("{{address}}", property.address || "Property")
      .replace("{{date}}", property.date)
      .replace("{{type}}", property.type)
      .replace("{{tenant}}", property.tenant || "Tenant")
      .replace("{{condition}}", getOverallCondition());

    return {
      inspection_id: `INS-${Date.now()}`,
      timestamp: new Date().toISOString(),
      // Property
      property_address: property.address,
      property_unit: property.unit,
      tenant_name: property.tenant,
      tenant_email: property.tenantEmail,
      inspector_name: property.inspector,
      inspection_date: property.date,
      inspection_type: property.type,
      // Results
      overall_condition: getOverallCondition(),
      overall_progress: getTotalProgress() + "%",
      average_rating: ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : "N/A",
      total_rooms_inspected: activeRooms.length,
      total_photos: photoCount,
      total_issues: issues.length,
      issues_summary: issues.map((i) => `${i.room} → ${i.item}: ${i.rating}${i.note ? " (" + i.note + ")" : ""}`).join(" | "),
      rooms: roomResults,
      // Signatures
      tenant_signed: !!inspectionData.signatures.tenant,
      inspector_signed: !!inspectionData.signatures.inspector,
      general_notes: inspectionData.notes,
      // Email fields — separated for Zapier compatibility
      email_to: recipients.join(", "),
      email_to_owner: emailTo ? emailTo.split(",")[0].trim() : "",
      email_to_tenant: (emailTenant && property.tenantEmail) ? property.tenantEmail : "",
      email_cc: emailCc,
      email_subject: subject,
      email_body: buildEmailBody(),
    };
  };

  const sendToZapier = async () => {
    if (!webhookUrl) { showToast("Set your Zapier webhook URL in Settings first", "error"); return; }
    if (!webhookUrl.includes("hooks.zapier.com")) { showToast("That doesn't look like a Zapier webhook URL", "error"); return; }
    setSending(true);
    try {
      const payload = buildPayload();
      // Call our own API route which forwards to Zapier server-side (no CORS)
      const response = await fetch("/api/zapier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ webhookUrl, payload }),
      });
      const result = await response.json();
      if (result.success) {
        showToast("Inspection sent to Zapier!", "success");
      } else {
        showToast(`Zapier error: ${result.error || result.status}`, "error");
      }
    } catch (err) {
      showToast("Error sending: " + err.message, "error");
    }
    setSending(false);
  };

  const downloadReport = () => {
    const report = buildEmailBody();
    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `inspection_${inspectionData.property.address.replace(/\s/g, "_")}_${inspectionData.property.date}.txt`;
    a.click(); URL.revokeObjectURL(url);
  };

  const copyPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(buildPayload(), null, 2)).then(() => showToast("JSON copied", "success")).catch(() => showToast("Couldn't copy", "error"));
  };

  // Styles
  const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "2px solid #e2e8f0", fontSize: 14, fontFamily: "var(--font)", outline: "none", background: "#fff", boxSizing: "border-box" };
  const labelStyle = { fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4, display: "block", fontFamily: "var(--font)" };
  const cardStyle = { background: "#fff", borderRadius: 16, padding: 20, marginBottom: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9" };
  const btnPrimary = { width: "100%", padding: "14px 24px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%)", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font)", boxShadow: "0 4px 14px rgba(30,58,95,0.25)" };
  const btnSecondary = { ...btnPrimary, background: "#f1f5f9", color: "#475569", boxShadow: "none", border: "2px solid #e2e8f0" };
  const btnZapier = { ...btnPrimary, background: "linear-gradient(135deg, #ff4a00 0%, #ff6d2e 100%)", boxShadow: "0 4px 14px rgba(255,74,0,0.3)" };

  const headerBar = (title, onBack, extra) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, paddingBottom: 16, borderBottom: "2px solid #f1f5f9" }}>
      {onBack && <button onClick={onBack} style={{ background: "#f1f5f9", border: "none", borderRadius: 10, width: 40, height: 40, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>}
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#1e293b", fontFamily: "'Playfair Display', serif", flex: 1 }}>{title}</h2>
      {extra}
    </div>
  );

  const shell = (children) => (
    <div style={{ "--font": "'DM Sans', sans-serif", fontFamily: "var(--font)", maxWidth: 480, margin: "0 auto", padding: 20, minHeight: "100vh", background: "linear-gradient(180deg, #f0f4f8 0%, #e8edf3 100%)" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800;900&display=swap" rel="stylesheet" />
      <style>{`@keyframes slideDown{from{opacity:0;transform:translate(-50%,-20px)}to{opacity:1;transform:translate(-50%,0)}} @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {children}
    </div>
  );

  const settingsBtn = (
    <button onClick={() => setShowSettings(true)} style={{ background: webhookUrl ? "#fff7ed" : "#f1f5f9", border: webhookUrl ? "2px solid #fb923c" : "2px solid #e2e8f0", borderRadius: 10, width: 40, height: 40, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
      ⚙️
      {webhookUrl && <span style={{ position: "absolute", top: -2, right: -2, width: 10, height: 10, borderRadius: "50%", background: "#fb923c", border: "2px solid #fff" }} />}
    </button>
  );

  // ===== SETTINGS MODAL =====
  const settingsModal = showSettings && (
    <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={(e) => { if (e.target === e.currentTarget) setShowSettings(false); }}>
      <div style={{ background: "#fff", borderRadius: "20px 20px 0 0", padding: 24, width: "100%", maxWidth: 480, maxHeight: "85vh", overflow: "auto", animation: "slideUp 0.25s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, fontFamily: "'Playfair Display', serif", color: "#1e293b" }}>⚙️ Settings</h3>
          <button onClick={() => setShowSettings(false)} style={{ background: "#f1f5f9", border: "none", borderRadius: 10, width: 36, height: 36, cursor: "pointer", fontSize: 18 }}>×</button>
        </div>

        {/* Zapier Webhook */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 20 }}>⚡</span>
            <span style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>Zapier Webhook URL</span>
          </div>
          <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 10px", lineHeight: 1.5 }}>Your Zapier "Catch Hook" URL. This receives the full inspection payload.</p>
          <input style={inputStyle} value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} placeholder="https://hooks.zapier.com/hooks/catch/..." />
          {webhookUrl && webhookUrl.includes("hooks.zapier.com") && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#16a34a" }} />
              <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 600 }}>Webhook connected</span>
            </div>
          )}
        </div>

        {/* Email Settings */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 20 }}>📧</span>
            <span style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>Auto-Email Settings</span>
          </div>
          <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 12px", lineHeight: 1.5 }}>These fields are included in the Zapier payload so your Zap can auto-send inspection reports via email.</p>

          <label style={labelStyle}>Send Reports To (comma-separated)</label>
          <input style={{ ...inputStyle, marginBottom: 10 }} value={emailTo} onChange={(e) => setEmailTo(e.target.value)} placeholder="you@company.com, manager@company.com" />

          <label style={labelStyle}>CC (optional)</label>
          <input style={{ ...inputStyle, marginBottom: 10 }} value={emailCc} onChange={(e) => setEmailCc(e.target.value)} placeholder="office@company.com" />

          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#f8fafc", borderRadius: 10, marginBottom: 10, cursor: "pointer" }} onClick={() => setEmailTenant(!emailTenant)}>
            <div style={{ width: 20, height: 20, borderRadius: 6, border: emailTenant ? "none" : "2px solid #cbd5e1", background: emailTenant ? "#2563eb" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 800, transition: "all 0.15s" }}>
              {emailTenant ? "✓" : ""}
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>Also email tenant (uses tenant email from property details)</span>
          </div>

          <label style={labelStyle}>Email Subject Template</label>
          <input style={inputStyle} value={emailSubjectTemplate} onChange={(e) => setEmailSubjectTemplate(e.target.value)} />
          <p style={{ fontSize: 11, color: "#94a3b8", margin: "4px 0 0", lineHeight: 1.5 }}>
            Variables: {"{{address}}"}, {"{{date}}"}, {"{{type}}"}, {"{{tenant}}"}, {"{{condition}}"}
          </p>
        </div>

        {/* Setup Guide */}
        <div style={{ background: "#fff7ed", borderRadius: 12, padding: 16, border: "1px solid #fed7aa", marginBottom: 16 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#c2410c", marginBottom: 8 }}>🔗 Zapier + DoorLoop + Email Setup</p>
          <ol style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: "#9a3412", lineHeight: 2 }}>
            <li><strong>Create Zap</strong> → Trigger: Webhooks by Zapier → Catch Hook</li>
            <li><strong>Copy</strong> the webhook URL → paste above</li>
            <li><strong>Test:</strong> Run a test inspection from this app</li>
            <li><strong>Action 1:</strong> Gmail → Send Email</li>
            <li style={{ paddingLeft: 8 }}>To: map <code>email_to</code> field</li>
            <li style={{ paddingLeft: 8 }}>CC: map <code>email_cc</code> field</li>
            <li style={{ paddingLeft: 8 }}>Subject: map <code>email_subject</code> field</li>
            <li style={{ paddingLeft: 8 }}>Body: map <code>email_body</code> field</li>
            <li><strong>Action 2 (optional):</strong> DoorLoop → Create Task</li>
            <li style={{ paddingLeft: 8 }}>Map: address, tenant, condition, issues</li>
            <li><strong>Turn on</strong> your Zap!</li>
          </ol>
        </div>

        <button onClick={() => { setShowSettings(false); showToast("Settings saved", "success"); }} style={btnPrimary}>Save Settings</button>
      </div>
    </div>
  );

  // ============ HOME ============
  if (screen === "home") {
    return shell(<>
      {settingsModal}
      <div style={{ textAlign: "center", padding: "30px 0 24px" }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, background: "linear-gradient(135deg, #1e3a5f 0%, #3b7dd8 100%)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 34, boxShadow: "0 8px 24px rgba(30,58,95,0.3)" }}>📋</div>
        <h1 style={{ margin: "0 0 4px", fontSize: 28, fontWeight: 900, color: "#1e293b", fontFamily: "'Playfair Display', serif" }}>InspectPro</h1>
        <p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>Professional Rental Inspections</p>
      </div>

      {webhookUrl ? (
        <div style={{ ...cardStyle, display: "flex", alignItems: "center", gap: 10, background: "#fff7ed", border: "1px solid #fed7aa" }}>
          <span style={{ fontSize: 22 }}>⚡</span>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#c2410c" }}>Zapier Connected</p>
            <p style={{ margin: 0, fontSize: 11, color: "#9a3412" }}>
              {emailTo ? `Reports → ${emailTo.split(",")[0].trim()}${emailTo.includes(",") ? " +" + (emailTo.split(",").length - 1) : ""}` : "No email recipients set"}
              {emailTo ? " → DoorLoop" : ""}
            </p>
          </div>
          {settingsBtn}
        </div>
      ) : (
        <div style={{ ...cardStyle, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>⚡</span>
          <div style={{ flex: 1 }}><p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#64748b" }}>Connect Zapier for auto-email + DoorLoop</p></div>
          {settingsBtn}
        </div>
      )}

      <div style={cardStyle}>
        <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#1e293b" }}>Property Details</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div><label style={labelStyle}>Address</label><input style={inputStyle} value={inspectionData.property.address} onChange={(e) => updateProperty("address", e.target.value)} placeholder="123 Main St, Bemidji, MN" /></div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}><label style={labelStyle}>Unit</label><input style={inputStyle} value={inspectionData.property.unit} onChange={(e) => updateProperty("unit", e.target.value)} placeholder="Apt #" /></div>
            <div style={{ flex: 1 }}><label style={labelStyle}>Type</label>
              <select style={inputStyle} value={inspectionData.property.type} onChange={(e) => updateProperty("type", e.target.value)}>
                <option>Move-In</option><option>Move-Out</option><option>Periodic</option><option>Drive-By</option>
              </select>
            </div>
          </div>
          <div><label style={labelStyle}>Tenant Name</label><input style={inputStyle} value={inspectionData.property.tenant} onChange={(e) => updateProperty("tenant", e.target.value)} placeholder="Tenant name" /></div>
          <div><label style={labelStyle}>Tenant Email</label><input style={inputStyle} type="email" value={inspectionData.property.tenantEmail} onChange={(e) => updateProperty("tenantEmail", e.target.value)} placeholder="tenant@email.com (for auto-email)" /></div>
          <div><label style={labelStyle}>Inspector Name</label><input style={inputStyle} value={inspectionData.property.inspector} onChange={(e) => updateProperty("inspector", e.target.value)} placeholder="Your name" /></div>
          <div><label style={labelStyle}>Date</label><input type="date" style={inputStyle} value={inspectionData.property.date} onChange={(e) => updateProperty("date", e.target.value)} /></div>
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700, color: "#1e293b" }}>Rooms to Inspect</h3>
        <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 12px" }}>Tap to toggle</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {ROOMS.map((room) => {
            const active = activeRooms.includes(room.id);
            return <button key={room.id} onClick={() => setActiveRooms(active ? activeRooms.filter((r) => r !== room.id) : [...activeRooms, room.id])}
              style={{ padding: "8px 14px", borderRadius: 24, border: active ? "2px solid #1e3a5f" : "2px solid #e2e8f0", background: active ? "#eef2ff" : "#fff", color: active ? "#1e3a5f" : "#94a3b8", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font)" }}>
              {room.icon} {room.label}
            </button>;
          })}
        </div>
      </div>
      <button onClick={() => setScreen("inspect")} disabled={!inspectionData.property.address} style={{ ...btnPrimary, opacity: inspectionData.property.address ? 1 : 0.5 }}>Start Inspection →</button>
    </>);
  }

  // ============ INSPECT ============
  if (screen === "inspect") {
    return shell(<>
      {settingsModal}
      {headerBar("Inspection", () => setScreen("home"), settingsBtn)}
      <div style={{ ...cardStyle, display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
        <ProgressRing progress={getTotalProgress()} size={52} />
        <div>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#1e293b" }}>{inspectionData.property.address}</p>
          <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>{inspectionData.property.type} · {activeRooms.length} rooms</p>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {activeRooms.map((rid) => {
          const room = ROOMS.find((r) => r.id === rid); const prog = getRoomProgress(rid); const data = getRoomData(rid);
          return (
            <button key={rid} onClick={() => { setCurrentRoom(rid); setExpandedItem(null); setScreen("room"); }}
              style={{ ...cardStyle, marginBottom: 0, display: "flex", alignItems: "center", gap: 14, cursor: "pointer", textAlign: "left", border: prog === 100 ? "2px solid #bbf7d0" : "1px solid #f1f5f9" }}>
              <div style={{ fontSize: 28, width: 48, height: 48, borderRadius: 12, background: prog === 100 ? "#dcfce7" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>{room.icon}</div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#1e293b" }}>{room.label}</p>
                <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>{CHECKLIST_ITEMS[rid]?.length || 0} items{(data.photos?.length || 0) > 0 ? ` · ${data.photos.length} 📷` : ""}</p>
              </div>
              <ProgressRing progress={prog} size={40} />
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: 20 }}><button onClick={() => setScreen("review")} style={btnPrimary}>Review & Sign →</button></div>
    </>);
  }

  // ============ ROOM ============
  if (screen === "room" && currentRoom) {
    const room = ROOMS.find((r) => r.id === currentRoom);
    const items = CHECKLIST_ITEMS[currentRoom] || [];
    const data = getRoomData(currentRoom);
    return shell(<>
      {headerBar(`${room.icon} ${room.label}`, () => setScreen("inspect"))}
      <div style={{ ...cardStyle, marginBottom: 16 }}>
        <h4 style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>Photos</h4>
        <PhotoUpload photos={data.photos || []} onAdd={(p) => addPhoto(currentRoom, p)} onRemove={(i) => removePhoto(currentRoom, i)} />
      </div>
      <div style={cardStyle}>
        <h4 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>Checklist</h4>
        {items.map((item, idx) => {
          const itemData = data.items[item] || {};
          const isExp = expandedItem === item;
          const ri = itemData.rating !== undefined ? RATINGS.find((r) => r.value === itemData.rating) : null;
          return (
            <div key={item} style={{ padding: "12px 0", borderBottom: idx < items.length - 1 ? "1px solid #f1f5f9" : "none" }}>
              <div onClick={() => setExpandedItem(isExp ? null : item)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#334155" }}>{item}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {ri && <span style={{ fontSize: 11, fontWeight: 700, color: ri.color, background: ri.bg, padding: "3px 10px", borderRadius: 20 }}>{ri.label}</span>}
                  <span style={{ color: "#cbd5e1", fontSize: 16, transform: isExp ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
                </div>
              </div>
              {isExp && (
                <div style={{ marginTop: 10, paddingLeft: 4 }}>
                  <RatingSelector value={itemData.rating} onChange={(v) => updateItemRating(currentRoom, item, v)} />
                  <textarea value={itemData.note || ""} onChange={(e) => updateItemNote(currentRoom, item, e.target.value)} placeholder="Note about condition..." style={{ ...inputStyle, marginTop: 10, minHeight: 60, resize: "vertical" }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ ...cardStyle, marginTop: 12 }}>
        <h4 style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>Room Notes</h4>
        <textarea value={data.notes || ""} onChange={(e) => updateRoomData(currentRoom, { notes: e.target.value })} placeholder="General notes..." style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} />
      </div>
      <button onClick={() => setScreen("inspect")} style={{ ...btnPrimary, marginTop: 16 }}>← Back to Rooms</button>
    </>);
  }

  // ============ REVIEW ============
  if (screen === "review") {
    const recipients = [];
    if (emailTo) recipients.push(...emailTo.split(",").map((e) => e.trim()).filter(Boolean));
    if (emailTenant && inspectionData.property.tenantEmail) recipients.push(inspectionData.property.tenantEmail);

    return shell(<>
      {settingsModal}
      {headerBar("Review & Sign", () => setScreen("inspect"), settingsBtn)}

      <div style={{ ...cardStyle, textAlign: "center", marginBottom: 20 }}>
        <ProgressRing progress={getTotalProgress()} size={64} />
        <p style={{ margin: "12px 0 4px", fontSize: 22, fontWeight: 800, color: "#1e293b", fontFamily: "'Playfair Display', serif" }}>{getOverallCondition()}</p>
        <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>Overall Property Condition</p>
      </div>

      {activeRooms.map((rid) => {
        const room = ROOMS.find((r) => r.id === rid);
        const data = getRoomData(rid);
        const flagged = (CHECKLIST_ITEMS[rid] || []).filter((item) => { const d = data.items[item]; return d?.rating !== undefined && d.rating > 0 && d.rating <= 2; });
        return (
          <div key={rid} style={{ ...cardStyle, marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: flagged.length > 0 ? 10 : 0 }}>
              <span style={{ fontSize: 20 }}>{room.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", flex: 1 }}>{room.label}</span>
              <ProgressRing progress={getRoomProgress(rid)} size={36} />
            </div>
            {flagged.length > 0 && (
              <div style={{ background: "#fef2f2", borderRadius: 10, padding: "8px 12px" }}>
                <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, color: "#dc2626" }}>⚠ Issues</p>
                {flagged.map((item) => <p key={item} style={{ margin: 0, fontSize: 12, color: "#991b1b" }}>• {item}: {RATINGS.find((r) => r.value === data.items[item]?.rating)?.label}{data.items[item]?.note ? ` — ${data.items[item].note}` : ""}</p>)}
              </div>
            )}
          </div>
        );
      })}

      <div style={{ ...cardStyle, marginTop: 12 }}>
        <h4 style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>General Notes</h4>
        <textarea value={inspectionData.notes} onChange={(e) => setInspectionData((d) => ({ ...d, notes: e.target.value }))} placeholder="Overall inspection notes..." style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} />
      </div>

      <div style={{ ...cardStyle, marginTop: 12 }}>
        <h4 style={{ margin: "0 0 16px", fontSize: 13, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>Signatures</h4>
        <SignaturePad label="Tenant Signature" value={inspectionData.signatures.tenant} onChange={(sig) => setInspectionData((d) => ({ ...d, signatures: { ...d.signatures, tenant: sig } }))} />
        <SignaturePad label="Inspector Signature" value={inspectionData.signatures.inspector} onChange={(sig) => setInspectionData((d) => ({ ...d, signatures: { ...d.signatures, inspector: sig } }))} />
      </div>

      {/* Email preview */}
      {recipients.length > 0 && webhookUrl && (
        <div style={{ ...cardStyle, marginTop: 12, background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 18 }}>📧</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#166534" }}>Auto-Email Preview</span>
          </div>
          <p style={{ margin: "0 0 2px", fontSize: 12, color: "#166534" }}><strong>To:</strong> {recipients.join(", ")}</p>
          {emailCc && <p style={{ margin: "0 0 2px", fontSize: 12, color: "#166534" }}><strong>CC:</strong> {emailCc}</p>}
          <p style={{ margin: 0, fontSize: 12, color: "#166534" }}><strong>Subject:</strong> {emailSubjectTemplate.replace("{{address}}", inspectionData.property.address || "Property").replace("{{date}}", inspectionData.property.date).replace("{{type}}", inspectionData.property.type).replace("{{tenant}}", inspectionData.property.tenant || "Tenant").replace("{{condition}}", getOverallCondition())}</p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
        <button onClick={sendToZapier} disabled={sending} style={{ ...btnZapier, opacity: sending ? 0.7 : 1 }}>
          {sending ? "⏳ Sending..." : `⚡ Send${recipients.length > 0 ? " + Email " + recipients.length + " recipient" + (recipients.length > 1 ? "s" : "") : ""} → Zapier`}
        </button>
        <button onClick={() => setShowReport(true)} style={btnPrimary}>📄 View Full Report</button>
      </div>

      {/* Professional Report Modal */}
      {showReport && (() => {
        const { property } = inspectionData;
        const allIssues = [];
        activeRooms.forEach((rid) => {
          const room = ROOMS.find((r) => r.id === rid);
          const data = getRoomData(rid);
          (CHECKLIST_ITEMS[rid] || []).forEach((item) => {
            const d = data.items[item];
            if (d?.rating !== undefined && d.rating > 0 && d.rating <= 2) {
              allIssues.push({ room: room.label, icon: room.icon, item, rating: RATINGS.find((r) => r.value === d.rating), note: d.note || "" });
            }
          });
        });
        const rptCard = { background: "#fff", borderRadius: 12, padding: "16px 20px", marginBottom: 12, border: "1px solid #e9ecef" };
        const rptLabel = { fontSize: 10, fontWeight: 700, color: "#8895a7", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 2px" };
        const rptValue = { fontSize: 14, fontWeight: 600, color: "#1e293b", margin: 0 };

        return (
          <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(15,23,42,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 12 }} onClick={(e) => { if (e.target === e.currentTarget) setShowReport(false); }}>
            <div style={{ background: "#f4f5f7", borderRadius: 16, width: "100%", maxWidth: 500, maxHeight: "92vh", overflow: "auto", animation: "slideUp 0.25s ease", boxShadow: "0 24px 64px rgba(0,0,0,0.3)" }}>

              {/* Report Header */}
              <div style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%)", padding: "28px 24px 24px", borderRadius: "16px 16px 0 0", color: "#fff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ margin: "0 0 2px", fontSize: 11, fontWeight: 600, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.12em" }}>InspectPro</p>
                    <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, fontFamily: "'Playfair Display', serif" }}>Inspection Report</h2>
                    <p style={{ margin: 0, fontSize: 13, opacity: 0.8 }}>{property.type} Inspection</p>
                  </div>
                  <button onClick={() => setShowReport(false)} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 10, width: 36, height: 36, cursor: "pointer", fontSize: 16, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px", marginTop: 20 }}>
                  <div><p style={{ ...rptLabel, color: "rgba(255,255,255,0.5)" }}>Property</p><p style={{ ...rptValue, color: "#fff" }}>{property.address || "—"}{property.unit ? `, Unit ${property.unit}` : ""}</p></div>
                  <div><p style={{ ...rptLabel, color: "rgba(255,255,255,0.5)" }}>Date</p><p style={{ ...rptValue, color: "#fff" }}>{property.date}</p></div>
                  <div><p style={{ ...rptLabel, color: "rgba(255,255,255,0.5)" }}>Tenant</p><p style={{ ...rptValue, color: "#fff" }}>{property.tenant || "—"}</p></div>
                  <div><p style={{ ...rptLabel, color: "rgba(255,255,255,0.5)" }}>Inspector</p><p style={{ ...rptValue, color: "#fff" }}>{property.inspector || "—"}</p></div>
                </div>
              </div>

              <div style={{ padding: "16px 16px 24px" }}>

                {/* Condition Summary Bar */}
                <div style={{ ...rptCard, display: "flex", alignItems: "center", gap: 16 }}>
                  <ProgressRing progress={getTotalProgress()} size={56} />
                  <div style={{ flex: 1 }}>
                    <p style={rptLabel}>Overall Condition</p>
                    <p style={{ ...rptValue, fontSize: 20, fontFamily: "'Playfair Display', serif" }}>{getOverallCondition()}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={rptLabel}>Rooms</p>
                    <p style={rptValue}>{activeRooms.length}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={rptLabel}>Issues</p>
                    <p style={{ ...rptValue, color: allIssues.length > 0 ? "#dc2626" : "#16a34a" }}>{allIssues.length}</p>
                  </div>
                </div>

                {/* Issues Alert */}
                {allIssues.length > 0 && (
                  <div style={{ ...rptCard, background: "#fef2f2", border: "1px solid #fecaca" }}>
                    <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 800, color: "#991b1b", textTransform: "uppercase", letterSpacing: "0.08em" }}>⚠ Items Requiring Attention</p>
                    {allIssues.map((issue, idx) => (
                      <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "6px 0", borderTop: idx > 0 ? "1px solid #fecaca" : "none" }}>
                        <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{issue.icon}</span>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{issue.room} — {issue.item}</p>
                          {issue.note && <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748b" }}>{issue.note}</p>}
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: issue.rating.color, background: issue.rating.bg, padding: "3px 10px", borderRadius: 20, flexShrink: 0 }}>{issue.rating.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Room-by-Room Detail */}
                {activeRooms.map((rid) => {
                  const room = ROOMS.find((r) => r.id === rid);
                  const data = getRoomData(rid);
                  const items = CHECKLIST_ITEMS[rid] || [];
                  const prog = getRoomProgress(rid);
                  return (
                    <div key={rid} style={rptCard}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid #f1f5f9" }}>
                        <span style={{ fontSize: 20 }}>{room.icon}</span>
                        <span style={{ fontSize: 14, fontWeight: 800, color: "#1e293b", flex: 1 }}>{room.label}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: prog === 100 ? "#16a34a" : "#64748b", background: prog === 100 ? "#dcfce7" : "#f1f5f9", padding: "3px 10px", borderRadius: 20 }}>{prog}%</span>
                      </div>
                      <div style={{ display: "grid", gap: 1 }}>
                        {items.map((item, idx) => {
                          const d = data.items[item] || {};
                          const ri = d.rating !== undefined ? RATINGS.find((r) => r.value === d.rating) : null;
                          return (
                            <div key={item} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 0", borderBottom: idx < items.length - 1 ? "1px solid #f8f9fa" : "none" }}>
                              <div style={{ flex: 1 }}>
                                <span style={{ fontSize: 12, color: "#475569" }}>{item}</span>
                                {d.note && <span style={{ fontSize: 10, color: "#94a3b8", marginLeft: 6 }}>💬 {d.note}</span>}
                              </div>
                              {ri ? (
                                <span style={{ fontSize: 10, fontWeight: 700, color: ri.color, background: ri.bg, padding: "2px 8px", borderRadius: 16, flexShrink: 0 }}>{ri.label}</span>
                              ) : (
                                <span style={{ fontSize: 10, color: "#d1d5db" }}>—</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      {data.notes && (
                        <div style={{ marginTop: 10, padding: "8px 10px", background: "#f8fafc", borderRadius: 8 }}>
                          <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}><strong>Notes:</strong> {data.notes}</p>
                        </div>
                      )}
                      {data.photos?.length > 0 && (
                        <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                          {data.photos.map((p, i) => <img key={i} src={p.data} alt="" style={{ width: 44, height: 44, borderRadius: 6, objectFit: "cover", border: "1px solid #e2e8f0" }} />)}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* General Notes */}
                {inspectionData.notes && (
                  <div style={rptCard}>
                    <p style={{ ...rptLabel, marginBottom: 6 }}>General Notes</p>
                    <p style={{ margin: 0, fontSize: 13, color: "#334155", lineHeight: 1.6 }}>{inspectionData.notes}</p>
                  </div>
                )}

                {/* Signatures */}
                <div style={rptCard}>
                  <p style={{ ...rptLabel, marginBottom: 12 }}>Signatures</p>
                  <div style={{ display: "flex", gap: 16 }}>
                    <div style={{ flex: 1, textAlign: "center" }}>
                      {inspectionData.signatures.tenant ? (
                        <img src={inspectionData.signatures.tenant} alt="Tenant" style={{ width: "100%", height: 56, objectFit: "contain", borderRadius: 8, background: "#fafbfc", border: "1px solid #e2e8f0" }} />
                      ) : (
                        <div style={{ height: 56, borderRadius: 8, background: "#fafbfc", border: "1px dashed #d1d5db", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#94a3b8" }}>Not signed</div>
                      )}
                      <p style={{ margin: "6px 0 0", fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>Tenant</p>
                    </div>
                    <div style={{ flex: 1, textAlign: "center" }}>
                      {inspectionData.signatures.inspector ? (
                        <img src={inspectionData.signatures.inspector} alt="Inspector" style={{ width: "100%", height: 56, objectFit: "contain", borderRadius: 8, background: "#fafbfc", border: "1px solid #e2e8f0" }} />
                      ) : (
                        <div style={{ height: 56, borderRadius: 8, background: "#fafbfc", border: "1px dashed #d1d5db", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#94a3b8" }}>Not signed</div>
                      )}
                      <p style={{ margin: "6px 0 0", fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>Inspector</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div style={{ textAlign: "center", padding: "12px 0 4px" }}>
                  <p style={{ margin: 0, fontSize: 10, color: "#94a3b8" }}>Generated by <strong>InspectPro</strong> · {new Date().toLocaleString()}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 10, color: "#c4cad3" }}>ID: INS-{Date.now()}</p>
                </div>

                <button onClick={() => setShowReport(false)} style={{ ...btnSecondary, marginTop: 8 }}>Close Report</button>
              </div>
            </div>
          </div>
        );
      })()}
    </>);
  }

  return null;
}
