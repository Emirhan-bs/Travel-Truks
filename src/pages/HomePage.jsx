import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/images/hero-bg.jpg";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        width: "100%",
        minHeight: "calc(100vh - 70px)", 
        background: "#F7F7F7",
      }}
    >
      {/* Hero Banner - Full Width, No Container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          margin: 0,
          padding: 0,

          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.5), rgba(0,0,0,0.2)), url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Inner Content Container */}
        <div
          style={{
            width: "100%",
            maxWidth: "1440px",
            margin: "0 auto",
            padding: "0 120px",
            boxSizing: "border-box",
          }}
        >
          <div style={{ maxWidth: "600px" }}>
            <h1
              style={{
                fontSize: "48px",
                fontWeight: "600",
                margin: "0 0 8px 0",
                color: "white",
                lineHeight: "1.2",
                textShadow: "0 2px 8px rgba(0,0,0,0.3)",
              }}
            >
              Campers of your dreams
            </h1>

            <p
              style={{
                fontSize: "16px",
                margin: "0 0 32px 0",
                color: "white",
                opacity: 0.95,
                textShadow: "0 1px 4px rgba(0,0,0,0.3)",
              }}
            >
              You can find everything you want in our catalog
            </p>

            <button
              onClick={() => navigate("/catalog")}
              style={{
                padding: "16px 60px",
                fontSize: "16px",
                fontWeight: "500",
                background: "#E44848",
                color: "white",
                border: "none",
                borderRadius: "200px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(228, 72, 72, 0.3)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#D03939";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 16px rgba(228, 72, 72, 0.4)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "#E44848";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(228, 72, 72, 0.3)";
              }}
            >
              View Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
