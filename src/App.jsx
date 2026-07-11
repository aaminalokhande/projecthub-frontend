import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AdminDashboard from "./pages/AdminDashboard";
import TeamLeadDashboard from "./pages/TeamLeadDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading...</h2>;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route
        path="/admin"
        element={
          user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/login" />
        }
      />

      <Route
        path="/teamlead"
        element={
          user?.role === "team_lead" ? (
            <TeamLeadDashboard />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/employee"
        element={
          user?.role === "employee" ? (
            <EmployeeDashboard />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}

export default App;