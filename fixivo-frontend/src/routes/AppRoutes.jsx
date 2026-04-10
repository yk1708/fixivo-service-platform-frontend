import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainScreen from "../pages/MainScreen";
import LoginPage from "../pages/Auth/page"

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainScreen />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}