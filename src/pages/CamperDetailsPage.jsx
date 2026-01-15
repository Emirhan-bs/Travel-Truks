import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  fetchCamperById,
  clearSelected,
} from "../features/campers/campersSlice";
import Icon from "@/components/Icon/Icon";

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

const iconMap = {
  automatic: { name: "diagram", variant: "fill" },
  hybrid: { name: "petrol", variant: "fill" },
  diesel: { name: "petrol", variant: "fill" },
  petrol: { name: "petrol", variant: "fill" },

  AC: { name: "wind", variant: "fill" },
  Kitchen: { name: "cup-hot", variant: "fill" },
  Bathroom: { name: "ph_shower", variant: "fill" },
  TV: { name: "tv", variant: "fill" },
  Radio: { name: "vector", variant: "fill" },

  Refrigerator: { name: "solar_fridge-outline", variant: "stroke" },
  Microwave: { name: "lucide_microwave", variant: "stroke" },
  Gas: { name: "gas-stove", variant: "stroke" },
  Water: { name: "water-outline", variant: "stroke" },
};

const Stars = ({ value = 0 }) => {
  const full = Math.round(Number(value) || 0);
  return (
    <span style={{ display: "inline-flex", gap: 2, alignItems: "center" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          style={{
            color: i < full ? "#FFC531" : "#F2F4F7",
            fontSize: 16,
            lineHeight: 1,
          }}
        >
          ★
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
      padding: "16px 0",
      fontWeight: 500,
      fontSize: 20,
      cursor: "pointer",
      color: active ? "#101828" : "#6C717B",
      borderBottom: active ? "4px solid #E44D47" : "4px solid transparent",
    }}
  >
    {children}
  </button>
);

const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
  <input
    type="text"
    value={value}
    onClick={onClick}
    readOnly
    placeholder="Booking date*"
    style={{
      width: "358px",
      marginBottom: 14,
      padding: "18px",
      borderRadius: 12,
      border: "1px solid #DADDE1",
      outline: "none",
      fontSize: 16,
      boxSizing: "border-box",
      background: "#F7F7F7",
      cursor: "pointer",
    }}
    ref={ref}
  />
));

