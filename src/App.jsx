import { useState, useMemo } from "react";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTH_IMAGES = {
  0: "https://images.unsplash.com/photo-1517299321609-52687d1bc55a?w=800&q=80", // Jan - snowy mountain
  1: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80", // Feb - mountains
  2: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=800&q=80", // Mar - spring bloom
  3: "https://plus.unsplash.com/premium_photo-1661878589476-bcad7fe1b8c5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YXByaWx8ZW58MHx8MHx8fDA%3D", // Apr - flowers
  4: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&q=80", // May - forest
  5: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", // Jun - beach
  6: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80", // Jul - mountains
  7: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80", // Aug - lake
  8: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80", // Sep - autumn
  9: "https://media.istockphoto.com/id/1262572653/photo/flying-autumn-leaves.webp?a=1&b=1&s=612x612&w=0&k=20&c=tsuHRDqhgZZnAX9y3CikD7XKQ1BmWcFmQhHt9TRvnPw=", // Oct - river
  10: "https://images.unsplash.com/photo-1477322524744-0eece9e79640?w=800&q=80", // Nov - fog
  11: "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=800&q=80", // Dec - snow
};

const MONTH_PALETTES = {
  0: { accent: "#2563EB", light: "#DBEAFE", text: "#1E40AF" },
  1: { accent: "#7C3AED", light: "#EDE9FE", text: "#5B21B6" },
  2: { accent: "#059669", light: "#D1FAE5", text: "#047857" },
  3: { accent: "#DB2777", light: "#FCE7F3", text: "#9D174D" },
  4: { accent: "#16A34A", light: "#DCFCE7", text: "#15803D" },
  5: { accent: "#0891B2", light: "#CFFAFE", text: "#0E7490" },
  6: { accent: "#EA580C", light: "#FED7AA", text: "#C2410C" },
  7: { accent: "#0369A1", light: "#BAE6FD", text: "#0C4A6E" },
  8: { accent: "#B45309", light: "#FDE68A", text: "#92400E" },
  9: { accent: "#DC2626", light: "#FEE2E2", text: "#991B1B" },
  10: { accent: "#6B7280", light: "#F3F4F6", text: "#374151" },
  11: { accent: "#1D4ED8", light: "#DBEAFE", text: "#1E3A8A" },
};

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

function dateKey(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function isInRange(y, m, d, start, end) {
  if (!start || !end) return false;
  const k = dateKey(y, m, d);
  const [s, e] = start <= end ? [start, end] : [end, start];
  return k > s && k < e;
}

function SpiralBinding({ color = "#9ca3af" }) {
  const rings = Array.from({ length: 22 }, (_, i) => i);
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "14px",
      padding: "0 20px",
      height: "36px",
      background: "linear-gradient(180deg, #e5e7eb 0%, #d1d5db 100%)",
      borderBottom: "2px solid #9ca3af",
      position: "relative",
      zIndex: 10,
    }}>
      {rings.map((i) => (
        <div key={i} style={{
          width: "18px",
          height: "32px",
          borderRadius: "9px 9px 0 0",
          border: "2.5px solid #6b7280",
          borderBottom: "none",
          background: "linear-gradient(135deg, #d1d5db 0%, #9ca3af 50%, #6b7280 100%)",
          position: "relative",
          flexShrink: 0,
        }}>
          <div style={{
            position: "absolute",
            bottom: "-6px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "14px",
            height: "12px",
            borderRadius: "0 0 7px 7px",
            border: "2.5px solid #6b7280",
            borderTop: "none",
            background: "linear-gradient(135deg, #9ca3af, #6b7280)",
          }} />
        </div>
      ))}
    </div>
  );
}

