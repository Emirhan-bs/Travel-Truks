import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCampers, resetCampers } from "../features/campers/campersSlice";
import { toggleFavorite } from "../features/favorites/favoritesSlice";
import Icon from "@/components/Icon/Icon";

const getCamperImage = (c) => {
  const g = c?.gallery?.[0];
  if (typeof g === "string") return g;
  if (g?.original) return g.original;
  if (g?.url) return g.url;
  if (g?.thumb) return g.thumb;
  if (g?.preview) return g.preview;
  if (typeof c?.img === "string") return c.img;
  if (typeof c?.image === "string") return c.image;
  return "";
};

const getReviewCount = (c) => c?.reviews?.length ?? c?.reviewsCount ?? 0;
const getRating = (c) => Number(c?.rating ?? c?.reviewsRating ?? 0);

const buildChips = (c) => {
  const chips = [];

  if (c?.transmission) {
    const t = String(c.transmission);
    chips.push({
      label: t[0]?.toUpperCase() + t.slice(1),
      icon: "diagram",
      variant: "fill",
    });
  }

  if (c?.engine) {
    chips.push({
      label: c.engine,
      icon: "petrol",
      variant: "fill",
    });
  }

  const map = [
    ["AC", "AC", "wind", "fill"],
    ["kitchen", "Kitchen", "cup-hot", "fill"],
    ["bathroom", "Bathroom", "ph_shower", "fill"],
    ["TV", "TV", "tv", "fill"],
    ["microwave", "Microwave", "lucide_microwave", "stroke"],
    ["refrigerator", "Refrigerator", "solar_fridge-outline", "fill"],
    ["gas", "Gas", "gas-stove", "stroke"],
    ["water", "Water", "water-outline", "stroke"],
  ];

  map.forEach(([key, label, icon, variant]) => {
    if (c[key]) chips.push({ label, icon, variant });
  });

  const uniq = [];
  const seen = new Set();
  for (const ch of chips) {
    const k = ch.label.toLowerCase();
    if (!seen.has(k)) {
      seen.add(k);
      uniq.push(ch);
    }
  }
  return uniq;
};

export default function FavoritesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, status } = useSelector((s) => s.campers);
  const favoriteIds = useSelector((s) => s.favorites.ids);

  useEffect(() => {
    if (items.length === 0) {
      dispatch(resetCampers());
      dispatch(fetchCampers({ page: 1, limit: 100 }));
    }
  }, [dispatch, items.length]);

  const favoriteItems = useMemo(
    () =>
      items.filter((c) => favoriteIds.includes(c.id)).map((c) => ({
        ...c,
        img: getCamperImage(c),
        rating: getRating(c),
        reviewsCount: getReviewCount(c),
        chips: buildChips(c),
        isFav: true,
      })),
    [items, favoriteIds]
  );

  return (
    <div
      style={{
        padding: 24,
        maxWidth: 1440,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <h1 style={{ marginTop: 0, marginBottom: 16 }}>Favorites</h1>

      {status === "loading" && items.length === 0 && (
        <div style={{ padding: 40, textAlign: "center", color: "#667085" }}>
          <p>Loading campers...</p>
        </div>
      )}

      {status === "failed" && (
        <div
          style={{
            padding: 20,
            background: "#FEE",
            border: "1px solid #E44848",
            borderRadius: 12,
            color: "#E44848",
          }}
        >
          An error occurred. Please try again.
        </div>
      )}

      {favoriteItems.length === 0 && status === "succeeded" && (
        <div style={{ padding: 40, textAlign: "center", color: "#667085" }}>
          <p>No favorite campers yet. Add some from the catalog!</p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {favoriteItems.map((c) => (
          <div
            key={c.id}
            style={{
              background: "#fff",
              border: "1px solid #EAECF0",
              borderRadius: 16,
              padding: 18,
              display: "grid",
              gridTemplateColumns: "290px 1fr",
              gap: 18,
              alignItems: "start",
            }}
          >
            <div
              style={{
                width: 290,
                height: 190,
                borderRadius: 14,
                overflow: "hidden",
                background: "#F2F4F7",
              }}
            >
              {c.img ? (
                <img
                  src={c.img}
                  alt={c.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              ) : null}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <h3 style={{ margin: 0, fontSize: 22 }}>{c.name}</h3>

                <button
                  onClick={() => dispatch(toggleFavorite(c.id))}
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    padding: 4,
                  }}
                  aria-label="Remove from favorites"
                >
                  <Icon
                    name="property-1"
                    width={26}
                    height={26}
                    fill="#E44848"
                    stroke="#E44848"
                    variant="stroke"
                  />
                </button>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
                  <span style={{ color: "#F79009", fontWeight: 800 }}>★</span>
                  <span style={{ fontWeight: 700 }}>
                    {c.rating ? c.rating.toFixed(1) : "0.0"}
                  </span>
                  <span style={{ color: "#667085" }}>({c.reviewsCount} Reviews)</span>
                </span>

                <span style={{ color: "#D0D5DD" }}>•</span>

                <span
                  style={{
                    display: "inline-flex",
                    gap: 6,
                    alignItems: "center",
                    color: "#667085",
                  }}
                >
                  <Icon name="Map" width={18} height={18} />
                  {c.location || "—"}
                </span>
              </div>

              <p style={{ margin: 0, color: "#475467", lineHeight: 1.4 }}>
                {c.description ? String(c.description).slice(0, 90) + "..." : "—"}
              </p>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {c.chips.slice(0, 10).map((ch) => (
                  <span
                    key={ch.label}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 14px",
                      background: "#F2F4F7",
                      borderRadius: 999,
                      fontWeight: 600,
                      color: "#101828",
                    }}
                  >
                    <Icon name={ch.icon} width={18} height={18} variant={ch.variant} />
                    {ch.label}
                  </span>
                ))}
              </div>

              <div>
                <button
                  onClick={() => navigate(`/catalog/${c.id}`)}
                  style={{
                    marginTop: 4,
                    padding: "12px 26px",
                    borderRadius: 999,
                    border: "none",
                    background: "#E44848",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: 800,
                  }}
                >
                  Show more
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