export default function CamperDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selected, status } = useSelector((s) => s.campers);
  const [tab, setTab] = useState("features");
  const [isNarrow, setIsNarrow] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 1024 : false
  );
  const [selectedDate, setSelectedDate] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    dispatch(fetchCamperById(id));
    return () => dispatch(clearSelected());
  }, [dispatch, id]);

  useEffect(() => {
    const onResize = () => setIsNarrow(window.innerWidth < 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const features = useMemo(() => buildFeatures(selected), [selected]);

  if (status === "loading" || !selected) {
    return <p style={{ padding: 24 }}>Loading...</p>;
  }

  return (
    <div
      style={{
        width: "100%",
        background: "#F7F7F7",
        minHeight: "100vh",
        paddingBottom: 80,
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .react-datepicker__header {
            background: white !important;
          }
          .react-datepicker__day--selected {
            background: #344054 !important;
            color: white !important;
          }
        `,
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: 1440,
          margin: "0 auto",
          padding: "48px 64px 80px",
          boxSizing: "border-box",
        }}
      >
        {/* Title */}
        <div style={{ marginBottom: 28 }}>
          <h1
            style={{
              margin: "0 0 8px",
              fontSize: 32,
              fontWeight: 600,
              color: "#101828",
            }}
          >
            {selected.name}
          </h1>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Stars value={selected.rating} />
              <span
                style={{
                  fontSize: 16,
                  color: "#101828",
                  textDecoration: "underline",
                  marginLeft: 4,
                }}
              >
                {selected.reviews?.length || 0} Reviews
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "#101828",
                fontSize: 16,
              }}
            >
              <Icon name="Map" size={16} />
              <span>{selected.location || "—"}</span>
            </div>
          </div>

          <p
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 600,
              color: "#101828",
            }}
          >
            €{Number(selected.price).toFixed(2)}
          </p>
        </div>

        {/* Gallery */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isNarrow ? "1fr" : "repeat(3, 1fr)",
            gap: 16,
            marginBottom: 24,
          }}
        >
          {(selected.gallery || []).slice(0, 3).map((g, i) => {
            const src =
              typeof g === "string"
                ? g
                : g?.original || g?.url || g?.thumb || g?.preview || "";
            return (
              <img
                key={i}
                src={src}
                alt={selected.name}
                style={{
                  width: "100%",
                  height: 310,
                  objectFit: "cover",
                  borderRadius: 10,
                  background: "#F2F4F7",
                }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            );
          })}
        </div>

        {/* Description */}
        {selected.description && (
          <p
            style={{
              margin: "0 0 44px",
              color: "#475467",
              fontSize: 16,
              lineHeight: 1.5,
            }}
          >
            {selected.description}
          </p>
        )}

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 40,
            marginBottom: 24,
            borderBottom: "1px solid #DADDE1", 
          }}
        >
          <TabButton
            active={tab === "features"}
            onClick={() => setTab("features")}
          >
            Features
          </TabButton>
          <TabButton
            active={tab === "reviews"}
            onClick={() => setTab("reviews")}
          >
            Reviews
          </TabButton>
        </div>

        {/* Content grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isNarrow ? "1fr" : "1fr 448px",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* LEFT PANEL */}
          <div
            style={{
              background: "#FFF",
              borderRadius: 20,
              border: "1px solid #DADDE1",
              padding: 32,
            }}
          >
            {tab === "features" && (
              <div>
                {/* Feature Pills */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    marginBottom: 32,
                  }}
                >
                  {features.map((f) => {
                    const icon = iconMap[f];
                    return (
                      <div
                        key={f}
                        style={{
                          padding: "12px 18px",
                          background: "#F2F4F7",
                          borderRadius: 100,
                          fontSize: 16,
                          fontWeight: 500,
                          color: "#101828",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        {icon ? (
                          <Icon
                            name={icon.name}
                            variant={icon.variant}
                            size={18}
                          />
                        ) : null}
                        <span
                          style={{
                            textTransform:
                              f === "automatic" ? "lowercase" : "none",
                          }}
                        >
                          {f}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Vehicle Details */}
                <h3
                  style={{
                    margin: "0 0 24px",
                    fontSize: 20,
                    fontWeight: 600,
                    color: "#101828",
                    paddingBottom: 24,
                    borderBottom: "1px solid #DADDE1",
                  }}
                >
                  Vehicle details
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "14px 24px",
                    fontSize: 18,
                  }}
                >
                  <div style={{ color: "#101828" }}>Form</div>
                  <div
                    style={{ color: "#101828", textTransform: "capitalize" }}
                  >
                    {selected.form || "—"}
                  </div>

                  <div style={{ color: "#101828" }}>Length</div>
                  <div style={{ color: "#101828" }}>
                    {selected.length || "—"}
                  </div>

                  <div style={{ color: "#101828" }}>Width</div>
                  <div style={{ color: "#101828" }}>
                    {selected.width || "—"}
                  </div>

                  <div style={{ color: "#101828" }}>Height</div>
                  <div style={{ color: "#101828" }}>
                    {selected.height || "—"}
                  </div>

                  <div style={{ color: "#101828" }}>Tank</div>
                  <div style={{ color: "#101828" }}>{selected.tank || "—"}</div>

                  <div style={{ color: "#101828" }}>Consumption</div>
                  <div style={{ color: "#101828" }}>
                    {selected.consumption || "—"}
                  </div>
                </div>
              </div>
            )}

            {tab === "reviews" && (
              <div>
                {(selected.reviews || []).length === 0 ? (
                  <p>No reviews yet.</p>
                ) : (
                  (selected.reviews || []).map((r, i) => (
                    <div
                      key={i}
                      style={{
                        paddingBottom: 24,
                        marginBottom: 24,
                        borderBottom:
                          i < selected.reviews.length - 1
                            ? "1px solid #DADDE1"
                            : "none",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 16,
                          marginBottom: 16,
                        }}
                      >
                        <div
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: "50%",
                            background: "#F2F4F7",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 24,
                            fontWeight: 600,
                            color: "#E44D47",
                            flexShrink: 0,
                          }}
                        >
                          {(r.reviewer_name || "?")[0]?.toUpperCase()}
                        </div>

                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: 4,
                            }}
                          >
                            <span
                              style={{
                                fontWeight: 600,
                                fontSize: 18,
                                color: "#101828",
                              }}
                            >
                              {r.reviewer_name || "?"}
                            </span>
                            <Stars value={r.reviewer_rating || 0} />
                          </div>
                        </div>
                      </div>

                      <p
                        style={{
                          margin: 0,
                          color: "#475467",
                          fontSize: 16,
                          lineHeight: 1.5,
                        }}
                      >
                        {r.comment || "No comment"}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* RIGHT - Booking Form */}
          <aside
            style={{
              background: "#FFF",
              padding: 44,
              borderRadius: 20,
              border: "1px solid #DADDE1",
              position: isNarrow ? "static" : "sticky",
              top: 100,
              height: "fit-content",
            }}
          >
            <h3
              style={{
                margin: "0 0 8px",
                fontSize: 20,
                fontWeight: 600,
                color: "#101828",
              }}
            >
              Book your campervan now
            </h3>
            <p
              style={{
                margin: "0 0 24px",
                color: "#475467",
                fontSize: 16,
                lineHeight: 1.5,
              }}
            >
              Stay connected! We are always ready to help you.
            </p>

            <input
              placeholder="Name*"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                marginBottom: 14,
                padding: "18px",
                borderRadius: 12,
                border: "1px solid #DADDE1",
                outline: "none",
                fontSize: 16,
                boxSizing: "border-box",
                background: "#F7F7F7",
              }}
            />
            <input
              placeholder="Email*"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                marginBottom: 14,
                padding: "18px",
                borderRadius: 12,
                border: "1px solid #DADDE1",
                outline: "none",
                fontSize: 16,
                boxSizing: "border-box",
                background: "#F7F7F7",
              }}
            />
            <DatePicker
              selected={selectedDate}
              onChange={setSelectedDate}
              customInput={<CustomInput />}
              dateFormat="dd.MM.yyyy"
            />
            <textarea
              placeholder="Comment"
              rows={5}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{
                width: "100%",
                marginBottom: 24,
                padding: "18px",
                borderRadius: 12,
                border: "1px solid #DADDE1",
                outline: "none",
                resize: "vertical",
                fontSize: 16,
                boxSizing: "border-box",
                background: "#F7F7F7",
                fontFamily: "inherit",
              }}
            />

            <button
              style={{
                width: 180,
                height: 56,
                cursor: "pointer",
                background: "#E44D47",
                color: "white",
                border: "none",
                borderRadius: 200,
                fontWeight: 500,
                fontSize: 16,
                margin: "0 auto",
                display: "block",
              }}
              onClick={(e) => {
                e.preventDefault();
                toast.success("Booking request sent!");
                setName("");
                setEmail("");
                setSelectedDate(null);
                setComment("");
              }}
            >
              Send
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
