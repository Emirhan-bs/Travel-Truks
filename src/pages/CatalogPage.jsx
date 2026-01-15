import { useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCampers, resetCampers } from "../features/campers/campersSlice";
import { toggleFavorite } from "../features/favorites/favoritesSlice";
import {
  setLocation,
  setVehicleType,
  setTransmission,
  toggleEquipment,
  resetFilters,
} from "../features/filters/filtersSlice";
import Icon from "@/components/Icon/Icon";

const truthy = (val) => val === true || val === "true" || val === 1 || val === "1";

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

const getEngineIcon = (engine) => {
  const e = String(engine || "").trim().toLowerCase();
  if (e.includes("petrol") || e.includes("diesel")) return "petrol";
  return "wind";
};

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
      icon: getEngineIcon(c.engine),
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
    if (truthy(c?.[key])) chips.push({ label, icon, variant });
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
  const navigate = useNavigate();
  const { items, status } = useSelector((s) => s.campers);
  const favoriteIds = useSelector((s) => s.favorites.ids);
  const filters = useSelector((s) => s.filters);

  useEffect(() => {
    console.log("Initial loading...");
    dispatch(resetCampers());
    dispatch(fetchCampers({ page: 1, limit: 100 }));
  }, [dispatch]);

  const filteredItems = useMemo(() => {
    console.log("Filtering...");
    console.log("Total items:", items.length);
    console.log("Filters:", filters);

    return items.filter((c) => {
      const locOk = !filters.location || 
        String(c.location || "").toLowerCase().includes(filters.location.toLowerCase());

      const transmissionOk = !filters.transmission || 
        String(c.transmission || "").toLowerCase() === filters.transmission.toLowerCase();

      const typeOk = (() => {
        if (!filters.vehicleType) return true;
        
        const formValue = String(c.form || "").toLowerCase();
        const vehicleTypeValue = String(c.vehicleType || "").toLowerCase();
        
        console.log(`Camper: ${c.name}, form: "${c.form}", vehicleType: "${c.vehicleType}"`);
        
        const typeMap = {
          "van": ["van", "panel truck", "paneltruck"],
          "fully integrated": ["fullyintegrated", "fully integrated", "integrated"],
          "alcove": ["alcove"]
        };
        
        const searchKey = filters.vehicleType.toLowerCase();
        const validValues = typeMap[searchKey] || [searchKey];
        
        console.log(`Searching: ${searchKey}, Valid values: ${validValues.join(", ")}`);
        
        const match = validValues.some(v => 
          formValue.includes(v) || vehicleTypeValue.includes(v) || v.includes(formValue)
        );
        
        console.log(`Match: ${match}`);
        
        return match;
      })();

      const equipOk = Object.entries(filters.equipment).every(([key, isActive]) => {
        if (!isActive) return true;
        return c[key] === true;
      });

      const pass = locOk && transmissionOk && typeOk && equipOk;
      
      if (!pass) {
        console.log(`${c.name} filtered out: loc=${locOk}, trans=${transmissionOk}, type=${typeOk}, equip=${equipOk}`);
      }
      
      return pass;
    });
  }, [items, filters]);

  const cardsData = useMemo(
    () =>
      filteredItems.map((c) => ({
        ...c,
        img: getCamperImage(c),
        rating: getRating(c),
        reviewsCount: getReviewCount(c),
        chips: buildChips(c),
        isFav: favoriteIds.includes(c.id),
      })),
    [filteredItems, favoriteIds]
  );

  const handleSearch = useCallback(() => {
    console.log("Search: Applying filters");
  }, []);

  const handleReset = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

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
          <label style={{ display: "block", marginBottom: 6, color: "#667085", fontWeight: 500 }}>
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
          <label style={{ display: "block", marginBottom: 8, color: "#667085", fontWeight: 500 }}>
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
              { kind: "equipment", key: "AC", label: "AC", icon: "wind", variant: "fill" },
              { kind: "transmission", value: "automatic", label: "Automatic", icon: "diagram", variant: "fill" },
              { kind: "equipment", key: "kitchen", label: "Kitchen", icon: "cup-hot", variant: "fill" },
              { kind: "equipment", key: "TV", label: "TV", icon: "tv", variant: "fill" },
              { kind: "equipment", key: "bathroom", label: "Bathroom", icon: "ph_shower", variant: "fill" },
            ].map((x) => {
              const active =
                x.kind === "equipment"
                  ? !!filters.equipment[x.key]
                  : filters.transmission === x.value;

              const onClick =
                x.kind === "equipment"
                  ? () => dispatch(toggleEquipment(x.key))
                  : () => dispatch(setTransmission(filters.transmission === x.value ? "" : x.value));

              return (
                <button
                  key={x.kind === "equipment" ? x.key : x.value}
                  type="button"
                  onClick={onClick}
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
                    transition: "all 0.2s",
                  }}
                >
                  <Icon
                    name={x.icon}
                    width={22}
                    height={22}
                    variant={x.variant}
                    fill="currentColor"
                    color="#101828"
                  />
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{x.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", marginBottom: 8, color: "#667085", fontWeight: 500 }}>
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
              { value: "Fully Integrated", label: "Fully\nIntegrated", icon: "bi_grid-6" },
              { value: "Alcove", label: "Alcove", icon: "bi_grid-3" },
            ].map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() =>
                  dispatch(setVehicleType(filters.vehicleType === t.value ? "" : t.value))
                }
                style={{
                  border: filters.vehicleType === t.value ? "1px solid #E44848" : "1px solid #D0D5DD",
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
                  transition: "all 0.2s",
                }}
              >
                <Icon name={t.icon} width={22} height={22} variant="fill" />
                <span style={{ fontSize: 12, fontWeight: 600, textAlign: "center" }}>
                  {t.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={status === "loading"}
          style={{
            width: "100%",
            padding: 14,
            cursor: status === "loading" ? "not-allowed" : "pointer",
            background: status === "loading" ? "#ccc" : "#E44848",
            color: "white",
            border: "none",
            borderRadius: 999,
            fontWeight: 700,
            marginTop: 8,
          }}
        >
          {status === "loading" ? "Aranıyor..." : "Search"}
        </button>

        <button
          onClick={handleReset}
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

      <main>
        <h1 style={{ marginTop: 0, marginBottom: 16 }}>Catalog</h1>

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

        {filteredItems.length === 0 && status === "succeeded" && items.length > 0 && (
          <div style={{ padding: 40, textAlign: "center", color: "#667085" }}>
            <p>No campers found for selected filters.</p>
            <button
              onClick={handleReset}
              style={{
                marginTop: 16,
                padding: "10px 20px",
                background: "#E44848",
                color: "white",
                border: "none",
                borderRadius: 999,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Clear Filters
            </button>
          </div>
        )}

        {items.length === 0 && status === "succeeded" && (
          <div style={{ padding: 40, textAlign: "center", color: "#667085" }}>
            <p>No campers found in the system.</p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {cardsData.map((c) => (
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

                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
                      aria-label="Add to favorites"
                    >
                      <Icon
                        name="property-1"
                        width={26}
                        height={26}
                        fill={c.isFav ? "#E44848" : "none"}
                        stroke={c.isFav ? "#E44848" : "#101828"}
                        variant="stroke"
                      />
                    </button>
                  </div>
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

      </main>
    </div>
  );
}