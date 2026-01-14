import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Home</h1>
      <p>Banner + CTA burada olacak.</p>
      <Link to="/catalog">
        <button style={{ padding: "10px 16px", borderRadius: 999, border: "none", background: "var(--c-red)", color: "white" }}>
          View Now
        </button>
      </Link>
    </div>
  );
}
