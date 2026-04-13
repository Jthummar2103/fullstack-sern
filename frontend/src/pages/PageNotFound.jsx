import { useNavigate } from "react-router-dom";

function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-shell">
      <div className="not-found-code">404</div>
      <h2>Page not found</h2>
      <p style={{ maxWidth: 360 }}>
        The page you&apos;re looking for doesn&apos;t exist or the link is broken.
      </p>
      <div className="row" style={{ justifyContent: "center" }}>
        <button className="btn-primary" onClick={() => navigate("/dashboard")}>
          Go to Dashboard
        </button>
        <button className="btn-secondary" onClick={() => navigate(-1)}>
          Go back
        </button>
      </div>
    </div>
  );
}

export default PageNotFound;
