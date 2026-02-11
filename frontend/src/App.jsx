import { useState, useEffect } from "react";

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
`;
const injectFonts = () => {
  if (document.querySelector("#fraud-fonts")) return;
  const style = document.createElement("style");
  style.id = "fraud-fonts";
  style.textContent = FONTS;
  document.head.appendChild(style);
};

const themes = {
  light: {
    bg: "#F5F2EC", surface: "#FFFFFF", surfaceAlt: "#EDE9E0", border: "#D9D3C7",
    text: "#1A1714", textSub: "#6B6560", accent: "#D4500A", accentHover: "#B84208",
    success: "#1A6B3A", successBg: "#E8F5EE", danger: "#C0392B", dangerBg: "#FDECEA",
    tag: "#EDE9E0", tagText: "#4A453F", shadow: "rgba(26,23,20,0.08)", glow: "rgba(212,80,10,0.15)",
    selectBg: "#EDE9E0",
  },
  dark: {
    bg: "#0F0D0B", surface: "#1A1714", surfaceAlt: "#231F1B", border: "#2E2A25",
    text: "#F0EDE7", textSub: "#8C8480", accent: "#E8630F", accentHover: "#FF7A28",
    success: "#3DBA6E", successBg: "#0D2419", danger: "#E05D4D", dangerBg: "#2A0D0A",
    tag: "#2E2A25", tagText: "#B0A89E", shadow: "rgba(0,0,0,0.4)", glow: "rgba(232,99,15,0.2)",
    selectBg: "#231F1B",
  },
};

// ── Dropdown options ──────────────────────────────────────────────────────────
const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Temporary", "Internship", "Other"];
const EXPERIENCE_LEVELS = [
  "Not Applicable", "Internship", "Entry level", "Associate",
  "Mid-Senior level", "Director", "Executive",
];
const EDUCATION_LEVELS = [
  "Unspecified", "High School or equivalent", "Some College Coursework Completed",
  "Associate Degree", "Bachelor's Degree", "Master's Degree",
  "Doctorate", "Professional", "Certification", "Vocational",
];

// ── Icons ─────────────────────────────────────────────────────────────────────
const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
const ShieldIcon = ({ size = 24, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const AlertIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const BriefcaseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
    <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
  </svg>
);
const SpinnerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
      <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/>
    </path>
  </svg>
);

// ── Confidence Bar ────────────────────────────────────────────────────────────
const ConfidenceBar = ({ value, isFraud, t }) => {
  const color = isFraud ? t.danger : t.success;
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13, color: t.textSub }}>
        <span>Confidence</span>
        <span style={{ fontWeight: 600, color }}>{value}%</span>
      </div>
      <div style={{ height: 6, background: t.border, borderRadius: 99, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${value}%`, background: color,
          borderRadius: 99, transition: "width 1s cubic-bezier(.22,1,.36,1)"
        }} />
      </div>
    </div>
  );
};

