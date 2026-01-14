import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchCamperById, clearSelected } from "../features/campers/campersSlice";

const buildFeatures = (camper) => {
  if (!camper) return [];

  const chips = [];

  if (camper.transmission) chips.push(camper.transmission);
  if (camper.engine) chips.push(camper.engine);

  const boolMap = [
    ["AC", "AC"],
    ["kitchen", "Kitchen"],
    ["bathroom", "Bathroom"],
    ["TV", "TV"],
    ["radio", "Radio"],
    ["refrigerator", "Refrigerator"],
    ["microwave", "Microwave"],
    ["gas", "Gas"],
    ["water", "Water"],
  ];

  boolMap.forEach(([key, label]) => {
    if (camper[key]) chips.push(label);
  });

  return [...new Set(chips)];
};

const Stars = ({ value = 0 }) => {
  const full = Math.round(Number(value) || 0);
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ fontSize: 14 }}>
          {i < full ? "⭐" : "☆"}
        </span>
      ))}
    </span>
  );
};

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    style={{
      border: "none",
      background: "transparent",
      padding: "8px 0",
      fontWeight: 600,
      cursor: "pointer",
      borderBottom: active ? "3px solid #E44B48" : "3px solid transparent",
      color: active ? "#101828" : "#475467",
    }}
  >
    {children}
  </button>
);

export default function CamperDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selected, status } = useSelector((s) => s.campers);
  const [tab, setTab] = useState("features");

  useEffect(() => {
    dispatch(fetchCamperById(id));
    return () => dispatch(clearSelected());
  }, [dispatch, id]);

  const features = useMemo(() => buildFeatures(selected), [selected]);

  if (status === "loading" || !selected) {
    return <p style={{ padding: 24 }}>Loading...</p>;
  }

  return (
    <div
      style={{
        padding: 24,
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: 32,
        alignItems: "flex-start",
      }}
    >
      {/* SOL */}
      <div>
        <h1 style={{ marginTop: 0, marginBottom: 6 }}>{selected.name}</h1>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 10,
          }}
        >
          {/* rating alanı yoksa 0 gösterir */}
          <Stars value={selected.rating} />
          <span style={{ color: "#475467", fontSize: 14 }}>
            {selected.reviews?.length || 0} Reviews
          </span>
          <span style={{ color: "#475467", fontSize: 14 }}>
            • {selected.location || "—"}
          </span>
        </div>

        <p style={{ marginTop: 0, fontSize: 20, fontWeight: 700 }}>
          €{Number(selected.price).toFixed(2)}
        </p>

        {/* Gallery */}
        <div
          style={{
            display: "flex",
            gap: 10,
            margin: "16px 0 20px",
            flexWrap: "wrap",
          }}
        >
          {(selected.gallery || []).map((g, i) => {
            const src =
              typeof g === "string"
                ? g
                : g?.original || g?.url || g?.thumb || g?.preview || "";

            return (
              <img
                key={i}
                src={src}
                alt={selected.name}
                width={180}
                height={120}
                style={{
                  objectFit: "cover",
                  borderRadius: 8,
                  background: "#eee",
                }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            );
          })}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 24, marginBottom: 16 }}>
          <TabButton active={tab === "features"} onClick={() => setTab("features")}>
            Features
          </TabButton>
          <TabButton active={tab === "reviews"} onClick={() => setTab("reviews")}>
            Reviews
          </TabButton>
        </div>

        {/* Features */}
        {tab === "features" && (
          <div>
            <h3>Features</h3>

            {features.length === 0 ? (
              <p>Bu araca ait özellik bulunamadı.</p>
            ) : (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {features.map((f) => (
                  <span
                    key={f}
                    style={{
                      padding: "6px 10px",
                      background: "#f2f2f2",
                      borderRadius: 20,
                    }}
                  >
                    {f}
                  </span>
                ))}
              </div>
            )}

            {/* Vehicle details */}
            <div
              style={{
                marginTop: 20,
                background: "white",
                borderRadius: 12,
                padding: 16,
                boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                maxWidth: 520,
              }}
            >
              <h4 style={{ marginTop: 0 }}>Vehicle details</h4>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  rowGap: 10,
                }}
              >
                <div style={{ color: "#475467" }}>Form</div>
                <div>{selected.form || "—"}</div>

                <div style={{ color: "#475467" }}>Length</div>
                <div>{selected.length || "—"}</div>

                <div style={{ color: "#475467" }}>Width</div>
                <div>{selected.width || "—"}</div>

                <div style={{ color: "#475467" }}>Height</div>
                <div>{selected.height || "—"}</div>

                <div style={{ color: "#475467" }}>Tank</div>
                <div>{selected.tank || "—"}</div>

                <div style={{ color: "#475467" }}>Consumption</div>
                <div>{selected.consumption || "—"}</div>
              </div>
            </div>
          </div>
        )}

        {/* Reviews */}
        {tab === "reviews" && (
          <div>
            <h3>Reviews</h3>

            {(selected.reviews || []).length === 0 ? (
              <p>Henüz yorum yok.</p>
            ) : (
              selected.reviews.map((r, i) => (
                <div
                  key={i}
                  style={{
                    background: "white",
                    borderRadius: 12,
                    padding: 14,
                    marginBottom: 12,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                    maxWidth: 700,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        background: "#F2F4F7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                      }}
                    >
                      {(r.name || "?")[0]?.toUpperCase()}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <strong>{r.name}</strong>
                      <Stars value={r.rating} />
                    </div>
                  </div>

                  <p style={{ marginBottom: 0, marginTop: 10 }}>{r.comment}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* SAĞ (Form) */}
      <div
        style={{
          background: "white",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          position: "sticky",
          top: 20,
        }}
      >
        <h3 style={{ marginTop: 0 }}>Book your campervan now</h3>

        <input
          placeholder="Name"
          style={{ width: "100%", marginBottom: 10, padding: 10 }}
        />
        <input
          placeholder="Email"
          style={{ width: "100%", marginBottom: 10, padding: 10 }}
        />
        <input
          type="date"
          style={{ width: "100%", marginBottom: 10, padding: 10 }}
        />
        <textarea
          placeholder="Comment"
          rows={4}
          style={{ width: "100%", marginBottom: 12, padding: 10 }}
        />

        <button
          style={{
            width: "100%",
            padding: 10,
            cursor: "pointer",
            background: "#E44B48",
            color: "white",
            border: "none",
            borderRadius: 999,
            fontWeight: 600,
          }}
          onClick={(e) => {
            e.preventDefault();
            toast.success("Booking request sent!");
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