export default function WallCalendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [notes, setNotes] = useState({});
  const [noteInput, setNoteInput] = useState("");
  const [imgLoaded, setImgLoaded] = useState(false);

  const palette = MONTH_PALETTES[month];
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const totalCells = Math.ceil((daysInMonth + firstDay) / 7) * 7;
  const cells = Array.from({ length: totalCells }, (_, i) => {
    const d = i - firstDay + 1;
    return d >= 1 && d <= daysInMonth ? d : null;
  });

  const noteKey = rangeStart
    ? rangeEnd
      ? `${rangeStart}__${rangeEnd <= rangeStart ? rangeStart : rangeEnd}`
      : rangeStart
    : null;

  const currentNote = noteKey ? notes[noteKey] || "" : "";

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
    setRangeStart(null); setRangeEnd(null); setImgLoaded(false);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
    setRangeStart(null); setRangeEnd(null); setImgLoaded(false);
  };

  const handleDayClick = (d) => {
    const k = dateKey(year, month, d);
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(k); setRangeEnd(null);
    } else {
      if (k === rangeStart) { setRangeStart(null); setRangeEnd(null); }
      else { setRangeEnd(k); }
    }
  };

  const isStart = (d) => dateKey(year, month, d) === rangeStart;
  const isEnd = (d) => dateKey(year, month, d) === rangeEnd;
  const isToday = (d) => {
    return d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const effectiveEnd = rangeEnd || hovered;
  const [s, e] = rangeStart && effectiveEnd
    ? (rangeStart <= effectiveEnd ? [rangeStart, effectiveEnd] : [effectiveEnd, rangeStart])
    : [null, null];

  const isBetween = (d) => {
    if (!s || !e) return false;
    const k = dateKey(year, month, d);
    return k > s && k < e;
  };

  const saveNote = () => {
    if (!noteKey) return;
    setNotes(n => ({ ...n, [noteKey]: noteInput }));
  };

  const rangeLabel = () => {
    if (!rangeStart) return "No date selected";
    const fmt = (k) => {
      const [y, m, d] = k.split("-");
      return `${MONTHS[parseInt(m) - 1].slice(0, 3)} ${parseInt(d)}, ${y}`;
    };
    if (!rangeEnd) return fmt(rangeStart);
    const [s2, e2] = rangeStart <= rangeEnd ? [rangeStart, rangeEnd] : [rangeEnd, rangeStart];
    return `${fmt(s2)} → ${fmt(e2)}`;
  };

  // Sync note input when selection changes
  useMemo(() => {
    setNoteInput(noteKey ? notes[noteKey] || "" : "");
  }, [noteKey, notes]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #1e3a5f 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 16px",
      fontFamily: "'Georgia', 'Times New Roman', serif",
    }}>
      {/* Wall shadow + pin */}
      <div style={{ position: "relative" }}>
        {/* Wall pin */}
        <div style={{
          position: "absolute",
          top: "-28px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
          <div style={{
            width: "20px", height: "20px", borderRadius: "50%",
            background: "radial-gradient(circle at 35% 35%, #ef4444, #991b1b)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
          }} />
          <div style={{
            width: "4px", height: "16px",
            background: "linear-gradient(180deg, #b91c1c, #7f1d1d)",
            borderRadius: "0 0 2px 2px",
          }} />
        </div>

        {/* Calendar book */}
        <div style={{
          width: "min(780px, 96vw)",
          borderRadius: "4px 4px 8px 8px",
          boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.1)",
          overflow: "hidden",
          background: "#fff",
          position: "relative",
        }}>

          {/* Spiral */}
          <SpiralBinding />

          {/* HERO IMAGE SECTION */}
          <div style={{ position: "relative", height: "260px", overflow: "hidden", background: "#1a1a2e" }}>
            <img
              src={MONTH_IMAGES[month]}
              alt={MONTHS[month]}
              onLoad={() => setImgLoaded(true)}
              style={{
                width: "100%", height: "100%", objectFit: "cover",
                transition: "opacity 0.5s ease",
                opacity: imgLoaded ? 1 : 0,
              }}
            />
            {/* Dark gradient overlay */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.7) 100%)",
            }} />

            {/* Month/Year badge */}
            <div style={{
              position: "absolute",
              bottom: "20px",
              right: "24px",
              textAlign: "right",
            }}>
              <div style={{
                fontSize: "15px",
                fontWeight: "400",
                color: "rgba(255,255,255,0.8)",
                letterSpacing: "3px",
                textTransform: "uppercase",
                fontFamily: "'Georgia', serif",
              }}>{year}</div>
              <div style={{
                fontSize: "36px",
                fontWeight: "700",
                color: "#fff",
                lineHeight: 1,
                letterSpacing: "2px",
                textTransform: "uppercase",
                fontFamily: "'Georgia', serif",
                textShadow: "0 2px 8px rgba(0,0,0,0.5)",
              }}>{MONTHS[month]}</div>
              {/* Accent bar */}
              <div style={{
                height: "4px",
                background: palette.accent,
                borderRadius: "2px",
                marginTop: "8px",
              }} />
            </div>

            {/* Nav arrows */}
            <button onClick={prevMonth} style={{
              position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "50%", width: "40px", height: "40px",
              color: "#fff", fontSize: "18px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(4px)",
              transition: "background 0.2s",
            }}>‹</button>
            <button onClick={nextMonth} style={{
              position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "50%", width: "40px", height: "40px",
              color: "#fff", fontSize: "18px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(4px)",
              transition: "background 0.2s",
            }}>›</button>
          </div>

          {/* CALENDAR + NOTES SECTION */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 220px",
            background: "#fafaf8",
          }}>

            {/* Calendar Grid */}
            <div style={{ padding: "20px 20px 24px 24px" }}>

              {/* Day headers */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                marginBottom: "6px",
                gap: "2px",
              }}>
                {DAYS.map((d, i) => (
                  <div key={d} style={{
                    textAlign: "center",
                    fontSize: "11px",
                    fontWeight: "600",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    padding: "4px 0",
                    color: i === 0 ? palette.accent : i === 6 ? "#e05c5c" : "#6b7280",
                    fontFamily: "sans-serif",
                  }}>{d}</div>
                ))}
              </div>

              {/* Date cells */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "2px",
              }}>
                {cells.map((d, i) => {
                  if (!d) return <div key={i} />;
                  const start = isStart(d);
                  const end = isEnd(d);
                  const between = isBetween(d);
                  const today_ = isToday(d);
                  const sun = i % 7 === 0;
                  const sat = i % 7 === 6;

                  const bg = start || end
                    ? palette.accent
                    : between
                      ? palette.light
                      : "transparent";

                  const textColor = start || end
                    ? "#fff"
                    : today_
                      ? palette.accent
                      : sun
                        ? palette.accent
                        : sat
                          ? "#e05c5c"
                          : "#374151";

                  return (
                    <div
                      key={i}
                      onClick={() => handleDayClick(d)}
                      onMouseEnter={() => rangeStart && !rangeEnd && setHovered(dateKey(year, month, d))}
                      onMouseLeave={() => setHovered(null)}
                      style={{
                        position: "relative",
                        textAlign: "center",
                        padding: "6px 2px",
                        cursor: "pointer",
                        borderRadius: "6px",
                        background: bg,
                        transition: "all 0.12s ease",
                        userSelect: "none",
                      }}
                    >
                      {today_ && !start && !end && (
                        <div style={{
                          position: "absolute",
                          inset: "2px",
                          borderRadius: "4px",
                          border: `2px solid ${palette.accent}`,
                          opacity: 0.5,
                        }} />
                      )}
                      <span style={{
                        fontSize: "13px",
                        fontWeight: start || end || today_ ? "700" : "400",
                        color: textColor,
                        fontFamily: "sans-serif",
                        lineHeight: 1,
                        display: "block",
                      }}>{d}</span>
                      {/* Dot if note exists */}
                      {Object.keys(notes).some(k => k.includes(dateKey(year, month, d))) && (
                        <div style={{
                          width: "4px", height: "4px", borderRadius: "50%",
                          background: start || end ? "#fff" : palette.accent,
                          margin: "2px auto 0",
                        }} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Selection label */}
              <div style={{
                marginTop: "14px",
                padding: "8px 12px",
                background: rangeStart ? palette.light : "#f3f4f6",
                borderRadius: "6px",
                fontSize: "12px",
                color: rangeStart ? palette.text : "#9ca3af",
                fontFamily: "sans-serif",
                letterSpacing: "0.3px",
                transition: "all 0.2s",
              }}>
                {rangeLabel()}
              </div>
            </div>

            {/* Notes Panel */}
            <div style={{
              borderLeft: "1px dashed #d1d5db",
              padding: "20px 16px",
              display: "flex",
              flexDirection: "column",
              background: "#fdfcf8",
            }}>
              <div style={{
                fontSize: "11px",
                fontWeight: "600",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#9ca3af",
                marginBottom: "12px",
                fontFamily: "sans-serif",
              }}>Notes</div>

              {/* Lined paper effect */}
              <div style={{
                flex: 1,
                position: "relative",
              }}>
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} style={{
                    position: "absolute",
                    left: 0, right: 0,
                    top: `${i * 28 + 24}px`,
                    height: "1px",
                    background: "#e5e7eb",
                  }} />
                ))}
                <textarea
                  value={noteInput}
                  onChange={e => setNoteInput(e.target.value)}
                  placeholder={rangeStart ? "Add a note…" : "Select a date first"}
                  disabled={!rangeStart}
                  style={{
                    width: "100%",
                    height: "220px",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    resize: "none",
                    fontSize: "13px",
                    lineHeight: "28px",
                    color: "#374151",
                    fontFamily: "sans-serif",
                    padding: "0",
                    cursor: rangeStart ? "text" : "default",
                    position: "relative",
                    zIndex: 1,
                  }}
                />
              </div>

              <button
                onClick={saveNote}
                disabled={!rangeStart}
                style={{
                  marginTop: "12px",
                  padding: "8px 0",
                  background: rangeStart ? palette.accent : "#e5e7eb",
                  color: rangeStart ? "#fff" : "#9ca3af",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "600",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  cursor: rangeStart ? "pointer" : "default",
                  fontFamily: "sans-serif",
                  transition: "all 0.2s",
                }}
              >
                Save Note
              </button>

              {/* Saved notes list */}
              {Object.keys(notes).length > 0 && (
                <div style={{ marginTop: "12px" }}>
                  <div style={{
                    fontSize: "10px",
                    fontWeight: "600",
                    color: "#9ca3af",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                    fontFamily: "sans-serif",
                  }}>Saved</div>
                  {Object.entries(notes).filter(([, v]) => v).slice(0, 3).map(([k, v]) => (
                    <div key={k} style={{
                      fontSize: "11px",
                      color: "#6b7280",
                      fontFamily: "sans-serif",
                      marginBottom: "4px",
                      padding: "4px 6px",
                      background: palette.light,
                      borderRadius: "4px",
                      borderLeft: `2px solid ${palette.accent}`,
                    }}>
                      <div style={{ color: palette.text, fontWeight: 600, fontSize: "10px" }}>
                        {k.replace("__", " → ").split("-").join("-")}
                      </div>
                      <div style={{ marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bottom edge */}
          <div style={{
            height: "8px",
            background: "linear-gradient(180deg, #e5e7eb 0%, #d1d5db 100%)",
          }} />
        </div>

        {/* Shadow on wall */}
        <div style={{
          position: "absolute",
          bottom: "-20px",
          left: "10%",
          right: "10%",
          height: "20px",
          background: "rgba(0,0,0,0.3)",
          borderRadius: "50%",
          filter: "blur(10px)",
          zIndex: -1,
        }} />
      </div>

      <style>{`
        @media (max-width: 600px) {
          .cal-grid { grid-template-columns: 1fr !important; }
          .notes-panel { border-left: none !important; border-top: 1px dashed #d1d5db; }
        }
      `}</style>
    </div>
  );
}