// ── Toggle Switch ─────────────────────────────────────────────────────────────
const Toggle = ({ label, value, onChange, t }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
    background: t.surfaceAlt, borderRadius: 10, padding: "10px 14px",
    border: `1.5px solid ${t.border}`, cursor: "pointer" }}
    onClick={() => onChange(!value)}
  >
    <span style={{ fontSize: 14, color: t.text, userSelect: "none" }}>{label}</span>
    <div style={{
      width: 40, height: 22, borderRadius: 99,
      background: value ? t.accent : t.border,
      position: "relative", transition: "background 0.2s", flexShrink: 0,
    }}>
      <div style={{
        position: "absolute", top: 3, left: value ? 20 : 3,
        width: 16, height: 16, borderRadius: "50%", background: "#fff",
        transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }} />
    </div>
  </div>
);

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    telecommuting: false,
    has_company_logo: false,
    has_questions: false,
    employment_type: "Full-time",
    required_experience: "Not Applicable",
    required_education: "Unspecified",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({});
  const [history, setHistory] = useState([]);

  const t = themes[darkMode ? "dark" : "light"];
  useEffect(() => { injectFonts(); }, []);

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    setTouched({ title: true, description: true });
    if (!form.title || !form.description) {
      setError("Job Title and Description are required.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const API_URL = import.meta?.env?.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title:               form.title,
          description:         form.description,
          telecommuting:       form.telecommuting ? 1 : 0,
          has_company_logo:    form.has_company_logo ? 1 : 0,
          has_questions:       form.has_questions ? 1 : 0,
          employment_type:     form.employment_type,
          required_experience: form.required_experience,
          required_education:  form.required_education,
        }),
      });
      if (!res.ok) throw new Error("Server error. Please try again.");
      const data = await res.json();
      setResult(data);
      setHistory(prev => [{ ...form, ...data, id: Date.now() }, ...prev.slice(0, 4)]);
    } catch (err) {
      setError(err.message || "Network error. Is your backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      title: "", description: "",
      telecommuting: false, has_company_logo: false, has_questions: false,
      employment_type: "Full-time",
      required_experience: "Not Applicable",
      required_education: "Unspecified",
    });
    setResult(null); setError(""); setTouched({});
  };

  const isFraud = result?.prediction === 1;

  // ── Shared input styles ───────────────────────────────────────────────────
  const inputBase = {
    background: t.surfaceAlt, border: `1.5px solid ${t.border}`,
    borderRadius: 10, padding: "10px 14px", fontSize: 14.5, color: t.text,
    outline: "none", fontFamily: "'DM Sans', sans-serif",
    width: "100%", boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s",
  };
  const labelStyle = {
    fontSize: 12.5, fontWeight: 600, color: t.textSub,
    letterSpacing: "0.06em", textTransform: "uppercase",
  };

  return (
    <div style={{ minHeight: "100vh", background: t.bg, fontFamily: "'DM Sans', sans-serif", color: t.text, transition: "background 0.3s, color 0.3s" }}>
      <style>{`
        @keyframes popIn { from { opacity:0; transform:translateY(12px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        * { box-sizing:border-box; margin:0; padding:0; }
        input::placeholder, textarea::placeholder { color:${t.textSub}; opacity:0.6; }
        input:focus, textarea:focus, select:focus { border-color:${t.accent} !important; box-shadow:0 0 0 3px ${t.glow} !important; }
        button:active { transform:scale(0.97) !important; }
        select option { background:${t.surface}; color:${t.text}; }
      `}</style>

      {/* ── Header ── */}
      <header style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"20px 32px", borderBottom:`1px solid ${t.border}`,
        background: t.surface, position:"sticky", top:0, zIndex:100,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:20, color:t.accent }}>
          <ShieldIcon size={22} color={t.accent} />
          JobGuard
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:13, color:t.textSub, fontWeight:500 }}>Fraud Detection</span>
          <button
            style={{ display:"flex", alignItems:"center", justifyContent:"center", width:38, height:38, borderRadius:10, border:`1px solid ${t.border}`, background:t.surfaceAlt, color:t.text, cursor:"pointer", outline:"none" }}
            onClick={() => setDarkMode(d => !d)}
          >
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <main style={{ width:"100%", margin:0, padding:"40px 24px 80px", maxWidth:"none" }}>

        {/* Hero */}
        <div style={{ marginBottom:36 }}>
          <h1 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:"clamp(28px,5vw,42px)", letterSpacing:"-1.5px", lineHeight:1.1, marginBottom:12 }}>
            Is this job offer<br />
            <span style={{ color:t.accent }}>real or a scam?</span>
          </h1>
          <p style={{ fontSize:16, color:t.textSub, lineHeight:1.6, maxWidth:540, fontWeight:300 }}>
            Fill in the job listing details — our ML model analyzes every signal to detect fraudulent offers instantly.
          </p>
        </div>

        {/* Instructions */}
        <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:16, padding:"20px 24px", marginBottom:32 }}>
          <div style={{ fontSize:12, fontWeight:700, color:t.accent, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:12 }}>
            How to use
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))", gap:12 }}>
            {[
              "Enter the job title and full description.",
              "Fill in employment type, experience & education.",
              "Toggle the switches that apply to this listing.",
              "Click Analyze — red means fraud, green means valid.",
            ].map((text, i) => (
              <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                <div style={{ minWidth:24, height:24, borderRadius:"50%", background:t.accent, color:"#fff", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", marginTop:1 }}>
                  {i + 1}
                </div>
                <div style={{ fontSize:13.5, color:t.textSub, lineHeight:1.5 }}>{text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background:t.dangerBg, border:`1.5px solid ${t.danger}`, borderRadius:12, padding:"12px 16px", marginBottom:16, fontSize:13.5, color:t.danger }}>
            ⚠ {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div style={{
            background: isFraud ? t.dangerBg : t.successBg,
            border:`2px solid ${isFraud ? t.danger : t.success}`,
            borderRadius:20, padding:"24px 28px", marginBottom:24,
            animation:"popIn 0.4s cubic-bezier(.22,1,.36,1)",
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:8 }}>
              <div style={{ width:48, height:48, borderRadius:14, background:`${isFraud ? t.danger : t.success}22`, display:"flex", alignItems:"center", justifyContent:"center", color: isFraud ? t.danger : t.success }}>
                {isFraud ? <AlertIcon /> : <CheckIcon />}
              </div>
              <div>
                <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:22, letterSpacing:"-0.5px", color: isFraud ? t.danger : t.success }}>
                  {isFraud ? "Fraudulent Job Offer" : "Legitimate Job Offer"}
                </div>
                <div style={{ fontSize:14, color:t.textSub, lineHeight:1.6 }}>
                  {isFraud
                    ? "Our model flagged this listing as likely fraudulent. Proceed with extreme caution."
                    : "This listing appears to be a legitimate job offer based on our analysis."}
                </div>
              </div>
            </div>
            <ConfidenceBar value={result.confidence} isFraud={isFraud} t={t} />
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:16 }}>
              {form.title           && <span style={{ background:t.tag, color:t.tagText, borderRadius:8, padding:"4px 10px", fontSize:12.5, fontWeight:500 }}>📌 {form.title}</span>}
              {form.employment_type && <span style={{ background:t.tag, color:t.tagText, borderRadius:8, padding:"4px 10px", fontSize:12.5, fontWeight:500 }}>💼 {form.employment_type}</span>}
              {form.required_experience !== "Not Applicable" && <span style={{ background:t.tag, color:t.tagText, borderRadius:8, padding:"4px 10px", fontSize:12.5, fontWeight:500 }}>🎯 {form.required_experience}</span>}
              {form.telecommuting    && <span style={{ background:t.tag, color:t.tagText, borderRadius:8, padding:"4px 10px", fontSize:12.5, fontWeight:500 }}>🏠 Remote</span>}
            </div>
          </div>
        )}

        {/* ── Form Card ── */}
        <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:20, padding:28, boxShadow:`0 4px 24px ${t.shadow}`, marginBottom:24 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24 }}>
            <BriefcaseIcon />
            <span style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:16 }}>Job Offer Details</span>
          </div>

          {/* Section: Text inputs */}
          <div style={{ display:"grid", gap:16, marginBottom:20 }}>

            {/* Title */}
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <label style={labelStyle}>Job Title <span style={{ color:t.accent }}>*</span></label>
              <input
                style={{ ...inputBase, borderColor: touched.title && !form.title ? t.danger : t.border }}
                placeholder="e.g. Senior Software Engineer"
                value={form.title}
                onChange={e => setField("title", e.target.value)}
                onBlur={() => setTouched(p => ({ ...p, title: true }))}
              />
              {touched.title && !form.title && <span style={{ fontSize:12, color:t.danger }}>Required</span>}
            </div>

            {/* Description */}
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <label style={labelStyle}>Job Description <span style={{ color:t.accent }}>*</span></label>
              <textarea
                style={{ ...inputBase, resize:"vertical", minHeight:110, lineHeight:1.6,
                  borderColor: touched.description && !form.description ? t.danger : t.border }}
                placeholder="Paste the full job description here..."
                value={form.description}
                onChange={e => setField("description", e.target.value)}
                onBlur={() => setTouched(p => ({ ...p, description: true }))}
              />
              {touched.description && !form.description && <span style={{ fontSize:12, color:t.danger }}>Required</span>}
            </div>
          </div>

          {/* Section: Dropdowns */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:16, marginBottom:20 }}>

            {/* Employment Type */}
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <label style={labelStyle}>Employment Type</label>
              <select
                style={{ ...inputBase, appearance:"none", backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat:"no-repeat", backgroundPosition:"right 12px center", paddingRight:36, cursor:"pointer" }}
                value={form.employment_type}
                onChange={e => setField("employment_type", e.target.value)}
              >
                {EMPLOYMENT_TYPES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>

            {/* Required Experience */}
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <label style={labelStyle}>Required Experience</label>
              <select
                style={{ ...inputBase, appearance:"none", backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat:"no-repeat", backgroundPosition:"right 12px center", paddingRight:36, cursor:"pointer" }}
                value={form.required_experience}
                onChange={e => setField("required_experience", e.target.value)}
              >
                {EXPERIENCE_LEVELS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>

            {/* Required Education */}
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <label style={labelStyle}>Required Education</label>
              <select
                style={{ ...inputBase, appearance:"none", backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat:"no-repeat", backgroundPosition:"right 12px center", paddingRight:36, cursor:"pointer" }}
                value={form.required_education}
                onChange={e => setField("required_education", e.target.value)}
              >
                {EDUCATION_LEVELS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>

          {/* Section: Toggles */}
          <div style={{ marginBottom:24 }}>
            <div style={{ fontSize:12.5, fontWeight:600, color:t.textSub, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:10 }}>
              Listing Characteristics
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:10 }}>
              <Toggle label="🏠  Remote / Telecommuting"  value={form.telecommuting}    onChange={v => setField("telecommuting", v)}    t={t} />
              <Toggle label="🏢  Has Company Logo"        value={form.has_company_logo} onChange={v => setField("has_company_logo", v)} t={t} />
              <Toggle label="❓  Has Screening Questions" value={form.has_questions}    onChange={v => setField("has_questions", v)}    t={t} />
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display:"flex", gap:12 }}>
            <button
              style={{ flex:1, background:t.accent, color:"#fff", border:"none", borderRadius:12, padding:"13px 20px", fontSize:15, fontWeight:600, cursor: loading ? "not-allowed" : "pointer", fontFamily:"'Syne', sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:8, opacity: loading ? 0.8 : 1 }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <><SpinnerIcon /> Analyzing…</> : <><ShieldIcon size={17} color="#fff" /> Analyze Job Offer</>}
            </button>
            <button
              style={{ background:"transparent", color:t.textSub, border:`1.5px solid ${t.border}`, borderRadius:12, padding:"13px 20px", fontSize:14, fontWeight:500, cursor:"pointer", fontFamily:"'DM Sans', sans-serif" }}
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>

        {/* ── History ── */}
        {history.length > 0 && (
          <div style={{ marginTop:40 }}>
            <div style={{ fontSize:13, fontWeight:700, color:t.textSub, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:14 }}>
              Recent Analyses
            </div>
            {history.map(h => (
              <div key={h.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", borderRadius:12, border:`1px solid ${t.border}`, background:t.surface, marginBottom:8 }}>
                <div>
                  <div style={{ fontWeight:600, fontSize:14, marginBottom:2 }}>{h.title}</div>
                  <div style={{ fontSize:12.5, color:t.textSub }}>{h.employment_type} · {h.required_experience}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:12, color:t.textSub }}>{h.confidence}%</span>
                  <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20, background: h.prediction === 1 ? t.dangerBg : t.successBg, color: h.prediction === 1 ? t.danger : t.success, letterSpacing:"0.05em", textTransform:"uppercase" }}>
                    {h.prediction === 1 ? "Fraud" : "Valid"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}