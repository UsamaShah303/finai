import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function Field({ id, label, type = "text", placeholder, value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 14 }}>
      <label
        htmlFor={id}
        style={{
          display: "block",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.02em",
          marginBottom: 6,
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
          borderRadius: 10,
          padding: "11px 14px",
          fontSize: 13.5,
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

function ProgressBar({ pct }) {
  return (
    <div style={{ height: 3, background: "#dcfce7", borderRadius: 2, marginBottom: 28, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#4ade80,#16a34a)", borderRadius: 2, transition: "width .5s cubic-bezier(.4,0,.2,1)" }} />
    </div>
  );
}

function StepPill({ step }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 20, padding: "4px 12px", marginBottom: 14 }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a" }} />
      <span style={{ fontSize: 10.5, fontWeight: 600, color: "#166534" }}>{step}</span>
    </div>
  );
}

function CTAButton({ onClick, disabled, children, style = {} }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        padding: 13,
        background: disabled ? "rgba(22,163,74,.45)" : "linear-gradient(135deg,#16a34a,#15803d)",
        border: "none",
        borderRadius: 10,
        color: "#fff",
        fontSize: 14,
        fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "inherit",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        boxShadow: disabled ? "none" : "0 4px 14px rgba(22,163,74,.3)",
        transition: "all .25s",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function OutlineButton({ onClick, children }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseOver={() => setHov(true)}
      onMouseOut={() => setHov(false)}
      style={{
        width: "100%",
        padding: 13,
        background: hov ? "#f0fdf4" : "#fff",
        border: `1.5px solid ${hov ? "#86efac" : "#bbf7d0"}`,
        borderRadius: 10,
        color: "#166534",
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "inherit",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        transition: "all .2s",
        marginTop: 10,
      }}
    >
      {children}
    </button>
  );
}

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ─────────────────────────────────────────────
// Left panel side-bar
// ─────────────────────────────────────────────

const STEPS_META = ["Account setup", "Risk profile", "Set first goal", "Fund & invest"];

function LeftPanel({ currentStep }) {
  return (
    <div style={{
      flex: "0 0 42%",
      background: "linear-gradient(155deg,#052e16 0%,#14532d 50%,#166534 100%)",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      gap: 28,
      padding: "32px 32px",
    }}>
      {[
        { w: 350, h: 350, c: "rgba(255,255,255,.06)", t: -80, l: -60 },
        { w: 220, h: 220, c: "rgba(134,239,172,.12)", b: 10, r: -50 },
      ].map((o, i) => (
        <div key={i} style={{ position: "absolute", borderRadius: "50%", filter: "blur(70px)", width: o.w, height: o.h, background: o.c, top: o.t, left: o.l, bottom: o.b, right: o.r, pointerEvents: "none" }} />
      ))}
      <div style={{ position: "absolute", inset: 0, opacity: 0.05, backgroundImage: "linear-gradient(rgba(255,255,255,.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.8) 1px,transparent 1px)", backgroundSize: "36px 36px", pointerEvents: "none" }} />

      {/* Top: logo + hero */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 28 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.22)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="22 7 13.5 15.5 8.5 10.5 1 17" />
              <polyline points="17 7 22 7 22 12" />
            </svg>
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#fff", letterSpacing: "-0.3px" }}>Wealth OS</span>
        </div>

        <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.5)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
          Join 2.4M+ investors
        </div>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 42, fontWeight: 700, color: "#fff", lineHeight: 1.1, letterSpacing: "-1.5px", margin: "0 0 14px" }}>
          Start building<br />
          <em style={{ color: "#bbf7d0", fontStyle: "italic" }}>real wealth.</em>
        </h1>
        <p style={{ fontSize: 14.5, color: "rgba(255,255,255,.5)", lineHeight: 1.75, margin: 0 }}>
          Takes 2 minutes. No credit card required.<br />Your first PKR 1,000 investment is on us.
        </p>
      </div>

      {/* Stats row */}
      <div style={{ position: "relative", zIndex: 2, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {[
          { value: "PKR 50B+", label: "Assets managed" },
          { value: "4.9 ★",    label: "App Store rating" },
          { value: "SECP",     label: "Licensed & regulated" },
        ].map((s, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#bbf7d0", marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.45)", lineHeight: 1.3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Vertical step timeline */}
      <div style={{ position: "relative", zIndex: 2, flex: 1 }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: "rgba(255,255,255,.6)", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 14 }}>
          Your setup
        </div>
        <div style={{ background: "rgba(0,0,0,.25)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 16, padding: "18px 16px", backdropFilter: "blur(8px)" }}>
          <div style={{ position: "relative", paddingLeft: 14 }}>
            {/* Vertical track */}
            <div style={{ position: "absolute", left: 13, top: 14, bottom: 14, width: 1, background: "rgba(255,255,255,.2)" }} />
            {STEPS_META.map((label, i) => {
              const done = i < currentStep - 1;
              const active = i === currentStep - 1;
              return (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: i < STEPS_META.length - 1 ? 20 : 0, position: "relative" }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                    background: done ? "#16a34a" : active ? "#4ade80" : "rgba(255,255,255,.15)",
                    border: done || active ? "none" : "1px solid rgba(255,255,255,.35)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700,
                    color: done || active ? "#fff" : "rgba(255,255,255,.7)",
                    transition: "all .3s", zIndex: 1,
                    boxShadow: active ? "0 0 0 4px rgba(74,222,128,.2)" : "none",
                  }}>
                    {done ? <CheckIcon /> : i + 1}
                  </div>
                  <div style={{ paddingTop: 4 }}>
                    <div style={{ fontSize: 14, fontWeight: active ? 700 : 500, color: active ? "#fff" : done ? "rgba(255,255,255,.8)" : "rgba(255,255,255,.55)", transition: "all .3s" }}>
                      {label}
                    </div>
                    {active && (
                      <div style={{ fontSize: 11.5, color: "rgba(255,255,255,.55)", marginTop: 2 }}>
                        {["Fill in your details", "Choose your strategy", "Pick a goal to work toward", "Add funds to get started"][i]}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Social proof */}
      <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ display: "flex" }}>
          {[.22, .16, .1].map((o, i) => (
            <div key={i} style={{ width: 24, height: 24, borderRadius: "50%", background: `rgba(255,255,255,${o})`, border: `2px solid rgba(255,255,255,${o + .12})`, marginLeft: i ? -6 : 0 }} />
          ))}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Free account. Always.</div>
          <div style={{ fontSize: 11.5, color: "rgba(255,255,255,.4)" }}>Upgrade anytime for premium tools</div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Step 1 — Account Setup
// ─────────────────────────────────────────────

const STRENGTH_CONFIG = [
  { label: "Enter a password", width: "0%",    color: "#16a34a" },
  { label: "Needs improvement", width: "33%",  color: "#f59e0b" },
  { label: "Almost there",      width: "66%",  color: "#facc15" },
  { label: "Strong password",   width: "100%", color: "#16a34a" },
];

function Step1({ onNext, formData, setFormData }) {
  const r1 = formData.password.length >= 8;
  const r2 = /[A-Z]/.test(formData.password);
  const r3 = /[0-9!@#$%^&*]/.test(formData.password);
  const score = [r1, r2, r3].filter(Boolean).length;
  const cfg = STRENGTH_CONFIG[score];
  const valid = formData.first && formData.last && formData.email.includes("@") && r1;

  const Req = ({ met, label }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: met ? "#16a34a" : "#9ca3af", marginBottom: 7, transition: "color .2s" }}>
      <div style={{ width: 16, height: 16, borderRadius: "50%", background: met ? "#16a34a" : "transparent", border: `1.5px solid ${met ? "#16a34a" : "#bbf7d0"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .2s" }}>
        {met && <CheckIcon />}
      </div>
      {label}
    </div>
  );

  const SocialBtn = ({ icon, label }) => {
    const [hov, setHov] = useState(false);
    return (
      <button onMouseOver={() => setHov(true)} onMouseOut={() => setHov(false)} style={{ flex: 1, padding: "10px", background: hov ? "#f0fdf4" : "#fff", border: `1.5px solid ${hov ? "#86efac" : "#d1fae5"}`, borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, color: "#166534", fontSize: 12.5, fontWeight: 600, fontFamily: "inherit", transition: "all .2s" }}>
        {icon}
        {label}
      </button>
    );
  };

  return (
    <div>
      <ProgressBar pct={25} />
      <StepPill step="Step 1 of 4 — Account setup" />
      <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700, color: "#14532d", margin: "0 0 4px", letterSpacing: "-1px" }}>Create your account</h2>
      <p style={{ fontSize: 12.5, color: "#9ca3af", margin: "0 0 22px" }}>Join free. No credit card needed.</p>

      <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
        <SocialBtn label="Google" icon={
          <svg width="15" height="15" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        }/>
        <SocialBtn label="Facebook" icon={
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        }/>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 1, background: "#dcfce7" }} />
        <span style={{ fontSize: 11, color: "#9ca3af", whiteSpace: "nowrap" }}>or with email</span>
        <div style={{ flex: 1, height: 1, background: "#dcfce7" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field id="fname" label="First name" placeholder="Ali"  value={formData.first} onChange={e => setFormData(d => ({ ...d, first: e.target.value }))} />
        <Field id="lname" label="Last name"  placeholder="Khan" value={formData.last}  onChange={e => setFormData(d => ({ ...d, last: e.target.value }))}  />
      </div>

      <Field id="email" label="Email address" type="email"    placeholder="ali@example.com"   value={formData.email}    onChange={e => setFormData(d => ({ ...d, email: e.target.value }))} />
      <Field id="pass"  label="Password"      type="password" placeholder="Min. 8 characters" value={formData.password} onChange={e => setFormData(d => ({ ...d, password: e.target.value }))} />

      <div style={{ height: 4, background: "#dcfce7", borderRadius: 2, marginTop: -8, marginBottom: 6, overflow: "hidden" }}>
        <div style={{ height: "100%", width: cfg.width, background: cfg.color, borderRadius: 2, transition: "width .4s, background .4s" }} />
      </div>
      <div style={{ fontSize: 10.5, color: "#9ca3af", marginBottom: 14 }}>{cfg.label}</div>

      <div style={{ marginBottom: 18 }}>
        <Req met={r1} label="At least 8 characters" />
        <Req met={r2} label="One uppercase letter" />
        <Req met={r3} label="One number or symbol" />
      </div>

      <CTAButton onClick={onNext} disabled={!valid}>
        Continue <Arrow />
      </CTAButton>

      <div style={{ textAlign: "center", marginTop: 16 }}>
        <span style={{ fontSize: 12.5, color: "#9ca3af" }}>Already have an account? </span>
        <Link to="/login" style={{ fontSize: 12.5, color: "#16a34a", textDecoration: "none", fontWeight: 700 }}>Sign in</Link>
      </div>

      <p style={{ textAlign: "center", fontSize: 10.5, color: "#d1d5db", marginTop: 20, lineHeight: 1.6 }}>
        By continuing you agree to our Terms of Service<br />and Privacy Policy.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// Step 2 — Risk Profile
// ─────────────────────────────────────────────

const RISK_OPTIONS = [
  { val: "conservative", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, title: "Conservative", desc: "Low risk, stable returns. Mostly bonds & fixed income." },
  { val: "balanced",     icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"><polyline points="22 7 13.5 15.5 8.5 10.5 1 17"/><polyline points="17 7 22 7 22 12"/></svg>, title: "Balanced", desc: "Mix of equities and bonds. Best risk-adjusted returns.", recommended: true },
  { val: "aggressive",   icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>, title: "Aggressive", desc: "High risk, high reward. Heavy equity exposure." },
];

function Step2({ onNext, onBack }) {
  const [selected, setSelected] = useState("balanced");
  return (
    <div>
      <ProgressBar pct={50} />
      <StepPill step="Step 2 of 4 — Risk profile" />
      <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700, color: "#14532d", margin: "0 0 4px", letterSpacing: "-1px" }}>Your risk appetite</h2>
      <p style={{ fontSize: 12.5, color: "#9ca3af", margin: "0 0 22px" }}>This helps us build your ideal portfolio.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
        {RISK_OPTIONS.map(opt => (
          <div
            key={opt.val}
            onClick={() => setSelected(opt.val)}
            style={{
              border: `1.5px solid ${selected === opt.val ? "#16a34a" : "#d1fae5"}`,
              borderRadius: 12, padding: "14px 16px", cursor: "pointer",
              background: selected === opt.val ? "#f0fdf4" : "#fff",
              display: "flex", alignItems: "flex-start", gap: 12, transition: "all .2s",
            }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 9, background: selected === opt.val ? "#dcfce7" : "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {opt.icon}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#14532d", display: "flex", alignItems: "center", gap: 6 }}>
                {opt.title}
                {opt.recommended && (
                  <span style={{ fontSize: 10, background: "#dcfce7", color: "#16a34a", padding: "2px 8px", borderRadius: 10, fontWeight: 700 }}>
                    Recommended
                  </span>
                )}
              </div>
              <div style={{ fontSize: 11.5, color: selected === opt.val ? "#6b7280" : "#9ca3af", marginTop: 2 }}>{opt.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <CTAButton onClick={onNext}>Continue <Arrow /></CTAButton>
      <OutlineButton onClick={onBack}>Back</OutlineButton>
    </div>
  );
}

// ─────────────────────────────────────────────
// Step 3 — First Goal
// ─────────────────────────────────────────────

const GOALS = [
  { emoji: "🏠", label: "Dream home" },
  { emoji: "🌿", label: "Hajj / Umrah" },
  { emoji: "🎓", label: "Education" },
  { emoji: "🌅", label: "Retirement" },
  { emoji: "🚗", label: "New car" },
  { emoji: "✨", label: "Build wealth" },
];

function Step3({ onNext, onBack }) {
  const [selected, setSelected] = useState(null);
  return (
    <div>
      <ProgressBar pct={75} />
      <StepPill step="Step 3 of 4 — First goal" />
      <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700, color: "#14532d", margin: "0 0 4px", letterSpacing: "-1px" }}>What's your #1 goal?</h2>
      <p style={{ fontSize: 12.5, color: "#9ca3af", margin: "0 0 22px" }}>We'll build your portfolio around it.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 }}>
        {GOALS.map(g => (
          <div
            key={g.label}
            onClick={() => setSelected(g.label)}
            style={{
              border: `1.5px solid ${selected === g.label ? "#16a34a" : "#d1fae5"}`,
              borderRadius: 12, padding: 14, cursor: "pointer",
              background: selected === g.label ? "#f0fdf4" : "#fff",
              textAlign: "center", transition: "all .2s",
            }}
          >
            <div style={{ fontSize: 22, marginBottom: 6 }}>{g.emoji}</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#14532d" }}>{g.label}</div>
          </div>
        ))}
      </div>

      <CTAButton onClick={onNext} disabled={!selected}>Continue <Arrow /></CTAButton>
      <OutlineButton onClick={onBack}>Back</OutlineButton>
    </div>
  );
}

// ─────────────────────────────────────────────
// Step 4 — Success
// ─────────────────────────────────────────────

function Step4({ onDashboard }) {
  const items = [
    "AI portfolio generated in seconds",
    "Fund with as little as PKR 500",
    "Track goals from your dashboard",
  ];
  return (
    <div style={{ textAlign: "center" }}>
      <ProgressBar pct={100} />
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#4ade80,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700, color: "#14532d", margin: "0 0 8px", letterSpacing: "-1px" }}>You're all set!</h2>
      <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 28px", lineHeight: 1.7 }}>
        Your account is ready. Your personalised<br />portfolio is being built by our AI right now.
      </p>

      <div style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 14, padding: 18, marginBottom: 24, textAlign: "left" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#166534", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 12 }}>What's next</div>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < items.length - 1 ? 10 : 0 }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <CheckIcon />
            </div>
            <span style={{ fontSize: 12.5, color: "#14532d", fontWeight: 500 }}>{item}</span>
          </div>
        ))}
      </div>

      <CTAButton onClick={onDashboard}>
        Go to dashboard <Arrow />
      </CTAButton>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Export
// ─────────────────────────────────────────────

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ first: "", last: "", email: "", password: "" });
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;1,400&family=DM+Sans:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const next = () => {
    if (step === 1) {
      register(`${formData.first} ${formData.last}`, formData.email, formData.password);
    }
    setStep(s => Math.min(s + 1, 4));
  };
  const back = () => setStep(s => Math.max(s - 1, 1));

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .step-enter { animation: fadeUp .35s ease both; }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
        <LeftPanel currentStep={step} />

        <div style={{ flex: 1, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: "36px 48px", overflowY: "auto" }}>
          <div style={{ width: "100%", maxWidth: 420 }} className="step-enter" key={step}>
            {step === 1 && <Step1 onNext={next} formData={formData} setFormData={setFormData} />}
            {step === 2 && <Step2 onNext={next} onBack={back} />}
            {step === 3 && <Step3 onNext={next} onBack={back} />}
            {step === 4 && <Step4 onDashboard={() => navigate("/dashboard")} />}
          </div>
        </div>
      </div>
    </>
  );
}
