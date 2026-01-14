import Icon from "@/components/Icon/Icon";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCampers,
  nextPage,
  resetCampers,
} from "../features/campers/campersSlice";
import { toggleFavorite } from "../features/favorites/favoritesSlice";
import {
  setLocation,
  setVehicleType,
  toggleEquipment,
  resetFilters,
} from "../features/filters/filtersSlice";

const normalize = (v) =>
  String(v || "")
    .trim()
    .toLowerCase();

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

  if (c?.transmission)
    chips.push({ label: c.transmission, icon: "diagram", variant: "fill" });
  if (c?.engine) chips.push({ label: c.engine, icon: "wind", variant: "fill" });

  const map = [
    ["AC", "AC", "ph_shower", "fill"],
    ["kitchen", "Kitchen", "cup-hot", "stroke"],
    ["bathroom", "Bathroom", "ph_shower", "fill"],
    ["TV", "TV", "grid-1", "fill"],
    ["radio", "Radio", "wind", "fill"],
    ["microwave", "Microwave", "lucide_microwave", "stroke"],
    ["refrigerator", "Refrigerator", "solar_fridge-outline", "fill"],
    ["gas", "Gas", "gas-stove", "stroke"],
    ["water", "Water", "water-outline", "stroke"],
  ];

  map.forEach(([key, label, icon, variant]) => {
    const val = c?.[key];
    const ok = val === true || val === "true" || val === 1 || val === "1";
    if (ok) chips.push({ label, icon, variant });
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

export default function CatalogPage() {
  const dispatch = useDispatch();

  const { items, page, limit, status, hasMore } = useSelector((s) => s.campers);
  const favoriteIds = useSelector((s) => s.favorites.ids);
  const filters = useSelector((s) => s.filters);

  useEffect(() => {
    dispatch(fetchCampers({ page: 1, limit }));
  }, [dispatch, limit]);

  useEffect(() => {
    if (page === 1) return;
    dispatch(fetchCampers({ page, limit }));
  }, [dispatch, page, limit]);

  const filteredItems = useMemo(() => {
    return items.filter((c) => {
      const locOk =
        !filters.location ||
        normalize(c.location).includes(normalize(filters.location));

      const typeOk =
        !filters.vehicleType ||
        normalize(c.form).includes(normalize(filters.vehicleType)) ||
        normalize(c.vehicleType).includes(normalize(filters.vehicleType)) ||
        normalize(c.type).includes(normalize(filters.vehicleType));

      const selectedEquip = Object.entries(filters.equipment).filter(
        ([, v]) => v
      );
      const equipOk = selectedEquip.every(([key]) => {
        const val = c[key];
        return val === true || val === "true" || val === 1 || val === "1";
      });

      return locOk && typeOk && equipOk;
    });
  }, [items, filters]);

  const onLoadMore = () => dispatch(nextPage());

  return (
    <div
      style={{
        padding: 24,
        maxWidth: 1440,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "360px 1fr",
        gap: 32,
        alignItems: "start",
      }}
    >
      {/* FILTERS */}
      <aside
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 18,
          border: "1px solid #EAECF0",
          position: "sticky",
          top: 20,
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: 12 }}>Filters</h3>

        <div style={{ marginBottom: 14 }}>
          <label
            style={{ display: "block", marginBottom: 6, color: "#667085" }}
          >
            Location
          </label>
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              background: "#F2F4F7",
              padding: "10px 12px",
              borderRadius: 10,
            }}
          >
            <Icon name="Map" width={20} height={20} />
            <input
              value={filters.location}
              onChange={(e) => dispatch(setLocation(e.target.value))}
              placeholder="City, Country"
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                background: "transparent",
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label
            style={{ display: "block", marginBottom: 8, color: "#667085" }}
          >
            Vehicle equipment
          </label>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 10,
            }}
          >
            {[
              { key: "AC", label: "AC", icon: "ph_shower", variant: "fill" },
              {
                key: "kitchen",
                label: "Kitchen",
                icon: "cup-hot",
                variant: "stroke",
              },

              { key: "TV", label: "TV", icon: "grid-1", variant: "fill" },
              {
                key: "bathroom",
                label: "Bathroom",
                icon: "ph_shower",
                variant: "fill",
              },
              { key: "radio", label: "Radio", icon: "wind", variant: "fill" },
            ].map((x) => {
              const active = !!filters.equipment[x.key];

              return (
                <button
                  key={x.key}
                  type="button"
                  onClick={() => dispatch(toggleEquipment(x.key))}
                  style={{
                    border: active ? "1px solid #E44848" : "1px solid #D0D5DD",
                    background: "#fff",
                    borderRadius: 12,
                    padding: 10,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    alignItems: "center",
                    justifyContent: "center",
                    height: 84,
                  }}
                >
                  <Icon
                    name={x.icon}
                    width={22}
                    height={22}
                    variant={x.variant}
                    color="#101828"
                  />
                  <span style={{ fontSize: 12, fontWeight: 600 }}>
                    {x.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label
            style={{ display: "block", marginBottom: 8, color: "#667085" }}
          >
            Vehicle type
          </label>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 10,
            }}
          >
            {[
              { value: "Van", label: "Van", icon: "grid-1" },
              {
                value: "Fully Integrated",
                label: "Fully\nIntegrated",
                icon: "bi_grid-6",
              },
              { value: "Alcove", label: "Alcove", icon: "bi_grid-3" },
            ].map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => dispatch(setVehicleType(t.value))}
                style={{
                  border:
                    filters.vehicleType === t.value
                      ? "1px solid #E44848"
                      : "1px solid #D0D5DD",
                  background: "#fff",
                  borderRadius: 12,
                  padding: 10,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  height: 84,
                  whiteSpace: "pre-line",
                }}
              >
                <Icon name={t.icon} width={22} height={22} />
                <span
                  style={{ fontSize: 12, fontWeight: 600, textAlign: "center" }}
                >
                  {t.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => {}}
          style={{
            width: "100%",
            padding: 14,
            cursor: "pointer",
            background: "#E44848",
            color: "white",
            border: "none",
            borderRadius: 999,
            fontWeight: 700,
            marginTop: 8,
          }}
        >
          Search
        </button>

        <button
          onClick={() => {
            dispatch(resetFilters());
            dispatch(resetCampers());
            dispatch(fetchCampers({ page: 1, limit }));
          }}
          style={{
            width: "100%",
            padding: 12,
            cursor: "pointer",
            background: "transparent",
            border: "1px solid #D0D5DD",
            borderRadius: 999,
            fontWeight: 700,
            marginTop: 10,
          }}
        >
          Reset
        </button>
      </aside>

      {/* LIST */}
      <main>
        <h1 style={{ marginTop: 0, marginBottom: 16 }}>Catalog</h1>

        {status === "loading" && items.length === 0 && <p>Loading...</p>}

        {filteredItems.length === 0 && status !== "loading" && (
          <p>No campers found for selected filters.</p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {filteredItems.map((c) => {
            const isFav = favoriteIds.includes(c.id);
            const img = getCamperImage(c);
            const rating = getRating(c);
            const reviewsCount = getReviewCount(c);
            const chips = buildChips(c);

            return (
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
                  {img ? (
                    <img
                      src={img}
                      alt={c.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  ) : null}
                </div>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                    }}
                  >
                    <h3 style={{ margin: 0, fontSize: 22 }}>{c.name}</h3>

                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div style={{ fontWeight: 800, fontSize: 20 }}>
                        €{Number(c.price).toFixed(2)}
                      </div>

                      <button
                        onClick={() => dispatch(toggleFavorite(c.id))}
                        style={{
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                          padding: 4,
                        }}
                        aria-label="toggle favorite"
                      >
                        <Icon
                          name="property-1"
                          width={26}
                          height={26}
                          fill={isFav ? "#E44848" : "none"}
                          stroke={isFav ? "#E44848" : "#101828"}
                        />
                      </button>
                    </div>
                  </div>

                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        gap: 4,
                        alignItems: "center",
                      }}
                    >
                      <span style={{ color: "#F79009", fontWeight: 800 }}>
                        ★
                      </span>
                      <span style={{ fontWeight: 700 }}>
                        {rating ? rating.toFixed(1) : "0.0"}
                      </span>
                      <span style={{ color: "#667085" }}>
                        ({reviewsCount} Reviews)
                      </span>
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
                    {c.description
                      ? String(c.description).slice(0, 90) + "..."
                      : "—"}
                  </p>

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {chips.slice(0, 10).map((ch) => (
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
                        <Icon
                          name={ch.icon}
                          width={18}
                          height={18}
                          variant={ch.variant}
                        />
                        {ch.label}
                      </span>
                    ))}
                  </div>

                  <div>
                    <button
                      onClick={() =>
                        window.open(
                          `/catalog/${c.id}`,
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
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
            );
          })}
        </div>

        {hasMore && (
          <button
            onClick={onLoadMore}
            style={{
              marginTop: 24,
              padding: "12px 18px",
              borderRadius: 999,
              border: "1px solid #D0D5DD",
              background: "white",
              cursor: "pointer",
              fontWeight: 700,
            }}
            disabled={status === "loading"}
          >
            {status === "loading" ? "Loading..." : "Load more"}
          </button>
        )}
      </main>
    </div>
  );
}
