import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")) || {}; }
    catch { return {}; }
  })();

  const initials = user.name
    ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "⊞" },
    { path: "/resources", label: "Resources", icon: "📚" },
    { path: "/categories", label: "Categories", icon: "🏷️" },
    { path: "/add", label: "Add Resource", icon: "＋" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <button className="navbar-brand" onClick={() => navigate("/dashboard")}>
          <div className="navbar-brand-icon">📚</div>
          ResHub
        </button>

        <div className="navbar-nav">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`nav-btn ${isActive(item.path) ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        <div className="navbar-right">
          <div className="user-pill">
            <div className="user-avatar">{initials}</div>
            <span className="user-name">{user.name || "User"}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
