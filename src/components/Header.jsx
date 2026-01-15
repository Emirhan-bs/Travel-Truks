import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  return (
    <header
      style={{
        width: "100%",
        background: "white",
        borderBottom: "1px solid #E5E7EB",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "20px 120px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            fontSize: "20px",
            fontWeight: "600",
            textDecoration: "none",
            color: "#101828",
          }}
        >
          Travel<span style={{ color: "#475467" }}>Trucks</span>
        </Link>

        {/* Navigation */}
        <nav style={{ display: "flex", gap: "40px", alignItems: "center" }}>
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: location.pathname === "/" ? "#E44848" : "#101828",
              fontSize: "16px",
              fontWeight: location.pathname === "/" ? "600" : "400",
              transition: "color 0.2s ease",
            }}
            onMouseOver={(e) => {
              if (location.pathname !== "/") {
                e.currentTarget.style.color = "#E44848";
              }
            }}
            onMouseOut={(e) => {
              if (location.pathname !== "/") {
                e.currentTarget.style.color = "#101828";
              }
            }}
          >
            Home
          </Link>

          <Link
            to="/catalog"
            style={{
              textDecoration: "none",
              color: location.pathname.startsWith("/catalog") ? "#E44848" : "#101828",
              fontSize: "16px",
              fontWeight: location.pathname.startsWith("/catalog") ? "600" : "400",
              transition: "color 0.2s ease",
            }}
            onMouseOver={(e) => {
              if (!location.pathname.startsWith("/catalog")) {
                e.currentTarget.style.color = "#E44848";
              }
            }}
            onMouseOut={(e) => {
              if (!location.pathname.startsWith("/catalog")) {
                e.currentTarget.style.color = "#101828";
              }
            }}
          >
            Catalog
          </Link>

          <Link
            to="/favorites"
            style={{
              textDecoration: "none",
              color: location.pathname === "/favorites" ? "#E44848" : "#101828",
              fontSize: "16px",
              fontWeight: location.pathname === "/favorites" ? "600" : "400",
              transition: "color 0.2s ease",
            }}
            onMouseOver={(e) => {
              if (location.pathname !== "/favorites") {
                e.currentTarget.style.color = "#E44848";
              }
            }}
            onMouseOut={(e) => {
              if (location.pathname !== "/favorites") {
                e.currentTarget.style.color = "#101828";
              }
            }}
          >
            Favorites
          </Link>
        </nav>
      </div>
    </header>
  );
}