import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ResumeProvider } from "./context/ResumeContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ResumeProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/app" element={<App />} />
            <Route path="/login" element={<AuthPage initialMode="login" />} />
            <Route path="/signup" element={<AuthPage initialMode="signup" />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ResumeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
