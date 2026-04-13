import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainScreen from "../pages/MainScreen";
import LoginPage from "../pages/Auth/page"
import Dashboard from "../pages/Dashboard/page"

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainScreen />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}