import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// ── Reusable Input Field ──────────────────────────────────────────────────────
function Field({ id, label, type = "text", placeholder, value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      <label
        htmlFor={id}
        style={{
          display: "block",
          fontSize: 11.5,
          fontWeight: 600,
          letterSpacing: "0.03em",
          marginBottom: 7,
          color: focused ? "#16a34a" : "#166534",
          transition: "color .2s",
        }}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          background: focused ? "#fff" : "#f0fdf4",
          border: `1.5px solid ${focused ? "#16a34a" : "#bbf7d0"}`,
          borderRadius: 11,
          padding: "13px 15px",
          fontSize: 14,
          color: "#14532d",
          outline: "none",
          transition: "all .2s",
          fontFamily: "inherit",
          boxShadow: focused ? "0 0 0 3px rgba(22,163,74,.1)" : "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

// ── Floating Stat Card ────────────────────────────────────────────────────────
function StatCard({ label, value, delta, up, style }) {
  return (
    <div
      style={{
        position: "absolute",
        background: "rgba(255,255,255,.1)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,.18)",
        borderRadius: 14,
        padding: "12px 16px",
        minWidth: 148,
        ...style,
      }}
    >
      <div style={{ fontSize: 9, color: "rgba(255,255,255,.5)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 5 }}>
        {label}
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px" }}>
        {value}
      </div>
      <div style={{ fontSize: 10, fontWeight: 600, marginTop: 3, color: up ? "#bbf7d0" : "#fca5a5" }}>
        {up ? "▲" : "▼"} {delta}
      </div>
    </div>
  );
}

// ── Main Sign-In Page ─────────────────────────────────────────────────────────
export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [status, setStatus]     = useState("idle"); // idle | loading | success

  const { login } = useAuth();
  const navigate   = useNavigate();

  // Load Google Fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;1,400&family=DM+Sans:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const handleSubmit = () => {
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (status === "loading") return;
    setStatus("loading");
    setTimeout(() => {
      const userData = login(email, password);
      setStatus("success");
      setTimeout(() => {
        navigate(userData.role === "admin" ? "/admin" : "/dashboard");
      }, 600);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const STATS = [
    { label: "Portfolio Value", value: "PKR 4,82,500", delta: "+12.4%", up: true,  style: { top: 0,   left: 0,   animation: "float1 5s ease-in-out infinite"   } },
    { label: "Monthly Return",  value: "PKR 8,340",    delta: "+3.2%",  up: true,  style: { top: 18,  left: 188, animation: "float2 6s ease-in-out infinite"   } },
    { label: "Invested Total",  value: "PKR 3,20,000", delta: "-1.1%",  up: false, style: { top: 110, left: 24,  animation: "float3 7s ease-in-out infinite"   } },
    { label: "Goals On Track",  value: "4 / 5",        delta: "80%",    up: true,  style: { top: 116, left: 206, animation: "float4 5.5s ease-in-out infinite" } },
  ];

  return (
    <>
      <style>{`
        @keyframes float1 { 0%,100%{transform:translateY(0)}    50%{transform:translateY(-7px)} }
        @keyframes float2 { 0%,100%{transform:translateY(-4px)} 50%{transform:translateY(6px)}  }
        @keyframes float3 { 0%,100%{transform:translateY(3px)}  50%{transform:translateY(-5px)} }
        @keyframes float4 { 0%,100%{transform:translateY(-2px)} 50%{transform:translateY(7px)}  }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        .fi { animation: fadeUp .4s ease both; }
        .fi:nth-child(1){animation-delay:.04s} .fi:nth-child(2){animation-delay:.10s}
        .fi:nth-child(3){animation-delay:.16s} .fi:nth-child(4){animation-delay:.22s}
        .fi:nth-child(5){animation-delay:.28s} .fi:nth-child(6){animation-delay:.34s}
        .fi:nth-child(7){animation-delay:.40s} .fi:nth-child(8){animation-delay:.46s}
        .goog:hover { background:#f0fdf4 !important; border-color:#86efac !important; }
        .cta-btn:hover { filter:brightness(1.07); transform:translateY(-1px);
          box-shadow:0 6px 20px rgba(22,163,74,.45) !important; }
        .cta-btn:active { transform:scale(.98); }
        .txt-link:hover { text-decoration:underline; }
        * { box-sizing:border-box; }
      `}</style>
      
      <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
        {/* ══ LEFT PANEL ══════════════════════════════════════════════════════ */}
        <div style={{
          flex: "0 0 52%",
          background: "linear-gradient(150deg,#0d4a26 0%,#166534 45%,#15803d 100%)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "44px 24px",
        }}>
          {/* Ambient orbs */}
          {[
            { w:380, h:380, c:"rgba(255,255,255,.07)", t:"-100px", l:"-80px" },
            { w:260, h:260, c:"rgba(134,239,172,.15)", b:"20px",   r:"-60px" },
            { w:160, h:160, c:"rgba(255,255,255,.05)", t:"42%",    l:"55%"   },
          ].map((o, i) => (
            <div key={i} style={{
              position: "absolute", borderRadius: "50%", filter: "blur(72px)",
              width: o.w, height: o.h, background: o.c,
              top: o.t, left: o.l, bottom: o.b, right: o.r,
              pointerEvents: "none",
            }} />
          ))}

          {/* Grid texture */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.06, pointerEvents: "none",
            backgroundImage: "linear-gradient(rgba(255,255,255,.7) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.7) 1px,transparent 1px)",
            backgroundSize: "38px 38px",
          }} />

          {/* Logo — links back to landing */}
          <Link to="/" style={{ position: "absolute", top: 44, left: 52, textDecoration: "none", zIndex: 10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{
                width:36, height:36, borderRadius:9,
                background:"rgba(255,255,255,.15)", border:"1px solid rgba(255,255,255,.25)",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 1 17"/>
                  <polyline points="17 7 22 7 22 12"/>
                </svg>
              </div>
              <span style={{ fontSize:17, fontWeight:700, color:"#fff", letterSpacing:"-0.3px" }}>FinAI</span>
            </div>
          </Link>

          <div style={{ position:"relative", zIndex:2, width:"100%", maxWidth:380 }}>
            {/* Hero copy */}
            <div style={{ marginBottom:32 }}>
              <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,.6)", letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:14 }}>
                Pakistan's #1 Finance App
              </div>
              <h1 style={{
                fontFamily:"'Fraunces', serif",
                fontSize:46, fontWeight:700, lineHeight:1.08,
                color:"#fff", letterSpacing:"-2px", margin:"0 0 16px",
              }}>
                Grow smarter,<br />
                <em style={{ color:"#bbf7d0", fontStyle:"italic" }}>invest better.</em>
              </h1>
              <p style={{ fontSize:14, color:"rgba(255,255,255,.65)", lineHeight:1.75, margin:0 }}>
                AI-powered investing, savings, and retirement — built for every Pakistani.
              </p>
            </div>

            {/* Floating stat cards */}
            <div style={{ position:"relative", height:180 }}>
              {[
                { label: "Portfolio Value", value: "PKR 4,82,500", delta: "+12.4%", up: true,  style: { top: 0,   left: 0,   animation: "float1 5s ease-in-out infinite"   } },
                { label: "Monthly Return",  value: "PKR 8,340",    delta: "+3.2%",  up: true,  style: { top: 16,  left: 146, animation: "float2 6s ease-in-out infinite"   } },
                { label: "Invested Total",  value: "PKR 3,20,000", delta: "-1.1%",  up: false, style: { top: 90,  left: 18,  animation: "float3 7s ease-in-out infinite"   } },
                { label: "Goals On Track",  value: "4 / 5",        delta: "80%",    up: true,  style: { top: 106, left: 164, animation: "float4 5.5s ease-in-out infinite" } },
              ].map((s, i) => (
                <div key={i} style={{
                   position: "absolute",
                   background: "rgba(255,255,255,.08)",
                   backdropFilter: "blur(16px)",
                   border: "1px solid rgba(255,255,255,.15)",
                   borderRadius: 12,
                   padding: "10px 14px",
                   ...s.style,
                }}>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,.6)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px", marginBottom: 2 }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: s.up ? "#bbf7d0" : "#fca5a5", display:"flex", alignItems:"center", gap: 3 }}>
                    {s.up ? "▲" : "▼"} {s.delta}
                  </div>
                </div>
              ))}
            </div>

            {/* Social proof */}
            <div style={{ display:"flex", alignItems:"center", gap:16, marginTop:40 }}>
              <div style={{ display:"flex" }}>
                {[.25,.18,.12,.08].map((o, i) => (
                  <div key={i} style={{
                    width:26, height:26, borderRadius:"50%",
                    background:`rgba(255,255,255,${o})`,
                    border:`2px solid rgba(255,255,255,${o+.12})`,
                    marginLeft: i ? -7 : 0,
                  }} />
                ))}
              </div>
              <div>
                <div style={{ fontSize:12, fontWeight:600, color:"#fff", marginBottom:2 }}>2.4M+ Investors trust us</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,.6)" }}>★★★★★ 4.9 on App Store</div>
              </div>
            </div>
          </div>
        </div>

        {/* ══ RIGHT PANEL ═════════════════════════════════════════════════════ */}
        <div style={{
          flex: 1,
          background: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "44px 48px",
        }}>
          <div style={{ width:"100%", maxWidth:360 }}>

            {/* Secure badge */}
            <div className="fi" style={{
              display:"inline-flex", alignItems:"center", gap:6,
              background:"#f0fdf4", border:"1px solid #bbf7d0",
              borderRadius:20, padding:"4px 12px", marginBottom:14,
            }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:"#16a34a" }} />
              <span style={{ fontSize:11, fontWeight:600, color:"#166534" }}>Secure login</span>
            </div>

            {/* Heading */}
            <div className="fi" style={{ marginBottom:28 }}>
              <h2 style={{ fontFamily:"'Fraunces', serif", fontSize:32, fontWeight:700, color:"#14532d", margin:"0 0 8px", letterSpacing:"-1px" }}>
                Welcome back
              </h2>
              <p style={{ fontSize:13, color:"#9ca3af", margin:0 }}>Sign in to your account to continue</p>
            </div>

            {/* Error message */}
            {error && (
              <div className="fi" style={{
                marginBottom:16, padding:"10px 14px",
                background:"#fef2f2", border:"1px solid #fecaca",
                borderRadius:10, fontSize:13, color:"#dc2626",
                display:"flex", alignItems:"center", gap:8,
              }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background:"#dc2626", flexShrink:0, display:"inline-block" }} />
                {error}
              </div>
            )}

            {/* Google SSO */}
            <button className="fi goog" style={{
              width:"100%", padding:"12px 16px", marginBottom:24,
              background:"#fff", border:"1.5px solid #d1fae5", borderRadius:11,
              cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:9,
              color:"#166534", fontSize:13.5, fontWeight:600, fontFamily:"inherit",
              transition:"all .2s", boxShadow:"0 1px 4px rgba(22,163,74,.08)",
            }}>
              <svg width="17" height="17" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="fi" style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
              <div style={{ flex:1, height:1, background:"#dcfce7" }} />
              <span style={{ fontSize:11, color:"#9ca3af", whiteSpace:"nowrap" }}>or sign in with email</span>
              <div style={{ flex:1, height:1, background:"#dcfce7" }} />
            </div>

            {/* Input fields */}
            <div className="fi">
              <Field
                id="email"
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="fi" onKeyDown={handleKeyDown}>
              <Field
                id="password"
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Forgot password */}
            <div className="fi" style={{ textAlign:"right", marginTop:-4, marginBottom:22 }}>
              <span className="txt-link" style={{ fontSize:12, color:"#16a34a", cursor:"pointer", fontWeight:600 }}>
                Forgot password?
              </span>
            </div>

            {/* CTA */}
            <button
              className="fi cta-btn"
              onClick={handleSubmit}
              disabled={status === "loading"}
              style={{
                width:"100%", padding:"14px",
                background: status === "success" ? "#15803d"
                  : status === "loading" ? "rgba(22,163,74,.65)"
                  : "linear-gradient(135deg,#16a34a,#15803d)",
                border:"none", borderRadius:11,
                color:"#fff", fontSize:15, fontWeight:700,
                cursor: status === "loading" ? "not-allowed" : "pointer",
                fontFamily:"inherit", letterSpacing:"-0.2px",
                transition:"all .25s",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                boxShadow:"0 4px 14px rgba(22,163,74,.35)",
              }}
            >
              {status === "success" && (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Signed in!
                </>
              )}
              {status === "loading" && (
                <>
                  <div style={{ width:15, height:15, border:"2px solid rgba(255,255,255,.35)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin .7s linear infinite" }} />
                  Signing in…
                </>
              )}
              {status === "idle" && "Sign in →"}
            </button>

            {/* Sign up */}
            <div className="fi" style={{ textAlign:"center", marginTop:18 }}>
              <span style={{ fontSize:13, color:"#9ca3af" }}>Don't have an account? </span>
              <Link to="/register" className="txt-link" style={{ fontSize:13, color:"#16a34a", fontWeight:700, textDecoration:"none" }}>
                Create one free
              </Link>
            </div>

            {/* Fine print */}
            <p className="fi" style={{ textAlign:"center", fontSize:11, color:"#d1d5db", marginTop:26, lineHeight:1.6 }}>
              By signing in you agree to our Terms of Service<br />
              and Privacy Policy. Investments carry risk.
            </p>

            {/* Demo hint */}
            <p style={{ textAlign:"center", fontSize:11, color:"#d1d5db", marginTop:8 }}>
              Demo: any email & password · Admin: admin@finai.com
            </p>

          </div>
        </div>
      </div>
    </>
  );
}
